import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, organization, role, interest, context } = body

    if (!name?.trim() || !email?.trim() || !organization?.trim()) {
      return NextResponse.json({ error: 'Name, email, and organization are required.' }, { status: 400 })
    }

    // Generate access key for this person
    const accessKey = Buffer.from(email.trim().toLowerCase()).toString('base64')
    const approveUrl = `https://transformlearning.ai/api/approve-access?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}&action=approve&key=${accessKey}`
    const denyUrl = `https://transformlearning.ai/api/approve-access?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}&action=deny`

    // Send notification to Jeff with approve/deny links
    await resend.emails.send({
      from: 'Transform Learning <noreply@transformlearning.ai>',
      to: 'jeff@yourclassroom.ai',
      replyTo: email,
      subject: `Access Request: ${name} at ${organization}`,
      text: [
        'NEW ACCESS REQUEST — transformlearning.ai',
        '',
        `Name: ${name}`,
        `Email: ${email}`,
        `Organization: ${organization}`,
        `Role: ${role || 'Not specified'}`,
        `Interested in: ${interest || 'Not specified'}`,
        '',
        `Context:`,
        context || 'None provided',
        '',
        '═══════════════════════════════════════',
        '',
        'APPROVE — Click this link to send them access:',
        approveUrl,
        '',
        'DENY — Click this link to send a polite decline:',
        denyUrl,
        '',
        '═══════════════════════════════════════',
        '',
        'Or reply directly to this email to respond personally.',
      ].join('\n'),
    })

    // Send confirmation to requester
    await resend.emails.send({
      from: 'Transform Learning <noreply@transformlearning.ai>',
      to: email,
      subject: 'Access request received — Arrival / Transform Learning',
      text: [
        `Hi ${name},`,
        '',
        'Thank you for your interest in Arrival. We received your access request and will review it shortly.',
        '',
        'You requested access to restricted materials on transformlearning.ai. A member of our team will follow up within 1-2 business days.',
        '',
        'In the meantime, you can explore the public demo at transformlearning.ai/demo.',
        '',
        'Best,',
        'The Arrival Team',
        'transformlearning.ai',
      ].join('\n'),
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Access request error:', e)
    return NextResponse.json({ error: 'Failed to submit. Please try again.' }, { status: 500 })
  }
}
