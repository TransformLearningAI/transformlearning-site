import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req) {
  try {
    const { name, email, rating, comment, page } = await req.json()

    if (!rating || rating < 1 || rating > 5) {
      return Response.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating)

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px;">
        <h2 style="color: #0C1F3F; margin-bottom: 4px;">New Feedback</h2>
        <p style="color: #666; font-size: 14px; margin-top: 0;">From <strong>${page || 'unknown'}</strong> page</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb;" />
        <p style="font-size: 28px; margin: 16px 0 8px; letter-spacing: 2px; color: #F59E0B;">${stars}</p>
        <p style="color: #374151; font-size: 14px; margin-bottom: 4px;"><strong>Rating:</strong> ${rating}/5</p>
        ${comment ? `<p style="color: #374151; font-size: 14px; background: #F4F7FB; padding: 12px 16px; border-radius: 8px; white-space: pre-wrap;">${comment}</p>` : '<p style="color: #9CA3AF; font-size: 14px;"><em>No comment provided</em></p>'}
        <hr style="border: none; border-top: 1px solid #e5e7eb;" />
        <p style="color: #6B7280; font-size: 13px; margin-bottom: 2px;"><strong>Name:</strong> ${name || 'Anonymous'}</p>
        <p style="color: #6B7280; font-size: 13px; margin-top: 2px;"><strong>Email:</strong> ${email || 'Not provided'}</p>
      </div>
    `

    await resend.emails.send({
      from: 'Transform Learning <noreply@transformlearning.ai>',
      to: 'jeff@yourclassroom.ai',
      subject: `Feedback ${stars} — ${page || 'unknown'} page`,
      html,
    })

    return Response.json({ ok: true })
  } catch (err) {
    console.error('Feedback API error:', err)
    return Response.json({ error: 'Failed to send feedback' }, { status: 500 })
  }
}
