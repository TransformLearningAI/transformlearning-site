'use client'
import { useState, useMemo } from 'react'
import { proficiencyLabel, proficiencyColor } from '@/lib/utils/proficiency'
import Link from 'next/link'

/* ═══════════════════════════════════════════════════════════════
   MOCK DATA — mirrors the full scoring engine output shape
   ══���═════════════════════════���══════════════════════════════════ */

const SKILLS = [
  {
    id: '1', name: 'Cellular Physiology', skill_type: 'explicit', score: 72,
    evidence: 'Shows strong understanding of cellular mechanisms. Able to connect molecular events to tissue-level function.',
    confidence: 0.72,
    interval: { lower: 64, estimate: 72, upper: 80, reliability: 'moderate' },
    trajectory: { trend: 'improving', velocity: 3.2, consistency: 0.75, genuineness: 0.56, isGenuine: true, description: 'Steady improvement. Gaining 3.2 points per assessment. Consistent progress.', dataPoints: 5 },
    sourceBreakdown: { quiz: { count: 3, avgScore: 70, weightedScore: 72 }, assessment: { count: 1, avgScore: 65, weightedScore: 65 }, upload: { count: 1, avgScore: 78, weightedScore: 78 } },
  },
  {
    id: '2', name: 'Membrane Transport', skill_type: 'explicit', score: 58,
    evidence: 'Understands passive transport well. Active transport mechanisms need reinforcement.',
    confidence: 0.55,
    interval: { lower: 48, estimate: 58, upper: 68, reliability: 'moderate' },
    trajectory: { trend: 'improving', velocity: 2.1, consistency: 0.67, genuineness: 0.42, isGenuine: true, description: 'Steady improvement. Gaining 2.1 points per assessment. Some variability in scores.', dataPoints: 4 },
    sourceBreakdown: { quiz: { count: 2, avgScore: 55, weightedScore: 57 }, assessment: { count: 1, avgScore: 52, weightedScore: 52 } },
  },
  {
    id: '3', name: 'Neurophysiology', skill_type: 'explicit', score: 34,
    evidence: 'Early-stage understanding. Struggles with action potential propagation across synapses.',
    confidence: 0.35,
    interval: { lower: 20, estimate: 34, upper: 48, reliability: 'low' },
    trajectory: { trend: 'stable', velocity: 0.5, consistency: 0.5, genuineness: 0, isGenuine: false, description: 'Scores are stable. No significant growth detected. May need a different approach.', dataPoints: 3 },
    sourceBreakdown: { quiz: { count: 2, avgScore: 32, weightedScore: 34 }, coaching: { count: 3, avgScore: 40, weightedScore: 38 } },
  },
  {
    id: '4', name: 'Cardiovascular', skill_type: 'explicit', score: 88,
    evidence: 'Strong mastery. Can explain cardiac cycle, pressure dynamics, and regulation mechanisms.',
    confidence: 0.85,
    interval: { lower: 82, estimate: 88, upper: 94, reliability: 'high' },
    trajectory: { trend: 'accelerating', velocity: 5.8, consistency: 0.83, genuineness: 0.72, isGenuine: true, description: 'Strong upward trajectory. Gaining 5.8 points per assessment. Learning appears genuine and sustained.', dataPoints: 6 },
    sourceBreakdown: { quiz: { count: 4, avgScore: 86, weightedScore: 88 }, assessment: { count: 1, avgScore: 78, weightedScore: 78 }, upload: { count: 2, avgScore: 91, weightedScore: 90 } },
  },
  {
    id: '5', name: 'Respiratory', skill_type: 'explicit', score: 41,
    evidence: 'Developing. Understands gas exchange but not ventilation-perfusion matching.',
    confidence: 0.40,
    interval: { lower: 28, estimate: 41, upper: 54, reliability: 'low' },
    trajectory: { trend: 'slipping', velocity: -1.5, consistency: 0.6, genuineness: 0, isGenuine: false, description: 'Scores are declining by 1.5 points per assessment. Intervention recommended.', dataPoints: 4 },
    sourceBreakdown: { quiz: { count: 2, avgScore: 40, weightedScore: 41 }, coaching: { count: 2, avgScore: 45, weightedScore: 44 } },
  },
  {
    id: '6', name: 'Renal Physiology', skill_type: 'explicit', score: 0,
    evidence: null, confidence: 0, interval: null, trajectory: null, sourceBreakdown: {},
  },
  {
    id: '7', name: 'Endocrine System', skill_type: 'explicit', score: 22,
    evidence: 'Knows major hormones but cannot articulate feedback loops.',
    confidence: 0.20,
    interval: { lower: 8, estimate: 22, upper: 40, reliability: 'low' },
    trajectory: { trend: 'stable', velocity: 0.3, consistency: 0.5, genuineness: 0, isGenuine: false, description: 'Scores are stable. No significant growth detected. May need a different approach.', dataPoints: 2 },
    sourceBreakdown: { assessment: { count: 1, avgScore: 22, weightedScore: 22 } },
  },
  {
    id: '8', name: 'Homeostasis', skill_type: 'explicit', score: 67,
    evidence: 'Good conceptual grasp. Can identify disruptions but not always predict compensatory responses.',
    confidence: 0.62,
    interval: { lower: 58, estimate: 67, upper: 76, reliability: 'moderate' },
    trajectory: { trend: 'improving', velocity: 1.8, consistency: 0.7, genuineness: 0.47, isGenuine: true, description: 'Steady improvement. Gaining 1.8 points per assessment. Consistent progress.', dataPoints: 5 },
    sourceBreakdown: { quiz: { count: 3, avgScore: 65, weightedScore: 67 }, upload: { count: 1, avgScore: 72, weightedScore: 72 } },
  },
  {
    id: '9', name: 'Critical Thinking', skill_type: 'implicit', score: 55,
    evidence: 'Demonstrates analytical reasoning but needs practice connecting cause and effect across systems.',
    confidence: 0.48,
    interval: { lower: 43, estimate: 55, upper: 67, reliability: 'low' },
    trajectory: { trend: 'improving', velocity: 1.2, consistency: 0.6, genuineness: 0.35, isGenuine: false, description: 'Steady improvement. Gaining 1.2 points per assessment. Some variability in scores.', dataPoints: 3 },
    sourceBreakdown: { quiz: { count: 1, avgScore: 50, weightedScore: 50 }, upload: { count: 2, avgScore: 58, weightedScore: 57 } },
  },
  {
    id: '10', name: 'Systems Thinking', skill_type: 'implicit', score: 71,
    evidence: 'Emerging strength. Can describe how organ systems interact.',
    confidence: 0.68,
    interval: { lower: 63, estimate: 71, upper: 79, reliability: 'moderate' },
    trajectory: { trend: 'accelerating', velocity: 5.2, consistency: 0.8, genuineness: 0.65, isGenuine: true, description: 'Strong upward trajectory. Gaining 5.2 points per assessment. Learning appears genuine and sustained.', dataPoints: 5 },
    sourceBreakdown: { quiz: { count: 2, avgScore: 68, weightedScore: 70 }, upload: { count: 2, avgScore: 74, weightedScore: 73 }, coaching: { count: 1, avgScore: 60, weightedScore: 60 } },
  },
  {
    id: '11', name: 'Scientific Comm.', skill_type: 'implicit', score: 38,
    evidence: 'Writing is clear but lacks precision in terminology use.',
    confidence: 0.32,
    interval: { lower: 22, estimate: 38, upper: 54, reliability: 'low' },
    trajectory: { trend: 'stable', velocity: -0.3, consistency: 0.5, genuineness: 0, isGenuine: false, description: 'Scores are stable. Slight decline detected. May need a different approach.', dataPoints: 3 },
    sourceBreakdown: { upload: { count: 2, avgScore: 38, weightedScore: 38 } },
  },
  {
    id: '12', name: 'Problem Solving', skill_type: 'implicit', score: 48,
    evidence: 'Can work through structured problems but struggles with novel scenarios.',
    confidence: 0.44,
    interval: { lower: 36, estimate: 48, upper: 60, reliability: 'low' },
    trajectory: { trend: 'improving', velocity: 1.5, consistency: 0.67, genuineness: 0.38, isGenuine: false, description: 'Steady improvement. Gaining 1.5 points per assessment. Some variability in scores.', dataPoints: 3 },
    sourceBreakdown: { quiz: { count: 2, avgScore: 46, weightedScore: 48 }, coaching: { count: 1, avgScore: 52, weightedScore: 52 } },
  },
  {
    id: '13', name: 'Self-Regulation', skill_type: 'implicit', score: 0,
    evidence: null, confidence: 0, interval: null, trajectory: null, sourceBreakdown: {},
  },
  {
    id: '14', name: 'Experimental Design', skill_type: 'implicit', score: 15,
    evidence: 'Very early. Understands hypothesis formation but not controlled variable design.',
    confidence: 0.15,
    interval: { lower: 0, estimate: 15, upper: 38, reliability: 'low' },
    trajectory: null,
    sourceBreakdown: { assessment: { count: 1, avgScore: 15, weightedScore: 15 } },
  },
]

const MOCK_HISTORY = [
  { skill_id: '4', skill_name: 'Cardiovascular', score: 88, source: 'quiz', scored_at: '2025-11-12T14:30:00Z' },
  { skill_id: '1', skill_name: 'Cellular Physiology', score: 72, source: 'upload', scored_at: '2025-11-10T09:15:00Z' },
  { skill_id: '10', skill_name: 'Systems Thinking', score: 71, source: 'quiz', scored_at: '2025-11-08T11:00:00Z' },
  { skill_id: '8', skill_name: 'Homeostasis', score: 67, source: 'quiz', scored_at: '2025-11-06T16:45:00Z' },
  { skill_id: '2', skill_name: 'Membrane Transport', score: 58, source: 'quiz', scored_at: '2025-11-04T10:20:00Z' },
  { skill_id: '9', skill_name: 'Critical Thinking', score: 55, source: 'upload', scored_at: '2025-11-02T13:30:00Z' },
  { skill_id: '5', skill_name: 'Respiratory', score: 41, source: 'assessment', scored_at: '2025-10-28T09:00:00Z' },
  { skill_id: '3', skill_name: 'Neurophysiology', score: 34, source: 'quiz', scored_at: '2025-10-25T14:15:00Z' },
]

/* ═══ Layout helpers ════════════════════════════════════════════ */

const gradients = [
  'from-cyan-400 to-blue-500', 'from-violet-400 to-fuchsia-500', 'from-emerald-400 to-teal-500',
  'from-amber-400 to-orange-500', 'from-pink-400 to-rose-500', 'from-indigo-400 to-sky-500',
  'from-lime-400 to-green-500', 'from-fuchsia-400 to-purple-500', 'from-teal-400 to-cyan-500',
  'from-orange-400 to-red-500', 'from-sky-400 to-indigo-500', 'from-rose-400 to-pink-500',
  'from-cyan-400 to-emerald-500', 'from-purple-400 to-violet-500',
]

// Golden-angle spiral with collision avoidance
const starPositions = (() => {
  const total = SKILLS.length
  const minDist = 12
  const positions = []
  for (let i = 0; i < total; i++) {
    const golden = 2.39996323
    const angle = i * golden
    const r = 0.12 + Math.sqrt((i + 0.5) / total) * 0.32
    let x = 50 + Math.cos(angle) * r * 100
    let y = 50 + Math.sin(angle) * r * 100
    for (let attempt = 0; attempt < 8; attempt++) {
      let collides = false
      for (const prev of positions) {
        const dx = x - prev.xNum, dy = y - prev.yNum
        if (Math.sqrt(dx * dx + dy * dy) < minDist) {
          const pa = Math.atan2(dy, dx)
          x += Math.cos(pa) * (minDist - Math.sqrt(dx * dx + dy * dy) + 1)
          y += Math.sin(pa) * (minDist - Math.sqrt(dx * dx + dy * dy) + 1)
          collides = true
        }
      }
      if (!collides) break
    }
    x = Math.max(6, Math.min(94, x))
    y = Math.max(6, Math.min(92, y))
    positions.push({ top: `${y}%`, left: `${x}%`, xNum: x, yNum: y })
  }
  return positions
})()

/* ═══ Demo XP ══════════════════════════════════════════════════ */

const DEMO_XP = 1340
const DEMO_LEVEL = { level: 3, title: 'Learner', progress: 0.68 }

/* ═══ Page ═════════��═══════════════════════════════════════════ */

export default function DemoPage() {
  const [sel, setSel] = useState(null)
  const [view, setView] = useState('course')
  const [layout, setLayout] = useState('galaxy')
  const [draggedStar, setDraggedStar] = useState(null)
  const [customPositions, setCustomPositions] = useState({})

  const overall = Math.round(SKILLS.reduce((a, s) => a + s.score, 0) / SKILLS.length)
  const mastered = SKILLS.filter(s => s.score >= 80).length
  const evidenceCount = SKILLS.filter(s => s.evidence).length
  const weakest = [...SKILLS].sort((a, b) => a.score - b.score).slice(0, 3)
  const selected = sel ? SKILLS.find(s => s.id === sel) : SKILLS[0]

  const quests = [
    { title: "Decode This Week's Material", points: 90, time: '12 min', desc: 'The coach translates your course material into hidden skills and suggests what evidence to capture.', tag: 'Today' },
    { title: 'Reflection Sprint', points: 60, time: '8 min', desc: 'Three fast prompts turn your reflection into measurable growth signals tied to your course outcomes.', tag: 'Fast win' },
    { title: 'Evidence Power-Up', points: 120, time: '20 min', desc: 'Upload a paper, project, or assignment and watch the platform map it to skills and knowledge areas.', tag: 'Recommended' },
  ]

  return (
    <div className="min-h-screen text-white" style={{ background: '#020617' }}>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.14),transparent_22%),radial-gradient(circle_at_left,rgba(168,85,247,0.16),transparent_26%)] pointer-events-none" />

      {/* Banner */}
      <div className="relative z-10 text-center py-2.5 text-xs font-bold text-white/70" style={{ background: 'rgba(167,139,250,0.12)', borderBottom: '1px solid rgba(167,139,250,0.2)' }}>
        DEMO — Arrival Student Dashboard &nbsp;&middot;&nbsp;
        <Link href="/" className="underline opacity-70 hover:opacity-100">Back to site</Link>
        &nbsp;&middot;&nbsp; <Link href="/methodology" className="underline opacity-70 hover:opacity-100">Read Methodology</Link>
        &nbsp;&middot;&nbsp; <a href="/signup" className="underline opacity-70 hover:opacity-100">Sign up &rarr;</a>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                BSC3096 &middot; Fall 2025
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">
                Lv {DEMO_LEVEL.level} &middot; {DEMO_LEVEL.title} &middot; {DEMO_XP} XP
              </div>
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight lg:text-3xl">Human Physiology</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            {['course', 'skills', 'evidence'].map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`rounded-2xl px-4 py-2 text-sm capitalize transition ${view === v ? 'bg-white text-slate-950 font-semibold' : 'border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'}`}>
                {v === 'course' ? '\u2726 Galaxy' : v === 'skills' ? '\uD83D\uDCCA Skills' : '\uD83D\uDCC2 Evidence'}
              </button>
            ))}
          </div>
        </div>

        {/* ══ GALAXY VIEW ══ */}
        {view === 'course' && (
          <div className="grid gap-6 lg:grid-cols-12">
            <section className="space-y-6 lg:col-span-8">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold">Skill Galaxy</h2>
                    <p className="mt-1 text-sm text-slate-400">Your constellation of foundational and transferable skills. Click any star.</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-cyan-300">{overall}%</div>
                    <div className="text-xs text-slate-400">Overall</div>
                  </div>
                </div>

                {/* Layout toggles */}
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

                  {/* ── GALAXY LAYOUT ── */}
                  {layout === 'galaxy' && (
                    <div className="relative h-[44rem] overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70"
                      onMouseMove={e => {
                        if (!draggedStar) return
                        const rect = e.currentTarget.getBoundingClientRect()
                        const x = ((e.clientX - rect.left) / rect.width) * 100
                        const y = ((e.clientY - rect.top) / rect.height) * 100
                        setCustomPositions(p => ({ ...p, [draggedStar]: { top: `${Math.max(2, Math.min(92, y))}%`, left: `${Math.max(2, Math.min(92, x))}%` } }))
                      }}
                      onMouseUp={() => setDraggedStar(null)}
                      onMouseLeave={() => setDraggedStar(null)}>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.15),transparent_22%),radial-gradient(circle_at_30%_30%,rgba(168,85,247,0.18),transparent_24%)]" />
                      {/* Center hub */}
                      <div className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-center">
                        <div>
                          <div className="text-2xl font-black text-cyan-200">{overall}%</div>
                          <div className="text-[10px] text-cyan-300/60">{mastered} mastered</div>
                        </div>
                      </div>
                      {/* Stars */}
                      {SKILLS.map((s, i) => {
                        const active = sel === s.id
                        const grad = gradients[i % gradients.length]
                        const isImplicit = s.skill_type === 'implicit'
                        const pos = customPositions[s.id] || starPositions[i]
                        const isDragging = draggedStar === s.id
                        return (
                          <div key={s.id}
                            className={`absolute select-none transition-shadow ${isDragging ? 'z-20 cursor-grabbing' : 'cursor-grab z-10'}`}
                            style={{ top: pos?.top, left: pos?.left, transform: 'translate(-50%, -50%)' }}
                            onMouseDown={e => { e.preventDefault(); setDraggedStar(s.id) }}
                            onClick={() => { if (!isDragging) setSel(s.id) }}>
                            {/* Glow ring */}
                            {s.score > 0 && (
                              <div className="absolute inset-0 rounded-full animate-pulse"
                                style={{ boxShadow: `0 0 ${s.score >= 80 ? 20 : 12}px ${s.score >= 80 ? 'rgba(74,222,128,0.4)' : s.score >= 40 ? 'rgba(0,206,209,0.3)' : 'rgba(167,139,250,0.2)'}`, margin: '-8px', borderRadius: '50%' }} />
                            )}
                            <div className={`rounded-full bg-gradient-to-r ${grad} shadow-lg border-2 ${active ? 'border-cyan-300 scale-110' : 'border-transparent'} transition-all ${s.score === 0 ? 'opacity-35' : ''}`}
                              style={{ padding: '12px 18px', minWidth: s.score > 0 ? '110px' : '80px' }}>
                              <div className="text-sm font-bold text-white truncate max-w-[130px]" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
                                {isImplicit ? '\u25C7 ' : ''}{s.name}
                              </div>
                              <div className="text-xs text-white/90 font-semibold mt-0.5">{s.score > 0 ? `${s.score}%` : 'uncharted'}</div>
                            </div>
                          </div>
                        )
                      })}
                      <div className="absolute bottom-3 right-4 text-[10px] text-white/15">drag to rearrange</div>
                    </div>
                  )}

                  {/* ── LIST LAYOUT ── */}
                  {layout === 'list' && (
                    <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-4 h-[44rem] overflow-y-auto space-y-2">
                      {[...SKILLS].sort((a, b) => b.score - a.score).map((s, i) => {
                        const active = sel === s.id
                        const grad = gradients[SKILLS.indexOf(s) % gradients.length]
                        return (
                          <button key={s.id} onClick={() => setSel(s.id)}
                            className={`w-full flex items-center gap-3 rounded-2xl p-3 text-left transition-all ${active ? 'ring-1 ring-cyan-400 bg-white/5' : 'hover:bg-white/5'}`}>
                            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${grad} flex-shrink-0 ${s.score === 0 ? 'opacity-30' : ''}`} />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-white truncate">{s.skill_type === 'implicit' ? '\u25C7 ' : ''}{s.name}</div>
                              <div className="text-[10px] text-slate-400">{s.skill_type === 'implicit' ? 'transferable' : 'foundational'}</div>
                            </div>
                            <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden flex-shrink-0">
                              <div className={`h-full rounded-full bg-gradient-to-r ${grad}`} style={{ width: `${s.score}%` }} />
                            </div>
                            <div className="text-sm font-bold text-white w-10 text-right">{s.score}%</div>
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {/* ── CIRCLE LAYOUT ── */}
                  {layout === 'circle' && (
                    <div className="relative h-[44rem] overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.06),transparent_30%)]" />
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                        <circle cx="200" cy="200" r="140" fill="none" stroke="white" strokeWidth="0.5" opacity="0.08" />
                        <circle cx="200" cy="200" r="90" fill="none" stroke="white" strokeWidth="0.5" opacity="0.05" />
                      </svg>
                      <div className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/5 text-center text-[10px] font-semibold text-cyan-200">
                        {overall}%
                      </div>
                      {SKILLS.map((s, i) => {
                        const active = sel === s.id
                        const grad = gradients[i % gradients.length]
                        const angle = (i / SKILLS.length) * Math.PI * 2 - Math.PI / 2
                        const r = s.skill_type === 'explicit' ? 35 : 28
                        const x = 50 + Math.cos(angle) * r
                        const y = 50 + Math.sin(angle) * r
                        return (
                          <button key={s.id} onClick={() => setSel(s.id)}
                            className={`absolute rounded-full border border-white/10 p-[1px] shadow-xl transition-transform hover:scale-110 ${active ? 'ring-2 ring-cyan-400 scale-110 z-10' : ''}`}
                            style={{ top: `${y}%`, left: `${x}%`, transform: 'translate(-50%, -50%)' }}>
                            <div className={`rounded-full bg-gradient-to-r ${grad} px-3 py-2 text-center ${s.score === 0 ? 'opacity-40' : ''}`}>
                              <div className="text-[10px] font-bold text-white">{s.score}%</div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {/* ── CARDS LAYOUT ── */}
                  {layout === 'cards' && (
                    <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-4 h-[44rem] overflow-y-auto">
                      <div className="grid grid-cols-2 gap-3">
                        {SKILLS.map((s, i) => {
                          const active = sel === s.id
                          const grad = gradients[i % gradients.length]
                          return (
                            <button key={s.id} onClick={() => setSel(s.id)}
                              className={`rounded-2xl border border-white/10 p-4 text-left transition-all hover:bg-white/5 ${active ? 'ring-1 ring-cyan-400 bg-white/5' : ''}`}>
                              <div className="text-xs font-semibold text-white mb-2 truncate">{s.skill_type === 'implicit' ? '\u25C7 ' : ''}{s.name}</div>
                              <div className="h-2 rounded-full bg-white/10 overflow-hidden mb-2">
                                <div className={`h-full rounded-full bg-gradient-to-r ${grad}`} style={{ width: `${s.score}%` }} />
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-black text-white">{s.score}%</span>
                                <span className="text-[10px] text-slate-400">{s.score > 0 ? proficiencyLabel(s.score) : 'Uncharted'}</span>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* ── Selected skill detail panel ��─ */}
                  <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-5">
                    <div className="text-xs text-slate-400">Selected skill</div>
                    <h3 className="mt-2 text-2xl font-semibold">{selected?.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ background: selected?.skill_type === 'implicit' ? 'rgba(167,139,250,0.15)' : 'rgba(34,211,238,0.15)',
                                 color: selected?.skill_type === 'implicit' ? '#C4B5FD' : '#67E8F9' }}>
                        {selected?.skill_type === 'implicit' ? 'transferable' : 'foundational'}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-700" style={{ width: `${selected?.score || 0}%` }} />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-slate-400">Proficiency</span>
                      <span className="font-bold">{selected?.score || 0}%</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-slate-400">Confidence</span>
                      <span>{selected?.confidence ? `${Math.round(selected.confidence * 100)}%` : '\u2014'}</span>
                    </div>

                    {/* Confidence Interval */}
                    {selected?.interval && (
                      <div className="mt-4">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-white/20 mb-2">Confidence Interval</div>
                        <div className="relative h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                          <div className="absolute h-full rounded-full" style={{ left: `${selected.interval.lower}%`, width: `${selected.interval.upper - selected.interval.lower}%`, background: 'rgba(0,206,209,0.2)' }} />
                          <div className="absolute h-full w-1 rounded-full" style={{ left: `${selected.score}%`, background: '#00CED1' }} />
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-white/20 mt-1">
                          <span>{selected.interval.lower}%</span>
                          <span className="font-bold" style={{ color: selected.interval.reliability === 'high' ? '#4ADE80' : selected.interval.reliability === 'moderate' ? '#FBBF24' : '#FB7185' }}>
                            {selected.interval.reliability} reliability
                          </span>
                          <span>{selected.interval.upper}%</span>
                        </div>
                      </div>
                    )}

                    {/* Trajectory */}
                    {selected?.trajectory && selected.trajectory.trend !== 'insufficient_data' && (
                      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-white/20 mb-2">Trajectory</div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm" style={{ color: selected.trajectory.trend === 'improving' || selected.trajectory.trend === 'accelerating' ? '#4ADE80' : selected.trajectory.trend === 'stable' ? '#FBBF24' : '#FB7185' }}>
                            {selected.trajectory.trend === 'accelerating' ? '\uD83D\uDE80' : selected.trajectory.trend === 'improving' ? '\uD83D\uDCC8' : selected.trajectory.trend === 'stable' ? '\u27A1\uFE0F' : '\uD83D\uDCC9'}
                          </span>
                          <span className="text-xs text-white/40 capitalize">{selected.trajectory.trend}</span>
                          {selected.trajectory.velocity !== 0 && (
                            <span className="text-xs font-bold" style={{ color: selected.trajectory.velocity > 0 ? '#4ADE80' : '#FB7185' }}>
                              {selected.trajectory.velocity > 0 ? '+' : ''}{selected.trajectory.velocity}/assessment
                            </span>
                          )}
                          {selected.trajectory.isGenuine && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(74,222,128,0.1)', color: '#4ADE80' }}>genuine</span>
                          )}
                        </div>
                        <p className="text-xs text-white/30 leading-relaxed">{selected.trajectory.description}</p>
                      </div>
                    )}

                    {/* AI Insight */}
                    {selected?.evidence && (
                      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 mb-2">AI Insight</div>
                        {selected.evidence}
                      </div>
                    )}

                    {/* Source Breakdown */}
                    {selected?.sourceBreakdown && Object.keys(selected.sourceBreakdown).length > 0 && (
                      <div className="mt-4">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-white/20 mb-2">Evidence Sources</div>
                        <div className="flex gap-2">
                          {Object.entries(selected.sourceBreakdown).map(([src, data]) => (
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
                      <a href="/signup" className="rounded-2xl bg-white px-4 py-3 text-center font-semibold text-slate-950 text-sm hover:opacity-90">Practice</a>
                      <a href="/signup" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center font-semibold text-white text-sm hover:bg-white/10">Ask Coach</a>
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
                    <a href="/signup" className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:opacity-90">Upload</a>
                  </div>
                  <div className="mt-5 space-y-3">
                    {MOCK_HISTORY.slice(0, 4).map((h, i) => (
                      <div key={i} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-medium text-sm">{h.skill_name}</div>
                            <div className="mt-1 text-xs text-slate-400">{h.source} &middot; {new Date(h.scored_at).toLocaleDateString()}</div>
                          </div>
                          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">{h.score}%</div>
                        </div>
                      </div>
                    ))}
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
                    {weakest.slice(0, 3).map((node, i) => (
                      <div key={node.id} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 hover:bg-slate-900/90 transition cursor-pointer">
                        <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-cyan-300">Coach note {i + 1}</div>
                        <div className="text-sm text-slate-200">
                          {node.score === 0
                            ? `${node.name} is unexplored territory. A single quiz will reveal where you stand.`
                            : `Your ${node.name} shows early signals at ${node.score}%. Want to build on that with targeted practice?`}
                        </div>
                      </div>
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
                <div className="mt-2 text-5xl font-bold">{overall}</div>
                <div className="mt-2 text-sm text-cyan-300">{overall > 50 ? 'Ahead of growth target' : 'Building momentum'}</div>
              </div>

              {/* Stats */}
              <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-5">
                <div className="text-sm text-slate-400">Skill Growth</div>
                <div className="mt-3 grid grid-cols-3 gap-3 text-center text-sm">
                  <div className="rounded-2xl bg-white/5 p-3"><div className="text-2xl font-bold">{SKILLS.length}</div><div className="text-slate-400 text-xs">Skills</div></div>
                  <div className="rounded-2xl bg-white/5 p-3"><div className="text-2xl font-bold">{evidenceCount}</div><div className="text-slate-400 text-xs">Evidence</div></div>
                  <div className="rounded-2xl bg-white/5 p-3"><div className="text-2xl font-bold">{mastered}</div><div className="text-slate-400 text-xs">Mastered</div></div>
                </div>
              </div>

              {/* XP Level */}
              <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-slate-400">Level Progress</div>
                  <span className="text-xs font-bold text-amber-300">Lv {DEMO_LEVEL.level} &middot; {DEMO_LEVEL.title}</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all" style={{ width: `${DEMO_LEVEL.progress * 100}%` }} />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                  <span>{DEMO_XP} XP</span>
                  <span>{(DEMO_LEVEL.level) * 500} XP to next level</span>
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
                        <a href="/signup" className="rounded-2xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/10">Start</a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Knowledge Snapshot */}
              <div className="rounded-[2rem] border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 via-blue-500/10 to-fuchsia-500/10 p-6 shadow-xl">
                <h2 className="text-lg font-semibold">Knowledge Snapshot</h2>
                <p className="mt-3 text-sm leading-6 text-slate-200">
                  The system compares assessment performance, evidence patterns, and coaching interactions to surface understanding that grades alone can&apos;t show.
                </p>
                <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm text-slate-100">
                  You&apos;ve mastered {mastered} skill{mastered !== 1 ? 's' : ''}. Your Cardiovascular mastery and emerging Systems Thinking suggest stronger analytical ability than quiz scores alone indicate. Upload project work to capture that evidence.
                </div>
              </div>

              {/* Governance */}
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-xs font-semibold text-emerald-300">Governed Intelligence</span>
                </div>
                <p className="text-xs text-slate-400 leading-5">
                  Every AI decision passes through fairness, confidence, and privacy constraints. The system defers to human review when conditions aren&apos;t met.
                </p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {[
                    { label: 'Fairness', status: 'pass' },
                    { label: 'Confidence', status: 'pass' },
                    { label: 'Privacy', status: 'pass' },
                  ].map(g => (
                    <div key={g.label} className="rounded-xl bg-white/5 p-2 text-center">
                      <div className="text-[10px] text-slate-400">{g.label}</div>
                      <div className="text-[10px] font-bold text-emerald-400 mt-0.5">\u2713 {g.status}</div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* ══ SKILLS LIST VIEW ══ */}
        {view === 'skills' && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {SKILLS.map((s, i) => (
              <div key={s.id} onClick={() => { setSel(s.id); setView('course') }}
                className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-xl transition hover:bg-white/10 cursor-pointer">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ background: s.skill_type === 'implicit' ? 'rgba(167,139,250,0.15)' : 'rgba(34,211,238,0.15)', color: s.skill_type === 'implicit' ? '#C4B5FD' : '#67E8F9' }}>
                    {s.skill_type === 'implicit' ? 'transferable' : 'foundational'}
                  </span>
                  {s.trajectory && s.trajectory.trend !== 'insufficient_data' && (
                    <span className="text-xs">
                      {s.trajectory.trend === 'accelerating' ? '\uD83D\uDE80' : s.trajectory.trend === 'improving' ? '\uD83D\uDCC8' : s.trajectory.trend === 'stable' ? '\u27A1\uFE0F' : '\uD83D\uDCC9'}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-white mb-3">{s.name}</h3>
                <div className="h-2 overflow-hidden rounded-full bg-white/10 mb-2">
                  <div className={`h-full rounded-full bg-gradient-to-r ${gradients[i % gradients.length]} transition-all duration-700`} style={{ width: `${s.score}%` }} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">{s.score > 0 ? proficiencyLabel(s.score) : 'Uncharted'}</span>
                  <span className="font-bold">{s.score}%</span>
                </div>
                {s.confidence > 0 && (
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                    <span>Confidence: {Math.round(s.confidence * 100)}%</span>
                    {s.interval && <span style={{ color: s.interval.reliability === 'high' ? '#4ADE80' : s.interval.reliability === 'moderate' ? '#FBBF24' : '#FB7185' }}>{s.interval.reliability}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ══ EVIDENCE VIEW ══ */}
        {view === 'evidence' && (
          <div className="max-w-3xl mx-auto rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Evidence Studio</h2>
              <a href="/signup" className="rounded-2xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900">Upload Work</a>
            </div>
            {MOCK_HISTORY.map((h, i) => {
              const skill = SKILLS.find(s => s.id === h.skill_id)
              return (
                <div key={i} className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 mb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium">{h.skill_name}</div>
                      <div className="mt-1 text-sm text-slate-400">{h.source} &middot; {new Date(h.scored_at).toLocaleDateString()}</div>
                      {skill?.evidence && <p className="mt-2 text-sm text-slate-300 leading-relaxed">{skill.evidence}</p>}
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-bold">{h.score}%</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
