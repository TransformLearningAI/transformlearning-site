import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getClient, MODELS } from '@/lib/claude/client'
import { SYSTEM, userMessage } from '@/lib/claude/prompts/study-guide'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { enrollmentId, skillId } = await request.json()
  const service = await createServiceClient()

  // Verify enrollment
  const { data: enrollment } = await service
    .from('enrollments').select('student_id, courses(title)').eq('id', enrollmentId).single()
  if (!enrollment || enrollment.student_id !== user.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  // Check cache (30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const { data: cached } = await service
    .from('study_guides')
    .select('content_md, generated_at')
    .eq('skill_id', skillId)
    .eq('enrollment_id', enrollmentId)
    .gte('generated_at', thirtyDaysAgo)
    .single()

  if (cached) return NextResponse.json({ content: cached.content_md, cached: true })

  // Get skill + proficiency
  const { data: skill } = await service.from('skills').select('*').eq('id', skillId).single()
  const { data: proficiency } = await service
    .from('proficiency_scores').select('score')
    .eq('enrollment_id', enrollmentId).eq('skill_id', skillId).single()

  const claude = getClient()
  const message = await claude.messages.create({
    model: MODELS.SMART,
    max_tokens: 2048,
    system: SYSTEM,
    messages: [{ role: 'user', content: userMessage({
      skillName: skill.name,
      skillDescription: skill.description,
      skillType: skill.skill_type,
      courseName: enrollment.courses.title,
      score: proficiency?.score ?? 0,
    }) }],
  })

  const content = message.content[0].text

  await service.from('study_guides').insert({ skill_id: skillId, enrollment_id: enrollmentId, content_md: content })

  return NextResponse.json({ content, cached: false })
}
