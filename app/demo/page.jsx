'use client'
import { useState, useMemo } from 'react'
import { proficiencyLabel } from '@/lib/utils/proficiency'
import Link from 'next/link'

const SKILLS = [
  { id: '1', name: 'Cellular Physiology', type: 'explicit', score: 72, evidence: 'Shows strong understanding of cellular mechanisms. Able to connect molecular events to tissue-level function.' },
  { id: '2', name: 'Membrane Transport', type: 'explicit', score: 58, evidence: 'Understands passive transport well. Active transport mechanisms need reinforcement.' },
  { id: '3', name: 'Neurophysiology', type: 'explicit', score: 34, evidence: 'Early-stage understanding. Struggles with action potential propagation across synapses.' },
  { id: '4', name: 'Cardiovascular', type: 'explicit', score: 85, evidence: 'Strong mastery. Can explain cardiac cycle, pressure dynamics, and regulation mechanisms.' },
  { id: '5', name: 'Respiratory', type: 'explicit', score: 41, evidence: 'Developing. Understands gas exchange but not ventilation-perfusion matching.' },
  { id: '6', name: 'Renal Physiology', type: 'explicit', score: 0, evidence: null },
  { id: '7', name: 'Endocrine System', type: 'explicit', score: 22, evidence: 'Knows major hormones but cannot articulate feedback loops.' },
  { id: '8', name: 'Homeostasis', type: 'explicit', score: 67, evidence: 'Good conceptual grasp. Can identify disruptions but not always predict compensatory responses.' },
  { id: '9', name: 'Critical Thinking', type: 'implicit', score: 55, evidence: 'Demonstrates analytical reasoning but needs practice connecting cause and effect across systems.' },
  { id: '10', name: 'Systems Thinking', type: 'implicit', score: 71, evidence: 'Emerging strength. Can describe how organ systems interact.' },
  { id: '11', name: 'Scientific Comm.', type: 'implicit', score: 38, evidence: 'Writing is clear but lacks precision in terminology use.' },
  { id: '12', name: 'Problem Solving', type: 'implicit', score: 48, evidence: 'Can work through structured problems but struggles with novel scenarios.' },
  { id: '13', name: 'Self-Regulation', type: 'implicit', score: 0, evidence: null },
  { id: '14', name: 'Experimental Design', type: 'implicit', score: 15, evidence: 'Very early. Understands hypothesis formation but not controlled variable design.' },
]

const orbits = [
  'top-[8%] left-[6%]', 'top-[18%] right-[8%]', 'top-[38%] left-[16%]',
  'bottom-[14%] left-[10%]', 'bottom-[8%] right-[12%]', 'top-[50%] right-[3%]',
  'top-[12%] left-[40%]', 'bottom-[30%] left-[35%]', 'top-[30%] right-[30%]',
  'bottom-[20%] right-[28%]', 'top-[60%] left-[5%]', 'bottom-[5%] left-[40%]',
  'top-[5%] right-[35%]', 'top-[45%] left-[30%]',
]

const gradients = [
  'from-cyan-400 to-blue-500', 'from-violet-400 to-fuchsia-500', 'from-emerald-400 to-teal-500',
  'from-amber-400 to-orange-500', 'from-pink-400 to-rose-500', 'from-indigo-400 to-sky-500',
  'from-lime-400 to-green-500', 'from-fuchsia-400 to-purple-500', 'from-teal-400 to-cyan-500',
  'from-orange-400 to-red-500', 'from-sky-400 to-indigo-500', 'from-rose-400 to-pink-500',
  'from-cyan-400 to-emerald-500', 'from-purple-400 to-violet-500',
]

export default function DemoPage() {
  const [sel, setSel] = useState(null)
  const [view, setView] = useState('course')

  const overall = Math.round(SKILLS.reduce((a, s) => a + s.score, 0) / SKILLS.length)
  const mastered = SKILLS.filter(s => s.score >= 80).length
  const evidenceCount = SKILLS.filter(s => s.evidence).length
  const weakest = [...SKILLS].sort((a, b) => a.score - b.score).slice(0, 3)
  const selected = sel ? SKILLS.find(s => s.id === sel) : SKILLS[0]

  return (
    <div className="min-h-screen text-white" style={{ background: '#020617' }}>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.14),transparent_22%),radial-gradient(circle_at_left,rgba(168,85,247,0.16),transparent_26%)] pointer-events-none" />

      {/* Banner */}
      <div className="relative z-10 text-center py-2.5 text-xs font-bold text-white/70" style={{ background: 'rgba(167,139,250,0.12)', borderBottom: '1px solid rgba(167,139,250,0.2)' }}>
        DEMO — Arrival Skill Galaxy &nbsp;·&nbsp;
        <Link href="/" className="underline opacity-70 hover:opacity-100">Back to site</Link>
        &nbsp;·&nbsp; <a href="/signup" className="underline opacity-70 hover:opacity-100">Sign up →</a>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
              BSC3096 · Fall 2025
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight lg:text-3xl">Human Physiology</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            {['course', 'skills', 'evidence'].map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`rounded-2xl px-4 py-2 text-sm capitalize transition ${view === v ? 'bg-white text-slate-950 font-semibold' : 'border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'}`}>
                {v === 'course' ? '✦ Galaxy' : v === 'skills' ? '📊 Skills' : '📂 Evidence'}
              </button>
            ))}
          </div>
        </div>

        {view === 'course' && (
          <div className="grid gap-6 lg:grid-cols-12">
            <section className="space-y-6 lg:col-span-8">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold">Skill Galaxy</h2>
                    <p className="mt-1 text-sm text-slate-400">Click any star to explore it.</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-cyan-300">{overall}%</div>
                    <div className="text-xs text-slate-400">Overall</div>
                  </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
                  <div className="relative h-[28rem] overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.12),transparent_18%),radial-gradient(circle_at_30%_30%,rgba(168,85,247,0.14),transparent_20%)]" />
                    <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-center text-xs font-semibold text-cyan-100">
                      {mastered} mastered
                    </div>
                    {SKILLS.map((s, i) => (
                      <button key={s.id} onClick={() => setSel(s.id)}
                        className={`absolute ${orbits[i]} rounded-full border border-white/10 p-[1px] shadow-2xl transition-transform hover:scale-105 ${sel === s.id ? 'ring-2 ring-cyan-400 scale-110' : ''}`}>
                        <div className={`rounded-full bg-gradient-to-r ${gradients[i]} px-4 py-3 text-left ${s.score === 0 ? 'opacity-40' : ''}`}>
                          <div className="text-xs font-semibold text-white truncate max-w-[120px]">{s.type === 'implicit' ? '◇ ' : ''}{s.name}</div>
                          <div className="text-[10px] text-white/80">{s.score > 0 ? `${s.score}%` : 'uncharted'}</div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-5">
                    <div className="text-xs text-slate-400">Selected skill</div>
                    <h3 className="mt-2 text-2xl font-semibold">{selected?.name}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 inline-block"
                      style={{ background: selected?.type === 'implicit' ? 'rgba(167,139,250,0.15)' : 'rgba(34,211,238,0.15)', color: selected?.type === 'implicit' ? '#C4B5FD' : '#67E8F9' }}>
                      {selected?.type}
                    </span>
                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                      <div className={`h-full rounded-full bg-gradient-to-r ${gradients[SKILLS.indexOf(selected)]} transition-all duration-700`} style={{ width: `${selected?.score || 0}%` }} />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-slate-400">Proficiency</span>
                      <span className="font-bold">{selected?.score || 0}%</span>
                    </div>
                    {selected?.evidence && (
                      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 mb-2">AI Insight</div>
                        {selected.evidence}
                      </div>
                    )}
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <a href="/signup" className="rounded-2xl bg-white px-4 py-3 text-center font-semibold text-slate-950 text-sm">Practice</a>
                      <a href="/signup" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center font-semibold text-white text-sm">Ask Coach</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coach notes */}
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Learning Coach</h2>
                  <div className="rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 px-3 py-1 text-xs font-semibold text-fuchsia-200">Live AI</div>
                </div>
                <div className="space-y-3">
                  {[
                    'Your Cardiovascular mastery is strong. That analytical pattern could transfer to Respiratory — want to try?',
                    'Neurophysiology is your biggest gap. A 12-minute focused session could shift your signal significantly.',
                    'Your Systems Thinking score suggests you understand more than your quiz results show. Upload project work to capture that evidence.',
                  ].map((note, i) => (
                    <div key={i} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                      <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-cyan-300">Coach note {i + 1}</div>
                      <div className="text-sm text-slate-200">{note}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <aside className="space-y-6 lg:col-span-4">
              <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-5">
                <div className="text-sm text-slate-400">Momentum Score</div>
                <div className="mt-2 text-5xl font-bold">{overall}</div>
                <div className="mt-2 text-sm text-cyan-300">{overall > 50 ? 'Ahead of growth target' : 'Building momentum'}</div>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-5">
                <div className="text-sm text-slate-400">Skill Growth</div>
                <div className="mt-3 grid grid-cols-3 gap-3 text-center text-sm">
                  <div className="rounded-2xl bg-white/5 p-3"><div className="text-2xl font-bold">{SKILLS.length}</div><div className="text-slate-400 text-xs">Skills</div></div>
                  <div className="rounded-2xl bg-white/5 p-3"><div className="text-2xl font-bold">{evidenceCount}</div><div className="text-slate-400 text-xs">Evidence</div></div>
                  <div className="rounded-2xl bg-white/5 p-3"><div className="text-2xl font-bold">{mastered}</div><div className="text-slate-400 text-xs">Mastered</div></div>
                </div>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl">
                <h2 className="text-xl font-semibold">Quest Board</h2>
                <div className="mt-5 space-y-4">
                  {[
                    { title: "Decode This Week's Material", points: 90, time: '12 min', tag: 'Today' },
                    { title: 'Reflection Sprint', points: 60, time: '8 min', tag: 'Fast win' },
                    { title: 'Evidence Power-Up', points: 120, time: '20 min', tag: 'Recommended' },
                  ].map(q => (
                    <div key={q.title} className="rounded-3xl border border-white/10 bg-slate-900/70 p-4">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">{q.tag}</span>
                        <span className="text-xs text-slate-400">{q.time}</span>
                      </div>
                      <h3 className="mt-3 text-sm font-semibold">{q.title}</h3>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs font-semibold text-cyan-300">+{q.points} XP</span>
                        <a href="/signup" className="rounded-2xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium hover:bg-white/10">Start</a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[2rem] border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 via-blue-500/10 to-fuchsia-500/10 p-6">
                <h2 className="text-lg font-semibold">Knowledge Snapshot</h2>
                <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm text-slate-100">
                  "Your Cardiovascular mastery and emerging Systems Thinking suggest stronger analytical ability than quiz scores alone indicate. Upload project work to capture that evidence."
                </div>
              </div>
            </aside>
          </div>
        )}

        {view === 'skills' && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {SKILLS.map((s, i) => (
              <div key={s.id} onClick={() => { setSel(s.id); setView('course') }}
                className="rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition hover:bg-white/10 cursor-pointer">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ background: s.type === 'implicit' ? 'rgba(167,139,250,0.15)' : 'rgba(34,211,238,0.15)', color: s.type === 'implicit' ? '#C4B5FD' : '#67E8F9' }}>{s.type}</span>
                <h3 className="font-semibold text-white mt-3 mb-3">{s.name}</h3>
                <div className="h-2 overflow-hidden rounded-full bg-white/10 mb-2">
                  <div className={`h-full rounded-full bg-gradient-to-r ${gradients[i]} transition-all`} style={{ width: `${s.score}%` }} />
                </div>
                <div className="flex justify-between text-sm"><span className="text-slate-400">{s.score > 0 ? proficiencyLabel(s.score) : 'Uncharted'}</span><span className="font-bold">{s.score}%</span></div>
              </div>
            ))}
          </div>
        )}

        {view === 'evidence' && (
          <div className="max-w-3xl mx-auto rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Evidence Studio</h2>
              <a href="/signup" className="rounded-2xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900">Upload Work</a>
            </div>
            {SKILLS.filter(s => s.evidence).map((s, i) => (
              <div key={s.id} className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 mb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">{s.name}</div>
                    <div className="mt-1 text-sm text-slate-400">{s.type} skill</div>
                    <p className="mt-2 text-sm text-slate-300">{s.evidence}</p>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-bold">{s.score}%</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
