import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export const runtime = 'nodejs'

export async function POST(request) {
  try {
    const { questionId, questionText, section } = await request.json()
    if (!questionId) return NextResponse.json({ error: 'questionId required' }, { status: 400 })

    const { data: responses, error } = await supabase
      .from('simulation_responses')
      .select('name, response, created_at')
      .eq('question_id', questionId)
      .order('created_at', { ascending: true })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    if (!responses || responses.length === 0) {
      return NextResponse.json({ analysis: 'No responses yet to analyze.' })
    }

    const responsesText = responses.map(r => `[${r.name}]: ${r.response}`).join('\n\n')

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `You are evaluating team responses to a campus transformation simulation exercise. The scenario involves "Edgewater College" — a fictional private liberal arts college in rural Pennsylvania facing closure (580 students, $5.3M deficit, $11M bond debt, reserves running out May 2028).

IMPORTANT CONTEXT ABOUT OUR MODEL — you must understand this to evaluate correctly:

Campus Transformation is NOT about integrating AI into traditional teaching or replacing faculty with AI. The transformed campus has NO traditional faculty. It is no longer a college. It becomes a Community Benefit Corporation — a multi-use community campus offering workforce training (CDL, welding, CNA, IT certs), community education, events and rentals, housing, health and wellness, K-12 programs, and small business support. Industry certifications replace degrees. Workforce trainers replace professors.

The role of AI in the new model is LIMITED and specific:
- Helping the organization manage operations more efficiently
- As a TOPIC for local workforce training (teaching community members about AI)
- For the organization's own planning, forecasting, and data analysis
- AI does NOT replace instructors, teachers, or workforce trainers
- There is no "AI-powered classroom" or "AI tutoring" as a central feature

Do NOT suggest or praise AI integration into teaching, AI-powered learning, or AI replacing human instruction. That is not our model. If team responses suggest heavy AI integration in instruction, flag that as a misunderstanding of the model.

The question is from ${section}:
"${questionText}"

Here are the team responses:

${responsesText}

Provide a brief analysis (3-5 paragraphs) that:
1. Identifies the strongest insights across all responses
2. Notes any gaps, contradictions, or areas where the team should dig deeper
3. Scores the collective response on Specificity, Honesty, Feasibility, and Empathy (1-5 each) with a brief justification for each score
4. Suggests one thing the team hasn't considered

Be direct, constructive, and specific. Reference Edgewater's actual data. Format with clear headers.`
      }]
    })

    const analysis = msg.content[0].text
    return NextResponse.json({ analysis, responseCount: responses.length })
  } catch (err) {
    console.error('Simulation analyze error:', err)
    return NextResponse.json({ error: err.message || 'Analysis failed' }, { status: 500 })
  }
}
