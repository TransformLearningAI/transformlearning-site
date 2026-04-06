import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getClient, MODELS } from '@/lib/claude/client'
import { SYSTEM, userMessage } from '@/lib/claude/prompts/syllabus-parse'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { courseId, syllabusText } = body

  if (!syllabusText?.trim())
    return NextResponse.json({ error: 'Syllabus text required' }, { status: 400 })

  // Verify ownership
  const { data: course } = await supabase
    .from('courses').select('id, faculty_id').eq('id', courseId).single()
  if (!course || course.faculty_id !== user.id)
    return NextResponse.json({ error: 'Course not found' }, { status: 404 })

  // Update course with syllabus text + set status to generating
  const service = await createServiceClient()
  await service.from('courses').update({
    syllabus_text: syllabusText,
    framework_status: 'generating',
    updated_at: new Date().toISOString(),
  }).eq('id', courseId)

  // Call Claude
  const claude = getClient()
  let parsed
  try {
    const message = await claude.messages.create({
      model: MODELS.SMART,
      max_tokens: 4096,
      system: SYSTEM,
      messages: [{ role: 'user', content: userMessage(syllabusText) }],
    })
    const text = message.content[0].text
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON found in response')
    parsed = JSON.parse(jsonMatch[0])
  } catch (err) {
    await service.from('courses').update({ framework_status: 'pending' }).eq('id', courseId)
    return NextResponse.json({ error: 'AI parsing failed: ' + err.message }, { status: 500 })
  }

  // Delete existing skills for this course
  await service.from('skills').delete().eq('course_id', courseId)

  // Insert new skills
  const explicitSkills = (parsed.explicit_skills || []).map((s, i) => ({
    course_id: courseId,
    name: s.name,
    description: s.description,
    category: s.category || 'General',
    skill_type: 'explicit',
    sort_order: i,
    is_approved: false,
  }))

  const implicitSkills = (parsed.implicit_skills || []).map((s, i) => ({
    course_id: courseId,
    name: s.name,
    description: s.description,
    category: s.category || 'Core',
    skill_type: 'implicit',
    sort_order: i,
    is_approved: false,
  }))

  const { error: insertError } = await service
    .from('skills')
    .insert([...explicitSkills, ...implicitSkills])

  if (insertError) {
    await service.from('courses').update({ framework_status: 'pending' }).eq('id', courseId)
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  await service.from('courses').update({ framework_status: 'ready' }).eq('id', courseId)

  return NextResponse.json({
    explicit_count: explicitSkills.length,
    implicit_count: implicitSkills.length,
  })
}
