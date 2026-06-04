import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')
  const email = searchParams.get('email')
  const name = searchParams.get('name')

  if (!token || !email) {
    return new NextResponse('Missing token or email', { status: 400 })
  }

  const accessUrl = `https://transformlearning.ai/campus-transformation/process?token=${token}`

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)

    // Send access link to the requester
    await resend.emails.send({
      from: 'Campus Transformation <noreply@transformlearning.ai>',
      to: email,
      subject: 'Your access to our Campus Transformation Process',
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:500px">
          <h2 style="color:#0C1F3F">Welcome, ${name || 'there'}.</h2>
          <p style="color:#2D3748;font-size:14px;line-height:1.6">
            Your request to view our Campus Transformation process has been approved.
            Click the link below to access the full process document.
          </p>
          <a href="${accessUrl}" style="display:inline-block;background:#00A8A8;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;margin:16px 0">
            View Our Process
          </a>
          <p style="color:#718096;font-size:13px;margin-top:16px">
            This link is personal to you. It will grant you ongoing access to the process page.
          </p>
          <p style="color:#718096;font-size:13px;margin-top:12px">
            Questions? Reply to this email or contact Jeff Ritter directly at
            <a href="mailto:jeff@transformlearning.ai" style="color:#00A8A8">jeff@transformlearning.ai</a>.
          </p>
          <p style="color:#999;font-size:11px;margin-top:24px">
            — Transform Learning · Campus Transformation
          </p>
        </div>
      `,
    })
  } catch (err) {
    console.error('Approval email error:', err)
  }

  // Redirect Jeff to a confirmation page
  return NextResponse.redirect(new URL('/campus-transformation/process?approved=' + encodeURIComponent(name || email), request.url))
}
