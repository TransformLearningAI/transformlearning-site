import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const action = searchParams.get('action')

  if (!id || !['approve', 'deny'].includes(action)) {
    return new Response(page('Invalid Request', 'Missing or invalid parameters.', '#FF6B4A'), {
      headers: { 'Content-Type': 'text/html' },
    })
  }

  const service = await createServiceClient()

  // Get the request
  const { data: req, error } = await service
    .from('whitepaper_requests')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !req) {
    return new Response(page('Not Found', 'This request was not found.', '#FF6B4A'), {
      headers: { 'Content-Type': 'text/html' },
    })
  }

  if (req.status !== 'pending') {
    return new Response(page('Already Processed', `This request was already ${req.status}.`, '#00A8A8'), {
      headers: { 'Content-Type': 'text/html' },
    })
  }

  // Update status
  await service
    .from('whitepaper_requests')
    .update({
      status: action === 'approve' ? 'approved' : 'denied',
      approved_at: action === 'approve' ? new Date().toISOString() : null,
    })
    .eq('id', id)

  if (action === 'approve') {
    // Send download link to requester
    const downloadUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://transformlearning.ai'}/campus-os/whitepaper/download?token=${req.token}`

    if (process.env.RESEND_API_KEY) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Transform Learning <noreply@transformlearning.ai>',
            to: [req.email],
            subject: 'Your Campus OS White Paper is Ready',
            html: `
              <div style="font-family:sans-serif;max-width:520px">
                <h2 style="color:#0C1F3F">Hi ${req.name.split(' ')[0]},</h2>
                <p style="font-size:15px;color:#444;line-height:1.7">
                  Your request for the Campus OS white paper has been approved. You can download it using the link below.
                </p>
                <a href="${downloadUrl}" style="display:inline-block;padding:14px 28px;background:#0C1F3F;color:white;text-decoration:none;border-radius:10px;font-weight:bold;font-size:14px;margin:16px 0">
                  Download White Paper →
                </a>
                <p style="font-size:13px;color:#888;line-height:1.6;margin-top:24px">
                  This link is unique to you. If you have questions or want to discuss a pilot,
                  reply to this email or visit <a href="https://transformlearning.ai" style="color:#00A8A8">transformlearning.ai</a>.
                </p>
                <p style="font-size:13px;color:#888">— The Arrival Team</p>
              </div>
            `,
          }),
        })
      } catch (e) {
        console.error('Download email failed:', e)
      }
    }

    return new Response(page(
      'Approved',
      `${req.name} (${req.email}) has been approved. A download link has been sent to their email.`,
      '#4F8A5B'
    ), { headers: { 'Content-Type': 'text/html' } })
  }

  return new Response(page(
    'Denied',
    `${req.name}'s request has been denied. No email was sent.`,
    '#FF6B4A'
  ), { headers: { 'Content-Type': 'text/html' } })
}

function page(title, message, color) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} — Arrival</title>
<style>
  body { font-family: system-ui, sans-serif; margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #F4F7FB; }
  .card { background: white; border-radius: 20px; padding: 48px; max-width: 440px; text-align: center; box-shadow: 0 8px 32px rgba(12,31,63,0.08); }
  h1 { color: ${color}; margin: 0 0 16px; font-size: 28px; }
  p { color: #60758C; font-size: 15px; line-height: 1.7; margin: 0; }
</style></head>
<body><div class="card"><h1>${title}</h1><p>${message}</p></div></body></html>`
}
