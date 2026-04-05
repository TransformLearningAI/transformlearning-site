'use client'
import { useState } from 'react'
import { proficiencyLabel, proficiencyColor } from '@/lib/utils/proficiency'
import Link from 'next/link'

/* ═══ MOCK DATA ══════════════════════════════════════════════════════ */

const SKILLS = [
  { id: '1', name: 'Cellular Physiology', skill_type: 'explicit', score: 72, evidence: 'Shows strong understanding of cellular mechanisms. Able to connect molecular events to tissue-level function.', confidence: 0.72, interval: { lower: 64, estimate: 72, upper: 80, reliability: 'moderate' }, trajectory: { trend: 'improving', velocity: 3.2, isGenuine: true, description: 'Steady improvement. Gaining 3.2 points per assessment.' }, sourceBreakdown: { quiz: { count: 3, avgScore: 70 }, assessment: { count: 1, avgScore: 65 }, upload: { count: 1, avgScore: 78 } } },
  { id: '2', name: 'Membrane Transport', skill_type: 'explicit', score: 58, evidence: 'Understands passive transport well. Active transport mechanisms need reinforcement.', confidence: 0.55, interval: { lower: 48, estimate: 58, upper: 68, reliability: 'moderate' }, trajectory: { trend: 'improving', velocity: 2.1, isGenuine: true, description: 'Gaining 2.1 points per assessment.' }, sourceBreakdown: { quiz: { count: 2, avgScore: 55 }, assessment: { count: 1, avgScore: 52 } } },
  { id: '3', name: 'Neurophysiology', skill_type: 'explicit', score: 34, evidence: 'Early-stage understanding. Struggles with action potential propagation.', confidence: 0.35, interval: { lower: 20, estimate: 34, upper: 48, reliability: 'low' }, trajectory: { trend: 'stable', velocity: 0.5, isGenuine: false, description: 'No significant growth. May need a different approach.' }, sourceBreakdown: { quiz: { count: 2, avgScore: 32 }, coaching: { count: 3, avgScore: 40 } } },
  { id: '4', name: 'Cardiovascular', skill_type: 'explicit', score: 88, evidence: 'Strong mastery. Can explain cardiac cycle, pressure dynamics, and regulation.', confidence: 0.85, interval: { lower: 82, estimate: 88, upper: 94, reliability: 'high' }, trajectory: { trend: 'accelerating', velocity: 5.8, isGenuine: true, description: 'Strong upward trajectory. Learning is genuine and sustained.' }, sourceBreakdown: { quiz: { count: 4, avgScore: 86 }, upload: { count: 2, avgScore: 91 } } },
  { id: '5', name: 'Respiratory', skill_type: 'explicit', score: 41, evidence: 'Developing. Understands gas exchange but not ventilation-perfusion matching.', confidence: 0.40, interval: { lower: 28, estimate: 41, upper: 54, reliability: 'low' }, trajectory: { trend: 'slipping', velocity: -1.5, isGenuine: false, description: 'Declining by 1.5 points per assessment. Intervention recommended.' }, sourceBreakdown: { quiz: { count: 2, avgScore: 40 } } },
  { id: '6', name: 'Renal Physiology', skill_type: 'explicit', score: 0, evidence: null, confidence: 0, interval: null, trajectory: null, sourceBreakdown: {} },
  { id: '7', name: 'Endocrine System', skill_type: 'explicit', score: 22, evidence: 'Knows major hormones but cannot articulate feedback loops.', confidence: 0.20, interval: { lower: 8, estimate: 22, upper: 40, reliability: 'low' }, trajectory: { trend: 'stable', velocity: 0.3, isGenuine: false, description: 'Stable. May need a different approach.' }, sourceBreakdown: { assessment: { count: 1, avgScore: 22 } } },
  { id: '8', name: 'Homeostasis', skill_type: 'explicit', score: 67, evidence: 'Good conceptual grasp. Can identify disruptions but not always predict compensatory responses.', confidence: 0.62, interval: { lower: 58, estimate: 67, upper: 76, reliability: 'moderate' }, trajectory: { trend: 'improving', velocity: 1.8, isGenuine: true, description: 'Steady progress.' }, sourceBreakdown: { quiz: { count: 3, avgScore: 65 }, upload: { count: 1, avgScore: 72 } } },
  { id: '9', name: 'Critical Thinking', skill_type: 'implicit', score: 55, evidence: 'Demonstrates analytical reasoning but needs practice connecting cause and effect.', confidence: 0.48, interval: { lower: 43, estimate: 55, upper: 67, reliability: 'low' }, trajectory: { trend: 'improving', velocity: 1.2, isGenuine: false, description: 'Some variability in scores.' }, sourceBreakdown: { quiz: { count: 1, avgScore: 50 }, upload: { count: 2, avgScore: 58 } } },
  { id: '10', name: 'Systems Thinking', skill_type: 'implicit', score: 71, evidence: 'Emerging strength. Can describe how organ systems interact.', confidence: 0.68, interval: { lower: 63, estimate: 71, upper: 79, reliability: 'moderate' }, trajectory: { trend: 'accelerating', velocity: 5.2, isGenuine: true, description: 'Strong trajectory. Genuine and sustained.' }, sourceBreakdown: { quiz: { count: 2, avgScore: 68 }, upload: { count: 2, avgScore: 74 } } },
  { id: '11', name: 'Scientific Comm.', skill_type: 'implicit', score: 38, evidence: 'Writing is clear but lacks precision in terminology.', confidence: 0.32, interval: { lower: 22, estimate: 38, upper: 54, reliability: 'low' }, trajectory: { trend: 'stable', velocity: -0.3, isGenuine: false, description: 'Slight decline detected.' }, sourceBreakdown: { upload: { count: 2, avgScore: 38 } } },
  { id: '12', name: 'Problem Solving', skill_type: 'implicit', score: 48, evidence: 'Can work through structured problems but struggles with novel scenarios.', confidence: 0.44, interval: { lower: 36, estimate: 48, upper: 60, reliability: 'low' }, trajectory: { trend: 'improving', velocity: 1.5, isGenuine: false, description: 'Some variability.' }, sourceBreakdown: { quiz: { count: 2, avgScore: 46 } } },
  { id: '13', name: 'Self-Regulation', skill_type: 'implicit', score: 0, evidence: null, confidence: 0, interval: null, trajectory: null, sourceBreakdown: {} },
  { id: '14', name: 'Experimental Design', skill_type: 'implicit', score: 15, evidence: 'Very early. Understands hypothesis formation but not controlled variable design.', confidence: 0.15, interval: { lower: 0, estimate: 15, upper: 38, reliability: 'low' }, trajectory: null, sourceBreakdown: { assessment: { count: 1, avgScore: 15 } } },
]

const HISTORY = [
  { skill_name: 'Cardiovascular', score: 88, source: 'quiz', date: 'Nov 12' },
  { skill_name: 'Cellular Physiology', score: 72, source: 'upload', date: 'Nov 10' },
  { skill_name: 'Systems Thinking', score: 71, source: 'quiz', date: 'Nov 8' },
  { skill_name: 'Homeostasis', score: 67, source: 'quiz', date: 'Nov 6' },
  { skill_name: 'Membrane Transport', score: 58, source: 'quiz', date: 'Nov 4' },
  { skill_name: 'Critical Thinking', score: 55, source: 'upload', date: 'Nov 2' },
]

const QUESTS = [
  { title: "Decode This Week's Material", points: 90, time: '12 min', desc: 'The coach translates your course material into hidden skills and suggests what evidence to capture.', tag: 'Today' },
  { title: 'Reflection Sprint', points: 60, time: '8 min', desc: 'Three fast prompts turn your reflection into measurable growth signals.', tag: 'Fast win' },
  { title: 'Evidence Power-Up', points: 120, time: '20 min', desc: 'Upload a paper or assignment and watch the platform map it to skills.', tag: 'Recommended' },
]

function trendEmoji(t) { return t === 'accelerating' ? '\uD83D\uDE80' : t === 'improving' ? '\uD83D\uDCC8' : t === 'stable' ? '\u27A1\uFE0F' : '\uD83D\uDCC9' }
function trendColor(t) { return t === 'accelerating' || t === 'improving' ? '#4ADE80' : t === 'stable' ? '#FBBF24' : '#FB7185' }

/* ═══ Page ════════════════════════════════════════════════════════════ */

export default function DemoPage() {
  const [sel, setSel] = useState(null)
  const [view, setView] = useState('dashboard')

  const overall = Math.round(SKILLS.reduce((a, s) => a + s.score, 0) / SKILLS.length)
  const mastered = SKILLS.filter(s => s.score >= 80).length
  const evidenceCount = SKILLS.filter(s => s.evidence).length
  const weakest = [...SKILLS].sort((a, b) => a.score - b.score).slice(0, 3)
  const selected = sel ? SKILLS.find(s => s.id === sel) : null

  return (
    <div className="min-h-screen text-white" style={{ background: '#020617' }}>
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at top right, rgba(34,211,238,0.1), transparent 40%), radial-gradient(circle at bottom left, rgba(168,85,247,0.08), transparent 40%)' }} />

      {/* Banner */}
      <div className="relative z-10 text-center py-2 text-[11px] font-bold text-white/50 px-4" style={{ background: 'rgba(167,139,250,0.1)', borderBottom: '1px solid rgba(167,139,250,0.15)' }}>
        DEMO &middot; Student Dashboard &middot;{' '}
        <Link href="/" className="underline opacity-70 hover:opacity-100">Back to site</Link>
        {' '}&middot;{' '}
        <Link href="/blog" className="underline opacity-70 hover:opacity-100">Blog</Link>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-4 sm:py-6">

        {/* Header */}
        <div className="mb-4 sm:mb-6 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black" style={{ background: 'linear-gradient(135deg, #00A8A8, #0C1F3F)' }}>JM</div>
                <div>
                  <div className="text-base sm:text-lg font-bold tracking-tight">Jordan Mitchell</div>
                  <div className="text-[10px] text-slate-400">Pre-Med &middot; Sophomore</div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-200">BSC3096 &middot; Fall 2025</span>
                <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-200">Lv 3 &middot; Learner &middot; 1340 XP</span>
              </div>
              <h1 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight">Human Physiology</h1>
            </div>
            <div className="flex gap-2">
              {[{ key: 'dashboard', label: 'Dashboard' }, { key: 'skills', label: 'All Skills' }, { key: 'evidence', label: 'Evidence' }].map(v => (
                <button key={v.key} onClick={() => { setView(v.key); if (v.key !== 'dashboard') setSel(null) }}
                  className={`px-3 py-1.5 rounded-xl text-xs transition ${view === v.key ? 'bg-white text-slate-950 font-bold' : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'}`}>
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ══ DASHBOARD VIEW ══ */}
        {view === 'dashboard' && (
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1fr_340px]">
            <div className="space-y-4 sm:space-y-6">

              {/* Skill Cards Grid */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold">Skills</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Tap any skill to see details</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl sm:text-3xl font-bold text-cyan-300">{overall}%</div>
                    <div className="text-[10px] text-slate-400">Overall</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                  {SKILLS.map(s => {
                    const active = sel === s.id
                    return (
                      <button key={s.id} onClick={() => setSel(active ? null : s.id)}
                        className={`rounded-xl p-3 sm:p-4 text-left transition-all ${active ? 'ring-2 ring-cyan-400 bg-white/10' : 'bg-white/[0.03] hover:bg-white/[0.06]'} border border-white/[0.06]`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                            style={{ background: s.skill_type === 'implicit' ? 'rgba(167,139,250,0.15)' : 'rgba(34,211,238,0.15)', color: s.skill_type === 'implicit' ? '#C4B5FD' : '#67E8F9' }}>
                            {s.skill_type === 'implicit' ? 'trans' : 'found'}
                          </span>
                          {s.trajectory && <span className="text-[10px]">{trendEmoji(s.trajectory.trend)}</span>}
                        </div>
                        <p className="text-xs sm:text-sm font-medium truncate mb-2">{s.name}</p>
                        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mb-1.5">
                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${s.score}%`, background: proficiencyColor(s.score) }} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg sm:text-xl font-black">{s.score}%</span>
                          <span className="text-[9px] text-slate-500">{s.score > 0 ? proficiencyLabel(s.score) : 'Uncharted'}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Selected Skill Detail (inline on mobile) */}
              {selected && (
                <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 sm:p-5 lg:hidden">
                  <button onClick={() => setSel(null)} className="text-xs text-white/30 hover:text-white/60 mb-2 block">Close</button>
                  <SkillDetail skill={selected} />
                </div>
              )}

              {/* Evidence Studio + Learning Coach */}
              <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 backdrop-blur-xl">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm sm:text-base font-semibold">Evidence Studio</h3>
                    <button className="rounded-xl bg-white px-3 py-1.5 text-xs font-semibold text-slate-900">Upload</button>
                  </div>
                  <div className="space-y-2">
                    {HISTORY.slice(0, 4).map((h, i) => (
                      <div key={i} className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/70 p-3">
                        <div>
                          <div className="text-xs font-medium">{h.skill_name}</div>
                          <div className="text-[10px] text-slate-500">{h.source} &middot; {h.date}</div>
                        </div>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/5">{h.score}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 backdrop-blur-xl">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm sm:text-base font-semibold">Learning Coach</h3>
                    <span className="text-[10px] font-semibold px-2 py-1 rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 text-fuchsia-200">AI</span>
                  </div>
                  <div className="space-y-2">
                    {weakest.slice(0, 3).map((s, i) => (
                      <div key={s.id} className="rounded-xl border border-white/10 bg-slate-900/70 p-3">
                        <div className="text-[9px] font-semibold uppercase tracking-wider text-cyan-300 mb-1">Note {i + 1}</div>
                        <div className="text-xs text-slate-300">
                          {s.score === 0 ? `${s.name} is unexplored. A single quiz will reveal where you stand.` : `Your ${s.name} shows early signals at ${s.score}%. Targeted practice could move this.`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right sidebar */}
            <aside className="space-y-4 sm:space-y-5">
              {/* Skill detail on desktop */}
              {selected ? (
                <div className="hidden lg:block rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                  <button onClick={() => setSel(null)} className="text-xs text-white/30 hover:text-white/60 mb-2 block">Close</button>
                  <SkillDetail skill={selected} />
                </div>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                  <p className="text-sm text-slate-400 mb-3">Tap a skill card to see details</p>
                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div className="rounded-xl bg-white/5 p-3"><div className="text-xl font-bold">{SKILLS.length}</div><div className="text-[10px] text-slate-400">Skills</div></div>
                    <div className="rounded-xl bg-white/5 p-3"><div className="text-xl font-bold">{evidenceCount}</div><div className="text-[10px] text-slate-400">Evidence</div></div>
                    <div className="rounded-xl bg-white/5 p-3"><div className="text-xl font-bold">{mastered}</div><div className="text-[10px] text-slate-400">Mastered</div></div>
                  </div>
                </div>
              )}

              {/* Momentum */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                <div className="text-sm text-slate-400">Momentum</div>
                <div className="mt-1 text-4xl font-bold">{overall}</div>
                <div className="mt-1 text-xs text-cyan-300">{overall > 50 ? 'Ahead of growth target' : 'Building momentum'}</div>
              </div>

              {/* Quest Board */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 backdrop-blur-xl">
                <h3 className="text-sm sm:text-base font-semibold mb-1">Quest Board</h3>
                <p className="text-[10px] text-slate-400 mb-4">Small actions that build momentum.</p>
                <div className="space-y-3">
                  {QUESTS.map(q => (
                    <div key={q.title} className="rounded-xl border border-white/10 bg-slate-900/70 p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-200">{q.tag}</span>
                        <span className="text-[10px] text-slate-500">{q.time}</span>
                      </div>
                      <h4 className="text-xs font-semibold mb-1">{q.title}</h4>
                      <p className="text-[10px] text-slate-400 leading-relaxed mb-2">{q.desc}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-cyan-300">+{q.points} XP</span>
                        <button className="text-[10px] font-medium px-2.5 py-1 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10">Start</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Governance */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-xs font-semibold text-emerald-300">Governed Intelligence</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">Every AI decision passes through fairness, confidence, and privacy constraints.</p>
                <div className="mt-2 grid grid-cols-3 gap-1.5">
                  {['Fairness', 'Confidence', 'Privacy'].map(g => (
                    <div key={g} className="rounded-lg bg-white/5 p-1.5 text-center">
                      <div className="text-[9px] text-slate-500">{g}</div>
                      <div className="text-[9px] font-bold text-emerald-400">{'\u2713'}</div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* ══ ALL SKILLS VIEW ══ */}
        {view === 'skills' && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...SKILLS].sort((a, b) => b.score - a.score).map(s => (
              <button key={s.id} onClick={() => { setSel(s.id); setView('dashboard') }}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 text-left transition hover:bg-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ background: s.skill_type === 'implicit' ? 'rgba(167,139,250,0.15)' : 'rgba(34,211,238,0.15)', color: s.skill_type === 'implicit' ? '#C4B5FD' : '#67E8F9' }}>
                    {s.skill_type === 'implicit' ? 'transferable' : 'foundational'}
                  </span>
                  {s.trajectory && <span className="text-xs">{trendEmoji(s.trajectory.trend)}</span>}
                </div>
                <h3 className="font-semibold text-sm sm:text-base mb-2">{s.name}</h3>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden mb-2">
                  <div className="h-full rounded-full" style={{ width: `${s.score}%`, background: proficiencyColor(s.score) }} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">{s.score > 0 ? proficiencyLabel(s.score) : 'Uncharted'}</span>
                  <span className="font-bold">{s.score}%</span>
                </div>
                {s.confidence > 0 && (
                  <div className="mt-1 text-[10px] text-slate-500">
                    Confidence: {Math.round(s.confidence * 100)}%
                    {s.interval && <span className="ml-2" style={{ color: s.interval.reliability === 'high' ? '#4ADE80' : s.interval.reliability === 'moderate' ? '#FBBF24' : '#FB7185' }}>{s.interval.reliability}</span>}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* ══ EVIDENCE VIEW ══ */}
        {view === 'evidence' && (
          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-semibold">Evidence Studio</h2>
                <button className="rounded-xl bg-white px-4 py-2 text-xs font-semibold text-slate-900">Upload Work</button>
              </div>
              <div className="space-y-3">
                {HISTORY.map((h, i) => (
                  <div key={i} className="rounded-xl border border-white/10 bg-slate-900/70 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium">{h.skill_name}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{h.source} &middot; {h.date}</div>
                        {SKILLS.find(s => s.evidence && h.skill_name === s.name)?.evidence && (
                          <p className="mt-2 text-xs text-slate-300 leading-relaxed">{SKILLS.find(s => h.skill_name === s.name)?.evidence}</p>
                        )}
                      </div>
                      <span className="text-sm font-bold px-2.5 py-1 rounded-full bg-white/5">{h.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ═══ Skill Detail Component ═════════════════════════════════════════ */

function SkillDetail({ skill }) {
  return (
    <>
      <h3 className="text-xl font-semibold">{skill.name}</h3>
      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 inline-block"
        style={{ background: skill.skill_type === 'implicit' ? 'rgba(167,139,250,0.15)' : 'rgba(34,211,238,0.15)', color: skill.skill_type === 'implicit' ? '#C4B5FD' : '#67E8F9' }}>
        {skill.skill_type === 'implicit' ? 'transferable' : 'foundational'}
      </span>

      <div className="mt-4 h-3 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${skill.score}%`, background: proficiencyColor(skill.score) }} />
      </div>
      <div className="mt-2 flex justify-between text-sm">
        <span className="text-slate-400">Proficiency</span>
        <span className="font-bold">{skill.score}% &middot; {proficiencyLabel(skill.score)}</span>
      </div>

      {skill.interval && (
        <div className="mt-3">
          <div className="text-[9px] font-bold uppercase tracking-wider text-white/20 mb-1">Confidence Interval</div>
          <div className="relative h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="absolute h-full rounded-full" style={{ left: `${skill.interval.lower}%`, width: `${skill.interval.upper - skill.interval.lower}%`, background: 'rgba(0,206,209,0.2)' }} />
            <div className="absolute h-full w-1 rounded-full" style={{ left: `${skill.score}%`, background: '#00CED1' }} />
          </div>
          <div className="flex justify-between text-[9px] text-white/20 mt-1">
            <span>{skill.interval.lower}%</span>
            <span style={{ color: skill.interval.reliability === 'high' ? '#4ADE80' : skill.interval.reliability === 'moderate' ? '#FBBF24' : '#FB7185' }}>{skill.interval.reliability}</span>
            <span>{skill.interval.upper}%</span>
          </div>
        </div>
      )}

      {skill.trajectory && (
        <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-2 mb-1">
            <span>{trendEmoji(skill.trajectory.trend)}</span>
            <span className="text-xs capitalize" style={{ color: trendColor(skill.trajectory.trend) }}>{skill.trajectory.trend}</span>
            {skill.trajectory.velocity !== 0 && (
              <span className="text-xs font-bold" style={{ color: skill.trajectory.velocity > 0 ? '#4ADE80' : '#FB7185' }}>
                {skill.trajectory.velocity > 0 ? '+' : ''}{skill.trajectory.velocity}/assessment
              </span>
            )}
          </div>
          <p className="text-[10px] text-white/30">{skill.trajectory.description}</p>
        </div>
      )}

      {skill.evidence && (
        <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="text-[9px] font-bold uppercase tracking-wider text-cyan-300 mb-1">AI Insight</div>
          <p className="text-xs text-slate-300 leading-relaxed">{skill.evidence}</p>
        </div>
      )}

      {skill.sourceBreakdown && Object.keys(skill.sourceBreakdown).length > 0 && (
        <div className="mt-3">
          <div className="text-[9px] font-bold uppercase tracking-wider text-white/20 mb-1">Sources</div>
          <div className="flex gap-2">
            {Object.entries(skill.sourceBreakdown).map(([src, data]) => (
              <div key={src} className="flex-1 rounded-lg p-2 text-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="text-[9px] font-bold text-white/50 capitalize">{src}</div>
                <div className="text-sm font-black text-cyan-300">{data.count}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button className="rounded-xl bg-white px-3 py-2.5 text-center font-semibold text-slate-950 text-xs">Practice</button>
        <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-center font-semibold text-white text-xs hover:bg-white/10">Ask Coach</button>
      </div>
    </>
  )
}
