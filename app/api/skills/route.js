import { createClient, createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const courseId = searchParams.get('courseId')
  if (!courseId) return NextResponse.json({ error: 'courseId required' }, { status: 400 })

  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .eq('course_id', courseId)
    .order('skill_type').order('sort_order')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { courseId, skills } = await request.json()

  // Verify faculty owns course
  const { data: course } = await supabase
    .from('courses').select('faculty_id').eq('id', courseId).single()
  if (!course || course.faculty_id !== user.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const service = await createServiceClient()

  // Upsert all skills
  const { error } = await service.from('skills')
    .upsert(skills.map(s => ({ ...s, course_id: courseId, is_approved: true })))

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Mark course as approved
  await service.from('courses')
    .update({ framework_status: 'approved', updated_at: new Date().toISOString() })
    .eq('id', courseId)

  return NextResponse.json({ ok: true })
}
