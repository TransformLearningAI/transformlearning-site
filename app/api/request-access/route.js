import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { makeActionSig } from '@/lib/access-token'

const resend = new Resend(process.env.RESEND_API_KEY)

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, organization, role, interest, context } = body

    if (!name?.trim() || !email?.trim() || !organization?.trim()) {
      return NextResponse.json({ error: 'Name, email, and organization are required.' }, { status: 400 })
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    const cleanEmail = email.trim()
    const cleanName = name.trim().slice(0, 100)

    // Approve and deny links carry a server-side signature, so they cannot be forged.
    const approveUrl = `https://transformlearning.ai/api/approve-access?email=${encodeURIComponent(cleanEmail)}&name=${encodeURIComponent(cleanName)}&action=approve&sig=${makeActionSig(cleanEmail, 'approve')}`
    const denyUrl = `https://transformlearning.ai/api/approve-access?email=${encodeURIComponent(cleanEmail)}&name=${encodeURIComponent(cleanName)}&action=deny&sig=${makeActionSig(cleanEmail, 'deny')}`

    // Send notification to Jeff with approve/deny links
    await resend.emails.send({
      from: 'Transform Learning <noreply@transformlearning.ai>',
      to: 'jeff@yourclassroom.ai',
      replyTo: cleanEmail,
      subject: `Access Request: ${cleanName} at ${organization}`,
      text: [
        'NEW ACCESS REQUEST - transformlearning.ai',
        '',
        `Name: ${cleanName}`,
        `Email: ${cleanEmail}`,
        `Organization: ${organization}`,
        `Role: ${role || 'Not specified'}`,
        `Interested in: ${interest || 'Not specified'}`,
        '',
        'Context:',
        context || 'None provided',
        '',
        '===================================',
        '',
        'APPROVE - Click this link to send them access:',
        approveUrl,
        '',
        'DENY - Click this link to send a polite decline:',
        denyUrl,
        '',
        '===================================',
        '',
        'Or reply directly to this email to respond personally.',
      ].join('\n'),
    })

    // Send confirmation to requester
    await resend.emails.send({
      from: 'Transform Learning <noreply@transformlearning.ai>',
      to: cleanEmail,
      subject: 'Access request received - Transform Learning',
      text: [
        `Hi ${cleanName},`,
        '',
        'Thank you for your interest in Transform Learning. We received your access request and will review it shortly.',
        '',
        'You requested access to restricted materials on transformlearning.ai. A member of our team will follow up within 1-2 business days.',
        '',
        'In the meantime, you can explore the public demo at transformlearning.ai/demo.',
        '',
        'Best,',
        'The Transform Learning Team',
        'transformlearning.ai',
      ].join('\n'),
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Access request error:', e)
    return NextResponse.json({ error: 'Failed to submit. Please try again.' }, { status: 500 })
  }
}
