import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getClient, MODELS } from '@/lib/claude/client'
import { SYSTEM, userMessage } from '@/lib/claude/prompts/syllabus-parse'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { title, content, sourceUrl } = body

  const text = content?.trim() || ''
  if (!text && !sourceUrl)
    return NextResponse.json({ error: 'Please provide content or a URL' }, { status: 400 })

  const service = await createServiceClient()

  // If a URL was provided, fetch its content
  let syllabusText = text
  if (sourceUrl && !text) {
    try {
      const res = await fetch(sourceUrl, { headers: { 'User-Agent': 'Arrival/1.0' } })
      if (!res.ok) throw new Error(`Failed to fetch URL: ${res.status}`)
      const html = await res.text()
      // Strip HTML tags for plain text
      syllabusText = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 30000) // limit to ~30k chars
    } catch (err) {
      return NextResponse.json({ error: 'Could not fetch that URL: ' + err.message }, { status: 400 })
    }
  }

  if (!syllabusText?.trim())
    return NextResponse.json({ error: 'No usable content found' }, { status: 400 })

  // Create a self-study course owned by the student (faculty_id = student's id)
  const { data: course, error: courseError } = await service
    .from('courses')
    .insert({
      faculty_id: user.id,
      title: title || 'My Course',
      course_code: 'SELF',
      institution: 'Self-Study',
      term: 'Self-Paced',
      syllabus_text: syllabusText,
      framework_status: 'generating',
    })
    .select()
    .single()

  if (courseError)
    return NextResponse.json({ error: courseError.message }, { status: 500 })

  // Auto-enroll the student
  const { data: enrollment, error: enrollError } = await service
    .from('enrollments')
    .insert({
      course_id: course.id,
      student_id: user.id,
      onboarding_status: 'complete',
    })
    .select()
    .single()

  if (enrollError) {
    await service.from('courses').delete().eq('id', course.id)
    return NextResponse.json({ error: enrollError.message }, { status: 500 })
  }

  // Call Claude to parse skills
  const claude = getClient()
  let parsed
  try {
    const message = await claude.messages.create({
      model: MODELS.SMART,
      max_tokens: 4096,
      system: SYSTEM,
      messages: [{ role: 'user', content: userMessage(syllabusText) }],
    })
    const responseText = message.content[0].text
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON found in response')
    parsed = JSON.parse(jsonMatch[0])
  } catch (err) {
    await service.from('courses').update({ framework_status: 'pending' }).eq('id', course.id)
    return NextResponse.json({ error: 'AI parsing failed: ' + err.message }, { status: 500 })
  }

  // Insert skills (auto-approved for self-study)
  const explicitSkills = (parsed.explicit_skills || []).map((s, i) => ({
    course_id: course.id,
    name: s.name,
    description: s.description,
    category: s.category || 'General',
    skill_type: 'explicit',
    sort_order: i,
    is_approved: true,
  }))

  const implicitSkills = (parsed.implicit_skills || []).map((s, i) => ({
    course_id: course.id,
    name: s.name,
    description: s.description,
    category: s.category || 'Core',
    skill_type: 'implicit',
    sort_order: i,
    is_approved: true,
  }))

  await service.from('skills').insert([...explicitSkills, ...implicitSkills])
  await service.from('courses').update({ framework_status: 'approved' }).eq('id', course.id)

  return NextResponse.json({
    courseId: course.id,
    enrollmentId: enrollment.id,
    skillCount: explicitSkills.length + implicitSkills.length,
  })
}
