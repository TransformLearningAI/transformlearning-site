'use client'
import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function ChatPage() {
  const { enrollmentId, skillId } = useParams()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const [skill, setSkill] = useState(null)
  const [proficiency, setProficiency] = useState(null)
  const [pace, setPace] = useState('moderate')
  const bottomRef = useRef(null)

  useEffect(() => {
    Promise.all([
      fetch(`/api/skills/${skillId}`).then(r => r.json()),
      fetch(`/api/proficiency?enrollmentId=${enrollmentId}`).then(r => r.json()),
    ]).then(([s, p]) => {
      setSkill(s)
      setProficiency(p.scores?.find(ps => ps.skill_id === skillId) || null)
      // Starter message
      setMessages([{
        role: 'assistant',
        content: `Hi! I'm your coach for **${s.name}**. ${
          p.scores?.find(ps => ps.skill_id === skillId)
            ? `Your current proficiency is ${p.scores.find(ps => ps.skill_id === skillId).score}% — let's work on getting that higher.`
            : `Let's work through this skill together.`
        } What would you like to understand better, or where do you feel stuck?`,
      }])
    })
  }, [enrollmentId, skillId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(e) {
    e.preventDefault()
    if (!input.trim() || sending) return
    const userMsg = input.trim()
    setInput('')
    setSending(true)
    setMessages(m => [...m, { role: 'user', content: userMsg }])

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enrollmentId, skillId, message: userMsg, sessionId, pace }),
    })

    if (!sessionId) {
      const newSessionId = res.headers.get('X-Session-Id')
      if (newSessionId) setSessionId(newSessionId)
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let assistantMsg = ''

    setMessages(m => [...m, { role: 'assistant', content: '' }])

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      assistantMsg += decoder.decode(value, { stream: true })
      setMessages(m => [
        ...m.slice(0, -1),
        { role: 'assistant', content: assistantMsg },
      ])
    }

    setSending(false)
  }

  function renderContent(content) {
    return content
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>')
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-2xl">
      {/* Header */}
      <div className="bg-white rounded-t-2xl border border-gray-200 border-b-0 px-6 py-4 flex items-center justify-between">
        <div>
          <Link href={`/my-progress/${enrollmentId}/skill/${skillId}`} className="text-xs text-gray-400 hover:text-navy block mb-1">
            ← {skill?.name}
          </Link>
          <h1 className="font-bold text-navy text-base">{skill?.name} — Coaching</h1>
          {proficiency && (
            <p className="text-xs text-gray-400">Current proficiency: {proficiency.score}%</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          {/* Pace control */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Pace</span>
            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
              {[
                { id: 'slow', label: 'Gradual', icon: '◇' },
                { id: 'moderate', label: 'Moderate', icon: '◈' },
                { id: 'fast', label: 'Fast', icon: '▸▸' },
              ].map(p => (
                <button key={p.id} onClick={() => setPace(p.id)}
                  className={`px-2.5 py-1.5 text-[11px] font-medium transition-all ${
                    pace === p.id
                      ? 'bg-navy text-white'
                      : 'text-gray-400 hover:text-navy hover:bg-gray-50'
                  }`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ background: '#00A8A8' }}>AI</div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-white border-x border-gray-200 px-6 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'text-white rounded-br-sm'
                : 'bg-gray-50 border border-gray-200 text-gray-700 rounded-bl-sm'
            }`}
            style={msg.role === 'user' ? { background: '#0C1F3F' } : {}}
            dangerouslySetInnerHTML={{ __html: renderContent(msg.content) || '…' }} />
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage}
        className="bg-white rounded-b-2xl border border-gray-200 border-t-0 px-4 py-3 flex gap-3">
        <input
          value={input} onChange={e => setInput(e.target.value)}
          placeholder="Ask a question or say where you're stuck…"
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-teal text-navy"
          disabled={sending} />
        <button type="submit" disabled={sending || !input.trim()}
          className="px-5 py-2.5 rounded-xl font-bold text-sm text-white disabled:opacity-40"
          style={{ background: '#00A8A8' }}>
          {sending ? '…' : '→'}
        </button>
      </form>
    </div>
  )
}
