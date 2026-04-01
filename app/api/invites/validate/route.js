import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'Token required' }, { status: 400 })

  const service = await createServiceClient()
  const { data: invite } = await service
    .from('invites')
    .select('*, courses(title)')
    .eq('token', token)
    .single()

  if (!invite) return NextResponse.json({ error: 'Invalid or expired invite link.' }, { status: 404 })
  if (invite.accepted_at) return NextResponse.json({ error: 'This invite has already been used.' }, { status: 410 })
  if (new Date(invite.expires_at) < new Date()) return NextResponse.json({ error: 'This invite has expired. Ask your instructor to resend it.' }, { status: 410 })

  return NextResponse.json({ email: invite.email, course_title: invite.courses.title, course_id: invite.course_id })
}
