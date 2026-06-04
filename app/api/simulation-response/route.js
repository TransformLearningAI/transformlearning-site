import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request) {
  const { name, email, questionId, questionText, response, section } = await request.json()
  if (!name || !response || !questionId) {
    return NextResponse.json({ error: 'Name, question, and response required' }, { status: 400 })
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'Campus Transformation <noreply@transformlearning.ai>',
      to: 'jeff@transformlearning.ai',
      subject: `Simulation Response — ${name} — ${section}: ${questionId}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:600px">
          <div style="background:#0C1F3F;padding:20px 24px;border-radius:12px 12px 0 0">
            <p style="color:#00A8A8;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 4px">Simulation Response</p>
            <h2 style="color:white;margin:0;font-size:18px">${name}</h2>
            ${email ? `<p style="color:rgba(255,255,255,0.5);font-size:13px;margin:4px 0 0">${email}</p>` : ''}
          </div>
          <div style="background:#F4F7FB;padding:20px 24px;border:1px solid #DDE5EF">
            <p style="color:#00A8A8;font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 6px">${section}</p>
            <p style="color:#0C1F3F;font-weight:600;font-size:14px;margin:0 0 4px">${questionId}</p>
            <p style="color:#64748B;font-size:13px;margin:0;line-height:1.5">${questionText}</p>
          </div>
          <div style="padding:20px 24px;border:1px solid #DDE5EF;border-top:none;border-radius:0 0 12px 12px;background:white">
            <p style="color:#0C1F3F;font-size:14px;line-height:1.7;white-space:pre-wrap">${response}</p>
          </div>
          <p style="color:#94A3B8;font-size:11px;margin-top:12px">Also posted to the <a href="https://docs.google.com/document/d/1akdzkGLS9FNzjYJqSpb0JFxu-4CykS1tLWsASlDjdtY/edit" style="color:#00A8A8">collaborative Google Doc</a></p>
        </div>
      `,
    })
  } catch (err) {
    console.error('Simulation response email error:', err)
  }

  return NextResponse.json({ ok: true })
}
