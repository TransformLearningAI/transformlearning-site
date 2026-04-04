import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getClient, MODELS } from '@/lib/claude/client'
import { SYSTEM, userMessage } from '@/lib/claude/prompts/assessment-score'
import { runGovernancePipeline, monitorTrust } from '@/lib/governance/engine'
import { computeProficiency, analyzeTrajectory, computeConfidenceInterval } from '@/lib/scoring/engine'
import { awardXP, XP_REWARDS } from '@/lib/xp'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { sessionId, answers } = await request.json()
  const service = await createServiceClient()

  // Get session + verify student
  const { data: session } = await service
    .from('assessment_sessions')
    .select('*, enrollments(student_id, course_id)')
    .eq('id', sessionId)
    .single()

  if (!session || session.enrollments.student_id !== user.id)
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })

  // Get skill descriptions
  const skillIds = [...new Set(session.questions_json.map(q => q.skill_id))]
  const { data: skills } = await service
    .from('skills').select('id, name, description, skill_type').in('id', skillIds)

  // Score with Claude
  const claude = getClient()
  const message = await claude.messages.create({
    model: MODELS.FAST,
    max_tokens: 4096,
    system: SYSTEM,
    messages: [{ role: 'user', content: userMessage(session.questions_json, answers, skills) }],
  })

  const text = message.content[0].text
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) return NextResponse.json({ error: 'Scoring failed' }, { status: 500 })
  const { skill_scores } = JSON.parse(jsonMatch[0])

  const now = new Date().toISOString()

  // Get existing scores and full history for multi-source scoring
  const { data: existingScores } = await service
    .from('proficiency_scores')
    .select('skill_id, score, source, scored_at')
    .eq('enrollment_id', session.enrollment_id)
  const { data: fullHistory } = await service
    .from('proficiency_history')
    .select('skill_id, score, source, confidence, scored_at')
    .eq('enrollment_id', session.enrollment_id)
    .order('scored_at', { ascending: true })

  // Enhanced scoring: multi-source weighting + trajectory + confidence intervals
  const governedScores = skill_scores.map(s => {
    // Gather all observations for this skill (existing + new)
    const skillHistory = (fullHistory || []).filter(h => h.skill_id === s.skill_id)
    const observations = [
      ...skillHistory.map(h => ({ score: h.score, source: h.source || 'quiz', timestamp: h.scored_at })),
      { score: s.score, source: session.session_type === 'onboarding' ? 'assessment' : 'quiz', timestamp: now },
    ]

    // Run full proficiency pipeline (include new score in trajectory history)
    const proficiency = computeProficiency({
      observations,
      history: [
        ...skillHistory.map(h => ({ score: h.score, timestamp: h.scored_at })),
        { score: s.score, timestamp: now },
      ],
    })

    // Run governance pipeline
    const governance = runGovernancePipeline({
      studentId: user.id,
      skillId: s.skill_id,
      enrollmentId: session.enrollment_id,
      score: proficiency.score,
      confidence: proficiency.confidence,
      evidenceSummary: s.evidence_summary,
      scores: existingScores || [],
      historyCount: (fullHistory || []).length,
    })

    return {
      ...s,
      score: proficiency.score,           // May be adjusted by trajectory
      rawAIScore: s.score,                // Original Claude score
      confidence: proficiency.confidence,
      interval: proficiency.interval,     // { lower, estimate, upper }
      trajectory: proficiency.trajectory, // { velocity, trend, isGenuine }
      sourceBreakdown: proficiency.sourceBreakdown,
      governance,
    }
  })

  // Monitor for anomalies (L4: Continuous Monitoring)
  const trustCheck = monitorTrust(
    governedScores.map(s => ({ skill_id: s.skill_id, score: s.score })),
    existingScores || []
  )

  // Upsert proficiency scores — only governed-approved scores are persisted
  await service.from('proficiency_scores').upsert(
    governedScores.map(s => ({
      enrollment_id: session.enrollment_id,
      skill_id: s.skill_id,
      score: s.score,
      confidence: s.confidence,
      source: session.session_type === 'onboarding' ? 'assessment' : 'quiz',
      evidence_summary: s.evidence_summary,
      scored_at: now,
    })),
    { onConflict: 'enrollment_id,skill_id' }
  )

  // Insert history with governance metadata
  await service.from('proficiency_history').insert(
    governedScores.map(s => ({
      enrollment_id: session.enrollment_id,
      skill_id: s.skill_id,
      score: s.score,
      confidence: s.confidence,
      evidence_summary: s.evidence_summary,
      source: session.session_type === 'onboarding' ? 'assessment' : 'quiz',
    }))
  )

  // Mark session scored
  await service.from('assessment_sessions').update({
    status: 'scored',
    answers_json: answers,
    feedback_json: skill_scores,
    submitted_at: now,
    scored_at: now,
  }).eq('id', sessionId)

  // If onboarding, mark enrollment complete
  if (session.session_type === 'onboarding') {
    await service.from('enrollments')
      .update({ onboarding_status: 'complete' })
      .eq('id', session.enrollment_id)
  }

  // Award XP for quiz completion
  let xpEarned = XP_REWARDS.quiz_complete
  // Bonus XP for any newly mastered skills
  const newlyMastered = governedScores.filter(s => {
    const prev = (existingScores || []).find(e => e.skill_id === s.skill_id)
    return s.score >= 80 && (!prev || prev.score < 80)
  })
  xpEarned += newlyMastered.length * XP_REWARDS.skill_mastered

  const newXP = await awardXP(service, user.id, xpEarned, 'quiz_complete')

  return NextResponse.json({
    skill_scores: governedScores,
    xp: { earned: xpEarned, total: newXP, mastery_bonus: newlyMastered.length },
    governance: {
      trust: trustCheck,
      scores_governed: governedScores.length,
      all_passed: governedScores.every(s => s.governance.allowed),
    },
  })
}
