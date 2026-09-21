import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req) {
  try {
    const data = await req.json()

    await resend.emails.send({
      from: 'Transform Learning <noreply@transformlearning.ai>',
      to: process.env.DIGEST_EMAIL || 'jeff@yourclassroom.ai',
      subject: `Ambassador Application: ${data.name} — ${data.school}`,
      html: `
        <h2>New Ambassador Application</h2>
        <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
          <tr><td style="padding:8px;font-weight:bold;color:#666;">Name</td><td style="padding:8px;">${data.name}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;color:#666;">Email</td><td style="padding:8px;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
          <tr><td style="padding:8px;font-weight:bold;color:#666;">School</td><td style="padding:8px;">${data.school}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;color:#666;">Major</td><td style="padding:8px;">${data.major || 'Not specified'}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;color:#666;">Year</td><td style="padding:8px;">${data.year || 'Not specified'}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;color:#666;">Instagram</td><td style="padding:8px;">${data.instagram || 'Not specified'}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;color:#666;">TikTok</td><td style="padding:8px;">${data.tiktok || 'Not specified'}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;color:#666;">Followers</td><td style="padding:8px;">${data.followers || 'Not specified'}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;color:#666;">Why</td><td style="padding:8px;">${data.why || 'Not specified'}</td></tr>
        </table>
      `,
    })

    // Send confirmation to applicant
    await resend.emails.send({
      from: 'Transform Learning <noreply@transformlearning.ai>',
      replyTo: 'jeff@yourclassroom.ai',
      to: data.email,
      subject: 'We received your ambassador application!',
      html: `
        <div style="font-family:sans-serif;font-size:14px;line-height:1.7;color:#333;max-width:500px;">
          <p>Hi ${data.name.split(' ')[0]},</p>
          <p>Thanks for applying to the Transform Learning Ambassador Program! We'll review your application and get back to you within a few days.</p>
          <p>In the meantime, check out <a href="https://transformlearning.ai">transformlearning.ai</a> to see what you'd be sharing with your audience.</p>
          <p>Best,<br>The Transform Learning Team</p>
        </div>
      `,
    }).catch(() => {})

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Ambassador apply error:', err)
    return NextResponse.json({ ok: true })
  }
}
