import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getClient, MODELS } from '@/lib/claude/client'
import { SYSTEM, userMessage } from '@/lib/claude/prompts/assessment-score'
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

  // Upsert proficiency scores
  await service.from('proficiency_scores').upsert(
    skill_scores.map(s => ({
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

  // Insert history
  await service.from('proficiency_history').insert(
    skill_scores.map(s => ({
      enrollment_id: session.enrollment_id,
      skill_id: s.skill_id,
      score: s.score,
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

  return NextResponse.json({ skill_scores })
}
