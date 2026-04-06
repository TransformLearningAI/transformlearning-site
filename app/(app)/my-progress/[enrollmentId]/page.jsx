'use client'
import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { proficiencyColor, proficiencyLabel } from '@/lib/utils/proficiency'
import Link from 'next/link'
import { BookOpen, Brain, FileUp, Sparkles, Trophy, Compass, MessageCircle } from 'lucide-react'

export default function StudentDashboard() {
  const { enrollmentId } = useParams()
  const [enrollment, setEnrollment] = useState(null)
  const [scores, setScores] = useState([])
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSkill, setSelectedSkill] = useState(null)
  const [selectedTrack, setSelectedTrack] = useState('course')
  const [layout, setLayout] = useState('galaxy') // galaxy | list | circle | cards
  const [draggedStar, setDraggedStar] = useState(null)
  const [customPositions, setCustomPositions] = useState({})

  useEffect(() => {
    Promise.all([
      fetch(`/api/enrollments/${enrollmentId}`).then(r => r.json()),
      fetch(`/api/proficiency?enrollmentId=${enrollmentId}`).then(r => r.json()),
    ]).then(([e, p]) => {
      setEnrollment(e)
      setScores(p.scores || [])
      setHistory((p.history || []).sort((a, b) => new Date(b.created_at || b.scored_at) - new Date(a.created_at || a.scored_at)))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [enrollmentId])

  const derived = useMemo(() => {
    if (!enrollment) return null
    const skills = enrollment?.courses?.skills?.filter(s => s.is_approved) || []
    const scoreMap = Object.fromEntries(scores.map(s => [s.skill_id, s]))
    const nodes = skills.map(s => {
      const ps = scoreMap[s.id]
      return { ...s, score: ps?.score ?? 0, evidence: ps?.evidence_summary, confidence: ps?.confidence, trend: null }
    })
    const overall = skills.length > 0 ? Math.round(nodes.reduce((a, n) => a + n.score, 0) / skills.length) : 0
    const evidenceCount = scores.filter(s => s.evidence_summary).length
    const mastered = nodes.filter(n => n.score >= 80).length
    const weakest = [...nodes].sort((a, b) => a.score - b.score).slice(0, 3)
    return { skills, scoreMap, nodes, overall, evidenceCount, mastered, weakest }
  }, [enrollment, scores])

  // Compute star positions with collision avoidance
  const starPositions = useMemo(() => {
    if (!derived?.nodes) return []
    const total = derived.nodes.length
    const positions = []
    const minDist = total <= 10 ? 14 : total <= 16 ? 12 : 10 // min % distance between stars

    for (let i = 0; i < total; i++) {
      const golden = 2.39996323
      const angle = i * golden
      // Wider spread: 0.12 to 0.42 radius
      const r = 0.12 + Math.sqrt((i + 0.5) / total) * 0.32
      let x = 50 + Math.cos(angle) * r * 100
      let y = 50 + Math.sin(angle) * r * 100

      // Collision avoidance — push apart if too close
      for (let attempt = 0; attempt < 8; attempt++) {
        let collides = false
        for (const prev of positions) {
          const dx = x - prev.xNum
          const dy = y - prev.yNum
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < minDist) {
            // Push outward from collision
            const pushAngle = Math.atan2(dy, dx)
            x += Math.cos(pushAngle) * (minDist - dist + 1)
            y += Math.sin(pushAngle) * (minDist - dist + 1)
            collides = true
          }
        }
        if (!collides) break
      }

      // Clamp to bounds (wider margins for bigger box)
      x = Math.max(6, Math.min(94, x))
      y = Math.max(6, Math.min(92, y))

      positions.push({ top: `${y}%`, left: `${x}%`, xNum: x, yNum: y })
    }
    return positions
  }, [derived?.nodes?.length])

  const sel = derived ? (selectedSkill ? derived.nodes.find(n => n.id === selectedSkill) : derived.nodes[0]) : null

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-white/30">Mapping your galaxy...</p>
      </div>
    </div>
  )

  if (!derived) return null

  const gradients = [
    'from-cyan-400 to-blue-500', 'from-violet-400 to-fuchsia-500', 'from-emerald-400 to-teal-500',
    'from-amber-400 to-orange-500', 'from-pink-400 to-rose-500', 'from-indigo-400 to-sky-500',
    'from-lime-400 to-green-500', 'from-fuchsia-400 to-purple-500', 'from-teal-400 to-cyan-500',
    'from-orange-400 to-red-500', 'from-sky-400 to-indigo-500', 'from-rose-400 to-pink-500',
  ]

  const quests = [
    { title: 'Decode This Week\'s Material', points: 90, time: '12 min', desc: 'The coach translates your course material into hidden skills and suggests what evidence to capture.', tag: 'Today' },
    { title: 'Reflection Sprint', points: 60, time: '8 min', desc: 'Three fast prompts turn your reflection into measurable growth signals tied to your course outcomes.', tag: 'Fast win' },
    { title: 'Evidence Power-Up', points: 120, time: '20 min', desc: 'Upload a paper, project, or assignment and watch the platform map it to skills and knowledge areas.', tag: 'Recommended' },
  ]

  return (
    <div className="-m-6 lg:-m-8 min-h-screen text-white" style={{ background: '#020617' }}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.14),transparent_22%),radial-gradient(circle_at_left,rgba(168,85,247,0.16),transparent_26%)]" style={{ position: 'fixed', pointerEvents: 'none' }} />

      <div className="relative mx-auto max-w-7xl px-6 py-6 lg:px-8">
        {/* Course header */}
        <div className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
              {enrollment?.courses?.course_code} · {enrollment?.courses?.term}
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight lg:text-3xl">{enrollment?.courses?.title}</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            {['course', 'skills', 'evidence'].map(v => (
              <button key={v} onClick={() => setSelectedTrack(v)}
                className={`rounded-2xl px-4 py-2 text-sm capitalize transition ${selectedTrack === v ? 'bg-white text-slate-950 font-semibold' : 'border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'}`}>
                {v === 'course' ? '✦ Galaxy' : v === 'skills' ? '📊 Skills' : '📂 Evidence'}
              </button>
            ))}
          </div>
        </div>

        {/* ══ GALAXY VIEW ══ */}
        {selectedTrack === 'course' && (
          <div className="grid gap-6 lg:grid-cols-12">
            <section className="space-y-6 lg:col-span-8">
              {/* Skill Galaxy */}
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold">Skill Galaxy</h2>
                    <p className="mt-1 text-sm text-slate-400">Your constellation of foundational and transferable skills. Click any star.</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-cyan-300">{derived.overall}%</div>
                    <div className="text-xs text-slate-400">Overall</div>
                  </div>
                </div>

                {/* Layout toggle icons */}
                <div className="flex items-center gap-1 mb-4">
                  {[
                    { id: 'galaxy', label: 'Galaxy', icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2" fill="currentColor"/><circle cx="3" cy="5" r="1.5" fill="currentColor" opacity="0.5"/><circle cx="13" cy="4" r="1.5" fill="currentColor" opacity="0.5"/><circle cx="5" cy="12" r="1.5" fill="currentColor" opacity="0.5"/><circle cx="12" cy="11" r="1.5" fill="currentColor" opacity="0.5"/></svg> },
                    { id: 'list', label: 'List', icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
                    { id: 'circle', label: 'Circle', icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" fill="none"/><circle cx="8" cy="2" r="1.5" fill="currentColor"/><circle cx="14" cy="8" r="1.5" fill="currentColor"/><circle cx="8" cy="14" r="1.5" fill="currentColor"/><circle cx="2" cy="8" r="1.5" fill="currentColor"/></svg> },
                    { id: 'cards', label: 'Cards', icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/></svg> },
                  ].map(l => (
                    <button key={l.id} onClick={() => setLayout(l.id)} title={l.label}
                      className={`p-2 rounded-xl transition-all ${layout === l.id ? 'bg-white/10 text-cyan-300' : 'text-white/25 hover:text-white/50'}`}>
                      {l.icon}
                    </button>
                  ))}
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
                  {/* ── GALAXY LAYOUT — grouped skill map with progress rings ── */}
                  {layout === 'galaxy' && (() => {
                    const foundational = [...derived.nodes].filter(n => n.skill_type !== 'implicit').sort((a, b) => b.score - a.score)
                    const transferable = [...derived.nodes].filter(n => n.skill_type === 'implicit').sort((a, b) => b.score - a.score)
                    const circ = 2 * Math.PI * 15
                    return (
                      <div className="relative rounded-[2rem] border border-white/10 bg-slate-950/70 p-5 max-h-[44rem] overflow-y-auto">
                        <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.08),transparent_40%)] pointer-events-none" />

                        {/* Overall hub */}
                        <div className="relative flex items-center gap-4 mb-6 p-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/5">
                          <div className="relative w-14 h-14 flex-shrink-0">
                            <svg viewBox="0 0 36 36" className="w-14 h-14 -rotate-90">
                              <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                              <circle cx="18" cy="18" r="15" fill="none" stroke="url(#hubGrad)" strokeWidth="3" strokeLinecap="round"
                                strokeDasharray={`${(derived.overall / 100) * circ} ${circ}`} />
                              <defs><linearGradient id="hubGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#22D3EE" /><stop offset="100%" stopColor="#3B82F6" /></linearGradient></defs>
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-cyan-200">{derived.overall}%</span>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-white">{derived.mastered} of {derived.nodes.length} mastered</div>
                            <div className="text-xs text-slate-400">Overall proficiency</div>
                          </div>
                        </div>

                        {/* Foundational Skills */}
                        {foundational.length > 0 && (
                          <div className="relative mb-5">
                            <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-300/50 mb-3">Foundational Skills</div>
                            <div className="grid grid-cols-2 gap-2">
                              {foundational.map(node => {
                                const active = selectedSkill === node.id
                                const pct = (node.score / 100) * circ
                                return (
                                  <button key={node.id} onClick={() => setSelectedSkill(node.id)}
                                    className={`flex items-center gap-3 rounded-2xl p-3 text-left transition-all ${active ? 'ring-1 ring-cyan-400 bg-white/5' : 'hover:bg-white/5'}`}>
                                    <div className="relative w-10 h-10 flex-shrink-0">
                                      <svg viewBox="0 0 36 36" className="w-10 h-10 -rotate-90">
                                        <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" />
                                        <circle cx="18" cy="18" r="15" fill="none" className="stroke-current"
                                          style={{ color: node.score >= 80 ? '#4ADE80' : node.score >= 40 ? '#22D3EE' : node.score > 0 ? '#A78BFA' : 'rgba(255,255,255,0.1)' }}
                                          strokeWidth="2.5" strokeLinecap="round"
                                          strokeDasharray={`${pct} ${circ}`} />
                                      </svg>
                                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white/80">{node.score}</span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="text-sm font-medium text-white truncate">{node.name}</div>
                                      <div className="text-[10px] text-slate-500">{node.score >= 80 ? 'mastered' : node.score >= 40 ? 'developing' : node.score > 0 ? 'emerging' : 'uncharted'}</div>
                                    </div>
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {/* Transferable Skills */}
                        {transferable.length > 0 && (
                          <div className="relative">
                            <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-violet-300/50 mb-3">Transferable Skills</div>
                            <div className="grid grid-cols-2 gap-2">
                              {transferable.map(node => {
                                const active = selectedSkill === node.id
                                const pct = (node.score / 100) * circ
                                return (
                                  <button key={node.id} onClick={() => setSelectedSkill(node.id)}
                                    className={`flex items-center gap-3 rounded-2xl p-3 text-left transition-all ${active ? 'ring-1 ring-violet-400 bg-white/5' : 'hover:bg-white/5'}`}>
                                    <div className="relative w-10 h-10 flex-shrink-0">
                                      <svg viewBox="0 0 36 36" className="w-10 h-10 -rotate-90">
                                        <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" />
                                        <circle cx="18" cy="18" r="15" fill="none" className="stroke-current"
                                          style={{ color: node.score >= 80 ? '#4ADE80' : node.score >= 40 ? '#C084FC' : node.score > 0 ? '#A78BFA' : 'rgba(255,255,255,0.1)' }}
                                          strokeWidth="2.5" strokeLinecap="round"
                                          strokeDasharray={`${pct} ${circ}`} />
                                      </svg>
                                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white/80">{node.score}</span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="text-sm font-medium text-white truncate">◇ {node.name}</div>
                                      <div className="text-[10px] text-slate-500">{node.score >= 80 ? 'mastered' : node.score >= 40 ? 'developing' : node.score > 0 ? 'emerging' : 'uncharted'}</div>
                                    </div>
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })()}

                  {/* ── LIST LAYOUT ── */}
                  {layout === 'list' && (
                    <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-4 h-[28rem] overflow-y-auto space-y-2">
                      {[...derived.nodes].sort((a, b) => b.score - a.score).map((node, i) => {
                        const active = selectedSkill === node.id
                        const grad = gradients[i % gradients.length]
                        return (
                          <button key={node.id} onClick={() => setSelectedSkill(node.id)}
                            className={`w-full flex items-center gap-3 rounded-2xl p-3 text-left transition-all ${active ? 'ring-1 ring-cyan-400 bg-white/5' : 'hover:bg-white/5'}`}>
                            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${grad} flex-shrink-0 ${node.score === 0 ? 'opacity-30' : ''}`} />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-white truncate">{node.skill_type === 'implicit' ? '◇ ' : ''}{node.name}</div>
                              <div className="text-[10px] text-slate-400">{node.skill_type === 'implicit' ? 'transferable' : 'foundational'}</div>
                            </div>
                            <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden flex-shrink-0">
                              <div className={`h-full rounded-full bg-gradient-to-r ${grad}`} style={{ width: `${node.score}%` }} />
                            </div>
                            <div className="text-sm font-bold text-white w-10 text-right">{node.score}%</div>
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {/* ── CIRCLE LAYOUT ── */}
                  {layout === 'circle' && (
                    <div className="relative h-[28rem] overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.06),transparent_30%)]" />
                      {/* Orbit ring */}
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                        <circle cx="200" cy="200" r="140" fill="none" stroke="white" strokeWidth="0.5" opacity="0.08" />
                        <circle cx="200" cy="200" r="90" fill="none" stroke="white" strokeWidth="0.5" opacity="0.05" />
                      </svg>
                      <div className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/5 text-center text-[10px] font-semibold text-cyan-200">
                        {derived.overall}%
                      </div>
                      {derived.nodes.map((node, i) => {
                        const active = selectedSkill === node.id
                        const grad = gradients[i % gradients.length]
                        const angle = (i / derived.nodes.length) * Math.PI * 2 - Math.PI / 2
                        const r = node.skill_type === 'explicit' ? 35 : 28
                        const x = 50 + Math.cos(angle) * r
                        const y = 50 + Math.sin(angle) * r
                        return (
                          <button key={node.id} onClick={() => setSelectedSkill(node.id)}
                            className={`absolute rounded-full border border-white/10 p-[1px] shadow-xl transition-transform hover:scale-110 ${active ? 'ring-2 ring-cyan-400 scale-110 z-10' : ''}`}
                            style={{ top: `${y}%`, left: `${x}%`, transform: 'translate(-50%, -50%)' }}>
                            <div className={`rounded-full bg-gradient-to-r ${grad} px-3 py-2 text-center ${node.score === 0 ? 'opacity-40' : ''}`}>
                              <div className="text-[10px] font-bold text-white">{node.score}%</div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {/* ── CARDS LAYOUT ── */}
                  {layout === 'cards' && (
                    <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-4 h-[28rem] overflow-y-auto">
                      <div className="grid grid-cols-2 gap-3">
                        {derived.nodes.map((node, i) => {
                          const active = selectedSkill === node.id
                          const grad = gradients[i % gradients.length]
                          return (
                            <button key={node.id} onClick={() => setSelectedSkill(node.id)}
                              className={`rounded-2xl border border-white/10 p-4 text-left transition-all hover:bg-white/5 ${active ? 'ring-1 ring-cyan-400 bg-white/5' : ''}`}>
                              <div className="text-xs font-semibold text-white mb-2 truncate">{node.skill_type === 'implicit' ? '◇ ' : ''}{node.name}</div>
                              <div className="h-2 rounded-full bg-white/10 overflow-hidden mb-2">
                                <div className={`h-full rounded-full bg-gradient-to-r ${grad}`} style={{ width: `${node.score}%` }} />
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-black text-white">{node.score}%</span>
                                <span className="text-[10px] text-slate-400">{node.score >= 80 ? 'mastered' : node.score >= 40 ? 'developing' : node.score > 0 ? 'emerging' : 'uncharted'}</span>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Selected skill detail */}
                  <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-5">
                    <div className="text-xs text-slate-400">Selected skill</div>
                    <h3 className="mt-2 text-2xl font-semibold">{sel?.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ background: sel?.skill_type === 'implicit' ? 'rgba(167,139,250,0.15)' : 'rgba(34,211,238,0.15)',
                                 color: sel?.skill_type === 'implicit' ? '#C4B5FD' : '#67E8F9' }}>
                        {sel?.skill_type === 'implicit' ? 'transferable' : 'foundational'}
                      </span>
                    </div>
                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-700" style={{ width: `${sel?.score || 0}%` }} />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-slate-400">Proficiency</span>
                      <span className="font-bold">{sel?.score || 0}%</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-slate-400">Confidence</span>
                      <span>{sel?.confidence ? `${Math.round(sel.confidence * 100)}%` : '—'}</span>
                    </div>
                    {/* Confidence Interval */}
                    {sel?.interval && (
                      <div className="mt-4">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-white/20 mb-2">Confidence Interval</div>
                        <div className="relative h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                          <div className="absolute h-full rounded-full" style={{ left: `${sel.interval.lower}%`, width: `${sel.interval.upper - sel.interval.lower}%`, background: 'rgba(0,206,209,0.2)' }} />
                          <div className="absolute h-full w-1 rounded-full" style={{ left: `${sel.score}%`, background: '#00CED1' }} />
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-white/20 mt-1">
                          <span>{sel.interval.lower}%</span>
                          <span className="font-bold" style={{ color: sel.interval.reliability === 'high' ? '#4ADE80' : sel.interval.reliability === 'moderate' ? '#FBBF24' : '#FB7185' }}>
                            {sel.interval.reliability} reliability
                          </span>
                          <span>{sel.interval.upper}%</span>
                        </div>
                      </div>
                    )}

                    {/* Trajectory */}
                    {sel?.trajectory && sel.trajectory.trend !== 'insufficient_data' && (
                      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-white/20 mb-2">Trajectory</div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm" style={{ color: sel.trajectory.trend === 'improving' || sel.trajectory.trend === 'accelerating' ? '#4ADE80' : sel.trajectory.trend === 'stable' ? '#FBBF24' : '#FB7185' }}>
                            {sel.trajectory.trend === 'accelerating' ? '🚀' : sel.trajectory.trend === 'improving' ? '📈' : sel.trajectory.trend === 'stable' ? '➡️' : '📉'}
                          </span>
                          <span className="text-xs text-white/40 capitalize">{sel.trajectory.trend}</span>
                          {sel.trajectory.velocity !== 0 && (
                            <span className="text-xs font-bold" style={{ color: sel.trajectory.velocity > 0 ? '#4ADE80' : '#FB7185' }}>
                              {sel.trajectory.velocity > 0 ? '+' : ''}{sel.trajectory.velocity}/assessment
                            </span>
                          )}
                          {sel.trajectory.isGenuine && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(74,222,128,0.1)', color: '#4ADE80' }}>genuine</span>
                          )}
                        </div>
                        <p className="text-xs text-white/30 leading-relaxed">{sel.trajectory.description}</p>
                      </div>
                    )}

                    {/* AI Insight */}
                    {sel?.evidence && (
                      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 mb-2">AI Insight</div>
                        {sel.evidence}
                      </div>
                    )}

                    {/* Source Breakdown */}
                    {sel?.sourceBreakdown && Object.keys(sel.sourceBreakdown).length > 0 && (
                      <div className="mt-4">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-white/20 mb-2">Evidence Sources</div>
                        <div className="flex gap-2">
                          {Object.entries(sel.sourceBreakdown).map(([src, data]) => (
                            <div key={src} className="flex-1 rounded-xl p-2 text-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
                              <div className="text-xs font-bold text-white/60 capitalize">{src}</div>
                              <div className="text-sm font-black text-cyan-300">{data.count}</div>
                              <div className="text-[9px] text-white/15">avg {data.avgScore}%</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <Link href={`/my-progress/${enrollmentId}/quiz/${sel?.id}`}
                        className="rounded-2xl bg-white px-4 py-3 text-center font-semibold text-slate-950 text-sm hover:opacity-90">
                        Practice
                      </Link>
                      <Link href={`/my-progress/${enrollmentId}/chat/${sel?.id}`}
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center font-semibold text-white text-sm hover:bg-white/10">
                        Ask Coach
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Evidence Studio + Learning Coach */}
              <div className="grid gap-6 xl:grid-cols-2">
                {/* Evidence Studio */}
                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold">Evidence Studio</h2>
                      <p className="mt-1 text-sm text-slate-400">Connect artifacts to real growth.</p>
                    </div>
                    <button className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:opacity-90">Upload</button>
                  </div>
                  <div className="mt-5 space-y-3">
                    {history.length > 0 ? history.slice(0, 4).map((h, i) => {
                      const skill = derived.skills.find(s => s.id === h.skill_id)
                      return (
                        <div key={i} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="font-medium text-sm">{skill?.name || 'Assessment'}</div>
                              <div className="mt-1 text-xs text-slate-400">{h.source || 'quiz'} · {new Date(h.created_at || h.scored_at).toLocaleDateString()}</div>
                            </div>
                            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">{h.score}%</div>
                          </div>
                        </div>
                      )
                    }) : (
                      <div className="text-center py-8 text-slate-400 text-sm">
                        <p>No evidence yet.</p>
                        <p className="text-xs text-slate-500 mt-1">Complete a quiz or upload work to start building your evidence.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Learning Coach */}
                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold">Learning Coach</h2>
                      <p className="mt-1 text-sm text-slate-400">Grounded. Reflective. Practical.</p>
                    </div>
                    <div className="rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 px-3 py-1 text-xs font-semibold text-fuchsia-200">Live AI</div>
                  </div>
                  <div className="mt-5 space-y-3">
                    {derived.weakest.slice(0, 3).map((node, i) => (
                      <Link key={node.id} href={`/my-progress/${enrollmentId}/chat/${node.id}`}
                        className="block rounded-2xl border border-white/10 bg-slate-900/70 p-4 hover:bg-slate-900/90 transition">
                        <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-cyan-300">Coach note {i + 1}</div>
                        <div className="text-sm text-slate-200">
                          {node.score === 0
                            ? `${node.name} is unexplored territory. A single quiz will reveal where you stand.`
                            : `Your ${node.name} shows early signals. Want to build on that with targeted practice?`}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Right sidebar */}
            <aside className="space-y-6 lg:col-span-4">
              {/* Momentum */}
              <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-5">
                <div className="text-sm text-slate-400">Momentum Score</div>
                <div className="mt-2 text-5xl font-bold">{derived.overall}</div>
                <div className="mt-2 text-sm text-cyan-300">{derived.overall > 50 ? 'Ahead of growth target' : 'Building momentum'}</div>
              </div>

              {/* Stats */}
              <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-5">
                <div className="text-sm text-slate-400">Skill Growth</div>
                <div className="mt-3 grid grid-cols-3 gap-3 text-center text-sm">
                  <div className="rounded-2xl bg-white/5 p-3"><div className="text-2xl font-bold">{derived.nodes.length}</div><div className="text-slate-400 text-xs">Skills</div></div>
                  <div className="rounded-2xl bg-white/5 p-3"><div className="text-2xl font-bold">{derived.evidenceCount}</div><div className="text-slate-400 text-xs">Evidence</div></div>
                  <div className="rounded-2xl bg-white/5 p-3"><div className="text-2xl font-bold">{derived.mastered}</div><div className="text-slate-400 text-xs">Mastered</div></div>
                </div>
              </div>

              {/* Quest Board */}
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl">
                <h2 className="text-xl font-semibold">Quest Board</h2>
                <p className="mt-1 text-sm text-slate-400">Small actions that build momentum.</p>
                <div className="mt-5 space-y-4">
                  {quests.map(quest => (
                    <div key={quest.title} className="rounded-3xl border border-white/10 bg-slate-900/70 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">{quest.tag}</div>
                        <div className="text-xs text-slate-400">{quest.time}</div>
                      </div>
                      <h3 className="mt-3 text-sm font-semibold">{quest.title}</h3>
                      <p className="mt-2 text-xs leading-5 text-slate-400">{quest.desc}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-xs font-semibold text-cyan-300">+{quest.points} XP</div>
                        <Link href={`/my-progress/${enrollmentId}/quiz/${derived.weakest[0]?.id || ''}`}
                          className="rounded-2xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/10">
                          Start
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Knowledge Snapshot */}
              <div className="rounded-[2rem] border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 via-blue-500/10 to-fuchsia-500/10 p-6 shadow-xl">
                <h2 className="text-lg font-semibold">Knowledge Snapshot</h2>
                <p className="mt-3 text-sm leading-6 text-slate-200">
                  The system compares assessment performance, evidence patterns, and coaching interactions to surface understanding that grades alone can't show.
                </p>
                <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm text-slate-100">
                  {derived.mastered > 0
                    ? `You've mastered ${derived.mastered} skill${derived.mastered > 1 ? 's' : ''}. Your evidence suggests stronger understanding than your scores alone indicate.`
                    : 'Begin exploring skills to build your knowledge snapshot. Every quiz and upload adds to the picture.'}
                </div>
              </div>

              {/* Governance */}
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-xs font-semibold text-emerald-300">Governed Intelligence</span>
                </div>
                <p className="text-xs text-slate-400 leading-5">
                  Every AI decision passes through fairness, confidence, and privacy constraints. The system defers to human review when conditions aren't met.
                </p>
              </div>
            </aside>
          </div>
        )}

        {/* ══ SKILLS LIST VIEW ══ */}
        {selectedTrack === 'skills' && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {derived.nodes.map((node, i) => (
              <Link key={node.id} href={`/my-progress/${enrollmentId}/skill/${node.id}`}
                className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-xl transition hover:bg-white/10 block">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ background: node.skill_type === 'implicit' ? 'rgba(167,139,250,0.15)' : 'rgba(34,211,238,0.15)',
                             color: node.skill_type === 'implicit' ? '#C4B5FD' : '#67E8F9' }}>
                    {node.skill_type === 'implicit' ? 'transferable' : 'foundational'}
                  </span>
                </div>
                <h3 className="font-semibold text-white mb-3">{node.name}</h3>
                <div className="h-2 overflow-hidden rounded-full bg-white/10 mb-2">
                  <div className={`h-full rounded-full bg-gradient-to-r ${gradients[i % gradients.length]} transition-all duration-700`} style={{ width: `${node.score}%` }} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">{node.score > 0 ? proficiencyLabel(node.score) : 'Uncharted'}</span>
                  <span className="font-bold">{node.score}%</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* ══ EVIDENCE VIEW ══ */}
        {selectedTrack === 'evidence' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Evidence Studio</h2>
                <button className="rounded-2xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900">Upload Work</button>
              </div>
              {history.length > 0 ? history.map((h, i) => {
                const skill = derived.skills.find(s => s.id === h.skill_id)
                return (
                  <div key={i} className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 mb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium">{skill?.name || 'Assessment'}</div>
                        <div className="mt-1 text-sm text-slate-400">{h.source || 'Quiz'} · {new Date(h.created_at || h.scored_at).toLocaleDateString()}</div>
                        {h.evidence_summary && <p className="mt-2 text-sm text-slate-300 leading-relaxed">{h.evidence_summary}</p>}
                      </div>
                      <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-bold text-white">{h.score}%</div>
                    </div>
                  </div>
                )
              }) : (
                <div className="text-center py-12 text-slate-400">
                  <FileUp className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="font-medium">No evidence yet</p>
                  <p className="text-sm text-slate-500 mt-1">Upload work, take quizzes, or talk to the coach to start building evidence.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
