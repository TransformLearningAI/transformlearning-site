import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const { name, email, institution, role, message } = await request.json()

  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
  }

  const service = await createServiceClient()

  // Check for duplicate request
  const { data: existing } = await service
    .from('whitepaper_requests')
    .select('id, status')
    .eq('email', email)
    .single()

  if (existing) {
    return NextResponse.json({ message: 'Request already submitted' })
  }

  // Insert request
  const { data: req, error } = await service
    .from('whitepaper_requests')
    .insert({ name, email, institution, role, message })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Send notification email to Jeff
  const approveUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://transformlearning.ai'}/api/whitepaper-approve?id=${req.id}&action=approve`
  const denyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://transformlearning.ai'}/api/whitepaper-approve?id=${req.id}&action=deny`

  if (process.env.RESEND_API_KEY) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Arrival <noreply@transformlearning.ai>',
          to: ['jeff@transformlearning.ai'],
          subject: `White Paper Request: ${name} — ${institution || 'No institution'}`,
          html: `
            <h2>New White Paper Request</h2>
            <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
              <tr><td style="padding:6px 12px;font-weight:bold">Name</td><td style="padding:6px 12px">${name}</td></tr>
              <tr><td style="padding:6px 12px;font-weight:bold">Email</td><td style="padding:6px 12px">${email}</td></tr>
              <tr><td style="padding:6px 12px;font-weight:bold">Institution</td><td style="padding:6px 12px">${institution || '—'}</td></tr>
              <tr><td style="padding:6px 12px;font-weight:bold">Role</td><td style="padding:6px 12px">${role || '—'}</td></tr>
              <tr><td style="padding:6px 12px;font-weight:bold">Message</td><td style="padding:6px 12px">${message || '—'}</td></tr>
            </table>
            <br/>
            <a href="${approveUrl}" style="display:inline-block;padding:12px 24px;background:#4F8A5B;color:white;text-decoration:none;border-radius:8px;font-weight:bold;margin-right:12px">Approve</a>
            <a href="${denyUrl}" style="display:inline-block;padding:12px 24px;background:#FF6B4A;color:white;text-decoration:none;border-radius:8px;font-weight:bold">Deny</a>
          `,
        }),
      })
    } catch (e) {
      console.error('Email send failed:', e)
    }
  } else {
    console.log('WHITEPAPER REQUEST:', { name, email, institution, role, message, approveUrl, denyUrl })
  }

  return NextResponse.json({ message: 'Request submitted' })
}
