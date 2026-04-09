import { createClient, createServiceClient } from '@/lib/supabase/server'
import { Resend } from 'resend'
import { NextResponse } from 'next/server'

export async function POST(request, context) {
  try {
    const { courseId } = await context.params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { email } = await request.json()
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

    // Get course details
    const { data: course } = await supabase
      .from('courses').select('title, faculty_id').eq('id', courseId).single()

    if (!course || course.faculty_id !== user.id)
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })

    // Get faculty profile
    const { data: faculty } = await supabase
      .from('profiles').select('full_name').eq('id', user.id).single()

    const service = await createServiceClient()

    // Check for existing invite
    const { data: existing } = await service
      .from('invites')
      .select('id, accepted_at, expires_at')
      .eq('course_id', courseId)
      .eq('email', email)
      .single()

    if (existing?.accepted_at)
      return NextResponse.json({ error: 'Student already enrolled' }, { status: 409 })

    // Create or refresh invite
    let token
    if (existing) {
      const { data: updated } = await service
        .from('invites')
        .update({ expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() })
        .eq('id', existing.id)
        .select('token')
        .single()
      token = updated.token
    } else {
      const { data: created } = await service
        .from('invites')
        .insert({ course_id: courseId, email, invited_by: user.id })
        .select('token')
        .single()
      token = created.token
    }

    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/accept-invite?token=${token}`

    // Send email
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error: emailError } = await resend.emails.send({
      from: `Transform Learning <noreply@transformlearning.ai>`,
      to: [email],
      reply_to: user.email,
      subject: `You've been invited to ${course.title} on Arrival`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 16px;">
          <div style="background:#0C1F3F;border-radius:12px;padding:28px 32px;margin-bottom:24px;">
            <p style="margin:0;color:#00A8A8;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">Arrival</p>
            <h1 style="margin:8px 0 0;color:white;font-size:22px;font-weight:300;">You've been invited!</h1>
          </div>
          <p style="color:#374151;">${faculty?.full_name || 'Your instructor'} has added you to <strong>${course.title}</strong> on Arrival.</p>
          <p style="color:#374151;">Arrival shows you exactly where you stand on every skill in this course — and helps you close the gaps through personalized coaching and practice.</p>
          <a href="${inviteUrl}" style="display:inline-block;background:#00A8A8;color:white;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:700;margin:16px 0;">
            Accept Invite &amp; Get Started →
          </a>
          <p style="color:#9CA3AF;font-size:12px;">This link expires in 7 days. If you didn't expect this email, you can ignore it.</p>
        </div>`,
    })

    if (emailError) {
      console.error('Resend error:', emailError)
      return NextResponse.json({ error: 'Failed to send invite email: ' + emailError.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Invite error:', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
