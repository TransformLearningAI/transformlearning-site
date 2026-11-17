import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, institution, role, course, email, message } = body

    if (!name || !institution || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (!EMAIL_PATTERN.test(String(email).trim())) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    // Deliver the request to the team by email. Personal details are not written to server logs.
    await resend.emails.send({
      from: 'Transform Learning <noreply@transformlearning.ai>',
      to: 'jeff@yourclassroom.ai',
      replyTo: String(email).trim(),
      subject: `New Pilot Partner: ${String(name).slice(0, 100)} - ${String(institution).slice(0, 100)}`,
      text: [
        `Name: ${name}`,
        `Institution: ${institution}`,
        `Role: ${role || 'Not specified'}`,
        `Course: ${course || 'Not specified'}`,
        `Email: ${email}`,
        '',
        'Message:',
        message || 'None provided',
      ].join('\n'),
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Pilot form error:', err?.name || 'unknown error')
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
