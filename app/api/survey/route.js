import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request) {
  try {
    const { site, rating, audience, features, comment } = await request.json()

    if (!rating) return NextResponse.json({ error: 'Rating required' }, { status: 400 })

    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating)

    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'Survey <noreply@transformlearning.ai>',
      to: 'jeff@transformlearning.ai',
      subject: `Survey Response — ${site} — ${stars} (${rating}/5)`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 500px;">
          <h2 style="color: #0C1F3F; margin-bottom: 4px;">New Survey Response</h2>
          <p style="color: #718096; font-size: 14px; margin-top: 0;">From <strong>${site}</strong> at ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET</p>

          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #E2E8F0; color: #718096; font-size: 13px; width: 120px;">Rating</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #E2E8F0; font-size: 18px;">${stars} <span style="color: #718096; font-size: 13px;">(${rating}/5)</span></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #E2E8F0; color: #718096; font-size: 13px;">Who they are</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #E2E8F0; font-size: 14px; font-weight: 600;">${audience || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #E2E8F0; color: #718096; font-size: 13px;">Want more of</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #E2E8F0; font-size: 14px;">${features && features.length > 0 ? features.join(', ') : 'None selected'}</td>
            </tr>
          </table>

          ${comment ? `
          <div style="background: #F7FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px; margin-top: 12px;">
            <p style="color: #718096; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 6px 0;">Comment / Question</p>
            <p style="color: #2D3748; font-size: 14px; line-height: 1.5; margin: 0; white-space: pre-wrap;">${comment}</p>
          </div>` : ''}
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Survey email error:', err)
    return NextResponse.json({ ok: true }) // Don't show error to user
  }
}
