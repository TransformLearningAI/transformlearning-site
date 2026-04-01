import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, institution, role, course, email, message } = body

    // Validate required fields
    if (!name || !institution || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // ── Option A: Log to console (works out of the box, check Railway logs) ──
    console.log('New pilot partner request:', {
      name, institution, role, course, email, message,
      timestamp: new Date().toISOString(),
    })

    // ── Option B: Send email via Resend (uncomment after adding RESEND_API_KEY) ──
    // import { Resend } from 'resend'
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.emails.send({
    //   from: 'pilot@transformlearning.ai',
    //   to: 'your@email.com',
    //   subject: `New Pilot Partner: ${name} — ${institution}`,
    //   text: `
    //     Name: ${name}
    //     Institution: ${institution}
    //     Role: ${role}
    //     Course: ${course}
    //     Email: ${email}
    //     Message: ${message}
    //   `,
    // })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Pilot form error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
