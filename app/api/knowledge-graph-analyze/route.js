import { NextResponse } from 'next/server'

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY

const NODE_IDS = [
  'verbal','nonverbal','language','interpersonal','intrapersonal','written',
  'tone','word-choice','clarity','persuasion','conversation',
  'body-language','facial-expr','proxemics','haptics','paralanguage','chronemics',
  'semantics','syntax','sapir-whorf','denotation','language-power',
  'active-listening','empathy','conflict-res','feedback','relationship-stages','self-disclosure','trust',
  'self-concept','perception','inner-voice','cognitive-bias','emotional-intel','mindfulness',
  'thesis','paragraph','audience-aware','tone-register','evidence-use','revision',
  'narrative','argumentation','genre','voice','coherence','digital-writing','ai-writing',
  'context','culture','digital-comm','noise',
  'mis-words','mis-natural','mis-nonverbal','mis-listening','mis-objective',
  'mis-grammar','mis-oneshot','mis-formal',
]

export async function POST(request) {
  try {
    const { concept } = await request.json()
    if (!concept || !ANTHROPIC_KEY) {
      return NextResponse.json({ error: 'Missing concept or API key' }, { status: 400 })
    }

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: `You are analyzing how a communication device, instance, medium, or concept relates to a Human Communication knowledge graph.

The user entered: "${concept}"

Here are all the nodes in the knowledge graph:
${NODE_IDS.join(', ')}

For each node that is DIRECTLY or INDIRECTLY related to "${concept}", provide:
- The node ID (must match exactly from the list)
- Whether the connection is "direct" (strongly, obviously related) or "indirect" (related through a chain of reasoning)
- A short description (10-20 words max) explaining HOW this concept connects to that node specifically in the context of "${concept}"

Respond ONLY with valid JSON in this exact format, no other text:
{
  "analysis": "${concept}",
  "summary": "A one-sentence summary of what this is and why it matters for human communication",
  "connections": [
    {"nodeId": "verbal", "type": "direct", "description": "How it connects"},
    {"nodeId": "tone", "type": "indirect", "description": "How it connects"}
  ]
}

Be selective — only include nodes with genuine, defensible connections. Typically 8-20 nodes. Don't include every node just to be comprehensive.`
        }],
      }),
    })

    const data = await res.json()
    const text = data.content?.[0]?.text || ''

    // Parse the JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Failed to parse response' }, { status: 500 })
    }

    const result = JSON.parse(jsonMatch[0])
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
