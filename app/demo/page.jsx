'use client'
import { useState } from 'react'
import { proficiencyLabel, proficiencyColor } from '@/lib/utils/proficiency'
import Link from 'next/link'

/* ═══ MOCK DATA ══════════════════════════════════════════════════════ */

const SKILLS = [
  { id: '1', name: 'Cellular Physiology', skill_type: 'explicit', score: 72, evidence: 'Shows strong understanding of cellular mechanisms. Able to connect molecular events to tissue-level function.', confidence: 0.72, interval: { lower: 64, estimate: 72, upper: 80, reliability: 'moderate' }, trajectory: { trend: 'improving', velocity: 3.2, isGenuine: true, description: 'Steady improvement. Gaining 3.2 points per assessment.' }, sourceBreakdown: { quiz: { count: 3, avgScore: 70 }, assessment: { count: 1, avgScore: 65 }, upload: { count: 1, avgScore: 78 } } },
  { id: '2', name: 'Membrane Transport', skill_type: 'explicit', score: 58, evidence: 'Understands passive transport well. Active transport mechanisms need reinforcement.', confidence: 0.55, interval: { lower: 48, estimate: 58, upper: 68, reliability: 'moderate' }, trajectory: { trend: 'improving', velocity: 2.1, isGenuine: true, description: 'Gaining 2.1 points per assessment.' }, sourceBreakdown: { quiz: { count: 2, avgScore: 55 }, assessment: { count: 1, avgScore: 52 } } },
  { id: '3', name: 'Neurophysiology', skill_type: 'explicit', score: 34, evidence: 'Early-stage understanding. Struggles with action potential propagation.', confidence: 0.35, interval: { lower: 20, estimate: 34, upper: 48, reliability: 'low' }, trajectory: { trend: 'stable', velocity: 0.5, isGenuine: false, description: 'No significant growth detected.' }, sourceBreakdown: { quiz: { count: 2, avgScore: 32 }, coaching: { count: 3, avgScore: 40 } } },
  { id: '4', name: 'Cardiovascular', skill_type: 'explicit', score: 88, evidence: 'Strong mastery. Can explain cardiac cycle, pressure dynamics, and regulation.', confidence: 0.85, interval: { lower: 82, estimate: 88, upper: 94, reliability: 'high' }, trajectory: { trend: 'accelerating', velocity: 5.8, isGenuine: true, description: 'Strong upward trajectory. Learning appears genuine.' }, sourceBreakdown: { quiz: { count: 4, avgScore: 86 }, upload: { count: 2, avgScore: 91 } } },
  { id: '5', name: 'Respiratory', skill_type: 'explicit', score: 41, evidence: 'Developing. Understands gas exchange but not ventilation-perfusion matching.', confidence: 0.40, interval: { lower: 28, estimate: 41, upper: 54, reliability: 'low' }, trajectory: { trend: 'slipping', velocity: -1.5, isGenuine: false, description: 'Declining by 1.5 points per assessment.' }, sourceBreakdown: { quiz: { count: 2, avgScore: 40 } } },
  { id: '6', name: 'Renal Physiology', skill_type: 'explicit', score: 0, evidence: null, confidence: 0, interval: null, trajectory: null, sourceBreakdown: {} },
  { id: '7', name: 'Endocrine System', skill_type: 'explicit', score: 22, evidence: 'Knows major hormones but cannot articulate feedback loops.', confidence: 0.20, interval: { lower: 8, estimate: 22, upper: 40, reliability: 'low' }, trajectory: { trend: 'stable', velocity: 0.3, isGenuine: false, description: 'Stable. May need a different approach.' }, sourceBreakdown: { assessment: { count: 1, avgScore: 22 } } },
  { id: '8', name: 'Homeostasis', skill_type: 'explicit', score: 67, evidence: 'Good conceptual grasp. Can identify disruptions but not always predict compensatory responses.', confidence: 0.62, interval: { lower: 58, estimate: 67, upper: 76, reliability: 'moderate' }, trajectory: { trend: 'improving', velocity: 1.8, isGenuine: true, description: 'Steady progress.' }, sourceBreakdown: { quiz: { count: 3, avgScore: 65 }, upload: { count: 1, avgScore: 72 } } },
  { id: '9', name: 'Critical Thinking', skill_type: 'implicit', score: 55, evidence: 'Demonstrates analytical reasoning but needs practice connecting cause and effect.', confidence: 0.48, interval: { lower: 43, estimate: 55, upper: 67, reliability: 'low' }, trajectory: { trend: 'improving', velocity: 1.2, isGenuine: false, description: 'Some variability in scores.' }, sourceBreakdown: { quiz: { count: 1, avgScore: 50 }, upload: { count: 2, avgScore: 58 } } },
  { id: '10', name: 'Systems Thinking', skill_type: 'implicit', score: 71, evidence: 'Emerging strength. Can describe how organ systems interact.', confidence: 0.68, interval: { lower: 63, estimate: 71, upper: 79, reliability: 'moderate' }, trajectory: { trend: 'accelerating', velocity: 5.2, isGenuine: true, description: 'Strong trajectory. Genuine and sustained.' }, sourceBreakdown: { quiz: { count: 2, avgScore: 68 }, upload: { count: 2, avgScore: 74 } } },
  { id: '11', name: 'Scientific Comm.', skill_type: 'implicit', score: 38, evidence: 'Writing is clear but lacks precision in terminology use.', confidence: 0.32, interval: { lower: 22, estimate: 38, upper: 54, reliability: 'low' }, trajectory: { trend: 'stable', velocity: -0.3, isGenuine: false, description: 'Slight decline detected.' }, sourceBreakdown: { upload: { count: 2, avgScore: 38 } } },
  { id: '12', name: 'Problem Solving', skill_type: 'implicit', score: 48, evidence: 'Can work through structured problems but struggles with novel scenarios.', confidence: 0.44, interval: { lower: 36, estimate: 48, upper: 60, reliability: 'low' }, trajectory: { trend: 'improving', velocity: 1.5, isGenuine: false, description: 'Some variability.' }, sourceBreakdown: { quiz: { count: 2, avgScore: 46 } } },
  { id: '13', name: 'Self-Regulation', skill_type: 'implicit', score: 0, evidence: null, confidence: 0, interval: null, trajectory: null, sourceBreakdown: {} },
  { id: '14', name: 'Experimental Design', skill_type: 'implicit', score: 15, evidence: 'Very early. Understands hypothesis formation but not controlled variable design.', confidence: 0.15, interval: { lower: 0, estimate: 15, upper: 38, reliability: 'low' }, trajectory: null, sourceBreakdown: { assessment: { count: 1, avgScore: 15 } } },
]

const HISTORY = [
  { skill_name: 'Cardiovascular', score: 88, source: 'quiz', scored_at: '2025-11-12' },
  { skill_name: 'Cellular Physiology', score: 72, source: 'upload', scored_at: '2025-11-10' },
  { skill_name: 'Systems Thinking', score: 71, source: 'quiz', scored_at: '2025-11-08' },
  { skill_name: 'Homeostasis', score: 67, source: 'quiz', scored_at: '2025-11-06' },
]

/* ═══ Helpers ═════════════════════════════════════════════════════════ */

function trendEmoji(t) {
  if (!t) return ''
  return t === 'accelerating' ? '\uD83D\uDE80' : t === 'improving' ? '\uD83D\uDCC8' : t === 'stable' ? '\u27A1\uFE0F' : '\uD83D\uDCC9'
}

function trendColor(t) {
  if (!t) return '#64748B'
  return t === 'accelerating' || t === 'improving' ? '#4ADE80' : t === 'stable' ? '#FBBF24' : '#FB7185'
}

/* ═══ Page ════════════════════════════════════════════════════════════ */

export default function DemoPage() {
  const [sel, setSel] = useState(null)
  const [view, setView] = useState('orbit')
  const [hovered, setHovered] = useState(null)

  const overall = Math.round(SKILLS.reduce((a, s) => a + s.score, 0) / SKILLS.length)
  const mastered = SKILLS.filter(s => s.score >= 80).length
  const selected = sel ? SKILLS.find(s => s.id === sel) : null

  return (
    <div className="min-h-screen text-white" style={{ background: '#020617' }}>
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at top right, rgba(34,211,238,0.12), transparent 40%), radial-gradient(circle at bottom left, rgba(168,85,247,0.1), transparent 40%)' }} />

      {/* Banner */}
      <div className="relative z-10 text-center py-2.5 text-xs font-bold text-white/70 px-4" style={{ background: 'rgba(167,139,250,0.12)', borderBottom: '1px solid rgba(167,139,250,0.2)' }}>
        DEMO &middot; Arrival Student Dashboard &middot;{' '}
        <Link href="/" className="underline opacity-70 hover:opacity-100">Back to site</Link>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-4 sm:py-6">

        {/* Header */}
        <div className="mb-4 sm:mb-6 rounded-2xl sm:rounded-[2rem] border border-white/10 bg-white/5 p-4 sm:p-5 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-200">BSC3096 &middot; Fall 2025</span>
                <span className="text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-200">Lv 3 &middot; Learner &middot; 1340 XP</span>
              </div>
              <h1 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight">Human Physiology</h1>
            </div>
            <div className="flex gap-2">
              {[
                { key: 'orbit', label: 'Orbit' },
                { key: 'list', label: 'List' },
              ].map(v => (
                <button key={v.key} onClick={() => { setView(v.key); setSel(null) }}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm transition ${view === v.key ? 'bg-white text-slate-950 font-bold' : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'}`}>
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ══ ORBIT VIEW ══ */}
        {view === 'orbit' && (
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1fr_380px]">

            {/* SVG Orbit */}
            <div className="rounded-2xl sm:rounded-[2rem] border border-white/10 bg-slate-950/70 p-2 sm:p-4 aspect-square max-h-[70vh] sm:max-h-none relative overflow-hidden">
              <svg viewBox="0 0 400 400" className="w-full h-full">
                {/* Orbit rings */}
                <circle cx="200" cy="200" r="170" fill="none" stroke="white" strokeWidth="0.3" opacity="0.06" />
                <circle cx="200" cy="200" r="120" fill="none" stroke="white" strokeWidth="0.3" opacity="0.06" />
                <circle cx="200" cy="200" r="70" fill="none" stroke="white" strokeWidth="0.3" opacity="0.04" />

                {/* Center hub */}
                <circle cx="200" cy="200" r="32" fill="rgba(34,211,238,0.08)" stroke="rgba(34,211,238,0.2)" strokeWidth="1" />
                <text x="200" y="196" textAnchor="middle" fill="#67E8F9" fontSize="16" fontWeight="800">{overall}%</text>
                <text x="200" y="212" textAnchor="middle" fill="rgba(103,232,249,0.4)" fontSize="8" fontWeight="600">{mastered} mastered</text>

                {/* Skill orbs */}
                {SKILLS.map((s, i) => {
                  const angle = (i / SKILLS.length) * Math.PI * 2 - Math.PI / 2
                  // Radius based on score: higher score = closer to center
                  const r = s.score > 0 ? 170 - (s.score / 100) * 100 : 170
                  const cx = 200 + Math.cos(angle) * r
                  const cy = 200 + Math.sin(angle) * r
                  const orbSize = s.score > 0 ? 8 + (s.score / 100) * 10 : 6
                  const isActive = sel === s.id
                  const isHovered = hovered === s.id
                  const color = proficiencyColor(s.score)

                  return (
                    <g key={s.id}
                      onClick={() => setSel(isActive ? null : s.id)}
                      onMouseEnter={() => setHovered(s.id)}
                      onMouseLeave={() => setHovered(null)}
                      style={{ cursor: 'pointer' }}>

                      {/* Glow */}
                      {s.score > 0 && (
                        <circle cx={cx} cy={cy} r={orbSize + 6} fill={color} opacity={isActive ? 0.25 : 0.08}>
                          <animate attributeName="opacity" values={isActive ? '0.25;0.4;0.25' : '0.08;0.15;0.08'} dur="3s" repeatCount="indefinite" />
                        </circle>
                      )}

                      {/* Orb */}
                      <circle cx={cx} cy={cy} r={orbSize}
                        fill={s.score > 0 ? color : 'rgba(100,116,139,0.3)'}
                        stroke={isActive ? '#67E8F9' : 'rgba(255,255,255,0.1)'}
                        strokeWidth={isActive ? 2 : 0.5}
                        opacity={s.score === 0 ? 0.3 : 1} />

                      {/* Score text inside orb */}
                      {s.score > 0 && orbSize > 10 && (
                        <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="central"
                          fill="white" fontSize="8" fontWeight="800" style={{ pointerEvents: 'none' }}>
                          {s.score}
                        </text>
                      )}

                      {/* Name label on hover/active */}
                      {(isHovered || isActive) && (
                        <g>
                          <rect x={cx - 50} y={cy - orbSize - 22} width="100" height="18" rx="9" fill="rgba(0,0,0,0.8)" />
                          <text x={cx} y={cy - orbSize - 11} textAnchor="middle" dominantBaseline="central"
                            fill="white" fontSize="7" fontWeight="600" style={{ pointerEvents: 'none' }}>
                            {s.name}
                          </text>
                        </g>
                      )}
                    </g>
                  )
                })}
              </svg>

              {/* Legend */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center gap-3 flex-wrap">
                {[
                  { label: 'Expert', color: '#4F8A5B' },
                  { label: 'Proficient', color: '#00A8A8' },
                  { label: 'Developing', color: '#5A3E6B' },
                  { label: 'Emerging', color: '#FF6B4A' },
                  { label: 'Novice', color: '#EF4444' },
                ].map(l => (
                  <div key={l.label} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                    <span className="text-[8px] sm:text-[9px] text-white/30">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Detail Panel / Sidebar */}
            <div className="space-y-4">
              {selected ? (
                <div className="rounded-2xl sm:rounded-[2rem] border border-white/10 bg-slate-900/70 p-4 sm:p-5">
                  <button onClick={() => setSel(null)} className="text-xs text-white/30 hover:text-white/60 mb-2">Close</button>
                  <h3 className="text-xl sm:text-2xl font-semibold">{selected.name}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 inline-block"
                    style={{ background: selected.skill_type === 'implicit' ? 'rgba(167,139,250,0.15)' : 'rgba(34,211,238,0.15)', color: selected.skill_type === 'implicit' ? '#C4B5FD' : '#67E8F9' }}>
                    {selected.skill_type === 'implicit' ? 'transferable' : 'foundational'}
                  </span>

                  <div className="mt-4 h-3 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${selected.score}%`, background: proficiencyColor(selected.score) }} />
                  </div>
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-slate-400">Proficiency</span>
                    <span className="font-bold">{selected.score}% &middot; {proficiencyLabel(selected.score)}</span>
                  </div>

                  {selected.interval && (
                    <div className="mt-3">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-white/20 mb-1">Confidence Interval</div>
                      <div className="relative h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <div className="absolute h-full rounded-full" style={{ left: `${selected.interval.lower}%`, width: `${selected.interval.upper - selected.interval.lower}%`, background: 'rgba(0,206,209,0.2)' }} />
                        <div className="absolute h-full w-1 rounded-full" style={{ left: `${selected.score}%`, background: '#00CED1' }} />
                      </div>
                      <div className="flex justify-between text-[10px] text-white/20 mt-1">
                        <span>{selected.interval.lower}%</span>
                        <span style={{ color: selected.interval.reliability === 'high' ? '#4ADE80' : selected.interval.reliability === 'moderate' ? '#FBBF24' : '#FB7185' }}>{selected.interval.reliability}</span>
                        <span>{selected.interval.upper}%</span>
                      </div>
                    </div>
                  )}

                  {selected.trajectory && (
                    <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span>{trendEmoji(selected.trajectory.trend)}</span>
                        <span className="text-xs capitalize" style={{ color: trendColor(selected.trajectory.trend) }}>{selected.trajectory.trend}</span>
                        {selected.trajectory.velocity !== 0 && (
                          <span className="text-xs font-bold" style={{ color: selected.trajectory.velocity > 0 ? '#4ADE80' : '#FB7185' }}>
                            {selected.trajectory.velocity > 0 ? '+' : ''}{selected.trajectory.velocity}/assessment
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-white/30">{selected.trajectory.description}</p>
                    </div>
                  )}

                  {selected.evidence && (
                    <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 mb-1">AI Insight</div>
                      <p className="text-xs text-slate-300 leading-relaxed">{selected.evidence}</p>
                    </div>
                  )}

                  {selected.sourceBreakdown && Object.keys(selected.sourceBreakdown).length > 0 && (
                    <div className="mt-3">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-white/20 mb-1">Sources</div>
                      <div className="flex gap-2">
                        {Object.entries(selected.sourceBreakdown).map(([src, data]) => (
                          <div key={src} className="flex-1 rounded-lg p-2 text-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <div className="text-[10px] font-bold text-white/50 capitalize">{src}</div>
                            <div className="text-sm font-black text-cyan-300">{data.count}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <a href="/signup" className="rounded-xl bg-white px-3 py-2.5 text-center font-semibold text-slate-950 text-xs hover:opacity-90">Practice</a>
                    <a href="/signup" className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-center font-semibold text-white text-xs hover:bg-white/10">Ask Coach</a>
                  </div>
                </div>
              ) : (
                /* Quick stats when nothing selected */
                <div className="rounded-2xl sm:rounded-[2rem] border border-white/10 bg-slate-900/70 p-4 sm:p-5">
                  <p className="text-sm text-slate-400 mb-3">Tap any orb to explore a skill</p>
                  <div className="grid grid-cols-3 gap-2 text-center text-sm mb-4">
                    <div className="rounded-xl bg-white/5 p-3"><div className="text-xl font-bold">{SKILLS.length}</div><div className="text-[10px] text-slate-400">Skills</div></div>
                    <div className="rounded-xl bg-white/5 p-3"><div className="text-xl font-bold">{SKILLS.filter(s => s.evidence).length}</div><div className="text-[10px] text-slate-400">Evidence</div></div>
                    <div className="rounded-xl bg-white/5 p-3"><div className="text-xl font-bold">{mastered}</div><div className="text-[10px] text-slate-400">Mastered</div></div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-300">Governed Intelligence</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">Every AI decision passes through fairness, confidence, and privacy constraints.</p>
                </div>
              )}

              {/* Recent evidence */}
              <div className="rounded-2xl sm:rounded-[2rem] border border-white/10 bg-white/5 p-4 sm:p-5">
                <h3 className="text-sm font-semibold mb-3">Recent Evidence</h3>
                <div className="space-y-2">
                  {HISTORY.map((h, i) => (
                    <div key={i} className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/70 p-3">
                      <div>
                        <div className="text-xs font-medium">{h.skill_name}</div>
                        <div className="text-[10px] text-slate-500">{h.source} &middot; {h.scored_at}</div>
                      </div>
                      <span className="text-xs font-bold px-2 py-1 rounded-full bg-white/5">{h.score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ LIST VIEW ══ */}
        {view === 'list' && (
          <div className="space-y-2">
            {[...SKILLS].sort((a, b) => b.score - a.score).map(s => (
              <button key={s.id} onClick={() => { setSel(s.id); setView('orbit') }}
                className="w-full flex items-center gap-3 rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4 text-left transition hover:bg-white/10">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: s.score > 0 ? proficiencyColor(s.score) : 'rgba(100,116,139,0.3)' }}>
                  <span className="text-[10px] sm:text-xs font-black text-white">{s.score || '?'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{s.name}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-slate-500">{s.skill_type === 'implicit' ? 'transferable' : 'foundational'}</span>
                    {s.trajectory && <span className="text-[10px]">{trendEmoji(s.trajectory.trend)}</span>}
                  </div>
                </div>
                <div className="w-16 sm:w-24 h-1.5 rounded-full bg-white/10 overflow-hidden flex-shrink-0">
                  <div className="h-full rounded-full" style={{ width: `${s.score}%`, background: proficiencyColor(s.score) }} />
                </div>
                <span className="text-sm font-bold w-8 text-right">{s.score}%</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
