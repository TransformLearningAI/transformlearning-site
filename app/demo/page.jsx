'use client'
import { useState } from 'react'
import { proficiencyLabel } from '@/lib/utils/proficiency'
import Link from 'next/link'

const SKILLS = [
  { id: '1', name: 'Cellular Physiology', type: 'explicit', score: 72 },
  { id: '2', name: 'Membrane Transport', type: 'explicit', score: 58 },
  { id: '3', name: 'Neurophysiology', type: 'explicit', score: 34 },
  { id: '4', name: 'Cardiovascular', type: 'explicit', score: 85 },
  { id: '5', name: 'Respiratory', type: 'explicit', score: 41 },
  { id: '6', name: 'Renal Physiology', type: 'explicit', score: 0 },
  { id: '7', name: 'Endocrine System', type: 'explicit', score: 22 },
  { id: '8', name: 'Homeostasis', type: 'explicit', score: 67 },
  { id: '9', name: 'Critical Thinking', type: 'implicit', score: 55 },
  { id: '10', name: 'Systems Thinking', type: 'implicit', score: 71 },
  { id: '11', name: 'Scientific Comm.', type: 'implicit', score: 38 },
  { id: '12', name: 'Problem Solving', type: 'implicit', score: 48 },
  { id: '13', name: 'Self-Regulation', type: 'implicit', score: 0 },
  { id: '14', name: 'Experimental Design', type: 'implicit', score: 15 },
]

function starPos(id, i, total) {
  let h = 0
  for (let c = 0; c < id.length; c++) h = ((h << 5) - h + id.charCodeAt(c)) | 0
  const a = i * 2.39996323 + (h % 100) * 0.005
  const r = 0.15 + Math.sqrt(i / total) * 0.3
  return { x: 0.5 + Math.cos(a) * r, y: 0.5 + Math.sin(a) * r }
}

const NODES = SKILLS.map((s, i) => ({ ...s, ...starPos(s.id, i, SKILLS.length) }))

function Star({ x, y, score, name, type, selected, onClick, i }) {
  const sz = score >= 80 ? 18 : score >= 40 ? 14 : score > 0 ? 11 : 8
  const br = score >= 80 ? 1 : score >= 40 ? 0.7 : score > 0 ? 0.4 : 0.15
  const color = score >= 80 ? '#4ADE80' : score >= 40 ? '#00CED1' : score > 0 ? '#A78BFA' : '#334155'
  const glow = score >= 80 ? 'rgba(74,222,128,0.6)' : score >= 40 ? 'rgba(0,206,209,0.4)' : 'rgba(167,139,250,0.2)'
  const imp = type === 'implicit'
  return (
    <g onClick={onClick} style={{ cursor: 'pointer' }}>
      {score > 0 && (
        <circle cx={x} cy={y} r={sz + 12} fill={glow} opacity={br * 0.3}>
          <animate attributeName="r" values={`${sz + 8};${sz + 16};${sz + 8}`} dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values={`${br * 0.2};${br * 0.4};${br * 0.2}`} dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
        </circle>
      )}
      {score >= 80 && (
        <circle cx={x} cy={y} r={sz / 2 + 4} fill="none" stroke={color} strokeWidth={1} opacity={0.5}>
          <animate attributeName="r" values={`${sz / 2 + 3};${sz / 2 + 8};${sz / 2 + 3}`} dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="4s" repeatCount="indefinite" />
        </circle>
      )}
      {imp ? (
        <rect x={x - sz / 2} y={y - sz / 2} width={sz} height={sz} rx={3} transform={`rotate(45,${x},${y})`}
          fill={color} opacity={br} stroke={selected ? 'white' : 'none'} strokeWidth={selected ? 2 : 0} />
      ) : (
        <circle cx={x} cy={y} r={sz / 2} fill={color} opacity={br}
          stroke={selected ? 'white' : 'none'} strokeWidth={selected ? 2 : 0} />
      )}
      <text x={x} y={y + sz / 2 + 14} textAnchor="middle" fill="white" fontSize="9" fontWeight={selected ? '700' : '400'} opacity={selected ? 1 : score > 0 ? 0.6 : 0.25}>
        {name.length > 16 ? name.substring(0, 14) + '…' : name}
      </text>
      {score > 0 && <text x={x} y={y + sz / 2 + 24} textAnchor="middle" fill={color} fontSize="10" fontWeight="800" opacity={0.9}>{score}%</text>}
    </g>
  )
}

export default function DemoPage() {
  const [sel, setSel] = useState(null)
  const node = sel ? NODES.find(n => n.id === sel) : null
  const overall = Math.round(NODES.reduce((a, n) => a + n.score, 0) / NODES.length)
  const illuminated = NODES.filter(n => n.score > 0).length
  const mastered = NODES.filter(n => n.score >= 80).length
  const weakest = [...NODES].sort((a, b) => a.score - b.score).slice(0, 3)
  const W = 800, H = 600

  const lines = []
  for (let i = 0; i < NODES.length; i++) {
    for (let j = i + 1; j < NODES.length; j++) {
      if (NODES[i].type === NODES[j].type) {
        const d = Math.hypot(NODES[i].x - NODES[j].x, NODES[i].y - NODES[j].y)
        if (d < 0.28) lines.push({ x1: NODES[i].x * W, y1: NODES[i].y * H, x2: NODES[j].x * W, y2: NODES[j].y * H, o: ((NODES[i].score || 0) + (NODES[j].score || 0)) / 2 > 0 ? 0.12 : 0.03 })
      }
    }
  }

  const circ = 2 * Math.PI * 160
  const offset = circ - (overall / 100) * circ

  return (
    <div className="min-h-screen" style={{ background: '#0A0E1A' }}>
      {/* Banner */}
      <div className="text-center py-2.5 text-xs font-bold text-white/70" style={{ background: 'rgba(167,139,250,0.15)', borderBottom: '1px solid rgba(167,139,250,0.2)' }}>
        DEMO — The Constellation &nbsp;·&nbsp;
        <Link href="/" className="underline opacity-70 hover:opacity-100">Back to site</Link>
        &nbsp;·&nbsp; <a href="/signup" className="underline opacity-70 hover:opacity-100">Sign up →</a>
      </div>

      {/* Sky */}
      <div className="relative overflow-hidden" style={{ minHeight: '85vh' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[500px] h-[500px] rounded-full" style={{ top: '10%', left: '20%', background: 'radial-gradient(circle, rgba(0,206,209,0.04) 0%, transparent 70%)' }} />
          <div className="absolute w-[400px] h-[400px] rounded-full" style={{ top: '40%', right: '10%', background: 'radial-gradient(circle, rgba(167,139,250,0.03) 0%, transparent 70%)' }} />
          <div className="absolute w-[300px] h-[300px] rounded-full" style={{ bottom: '10%', left: '40%', background: 'radial-gradient(circle, rgba(74,222,128,0.03) 0%, transparent 70%)' }} />
        </div>

        <div className="relative z-10 px-8 pt-8 pb-4 flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 mb-1">Fall 2025</p>
            <h1 className="text-2xl font-bold text-white tracking-tight">BSC3096</h1>
            <p className="text-sm text-white/30">Human Physiology</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">Illuminated</p>
              <p className="text-lg font-black text-cyan-400">{illuminated}<span className="text-white/20 font-normal">/{NODES.length}</span></p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">Mastered</p>
              <p className="text-lg font-black text-green-400">{mastered}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">Overall</p>
              <p className="text-lg font-black text-white">{overall}%</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 px-4">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: '60vh' }}>
            <defs>
              <linearGradient id="pg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#00CED1" /><stop offset="100%" stopColor="#4ADE80" /></linearGradient>
              <radialGradient id="cg"><stop offset="0%" stopColor="rgba(0,206,209,0.08)" /><stop offset="100%" stopColor="transparent" /></radialGradient>
            </defs>
            <circle cx={W / 2} cy={H / 2} r="200" fill="url(#cg)" />
            <circle cx={W / 2} cy={H / 2} r="160" fill="none" stroke="white" strokeWidth="0.5" opacity="0.05" />
            <circle cx={W / 2} cy={H / 2} r="160" fill="none" stroke="url(#pg)" strokeWidth="2"
              strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
              transform={`rotate(-90, ${W / 2}, ${H / 2})`} opacity="0.6" />
            {lines.map((l, i) => <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="white" strokeWidth="0.5" opacity={l.o} />)}
            {NODES.map((n, i) => <Star key={n.id} x={n.x * W} y={n.y * H} score={n.score} name={n.name} type={n.type} selected={sel === n.id} onClick={() => setSel(sel === n.id ? null : n.id)} i={i} />)}
          </svg>
        </div>

        <div className="absolute bottom-4 left-8 z-10 flex items-center gap-5">
          {[{ c: '#4ADE80', l: 'Mastered' }, { c: '#00CED1', l: 'Developing' }, { c: '#A78BFA', l: 'Emerging' }, { c: '#334155', l: 'Uncharted' }].map(x => (
            <div key={x.l} className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{ background: x.c }} /><span className="text-[10px] text-white/30">{x.l}</span></div>
          ))}
          <div className="flex items-center gap-1.5 ml-2"><div className="w-2.5 h-2.5 rounded-full border border-white/20" /><span className="text-[10px] text-white/30">Explicit</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rotate-45 rounded-sm border border-white/20" /><span className="text-[10px] text-white/30">Implicit</span></div>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
          <div className="px-5 py-2.5 rounded-full flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" style={{ boxShadow: '0 0 8px rgba(0,206,209,0.6)' }} />
            <span className="text-xs text-white/50">Renal Physiology is uncharted. Click to begin.</span>
          </div>
        </div>
      </div>

      {/* Below */}
      <div className="relative z-10 px-8 pb-12">
        <div className="max-w-4xl mx-auto mt-8">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-2 h-2 rounded-full bg-rose-400" />
            <h2 className="text-lg font-bold text-white">Where to focus</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {weakest.map(n => (
              <div key={n.id} className="rounded-2xl p-5 transition-all hover:scale-[1.02] cursor-pointer"
                onClick={() => setSel(n.id)}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: n.type === 'implicit' ? '#A78BFA' : '#00CED1' }}>{n.type}</span>
                    <h3 className="font-bold text-white text-sm">{n.name}</h3>
                  </div>
                  <div className="text-xl font-black" style={{ color: n.score > 0 ? '#A78BFA' : '#334155' }}>{n.score}%</div>
                </div>
                <span className="text-xs font-bold" style={{ color: '#00CED1' }}>Illuminate →</span>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-8 grid md:grid-cols-3 gap-4">
          {[
            { icon: '⚡', label: 'Practice Quiz', sub: 'Adaptive questions', color: '0,206,209' },
            { icon: '💬', label: 'Ask Coach', sub: 'AI guidance', color: '167,139,250' },
            { icon: '📄', label: 'Upload Work', sub: 'Prove mastery', color: '74,222,128' },
          ].map(a => (
            <a key={a.label} href="/signup" className="rounded-2xl p-5 flex items-center gap-4 transition-all hover:scale-[1.02]"
              style={{ background: `linear-gradient(135deg, rgba(${a.color},0.1), rgba(${a.color},0.02))`, border: `1px solid rgba(${a.color},0.15)` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: `rgba(${a.color},0.15)` }}>{a.icon}</div>
              <div><p className="text-sm font-bold text-white">{a.label}</p><p className="text-[10px] text-white/30">{a.sub}</p></div>
            </a>
          ))}
        </div>

        <div className="max-w-4xl mx-auto mt-8 rounded-2xl px-6 py-4 flex items-center gap-4"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
          <span className="text-green-400/40">🛡️</span>
          <p className="text-[11px] text-white/20">Every assessment is governed by fairness, confidence, and privacy constraints.</p>
        </div>
      </div>

      {/* Detail panel */}
      {node && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setSel(null)} />
          <div className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] z-50 overflow-y-auto"
            style={{ background: '#0D1117', borderLeft: '1px solid rgba(255,255,255,0.06)', animation: 'slideInRight 0.3s ease-out' }}>
            <div className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between" style={{ background: '#0D1117', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <button onClick={() => setSel(null)} className="text-white/30 hover:text-white text-sm">← Close</button>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full"
                style={{ background: node.type === 'implicit' ? 'rgba(167,139,250,0.1)' : 'rgba(0,206,209,0.1)', color: node.type === 'implicit' ? '#A78BFA' : '#00CED1' }}>{node.type}</span>
            </div>
            <div className="px-6 py-8 space-y-6">
              <div className="text-center">
                <div className="text-6xl font-black mb-2" style={{ color: node.score >= 80 ? '#4ADE80' : node.score >= 40 ? '#00CED1' : node.score > 0 ? '#A78BFA' : '#334155' }}>{node.score}%</div>
                <p className="text-sm font-bold uppercase tracking-wider" style={{ color: '#00CED1' }}>{proficiencyLabel(node.score)}</p>
                <h2 className="font-serif font-light text-white text-2xl mt-3">{node.name}</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <a href="/signup" className="px-4 py-3.5 rounded-xl text-sm font-bold text-center text-white" style={{ background: 'linear-gradient(135deg, #00CED1, #0891B2)' }}>Practice</a>
                <a href="/signup" className="px-4 py-3.5 rounded-xl text-sm font-bold text-center text-white/60" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>Ask Coach</a>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(0,206,209,0.04)', border: '1px solid rgba(0,206,209,0.1)' }}>
                <p className="text-xs text-white/30 mb-2">Sign up to illuminate this star</p>
                <a href="/signup" className="text-xs font-bold" style={{ color: '#00CED1' }}>Create Account →</a>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
