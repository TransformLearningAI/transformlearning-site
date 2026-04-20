export const runtime = 'nodejs'

export async function GET(request) {
  // Verify this is being called by Vercel Cron (or manually for testing)
  const authHeader = request.headers.get('authorization')
  if (
    process.env.NODE_ENV === 'production' &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response('Unauthorized', { status: 401 })
  }

  const resendKey = process.env.RESEND_API_KEY
  const toEmail = process.env.DIGEST_EMAIL || 'jeff@yourclassroom.ai'
  const vercelToken = process.env.VERCEL_TOKEN
  const projectId = process.env.VERCEL_PROJECT_ID || 'prj_4YJwjZtwghfrcdIzozNbsV7qW3RA'

  // Fetch analytics from Vercel if token is available
  let statsHtml = ''
  let statsText = ''

  if (vercelToken) {
    try {
      const now = Date.now()
      const yesterday = now - 24 * 60 * 60 * 1000
      const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000

      // Vercel Web Analytics API
      const [dailyRes, weeklyRes] = await Promise.all([
        fetch(
          `https://vercel.com/api/web/insights/summary?projectId=${projectId}&from=${yesterday}&to=${now}&environment=production`,
          { headers: { Authorization: `Bearer ${vercelToken}` } }
        ),
        fetch(
          `https://vercel.com/api/web/insights/summary?projectId=${projectId}&from=${sevenDaysAgo}&to=${now}&environment=production`,
          { headers: { Authorization: `Bearer ${vercelToken}` } }
        ),
      ])

      const daily = dailyRes.ok ? await dailyRes.json() : null
      const weekly = weeklyRes.ok ? await weeklyRes.json() : null

      if (daily && weekly) {
        const dv = daily.data?.pageviews ?? '—'
        const dvis = daily.data?.visitors ?? '—'
        const wv = weekly.data?.pageviews ?? '—'
        const wvis = weekly.data?.visitors ?? '—'

        statsHtml = `
          <table style="width:100%;border-collapse:collapse;margin:24px 0;">
            <thead>
              <tr style="background:#0C1F3F;color:white;">
                <th style="padding:12px 16px;text-align:left;font-weight:600;">Metric</th>
                <th style="padding:12px 16px;text-align:center;font-weight:600;">Last 24h</th>
                <th style="padding:12px 16px;text-align:center;font-weight:600;">Last 7 days</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid #e5e7eb;">
                <td style="padding:12px 16px;color:#374151;">Page Views</td>
                <td style="padding:12px 16px;text-align:center;font-weight:600;color:#0C1F3F;">${dv}</td>
                <td style="padding:12px 16px;text-align:center;font-weight:600;color:#0C1F3F;">${wv}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px;color:#374151;">Unique Visitors</td>
                <td style="padding:12px 16px;text-align:center;font-weight:600;color:#00A8A8;">${dvis}</td>
                <td style="padding:12px 16px;text-align:center;font-weight:600;color:#00A8A8;">${wvis}</td>
              </tr>
            </tbody>
          </table>`

        statsText = `Page Views (24h): ${dv} | Visitors (24h): ${dvis}\nPage Views (7d): ${wv} | Visitors (7d): ${wvis}`
      }
    } catch (err) {
      console.error('Analytics fetch error:', err)
    }
  }

  if (!statsHtml) {
    statsHtml = `
      <div style="background:#F4F7FB;border-radius:8px;padding:20px;margin:24px 0;text-align:center;color:#6b7280;">
        <p style="margin:0;">Analytics data unavailable — add <strong>VERCEL_TOKEN</strong> as an environment variable to enable live stats.</p>
        <p style="margin:8px 0 0;"><a href="https://vercel.com/transformlearningai/transformlearning-site/analytics" style="color:#00A8A8;">View analytics dashboard →</a></p>
      </div>`
    statsText = 'Add VERCEL_TOKEN env var to enable stats in this digest.\nView analytics: https://vercel.com/transformlearningai/transformlearning-site/analytics'
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    timeZone: 'America/New_York',
  })

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Transform Learning — Daily Digest</title>
</head>
<body style="margin:0;padding:0;background:#F4F7FB;font-family:-apple-system,BlinkMacSystemFont,'DM Sans',sans-serif;">
  <table style="max-width:600px;margin:0 auto;padding:32px 16px;" cellpadding="0" cellspacing="0">
    <!-- Header -->
    <tr>
      <td style="background:#0C1F3F;border-radius:12px 12px 0 0;padding:28px 32px;">
        <p style="margin:0;color:#00A8A8;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">Daily Digest</p>
        <h1 style="margin:6px 0 0;color:white;font-size:24px;font-weight:300;letter-spacing:-0.02em;">Transform Learning</h1>
        <p style="margin:4px 0 0;color:rgba(255,255,255,0.5);font-size:13px;">${today}</p>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="background:white;padding:32px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;">

        <h2 style="margin:0 0 8px;font-size:18px;font-weight:600;color:#0C1F3F;">Site Traffic</h2>
        <p style="margin:0 0 4px;color:#6b7280;font-size:14px;">transformlearning.ai</p>

        ${statsHtml}

        <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0;">

        <h2 style="margin:0 0 12px;font-size:18px;font-weight:600;color:#0C1F3F;">Quick Links</h2>
        <table cellpadding="0" cellspacing="0" style="width:100%;">
          <tr>
            <td style="padding:0 8px 0 0;width:50%;">
              <a href="https://transformlearning.ai" style="display:block;background:#0C1F3F;color:white;text-decoration:none;padding:12px 16px;border-radius:8px;font-size:13px;font-weight:600;text-align:center;">View Site →</a>
            </td>
            <td style="padding:0 0 0 8px;width:50%;">
              <a href="https://vercel.com/transformlearningai/transformlearning-site/analytics" style="display:block;background:#00A8A8;color:white;text-decoration:none;padding:12px 16px;border-radius:8px;font-size:13px;font-weight:600;text-align:center;">Analytics Dashboard →</a>
            </td>
          </tr>
        </table>

      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background:#F4F7FB;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none;padding:20px 32px;text-align:center;">
        <p style="margin:0;color:#9ca3af;font-size:12px;">
          Transform Learning · Daily digest sent to ${toEmail}<br>
          <a href="https://transformlearning.ai" style="color:#00A8A8;text-decoration:none;">transformlearning.ai</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`

  // Send via Resend
  if (!resendKey) {
    console.error('RESEND_API_KEY not set')
    return Response.json({ error: 'RESEND_API_KEY not configured' }, { status: 500 })
  }

  const sendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Transform Learning <digest@transformlearning.ai>',
      to: [toEmail],
      subject: `Transform Learning Digest — ${today}`,
      html,
      text: `Transform Learning Daily Digest\n${today}\n\n${statsText}\n\nView site: https://transformlearning.ai\nAnalytics: https://vercel.com/transformlearningai/transformlearning-site/analytics`,
    }),
  })

  if (!sendRes.ok) {
    const err = await sendRes.text()
    console.error('Resend error:', err)
    return Response.json({ error: err }, { status: 500 })
  }

  const result = await sendRes.json()
  console.log('Digest sent:', result.id)
  return Response.json({ ok: true, id: result.id })
}
