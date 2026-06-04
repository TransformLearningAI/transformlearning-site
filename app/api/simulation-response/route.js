import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// GET — fetch all responses, optionally filtered by question_id
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const questionId = searchParams.get('questionId')

  let query = supabase
    .from('simulation_responses')
    .select('*')
    .order('created_at', { ascending: true })

  if (questionId) query = query.eq('question_id', questionId)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ responses: data || [] })
}

// POST — save a response and email Jeff
export async function POST(request) {
  const { name, email, questionId, questionText, response, section } = await request.json()
  if (!name || !response || !questionId) {
    return NextResponse.json({ error: 'Name, question, and response required' }, { status: 400 })
  }

  // Save to Supabase
  const { data, error } = await supabase
    .from('simulation_responses')
    .insert({
      question_id: questionId,
      section,
      question_text: questionText,
      name,
      email: email || null,
      response,
    })
    .select()
    .single()

  if (error) {
    console.error('Supabase insert error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Email Jeff
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
        </div>
      `,
    })
  } catch (err) {
    console.error('Email error:', err)
  }

  return NextResponse.json({ ok: true, response: data })
}
