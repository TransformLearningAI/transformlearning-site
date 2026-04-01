import { createClient, createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const supabase = await createClient()
  let { data: { user } } = await supabase.auth.getUser()

  // Fallback: accept Bearer token (sent immediately after signUp before cookie propagates)
  if (!user) {
    const authHeader = request.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      const { data } = await supabase.auth.getUser(authHeader.slice(7))
      user = data?.user ?? null
    }
  }

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { token } = await request.json()
  const service = await createServiceClient()

  // Validate invite
  const { data: invite } = await service
    .from('invites')
    .select('*, courses(id, title)')
    .eq('token', token)
    .single()

  if (!invite || invite.accepted_at || new Date(invite.expires_at) < new Date())
    return NextResponse.json({ error: 'Invalid or expired invite' }, { status: 400 })

  if (invite.email !== user.email)
    return NextResponse.json({ error: 'Invite email does not match your account' }, { status: 403 })

  // Create enrollment
  const { data: enrollment, error } = await service
    .from('enrollments')
    .insert({ course_id: invite.course_id, student_id: user.id })
    .select()
    .single()

  if (error && error.code !== '23505') // ignore duplicate
    return NextResponse.json({ error: error.message }, { status: 500 })

  // Mark invite accepted
  await service.from('invites').update({ accepted_at: new Date().toISOString() }).eq('token', token)

  const enrollmentId = enrollment?.id || (
    await service.from('enrollments')
      .select('id').eq('course_id', invite.course_id).eq('student_id', user.id).single()
  ).data?.id

  return NextResponse.json({ enrollmentId })
}
