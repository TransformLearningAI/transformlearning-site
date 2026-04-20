import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  try {
    const { name, email, organization, role, interests, message } = await request.json()

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 })
    }

    // Notify Jeff
    await resend.emails.send({
      from: 'Transform Learning <noreply@transformlearning.ai>',
      to: 'jeff@yourclassroom.ai',
      replyTo: email,
      subject: `Tools Inquiry: ${name}${organization ? ` at ${organization}` : ''}`,
      text: [
        'NEW INQUIRY — transformlearning.ai/tools',
        '',
        `Name: ${name}`,
        `Email: ${email}`,
        `Organization: ${organization || 'Not specified'}`,
        `Role: ${role || 'Not specified'}`,
        '',
        `Interests:`,
        ...(interests || []).map(i => `  • ${i}`),
        '',
        `Message:`,
        message || 'None provided',
        '',
        `Reply directly to this email to respond to ${name}.`,
      ].join('\n'),
    })

    // Confirm to sender
    await resend.emails.send({
      from: 'Transform Learning <noreply@transformlearning.ai>',
      to: email,
      subject: 'Thanks for reaching out — Transform Learning',
      text: [
        `Hi ${name},`,
        '',
        'Thank you for your interest in Transform Learning. We received your inquiry and will follow up shortly.',
        '',
        'In the meantime, you can explore our current tools at transformlearning.ai/tools and read about our methodology at transformlearning.ai/methodology.',
        '',
        'Best,',
        'Jeff Ritter',
        'Founder, Transform Learning',
        'transformlearning.ai',
      ].join('\n'),
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Tools inquiry error:', e)
    return NextResponse.json({ error: 'Failed to submit. Please try again.' }, { status: 500 })
  }
}
