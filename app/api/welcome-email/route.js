import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  // Accept user data directly from the request body (no auth needed)
  const body = await request.json().catch(() => ({}))
  const { email, name } = body

  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  const firstName = (name || 'there').split(' ')[0]

  try {
    await resend.emails.send({
      from: 'Jeff Ritter <jeff@transformlearning.ai>',
      replyTo: 'jeff@yourclassroom.ai',
      to: email,
      subject: `Welcome ${firstName} — your skill map is one click away`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 0;">
          <div style="background: #0C1F3F; border-radius: 16px; padding: 32px; margin-bottom: 24px;">
            <h1 style="color: white; font-size: 24px; font-weight: 300; margin: 0 0 8px;">
              Welcome to <span style="color: #00A8A8;">transformlearning</span>
            </h1>
            <p style="color: rgba(255,255,255,0.5); font-size: 14px; margin: 0;">
              Your account is ready. Let's map your first course.
            </p>
          </div>

          <p style="color: #333; font-size: 15px; line-height: 1.7;">
            Hey ${firstName},
          </p>
          <p style="color: #333; font-size: 15px; line-height: 1.7;">
            I'm Jeff, the founder. Thanks for signing up — here's how to see value in the next 30 seconds:
          </p>

          <div style="background: #F4F7FB; border-radius: 12px; padding: 24px; margin: 24px 0;">
            <p style="color: #0C1F3F; font-weight: 600; margin: 0 0 12px; font-size: 15px;">
              Three ways to get started:
            </p>
            <ol style="color: #555; font-size: 14px; line-height: 1.8; padding-left: 20px; margin: 0;">
              <li><strong>Try a sample syllabus</strong> — one click, see a full skill map instantly</li>
              <li><strong>Tell us your major</strong> — type your program and the AI builds your map</li>
              <li><strong>Upload your own syllabus</strong> — paste text, upload a PDF, or drop in a URL</li>
            </ol>
          </div>

          <div style="text-align: center; margin: 28px 0;">
            <a href="https://www.transformlearning.ai/my-progress"
               style="display: inline-block; background: #00A8A8; color: white; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 700; font-size: 14px;">
              Map Your First Course →
            </a>
          </div>

          <p style="color: #333; font-size: 15px; line-height: 1.7;">
            If you have any questions or feedback, just reply to this email — it comes straight to me.
          </p>
          <p style="color: #333; font-size: 15px; line-height: 1.7;">
            — Jeff Ritter<br/>
            <span style="color: #999; font-size: 13px;">Founder, transformlearning.ai</span>
          </p>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
          <p style="color: #999; font-size: 12px; text-align: center;">
            <a href="https://www.transformlearning.ai" style="color: #00A8A8; text-decoration: none;">transformlearning.ai</a>
          </p>
        </div>
      `,
    })
    return NextResponse.json({ sent: true })
  } catch (err) {
    console.error('Welcome email error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
