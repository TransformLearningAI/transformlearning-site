'use client'
import { useState, useEffect, useRef, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { proficiencyColor, proficiencyLabel } from '@/lib/utils/proficiency'
import Link from 'next/link'

/*
  THE CONSTELLATION

  Each skill is a star. Mastered stars burn bright. Uncharted stars are dim.
  The student's course is a night sky they're illuminating.

  This is not a dashboard. It's a living map of knowledge.
*/

// Deterministic star placement from skill ID
function starPosition(id, i, total) {
  let h = 0
  for (let c = 0; c < id.length; c++) h = ((h << 5) - h + id.charCodeAt(c)) | 0
  const goldenAngle = 2.39996323
  const angle = i * goldenAngle + (h % 100) * 0.005
  const r = 0.15 + Math.sqrt(i / total) * 0.3
  return { x: 0.5 + Math.cos(angle) * r, y: 0.5 + Math.sin(angle) * r }
}

// Animated star glow
function Star({ x, y, score, name, type, isSelected, onClick, delay }) {
  const size = score >= 80 ? 18 : score >= 40 ? 14 : score > 0 ? 11 : 8
  const brightness = score >= 80 ? 1 : score >= 40 ? 0.7 : score > 0 ? 0.4 : 0.15
  const color = score >= 80 ? '#4ADE80' : score >= 40 ? '#00CED1' : score > 0 ? '#A78BFA' : '#334155'
  const glowColor = score >= 80 ? 'rgba(74,222,128,0.6)' : score >= 40 ? 'rgba(0,206,209,0.4)' : 'rgba(167,139,250,0.2)'
  const isImplicit = type === 'implicit'

  return (
    <g onClick={onClick} style={{ cursor: 'pointer' }}>
      {/* Glow */}
      {score > 0 && (
        <circle cx={x} cy={y} r={size + 12} fill={glowColor} opacity={brightness * 0.3}>
          <animate attributeName="r" values={`${size + 8};${size + 16};${size + 8}`} dur={`${3 + delay * 0.5}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values={`${brightness * 0.2};${brightness * 0.4};${brightness * 0.2}`} dur={`${3 + delay * 0.5}s`} repeatCount="indefinite" />
        </circle>
      )}

      {/* Star body */}
      {isImplicit ? (
        <rect x={x - size / 2} y={y - size / 2} width={size} height={size} rx={3}
          transform={`rotate(45, ${x}, ${y})`}
          fill={color} opacity={brightness}
          stroke={isSelected ? 'white' : 'none'} strokeWidth={isSelected ? 2 : 0} />
      ) : (
        <circle cx={x} cy={y} r={size / 2} fill={color} opacity={brightness}
          stroke={isSelected ? 'white' : 'none'} strokeWidth={isSelected ? 2 : 0} />
      )}

      {/* Score ring for mastered */}
      {score >= 80 && (
        <circle cx={x} cy={y} r={size / 2 + 4} fill="none" stroke={color} strokeWidth={1} opacity={0.5}>
          <animate attributeName="r" values={`${size / 2 + 3};${size / 2 + 8};${size / 2 + 3}`} dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="4s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Label (only on hover/select or if scored) */}
      <text x={x} y={y + size / 2 + 14} textAnchor="middle" fill="white" fontSize="9"
        fontWeight={isSelected ? '700' : '400'} opacity={isSelected ? 1 : score > 0 ? 0.6 : 0.25}>
        {name.length > 16 ? name.substring(0, 14) + '…' : name}
      </text>
      {score > 0 && (
        <text x={x} y={y + size / 2 + 24} textAnchor="middle" fill={color} fontSize="10" fontWeight="800" opacity={0.9}>
          {score}%
        </text>
      )}
    </g>
  )
}

// Constellation lines between related skills
function Constellation({ nodes, W, H }) {
  const lines = []
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (nodes[i].type === nodes[j].type) {
        const dx = nodes[i].x - nodes[j].x
        const dy = nodes[i].y - nodes[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 0.28) {
          const avgScore = ((nodes[i].score || 0) + (nodes[j].score || 0)) / 2
          lines.push({ x1: nodes[i].x * W, y1: nodes[i].y * H, x2: nodes[j].x * W, y2: nodes[j].y * H, opacity: avgScore > 0 ? 0.15 : 0.04 })
        }
      }
    }
  }
  return lines.map((l, i) => (
    <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="white" strokeWidth="0.5" opacity={l.opacity} />
  ))
}

// The orbit ring showing overall progress
function OrbitRing({ cx, cy, r, progress }) {
  const circumference = 2 * Math.PI * r
  const offset = circumference - (progress / 100) * circumference
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="white" strokeWidth="0.5" opacity="0.05" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="url(#progressGrad)" strokeWidth="2"
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round" transform={`rotate(-90, ${cx}, ${cy})`} opacity="0.6" />
    </g>
  )
}

export default function StudentDashboard() {
  const { enrollmentId } = useParams()
  const [enrollment, setEnrollment] = useState(null)
  const [scores, setScores] = useState([])
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => {
    Promise.all([
      fetch(`/api/enrollments/${enrollmentId}`).then(r => r.json()),
      fetch(`/api/proficiency?enrollmentId=${enrollmentId}`).then(r => r.json()),
    ]).then(([e, p]) => {
      setEnrollment(e)
      setScores(p.scores || [])
      setHistory(p.history || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [enrollmentId])

  const derived = useMemo(() => {
    if (!enrollment) return null
    const skills = enrollment?.courses?.skills?.filter(s => s.is_approved) || []
    const scoreMap = Object.fromEntries(scores.map(s => [s.skill_id, s]))

    const nodes = skills.map((s, i) => {
      const pos = starPosition(s.id, i, skills.length)
      const sc = scoreMap[s.id]?.score ?? 0
      return { ...s, x: pos.x, y: pos.y, score: sc, evidence: scoreMap[s.id]?.evidence_summary, confidence: scoreMap[s.id]?.confidence, type: s.skill_type }
    })

    const overall = skills.length > 0 ? Math.round(nodes.reduce((a, n) => a + n.score, 0) / skills.length) : 0
    const illuminated = nodes.filter(n => n.score > 0).length
    const mastered = nodes.filter(n => n.score >= 80).length
    const weakest = [...nodes].sort((a, b) => a.score - b.score).slice(0, 3)

    return { nodes, skills, scoreMap, overall, illuminated, mastered, weakest }
  }, [enrollment, scores])

  if (loading) return (
    <div className="flex items-center justify-center py-32" style={{ background: '#0A0E1A' }}>
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-white/30">Mapping your constellation...</p>
      </div>
    </div>
  )

  if (!derived) return null

  const selected = selectedId ? derived.nodes.find(n => n.id === selectedId) : null
  const W = 800, H = 600

  return (
    <div className="min-h-screen -m-6 lg:-m-8" style={{ background: '#0A0E1A' }}>

      {/* ═══ THE SKY ═══ */}
      <div className="relative overflow-hidden" style={{ minHeight: '85vh' }}>

        {/* Background nebula effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[500px] h-[500px] rounded-full" style={{ top: '10%', left: '20%', background: 'radial-gradient(circle, rgba(0,206,209,0.04) 0%, transparent 70%)' }} />
          <div className="absolute w-[400px] h-[400px] rounded-full" style={{ top: '40%', right: '10%', background: 'radial-gradient(circle, rgba(167,139,250,0.03) 0%, transparent 70%)' }} />
          <div className="absolute w-[300px] h-[300px] rounded-full" style={{ bottom: '10%', left: '40%', background: 'radial-gradient(circle, rgba(74,222,128,0.03) 0%, transparent 70%)' }} />
        </div>

        {/* Header */}
        <div className="relative z-10 px-8 pt-8 pb-4 flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 mb-1">{enrollment?.courses?.term}</p>
            <h1 className="text-2xl font-bold text-white tracking-tight">{enrollment?.courses?.course_code}</h1>
            <p className="text-sm text-white/30">{enrollment?.courses?.title}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">Illuminated</p>
              <p className="text-lg font-black text-cyan-400">{derived.illuminated}<span className="text-white/20 font-normal">/{derived.nodes.length}</span></p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">Mastered</p>
              <p className="text-lg font-black text-green-400">{derived.mastered}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">Overall</p>
              <p className="text-lg font-black text-white">{derived.overall}%</p>
            </div>
          </div>
        </div>

        {/* Constellation SVG */}
        <div className="relative z-10 px-4">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: '60vh' }}>
            <defs>
              <linearGradient id="progressGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#00CED1" />
                <stop offset="100%" stopColor="#4ADE80" />
              </linearGradient>
              <radialGradient id="centerGlow">
                <stop offset="0%" stopColor="rgba(0,206,209,0.08)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>

            {/* Center glow */}
            <circle cx={W / 2} cy={H / 2} r="200" fill="url(#centerGlow)" />

            {/* Orbit rings */}
            <OrbitRing cx={W / 2} cy={H / 2} r={120} progress={derived.overall} />
            <OrbitRing cx={W / 2} cy={H / 2} r={200} progress={derived.overall * 0.7} />

            {/* Constellation lines */}
            <Constellation nodes={derived.nodes} W={W} H={H} />

            {/* Stars */}
            {derived.nodes.map((node, i) => (
              <Star key={node.id}
                x={node.x * W} y={node.y * H}
                score={node.score} name={node.name} type={node.type}
                isSelected={selectedId === node.id}
                onClick={() => setSelectedId(selectedId === node.id ? null : node.id)}
                delay={i} />
            ))}
          </svg>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-8 z-10 flex items-center gap-5">
          {[
            { color: '#4ADE80', label: 'Mastered', shape: 'circle' },
            { color: '#00CED1', label: 'Developing', shape: 'circle' },
            { color: '#A78BFA', label: 'Emerging', shape: 'circle' },
            { color: '#334155', label: 'Uncharted', shape: 'circle' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
              <span className="text-[10px] text-white/30 font-medium">{l.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5 ml-2">
            <div className="w-2.5 h-2.5 rounded-full border border-white/20" />
            <span className="text-[10px] text-white/30 font-medium">Explicit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rotate-45 rounded-sm border border-white/20" />
            <span className="text-[10px] text-white/30 font-medium">Implicit</span>
          </div>
        </div>

        {/* Signal — bottom center */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
          <div className="px-5 py-2.5 rounded-full flex items-center gap-3"
               style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" style={{ boxShadow: '0 0 8px rgba(0,206,209,0.6)' }} />
            <span className="text-xs text-white/50">
              {derived.weakest[0]?.score === 0
                ? `${derived.weakest[0]?.name} is uncharted. Click to begin.`
                : `${derived.overall}% illuminated. ${derived.nodes.length - derived.illuminated} stars remain.`}
            </span>
          </div>
        </div>
      </div>

      {/* ═══ BELOW THE SKY ═══ */}
      <div className="relative z-10 px-8 pb-12">

        {/* Where it hurts */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-2 h-2 rounded-full bg-rose-400" />
            <h2 className="text-lg font-bold text-white">Where to focus</h2>
            <span className="text-xs text-white/20 ml-1">Your dimmest stars</span>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {derived.weakest.map(node => (
              <Link key={node.id} href={`/my-progress/${enrollmentId}/skill/${node.id}`}
                className="rounded-2xl p-5 block transition-all hover:scale-[1.02]"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider"
                      style={{ color: node.type === 'implicit' ? '#A78BFA' : '#00CED1' }}>
                      {node.type}
                    </span>
                    <h3 className="font-bold text-white text-sm">{node.name}</h3>
                  </div>
                  <div className="text-xl font-black" style={{ color: node.score > 0 ? '#A78BFA' : '#334155' }}>
                    {node.score}%
                  </div>
                </div>
                <p className="text-xs text-white/20 leading-relaxed mb-3 line-clamp-2">
                  {node.evidence || 'Unexplored. Take a quiz or upload your work to illuminate this star.'}
                </p>
                <span className="text-xs font-bold" style={{ color: '#00CED1' }}>Illuminate →</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="max-w-4xl mx-auto mt-8 grid md:grid-cols-3 gap-4">
          <Link href={derived.weakest[0] ? `/my-progress/${enrollmentId}/quiz/${derived.weakest[0].id}` : '#'}
            className="rounded-2xl p-5 flex items-center gap-4 transition-all hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg, rgba(0,206,209,0.1), rgba(0,206,209,0.02))', border: '1px solid rgba(0,206,209,0.15)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: 'rgba(0,206,209,0.15)' }}>⚡</div>
            <div>
              <p className="text-sm font-bold text-white">Practice Quiz</p>
              <p className="text-[10px] text-white/30">Adaptive questions for your level</p>
            </div>
          </Link>
          <Link href={derived.weakest[0] ? `/my-progress/${enrollmentId}/chat/${derived.weakest[0].id}` : '#'}
            className="rounded-2xl p-5 flex items-center gap-4 transition-all hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg, rgba(167,139,250,0.1), rgba(167,139,250,0.02))', border: '1px solid rgba(167,139,250,0.15)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: 'rgba(167,139,250,0.15)' }}>💬</div>
            <div>
              <p className="text-sm font-bold text-white">Ask Coach</p>
              <p className="text-[10px] text-white/30">AI guidance for any skill</p>
            </div>
          </Link>
          <div className="rounded-2xl p-5 flex items-center gap-4 transition-all hover:scale-[1.02] cursor-pointer"
            style={{ background: 'linear-gradient(135deg, rgba(74,222,128,0.1), rgba(74,222,128,0.02))', border: '1px solid rgba(74,222,128,0.15)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: 'rgba(74,222,128,0.15)' }}>📄</div>
            <div>
              <p className="text-sm font-bold text-white">Upload Work</p>
              <p className="text-[10px] text-white/30">Prove mastery with your own work</p>
            </div>
          </div>
        </div>

        {/* Governance footer */}
        <div className="max-w-4xl mx-auto mt-8 rounded-2xl px-6 py-4 flex items-center gap-4"
             style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2l6 3v4c0 3.5-2.5 6-6 7-3.5-1-6-3.5-6-7V5l6-3z" stroke="rgba(74,222,128,0.4)" strokeWidth="1.3" fill="none"/>
            <path d="M7 9l2 2 3-3.5" stroke="rgba(74,222,128,0.4)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p className="text-[11px] text-white/20">
            Every assessment is governed by fairness, confidence, and privacy constraints. The system cannot act on uncertain predictions.
          </p>
          <div className="flex items-center gap-3 ml-auto flex-shrink-0">
            {['Fairness', 'Confidence', 'Privacy'].map(g => (
              <div key={g} className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400/40" />
                <span className="text-[9px] text-white/15 font-medium">{g}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ SKILL DETAIL PANEL ═══ */}
      {selected && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setSelectedId(null)} />
          <div className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] z-50 overflow-y-auto"
               style={{ background: '#0D1117', borderLeft: '1px solid rgba(255,255,255,0.06)', animation: 'slideInRight 0.3s ease-out' }}>
            <div className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between"
                 style={{ background: '#0D1117', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <button onClick={() => setSelectedId(null)} className="text-white/30 hover:text-white text-sm">← Close</button>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full"
                style={{ background: selected.type === 'implicit' ? 'rgba(167,139,250,0.1)' : 'rgba(0,206,209,0.1)',
                         color: selected.type === 'implicit' ? '#A78BFA' : '#00CED1' }}>
                {selected.type}
              </span>
            </div>
            <div className="px-6 py-8 space-y-6">
              <div className="text-center">
                <div className="text-6xl font-black mb-2" style={{ color: selected.score >= 80 ? '#4ADE80' : selected.score >= 40 ? '#00CED1' : selected.score > 0 ? '#A78BFA' : '#334155' }}>
                  {selected.score}%
                </div>
                <p className="text-sm font-bold uppercase tracking-wider mb-1" style={{ color: selected.score >= 80 ? '#4ADE80' : '#00CED1' }}>
                  {proficiencyLabel(selected.score)}
                </p>
                <h2 className="font-serif font-light text-white text-2xl mt-3" style={{ letterSpacing: '-0.02em' }}>{selected.name}</h2>
                {selected.description && <p className="text-sm text-white/25 mt-2">{selected.description}</p>}
              </div>

              {/* Evidence */}
              <div>
                <h3 className="text-[10px] font-bold text-white/20 uppercase tracking-wider mb-2">Evidence</h3>
                <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <p className="text-sm text-white/40 leading-relaxed">
                    {selected.evidence || 'No evidence yet. Complete a quiz, coaching session, or upload your work to illuminate this star.'}
                  </p>
                </div>
              </div>

              {/* Confidence */}
              <div>
                <h3 className="text-[10px] font-bold text-white/20 uppercase tracking-wider mb-2">Confidence</h3>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div className="h-full rounded-full" style={{ width: `${(selected.confidence ?? 0) * 100}%`, background: 'linear-gradient(90deg, #00CED1, #4ADE80)' }} />
                </div>
                <p className="text-[10px] text-white/15 mt-1">{selected.confidence ? `${Math.round(selected.confidence * 100)}% confident` : 'Awaiting assessment'}</p>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Link href={`/my-progress/${enrollmentId}/quiz/${selected.id}`}
                  className="px-4 py-3.5 rounded-xl text-sm font-bold text-center text-white"
                  style={{ background: 'linear-gradient(135deg, #00CED1, #0891B2)' }}>
                  Practice
                </Link>
                <Link href={`/my-progress/${enrollmentId}/chat/${selected.id}`}
                  className="px-4 py-3.5 rounded-xl text-sm font-bold text-center text-white/60 hover:text-white"
                  style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                  Ask Coach
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
