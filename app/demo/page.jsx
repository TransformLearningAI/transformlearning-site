'use client'
import { useState, useEffect, useRef } from 'react'
import { proficiencyColor, proficiencyLabel } from '@/lib/utils/proficiency'
import Link from 'next/link'

// ── DATA ──
const COURSE = { title: 'Human Physiology', code: 'BSC3096', term: 'Fall 2025' }

const SKILLS = [
  { id: '1', name: 'Physiology & Technology', type: 'explicit', score: 4, evidence: 'Student shows minimal understanding of physiological technology applications. Needs foundational work.' },
  { id: '2', name: 'Ethical Considerations', type: 'explicit', score: 0, evidence: null },
  { id: '3', name: 'Communication Skills', type: 'explicit', score: 0, evidence: null },
  { id: '4', name: 'Critical Thinking', type: 'explicit', score: 13, evidence: 'Shows early signs of analytical reasoning but struggles to connect cause and effect across systems.' },
  { id: '5', name: 'Research Application', type: 'explicit', score: 0, evidence: null },
  { id: '6', name: 'Pathophysiology Concepts', type: 'explicit', score: 0, evidence: null },
  { id: '7', name: 'Laboratory Techniques', type: 'explicit', score: 0, evidence: null },
  { id: '8', name: 'Data Interpretation', type: 'explicit', score: 0, evidence: null },
  { id: '9', name: 'Homeostasis Mechanisms', type: 'implicit', score: 0, evidence: null },
  { id: '10', name: 'Organ System Functions', type: 'implicit', score: 0, evidence: null },
  { id: '11', name: 'Physiological Processes', type: 'implicit', score: 9, evidence: 'Demonstrates basic awareness of physiological processes but cannot yet articulate mechanisms.' },
  { id: '12', name: 'Anatomy Terminology', type: 'implicit', score: 0, evidence: null },
]

const HISTORY = [
  { type: 'assessment', skillName: 'Critical Thinking', score: 13, timestamp: '2025-09-15T14:30:00Z' },
  { type: 'assessment', skillName: 'Physiological Processes', score: 9, timestamp: '2025-09-15T14:25:00Z' },
  { type: 'assessment', skillName: 'Physiology & Technology', score: 4, timestamp: '2025-09-15T14:20:00Z' },
]

// ── POSITIONING ──
function hashPos(id, i, total) {
  let h = 0
  for (let c = 0; c < id.length; c++) h = ((h << 5) - h + id.charCodeAt(c)) | 0
  const angle = (i / total) * Math.PI * 2 + (h % 100) * 0.01
  const r = 0.28 + (Math.abs(h % 50) / 50) * 0.18
  return { x: 0.5 + Math.cos(angle) * r, y: 0.5 + Math.sin(angle) * r }
}

const NODES = SKILLS.map((s, i) => ({
  skill: s,
  score: s.score,
  status: s.score >= 80 ? 'explored' : s.score >= 40 ? 'emerging' : 'uncharted',
  position: hashPos(s.id, i, SKILLS.length),
  evidence: s.evidence,
}))

const PAIN = [...NODES].sort((a, b) => a.score - b.score).slice(0, 3)

// ── PULSE ──
function Pulse() {
  const ref = useRef(null)
  const frame = useRef(0)
  useEffect(() => {
    const c = ref.current
    if (!c) return
    const ctx = c.getContext('2d')
    c.width = 96; c.height = 40
    ctx.scale(2, 2)
    let off = 0
    function draw() {
      ctx.clearRect(0, 0, 48, 20)
      ctx.beginPath()
      for (let x = 0; x < 48; x++) {
        const y = 10 + Math.sin(x * 0.18 + off) * 3
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.strokeStyle = '#5F7691'
      ctx.lineWidth = 1.5
      ctx.stroke()
      off += 0.03
      frame.current = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(frame.current)
  }, [])
  return (
    <div className="flex items-center gap-2">
      <canvas ref={ref} style={{ width: 48, height: 20 }} />
      <span className="text-[10px] text-gray-400 font-medium hidden sm:block">→ steady</span>
    </div>
  )
}

// ── TERRAIN NODE ──
function TerrainNode({ node, cx, cy, isSelected, onSelect }) {
  const [hovered, setHovered] = useState(false)
  const active = isSelected || hovered
  const fills = { explored: '#4F8A5B', emerging: '#00A8A8', uncharted: '#DDE5EF' }
  const opacities = { explored: 1, emerging: 0.7, uncharted: 0.4 }
  const fill = fills[node.status]
  const opacity = opacities[node.status]
  const isImplicit = node.skill.type === 'implicit'
  const r = 28

  return (
    <g onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
       onClick={() => onSelect(node)} style={{ cursor: 'pointer' }}
       transform={active ? `translate(${cx},${cy}) scale(1.12) translate(${-cx},${-cy})` : undefined}>
      {/* Contour rings */}
      {[1, 2].map(i => (
        <circle key={i} cx={cx} cy={cy} r={r + i * 10} fill="none" stroke={fill}
          strokeWidth={node.status === 'uncharted' ? 0.5 : 0.8}
          strokeDasharray={node.status === 'uncharted' ? '4 4' : 'none'}
          opacity={opacity * (0.25 - i * 0.08)} />
      ))}
      {/* Glow for explored */}
      {node.status === 'explored' && (
        <circle cx={cx} cy={cy} r={r + 4} fill="none" stroke={fill} strokeWidth={2} opacity={0.2}>
          <animate attributeName="r" from={r + 2} to={r + 14} dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.25" to="0" dur="3s" repeatCount="indefinite" />
        </circle>
      )}
      {/* Fog for uncharted */}
      {node.status === 'uncharted' && (
        <circle cx={cx} cy={cy} r={r + 18} fill="url(#fog)" opacity={0.4}>
          <animate attributeName="opacity" values="0.25;0.5;0.25" dur="6s" repeatCount="indefinite" />
        </circle>
      )}
      {/* Main shape */}
      {isImplicit ? (
        <rect x={cx - r * 0.65} y={cy - r * 0.65} width={r * 1.3} height={r * 1.3} rx={4}
          transform={`rotate(45,${cx},${cy})`} fill={fill} opacity={opacity}
          stroke={active ? '#0C1F3F' : 'none'} strokeWidth={active ? 2 : 0} />
      ) : (
        <circle cx={cx} cy={cy} r={r} fill={fill} opacity={opacity}
          stroke={active ? '#0C1F3F' : 'none'} strokeWidth={active ? 2 : 0} />
      )}
      {/* Score */}
      <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle"
        fill="white" fontSize="13" fontWeight="800" opacity={node.score > 0 ? 1 : 0.5}>
        {node.score > 0 ? `${node.score}%` : '?'}
      </text>
      {/* Label */}
      <text x={cx} y={cy + r + 16} textAnchor="middle" fill="#1A2B3C" fontSize="10"
        fontWeight={active ? '700' : '500'} opacity={active ? 1 : 0.55}>
        {node.skill.name.length > 18 ? node.skill.name.substring(0, 16) + '…' : node.skill.name}
      </text>
      {isImplicit && (
        <text x={cx} y={cy + r + 27} textAnchor="middle" fill="#5A3E6B" fontSize="9" fontWeight="600" opacity={0.5}>
          implicit
        </text>
      )}
    </g>
  )
}

// ── EVIDENCE WALL ──
function EvidenceWall({ node, onClose }) {
  if (!node) return null
  const color = proficiencyColor(node.score)
  const label = proficiencyLabel(node.score)
  const isImplicit = node.skill.type === 'implicit'
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 bottom-0 w-full sm:w-[400px] z-50 bg-white shadow-2xl overflow-y-auto"
           style={{ animation: 'slideInRight 0.3s ease-out' }}>
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <button onClick={onClose} className="text-gray-400 hover:text-navy text-sm font-medium">← Close</button>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full"
            style={{ background: isImplicit ? 'rgba(90,62,107,0.08)' : 'rgba(0,168,168,0.08)', color: isImplicit ? '#5A3E6B' : '#00A8A8' }}>
            {isImplicit ? 'implicit' : 'explicit'}
          </span>
        </div>
        <div className="px-6 py-6 space-y-6">
          <div className="text-center py-4">
            <div className="text-6xl font-black mb-2" style={{ color }}>{node.score}%</div>
            <div className="text-sm font-bold uppercase tracking-wider" style={{ color }}>{label}</div>
            <h2 className="font-serif font-light text-navy text-2xl mt-3" style={{ letterSpacing: '-0.02em' }}>{node.skill.name}</h2>
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Evidence</h3>
            <div className="rounded-xl p-4" style={{ background: '#F4F7FB' }}>
              <p className="text-sm text-gray-600 leading-relaxed">
                {node.evidence || 'No assessment evidence yet. Complete a quiz or upload your work to generate evidence.'}
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Governance</h3>
            <div className="grid grid-cols-3 gap-2">
              {['Fairness', 'Confidence', 'Privacy'].map(g => (
                <div key={g} className="rounded-lg p-3 text-center" style={{ background: '#F0FDF4' }}>
                  <div className="w-2 h-2 rounded-full mx-auto mb-1.5" style={{ background: '#4F8A5B' }} />
                  <span className="text-[10px] font-bold" style={{ color: '#4F8A5B' }}>{g}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <a href="/signup" className="flex items-center justify-center px-4 py-3.5 rounded-xl text-white text-sm font-bold" style={{ background: '#00A8A8' }}>Practice Quiz</a>
            <a href="/signup" className="flex items-center justify-center px-4 py-3.5 rounded-xl text-sm font-bold border border-gray-200 text-navy hover:bg-gray-50">Ask Coach</a>
          </div>
          <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(0,168,168,0.04)', border: '1px solid rgba(0,168,168,0.1)' }}>
            <p className="text-xs text-gray-500 mb-2">Sign up to practice this skill with AI coaching</p>
            <a href="/signup" className="text-xs font-bold" style={{ color: '#00A8A8' }}>Create Account →</a>
          </div>
        </div>
      </div>
    </>
  )
}

// ── MAIN PAGE ──
export default function DemoPage() {
  const [selected, setSelected] = useState(null)
  const selectedNode = selected ? NODES.find(n => n.skill.id === selected) : null
  const explored = NODES.filter(n => n.status === 'explored').length
  const emerging = NODES.filter(n => n.status === 'emerging').length
  const uncharted = NODES.filter(n => n.status === 'uncharted').length
  const W = 900, H = 480

  // Connections between same-type skills
  const connections = []
  for (let i = 0; i < NODES.length; i++) {
    for (let j = i + 1; j < NODES.length; j++) {
      if (NODES[i].skill.type === NODES[j].skill.type) {
        const d = Math.hypot(NODES[i].position.x - NODES[j].position.x, NODES[i].position.y - NODES[j].position.y)
        if (d < 0.35) connections.push([i, j])
      }
    }
  }

  return (
    <div className="min-h-screen" style={{ background: '#F4F7FB' }}>
      {/* Demo banner */}
      <div className="text-center py-2.5 text-xs font-bold text-white" style={{ background: '#5A3E6B' }}>
        DEMO — Student Wayfinding Experience &nbsp;·&nbsp;
        <Link href="/" className="underline opacity-70 hover:opacity-100">Back to site</Link>
        &nbsp;·&nbsp; <a href="/signup" className="underline opacity-70 hover:opacity-100">Sign up as Faculty →</a>
      </div>

      <div className="flex min-h-[calc(100vh-36px)]">
        {/* Sidebar */}
        <aside className="w-64 flex-col hidden lg:flex" style={{ background: '#1B3A2D' }}>
          <div className="px-5 pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: '#2D8B6F' }}>J</div>
              <div>
                <p className="text-sm font-bold text-white">jeff</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] font-bold text-amber-400">Level 4</span>
                  <span className="text-[10px] text-white/40">Scholar</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full mt-1 overflow-hidden w-24">
                  <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500" style={{ width: '60%' }} />
                </div>
              </div>
            </div>
            <div className="mt-3 px-3 py-2 rounded-lg text-[11px] text-white/50 italic" style={{ background: 'rgba(255,255,255,0.06)' }}>
              "The path forward is clear."
            </div>
          </div>
          <div className="px-3 flex-1">
            <p className="px-3 text-[10px] font-bold text-white/30 uppercase tracking-[0.12em] mb-2">Main</p>
            <nav className="space-y-0.5">
              {['◎ Skill Mapping', '📖 Learn', '📅 Study Planner', '📁 Source Library'].map((n, i) => (
                <div key={n} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${i === 0 ? 'text-white' : 'text-white/50'}`}
                  style={i === 0 ? { background: 'rgba(45,139,111,0.35)' } : undefined}>
                  {n}
                </div>
              ))}
            </nav>
            <p className="px-3 text-[10px] font-bold text-white/30 uppercase tracking-[0.12em] mb-2 mt-6">My Classes</p>
            <div className="px-3 py-2.5 rounded-xl text-sm font-medium text-white flex items-center gap-3" style={{ background: 'rgba(45,139,111,0.35)' }}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: '#D4603A' }}>B</span>
              BSC3096
            </div>
          </div>
          <div className="px-3 pb-4">
            <div className="flex items-center gap-2 px-3 py-2 text-white/20">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 3L4 21H9L12 14L15 21H20L12 3Z" fill="currentColor"/></svg>
              <span className="text-[11px] font-bold">arrival<span style={{ color: '#2D8B6F' }}>.ai</span></span>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Top bar */}
          <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 sticky top-0 z-10">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/><path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <input type="text" placeholder="Search courses or actions..." className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm placeholder-gray-400 focus:outline-none" style={{ background: '#F9FAFB' }} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-500">Tour</button>
              <button className="px-4 py-2 rounded-xl text-white text-xs font-bold" style={{ background: '#2D8B6F' }}>Upload</button>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: '#2D8B6F' }}>J</div>
            </div>
          </header>

          <main className="flex-1 p-6 lg:p-8 max-w-5xl w-full mx-auto">
            {/* Course header */}
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="font-serif font-light text-navy" style={{ fontSize: '28px', letterSpacing: '-0.02em' }}>
                  {COURSE.code} · {COURSE.title}
                </h1>
                <p className="text-xs text-gray-400 mt-0.5">{COURSE.term}</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span><strong className="text-green-600">{explored}</strong> explored</span>
                <span><strong className="text-teal-600">{emerging}</strong> emerging</span>
                <span><strong className="text-gray-500">{uncharted}</strong> uncharted</span>
              </div>
            </div>

            {/* Signal */}
            <div className="flex items-center justify-between px-5 py-3 rounded-2xl mb-6"
                 style={{ background: 'rgba(12,31,63,0.03)', border: '1px solid rgba(12,31,63,0.06)' }}>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#00A8A8', boxShadow: '0 0 8px rgba(0,168,168,0.4)' }} />
                <p className="text-sm text-gray-600">Ethical Considerations is uncharted territory. Start here.</p>
              </div>
              <Pulse />
            </div>

            {/* Terrain */}
            <div className="rounded-3xl overflow-hidden relative" style={{ background: '#FAFCFE', border: '1px solid rgba(12,31,63,0.06)' }}>
              <div className="absolute top-4 left-5 z-10 flex items-center gap-4">
                {[
                  { color: '#4F8A5B', label: 'Explored', shape: 'circle' },
                  { color: '#00A8A8', label: 'Emerging', shape: 'circle', opacity: 0.7 },
                  { color: '#DDE5EF', label: 'Uncharted', shape: 'circle' },
                  { color: '#00A8A8', label: 'Explicit', shape: 'ring' },
                  { color: '#5A3E6B', label: 'Implicit', shape: 'diamond' },
                ].map(l => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    {l.shape === 'diamond' ? (
                      <div className="w-3 h-3 rotate-45 rounded-sm" style={{ background: l.color, opacity: 0.6 }} />
                    ) : l.shape === 'ring' ? (
                      <div className="w-3 h-3 rounded-full border-2" style={{ borderColor: l.color }} />
                    ) : (
                      <div className="w-3 h-3 rounded-full" style={{ background: l.color, opacity: l.opacity || 1 }} />
                    )}
                    <span className="text-[10px] text-gray-500 font-medium">{l.label}</span>
                  </div>
                ))}
              </div>

              <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minHeight: '400px' }}>
                <defs>
                  <radialGradient id="fog"><stop offset="0%" stopColor="#DDE5EF" stopOpacity="0.3" /><stop offset="100%" stopColor="#DDE5EF" stopOpacity="0" /></radialGradient>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(12,31,63,0.03)" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width={W} height={H} fill="url(#grid)" />
                {connections.map(([a, b], i) => (
                  <line key={i} x1={NODES[a].position.x * W} y1={NODES[a].position.y * H}
                    x2={NODES[b].position.x * W} y2={NODES[b].position.y * H}
                    stroke="rgba(12,31,63,0.06)" strokeWidth="1" strokeDasharray="6 4" />
                ))}
                {NODES.map(node => (
                  <TerrainNode key={node.skill.id} node={node}
                    cx={node.position.x * W} cy={node.position.y * H}
                    isSelected={selected === node.skill.id}
                    onSelect={n => setSelected(selected === n.skill.id ? null : n.skill.id)} />
                ))}
              </svg>
            </div>

            {/* Pain Map */}
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full" style={{ background: '#FF6B4A' }} />
                <h2 className="text-lg font-bold text-navy">Where it hurts</h2>
                <span className="text-xs text-gray-400 ml-1">Your 3 biggest gaps</span>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {PAIN.map(({ skill, score, evidence }) => (
                  <div key={skill.id} className="rounded-2xl p-5 bg-white"
                    style={{ border: '1px solid rgba(12,31,63,0.08)', borderLeft: `4px solid ${skill.type === 'implicit' ? '#5A3E6B' : '#00A8A8'}` }}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: skill.type === 'implicit' ? '#5A3E6B' : '#00A8A8' }}>
                          {skill.type}
                        </span>
                        <h3 className="font-bold text-navy text-sm">{skill.name}</h3>
                      </div>
                      <div className="text-2xl font-black" style={{ color: proficiencyColor(score) }}>{score}%</div>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-3">
                      {evidence || 'No assessment data yet. This skill needs your attention.'}
                    </p>
                    <a href="/signup" className="text-xs font-bold hover:opacity-80" style={{ color: skill.type === 'implicit' ? '#5A3E6B' : '#00A8A8' }}>
                      Fix this →
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Journey */}
            <div className="mt-10">
              <h2 className="text-lg font-bold text-navy mb-6">The Journey</h2>
              <div className="relative pl-8">
                <div className="absolute left-3 top-0 bottom-0 w-px" style={{ background: 'rgba(12,31,63,0.08)' }} />
                {HISTORY.map((e, i) => (
                  <div key={i} className="flex items-start gap-4 relative mb-4">
                    <div className="absolute -left-5 mt-1.5 w-2.5 h-2.5 rounded-full ring-2 ring-white" style={{ background: '#00A8A8' }} />
                    <div className="flex-1 rounded-xl px-4 py-3 bg-white" style={{ border: '1px solid rgba(12,31,63,0.05)' }}>
                      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#00A8A8' }}>Assessment</span>
                      <p className="text-sm text-gray-700">Practiced {e.skillName}. Scored {e.score}%.</p>
                      <p className="text-[10px] text-gray-300 mt-1">{new Date(e.timestamp).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>

          {/* Coach */}
          <div className="fixed bottom-6 right-6 z-30 max-w-[300px]">
            <div className="rounded-2xl shadow-lg overflow-hidden" style={{ background: 'rgba(255,255,255,0.97)', border: '1px solid rgba(12,31,63,0.08)', backdropFilter: 'blur(12px)' }}>
              <div className="px-4 py-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#00A8A8', boxShadow: '0 0 6px rgba(0,168,168,0.4)' }} />
                  <p className="text-[13px] text-gray-600 leading-relaxed">
                    {selected ? `${NODES.find(n => n.skill.id === selected)?.skill.name} is unexplored. A single quiz will reveal where you stand.` : 'All territory is uncharted. Start anywhere. Every step reveals the path.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Evidence Wall */}
      {selectedNode && <EvidenceWall node={selectedNode} onClose={() => setSelected(null)} />}
    </div>
  )
}
