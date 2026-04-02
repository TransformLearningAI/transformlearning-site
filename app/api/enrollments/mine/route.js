import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('id, course_id, onboarding_status, courses(title, course_code, term)')
    .eq('student_id', user.id)

  return NextResponse.json({ enrollments: enrollments || [] })
}
