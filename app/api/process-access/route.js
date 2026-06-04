import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import crypto from 'crypto'

export async function POST(request) {
  const { name, email, title, institution, reason } = await request.json()
  if (!name || !email) return NextResponse.json({ error: 'Name and email required' }, { status: 400 })

  // Generate a simple access token
  const token = crypto.randomBytes(16).toString('hex')

  // The approval link — when Jeff clicks this, it sends the token to the requester
  const approveUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://transformlearning.ai'}/api/process-access/approve?token=${token}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)

    // Email Jeff with approve link
    await resend.emails.send({
      from: 'Campus Transformation <noreply@transformlearning.ai>',
      to: 'jeff@transformlearning.ai',
      subject: `Process Access Request — ${name} (${institution || 'No institution'})`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:500px">
          <h2 style="color:#0C1F3F;margin-bottom:8px">Process Page Access Request</h2>
          <table style="width:100%;border-collapse:collapse;margin:16px 0">
            <tr><td style="padding:6px 0;color:#718096;font-size:13px;width:100px">Name</td><td style="padding:6px 0;font-size:14px;font-weight:600">${name}</td></tr>
            <tr><td style="padding:6px 0;color:#718096;font-size:13px">Email</td><td style="padding:6px 0;font-size:14px">${email}</td></tr>
            <tr><td style="padding:6px 0;color:#718096;font-size:13px">Title</td><td style="padding:6px 0;font-size:14px">${title || '—'}</td></tr>
            <tr><td style="padding:6px 0;color:#718096;font-size:13px">Institution</td><td style="padding:6px 0;font-size:14px">${institution || '—'}</td></tr>
            <tr><td style="padding:6px 0;color:#718096;font-size:13px">Reason</td><td style="padding:6px 0;font-size:14px">${reason || '—'}</td></tr>
          </table>
          <a href="${approveUrl}" style="display:inline-block;background:#00A8A8;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px;margin-top:8px">
            ✓ Approve Access
          </a>
          <p style="color:#999;font-size:11px;margin-top:16px">Clicking approve will send them an email with access to the process page.</p>
        </div>
      `,
    })
  } catch (err) {
    console.error('Process access email error:', err)
  }

  return NextResponse.json({ ok: true })
}
