import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')
  const name = searchParams.get('name') || 'there'
  const action = searchParams.get('action')
  const key = searchParams.get('key')

  if (!email || !action) {
    return new Response('Missing parameters.', { status: 400, headers: { 'Content-Type': 'text/html' } })
  }

  try {
    if (action === 'approve') {
      // Send access email to the requester
      const methodologyLink = `https://transformlearning.ai/methodology?access=${key}`
      const investorLink = `https://transformlearning.ai/investors?access=${key}`

      await resend.emails.send({
        from: 'Transform Learning <noreply@transformlearning.ai>',
        to: email,
        subject: 'Your access has been approved — Arrival / Transform Learning',
        text: [
          `Hi ${name},`,
          '',
          'Your access request has been approved. Here are your personal access links:',
          '',
          'Proficiency Scoring Methodology:',
          methodologyLink,
          '',
          'Investor Overview / Go-to-Market Strategy:',
          investorLink,
          '',
          'These links are personal to you. They will work in any browser and do not expire.',
          '',
          'If you have questions about what you read, feel free to reply to this email.',
          '',
          'Best,',
          'Jeff Ritter, PhD',
          'Founder, Transform Learning',
          'transformlearning.ai',
        ].join('\n'),
      })

      // Show confirmation page to Jeff
      return new Response(`
        <html>
          <head><title>Access Approved</title></head>
          <body style="font-family: system-ui; max-width: 500px; margin: 80px auto; text-align: center; color: #1a1a2e;">
            <div style="font-size: 48px; margin-bottom: 16px;">&#x2705;</div>
            <h1 style="font-size: 24px; margin-bottom: 8px;">Access approved.</h1>
            <p style="color: #666; font-size: 14px;">An email with access links has been sent to <strong>${email}</strong>.</p>
            <p style="color: #999; font-size: 12px; margin-top: 24px;">You can close this tab.</p>
          </body>
        </html>
      `, { status: 200, headers: { 'Content-Type': 'text/html' } })

    } else if (action === 'deny') {
      // Send polite decline
      await resend.emails.send({
        from: 'Transform Learning <noreply@transformlearning.ai>',
        to: email,
        subject: 'Regarding your access request — Arrival / Transform Learning',
        text: [
          `Hi ${name},`,
          '',
          'Thank you for your interest in Arrival. After reviewing your request, we are not able to provide access to our restricted materials at this time.',
          '',
          'You are welcome to explore our public demo at transformlearning.ai/demo and our blog at transformlearning.ai/blog.',
          '',
          'If your circumstances change or you have additional context to share, please feel free to submit a new request at transformlearning.ai/access.',
          '',
          'Best,',
          'The Arrival Team',
          'transformlearning.ai',
        ].join('\n'),
      })

      return new Response(`
        <html>
          <head><title>Access Denied</title></head>
          <body style="font-family: system-ui; max-width: 500px; margin: 80px auto; text-align: center; color: #1a1a2e;">
            <div style="font-size: 48px; margin-bottom: 16px;">&#x1F6AB;</div>
            <h1 style="font-size: 24px; margin-bottom: 8px;">Access declined.</h1>
            <p style="color: #666; font-size: 14px;">A polite decline has been sent to <strong>${email}</strong>.</p>
            <p style="color: #999; font-size: 12px; margin-top: 24px;">You can close this tab.</p>
          </body>
        </html>
      `, { status: 200, headers: { 'Content-Type': 'text/html' } })
    }

    return new Response('Invalid action.', { status: 400 })
  } catch (e) {
    console.error('Approve/deny error:', e)
    return new Response('Something went wrong. Try again.', { status: 500 })
  }
}
