import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getClient, MODELS } from '@/lib/claude/client'
import { SYSTEM, userMessage } from '@/lib/claude/prompts/assessment-generate'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { enrollmentId, skillIds } = await request.json()

  const service = await createServiceClient()

  // Get enrollment + verify student
  const { data: enrollment } = await service
    .from('enrollments')
    .select('*, courses(id, title, skills(*))')
    .eq('id', enrollmentId)
    .single()

  if (!enrollment || enrollment.student_id !== user.id)
    return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 })

  // Get current proficiency scores
  const { data: existingScores } = await service
    .from('proficiency_scores')
    .select('skill_id, score')
    .eq('enrollment_id', enrollmentId)

  const scoreMap = Object.fromEntries((existingScores || []).map(s => [s.skill_id, s.score]))

  // Filter skills to assess
  const allSkills = enrollment.courses.skills
  const skillsToAssess = skillIds
    ? allSkills.filter(s => skillIds.includes(s.id))
    : allSkills.filter(s => s.is_approved)

  const skillsWithScores = skillsToAssess.map(s => ({
    skill_id: s.id,
    name: s.name,
    description: s.description,
    skill_type: s.skill_type,
    current_score: scoreMap[s.id] ?? 0,
  }))

  // Generate questions
  const claude = getClient()
  const message = await claude.messages.create({
    model: MODELS.FAST,
    max_tokens: 4096,
    system: SYSTEM,
    messages: [{ role: 'user', content: userMessage(skillsWithScores, skillIds ? 3 : 2) }],
  })

  const text = message.content[0].text
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) return NextResponse.json({ error: 'Failed to generate questions' }, { status: 500 })
  const { questions } = JSON.parse(jsonMatch[0])

  // Save session
  const { data: session } = await service
    .from('assessment_sessions')
    .insert({
      enrollment_id: enrollmentId,
      skill_id: skillIds?.length === 1 ? skillIds[0] : null,
      session_type: skillIds ? 'quiz' : 'onboarding',
      questions_json: questions,
    })
    .select()
    .single()

  return NextResponse.json({ sessionId: session.id, questions: questions.map(q => ({
    id: q.id, skill_id: q.skill_id, type: q.type, text: q.text,
    choices: q.choices, difficulty: q.difficulty,
    // Don't send correct_answer to client
  })) })
}
