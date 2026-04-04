import { createClient, createServiceClient } from '@/lib/supabase/server'
import { analyzeTrajectory, computeConfidenceInterval, computeWeightedScore } from '@/lib/scoring/engine'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const enrollmentId = searchParams.get('enrollmentId')
  if (!enrollmentId) return NextResponse.json({ error: 'enrollmentId required' }, { status: 400 })

  const service = await createServiceClient()

  const { data: enrollment } = await service
    .from('enrollments').select('student_id').eq('id', enrollmentId).single()
  if (!enrollment || enrollment.student_id !== user.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const { data: scores } = await service
    .from('proficiency_scores')
    .select('*, skills(id, name, description, skill_type, category)')
    .eq('enrollment_id', enrollmentId)

  const { data: history } = await service
    .from('proficiency_history')
    .select('skill_id, score, confidence, evidence_summary, source, scored_at')
    .eq('enrollment_id', enrollmentId)
    .order('scored_at', { ascending: true })

  // Enhance each score with trajectory analysis and confidence intervals
  const enhancedScores = (scores || []).map(s => {
    const skillHistory = (history || []).filter(h => h.skill_id === s.skill_id)

    // Multi-source weighted score
    const observations = skillHistory.map(h => ({ score: h.score, source: h.source || 'quiz', timestamp: h.scored_at }))
    const weighted = computeWeightedScore(observations)

    // Trajectory
    const trajectory = analyzeTrajectory(
      skillHistory.map(h => ({ score: h.score, timestamp: h.scored_at }))
    )

    // Confidence interval
    const interval = computeConfidenceInterval(s.score, s.confidence || weighted.confidence, observations)

    return {
      ...s,
      trajectory: { trend: trajectory.trend, velocity: trajectory.velocity, isGenuine: trajectory.isGenuine, description: trajectory.description },
      interval: { lower: interval.lower, estimate: interval.estimate, upper: interval.upper, reliability: interval.reliability },
      sourceBreakdown: weighted.sourceBreakdown,
    }
  })

  return NextResponse.json({
    scores: enhancedScores,
    history: (history || []).reverse(), // Return newest first for display
  })
}
