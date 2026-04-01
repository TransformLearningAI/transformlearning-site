import { createClient, createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('skills').select('*').eq('id', params.skillId).single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(request, { params }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const service = await createServiceClient()

  const { data: skill } = await service
    .from('skills').select('courses(faculty_id)').eq('id', params.skillId).single()
  if (!skill || skill.courses.faculty_id !== user.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const { data, error } = await service
    .from('skills')
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq('id', params.skillId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(request, { params }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const service = await createServiceClient()
  const { data: skill } = await service
    .from('skills').select('courses(faculty_id)').eq('id', params.skillId).single()
  if (!skill || skill.courses.faculty_id !== user.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const { error } = await service.from('skills').delete().eq('id', params.skillId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
