import { createClient, createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const service = await createServiceClient()

  // Upsert profile — safe to call multiple times
  const { error } = await service.from('profiles').upsert({
    id: user.id,
    email: user.email,
    role: body.role || 'faculty',
    full_name: body.full_name || null,
    institution: body.institution || null,
  }, { onConflict: 'id' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
