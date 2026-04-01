import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const enrollmentId = searchParams.get('enrollmentId')
  if (!enrollmentId) return NextResponse.json({ error: 'enrollmentId required' }, { status: 400 })

  const { data: enrollment } = await supabase
    .from('enrollments').select('student_id').eq('id', enrollmentId).single()
  if (!enrollment || enrollment.student_id !== user.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const { data: scores } = await supabase
    .from('proficiency_scores')
    .select('*, skills(id, name, description, skill_type, category)')
    .eq('enrollment_id', enrollmentId)

  const { data: history } = await supabase
    .from('proficiency_history')
    .select('skill_id, score, scored_at')
    .eq('enrollment_id', enrollmentId)
    .order('scored_at', { ascending: true })

  return NextResponse.json({ scores: scores || [], history: history || [] })
}
