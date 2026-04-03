import { createClient, createServiceClient } from '@/lib/supabase/server'
import { buildSystemPrompt } from '@/lib/claude/prompts/coaching-chat'
import { getClient, MODELS } from '@/lib/claude/client'
import { awardXP, XP_REWARDS } from '@/lib/xp'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { enrollmentId, skillId, message: userMessage, sessionId: existingSessionId } = await request.json()
  const service = await createServiceClient()

  // Verify enrollment belongs to student
  const { data: enrollment } = await service
    .from('enrollments').select('student_id, courses(title)').eq('id', enrollmentId).single()
  if (!enrollment || enrollment.student_id !== user.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  // Get skill + proficiency
  const { data: skill } = await service
    .from('skills').select('*').eq('id', skillId).single()
  const { data: proficiency } = await service
    .from('proficiency_scores')
    .select('score, evidence_summary')
    .eq('enrollment_id', enrollmentId)
    .eq('skill_id', skillId)
    .single()

  // Get or create chat session
  let sessionId = existingSessionId
  if (!sessionId) {
    const { data: session } = await service
      .from('chat_sessions')
      .insert({ enrollment_id: enrollmentId, skill_id: skillId })
      .select()
      .single()
    sessionId = session.id
  }

  // Get chat history
  const { data: history } = await service
    .from('chat_messages')
    .select('role, content')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })

  // Save user message
  await service.from('chat_messages').insert({
    session_id: sessionId, role: 'user', content: userMessage,
  })

  // Build system prompt
  const systemPrompt = buildSystemPrompt({
    courseName: enrollment.courses.title,
    skillName: skill.name,
    skillDescription: skill.description,
    skillType: skill.skill_type,
    score: proficiency?.score ?? 0,
    evidenceSummary: proficiency?.evidence_summary,
  })

  // Call Claude with streaming
  const claude = getClient()
  const messages = [
    ...(history || []).map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMessage },
  ]

  const stream = await claude.messages.stream({
    model: MODELS.FAST,
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  })

  let fullResponse = ''
  const encoder = new TextEncoder()

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          const text = chunk.delta.text
          fullResponse += text
          controller.enqueue(encoder.encode(text))
        }
      }
      // Save assistant response
      await service.from('chat_messages').insert({
        session_id: sessionId, role: 'assistant', content: fullResponse,
      })
      // Award XP for coaching session
      await awardXP(service, user.id, XP_REWARDS.coaching_session, 'coaching_session')
      controller.close()
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Session-Id': sessionId,
      'Transfer-Encoding': 'chunked',
    },
  })
}
