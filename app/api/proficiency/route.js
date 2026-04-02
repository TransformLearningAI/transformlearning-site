import { createClient, createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const enrollmentId = searchParams.get('enrollmentId')
  if (!enrollmentId) return NextResponse.json({ error: 'enrollmentId required' }, { status: 400 })

  // Use service client to bypass RLS — we verify ownership manually
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
    .select('skill_id, score, confidence, evidence_summary, source, created_at')
    .eq('enrollment_id', enrollmentId)
    .order('created_at', { ascending: false })

  return NextResponse.json({ scores: scores || [], history: history || [] })
}
