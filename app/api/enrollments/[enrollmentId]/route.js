import { createClient, createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request, context) {
  const { enrollmentId } = await context.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Use service client to bypass RLS — verify ownership manually
  const service = await createServiceClient()

  const { data: enrollment } = await service
    .from('enrollments')
    .select('*, courses(id, title, course_code, term, skills(*))')
    .eq('id', enrollmentId)
    .single()

  if (!enrollment || enrollment.student_id !== user.id)
    return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({
    ...enrollment,
    course_title: enrollment.courses?.title,
  })
}
