'use client'
import { useState } from 'react'
import { proficiencyLabel, proficiencyColor } from '@/lib/utils/proficiency'
import Link from 'next/link'

const COURSE = { title: 'Calculus I', code: 'MATH 101', term: 'Fall 2026' }

const SKILLS = [
  { id: '1', name: 'Limits & Continuity',       type: 'explicit', score: 82, category: 'Differential Calculus' },
  { id: '2', name: 'Derivatives',                type: 'explicit', score: 58, category: 'Differential Calculus' },
  { id: '3', name: 'Integration Techniques',     type: 'explicit', score: 34, category: 'Integral Calculus'     },
  { id: '4', name: 'Optimization Problems',      type: 'explicit', score: 61, category: 'Applications'          },
  { id: '5', name: 'Fundamental Theorem',        type: 'explicit', score: 47, category: 'Integral Calculus'     },
  { id: '6', name: 'Curve Sketching',            type: 'explicit', score: 75, category: 'Applications'          },
  { id: '7', name: 'Related Rates',              type: 'explicit', score: 43, category: 'Applications'          },
  { id: '8', name: 'Problem Decomposition',      type: 'implicit', score: 55, category: 'Reasoning'             },
  { id: '9', name: 'Mathematical Reasoning',     type: 'implicit', score: 71, category: 'Reasoning'             },
  { id: '10', name: 'Precision & Notation',      type: 'implicit', score: 66, category: 'Communication'         },
  { id: '11', name: 'Proof Construction',        type: 'implicit', score: 38, category: 'Reasoning'             },
]

const CHAT_HISTORY = [
  { role: 'assistant', content: "Hi! I'm your coach for **Integration Techniques**. Your current proficiency is 34% — let's work on getting that higher. What would you like to understand better, or where do you feel stuck?" },
  { role: 'user',      content: "I don't really understand u-substitution. Every time I try it I get the wrong answer." },
  { role: 'assistant', content: "That's really common — u-sub trips most students up at first. The core idea: you're *renaming* part of the integral to simplify it.\n\nHere's the pattern:\n1. Spot something inside the integral whose **derivative also appears** (or can appear)\n2. Call that thing *u*\n3. Find *du*, substitute, and the integral becomes simpler\n\n**Quick example:** ∫2x·cos(x²)dx\n- Let u = x² → du = 2x dx\n- Substituting: ∫cos(u)du = sin(u) + C = sin(x²) + C\n\nWhat part breaks down for you — picking u, or solving after substitution?" },
  { role: 'user',      content: "I think picking u is the hard part" },
  { role: 'assistant', content: "Good — that's the right thing to focus on. Here's a rule of thumb that works 80% of the time:\n\n**Pick u = the \"inside\" of a composite function.**\n\nLook for things like:\n- cos(**x²**) → u = x²\n- e^(**3x**) → u = 3x\n- (x+1)^5 → u = x+1\n- √(**x²+1**) → u = x²+1\n\nThen check: does the derivative of u appear (or almost appear) elsewhere in the integral? If yes, you've found your u.\n\nWant to try one? Here: ∫x·e^(x²)dx — what would you pick for u?" },
]

const QUIZ = [
  { q: 'Which of the following is the correct u-substitution for ∫3x²·sin(x³)dx?', choices: ['u = sin(x³)', 'u = x³', 'u = 3x²', 'u = x²'], correct: 1, explanation: 'u = x³ works because its derivative du = 3x²dx appears in the integrand.' },
  { q: 'After substituting u = x² + 1 in ∫2x·(x²+1)⁴dx, what does the integral become?', choices: ['∫u⁴du', '∫2u⁴du', '∫u⁵du', '∫(u+1)⁴du'], correct: 0, explanation: 'du = 2x dx, so 2x dx = du. The integral becomes ∫u⁴du.' },
]

export default function DemoPage() {
  const [view, setView] = useState('dashboard') // dashboard | skill | chat | quiz | guide
  const [activeSkill, setActiveSkill] = useState(SKILLS[2]) // Integration Techniques
  const [tab, setTab] = useState('map')
  const [chatMsg, setChatMsg] = useState('')
  const [quizIdx, setQuizIdx] = useState(0)
  const [quizAnswer, setQuizAnswer] = useState(null)
  const [quizDone, setQuizDone] = useState(false)

  const overall = Math.round(SKILLS.reduce((s, k) => s + k.score, 0) / SKILLS.length)
  const atRisk = SKILLS.filter(s => s.score < 51)
  const explicit = SKILLS.filter(s => s.type === 'explicit')
  const implicit = SKILLS.filter(s => s.type === 'implicit')

  return (
    <div className="min-h-screen" style={{ background: '#F4F7FB' }}>
      {/* Demo banner */}
      <div className="text-center py-2.5 text-xs font-bold text-white" style={{ background: '#5A3E6B' }}>
        DEMO MODE — Student View &nbsp;·&nbsp; <Link href="/" className="underline opacity-70 hover:opacity-100">Back to site</Link>
        &nbsp;·&nbsp; <a href="/signup" className="underline opacity-70 hover:opacity-100">Sign up as Faculty →</a>
      </div>

      <div className="flex min-h-[calc(100vh-36px)]">
        {/* Sidebar */}
        <aside className="w-56 flex flex-col bg-navy hidden lg:flex">
          <div className="px-5 py-5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#00A8A8' }}>
                <span className="text-white font-bold text-xs">TL</span>
              </div>
              <span className="text-white font-semibold text-sm">Transform Learning</span>
            </div>
          </div>
          <nav className="flex-1 px-3 py-5 space-y-1">
            <button onClick={() => setView('dashboard')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-left transition-all ${view === 'dashboard' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'}`}>
              <span>◈</span> My Progress
            </button>
          </nav>
          <div className="px-4 py-4 border-t border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-brand-teal flex items-center justify-center text-white text-xs font-bold">J</div>
              <div>
                <p className="text-white text-xs font-semibold">Jordan Kim</p>
                <p className="text-white/40 text-[10px]">student</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col">
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-brand-teal flex items-center justify-center text-white text-xs font-bold">J</div>
              <span className="text-sm font-semibold text-navy hidden sm:block">Jordan Kim</span>
            </div>
          </header>

          <main className="flex-1 p-6 lg:p-8 max-w-5xl w-full mx-auto">

            {/* ── DASHBOARD ── */}
            {view === 'dashboard' && (
              <div>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">{COURSE.code} · {COURSE.term}</p>
                    <h1 className="font-serif font-light text-navy" style={{ fontSize: '32px', letterSpacing: '-0.02em' }}>{COURSE.title}</h1>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black" style={{ color: proficiencyColor(overall) }}>{overall}%</div>
                    <div className="text-xs text-gray-400">Overall proficiency</div>
                  </div>
                </div>

                {/* At-risk */}
                {atRisk.length > 0 && (
                  <div className="rounded-2xl px-5 py-4 mb-6 flex items-start gap-3"
                    style={{ background: 'rgba(255,107,74,0.07)', border: '1px solid rgba(255,107,74,0.2)' }}>
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#FF6B4A' }} />
                    <div>
                      <p className="text-sm font-bold text-navy mb-1">{atRisk.length} skills need attention</p>
                      <div className="flex flex-wrap gap-2">
                        {atRisk.map(s => (
                          <button key={s.id} onClick={() => { setActiveSkill(s); setView('skill') }}
                            className="text-xs font-medium px-2.5 py-1 rounded-full hover:opacity-80"
                            style={{ background: 'rgba(255,107,74,0.12)', color: '#FF6B4A' }}>
                            {s.name} — {s.score}%
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tabs */}
                <div className="flex gap-1 border-b border-gray-200 mb-6">
                  {['map', 'progress'].map(t => (
                    <button key={t} onClick={() => setTab(t)}
                      className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px capitalize transition-colors ${tab === t ? 'border-brand-teal text-navy' : 'border-transparent text-gray-400 hover:text-navy'}`}>
                      {t === 'map' ? 'Skill Map' : 'Progress Over Time'}
                    </button>
                  ))}
                </div>

                {tab === 'map' && (
                  <div className="space-y-8">
                    {[
                      { skills: explicit, label: 'Explicit Skills', desc: 'Subject-matter knowledge and procedures', color: '#00A8A8' },
                      { skills: implicit, label: 'Implicit Skills', desc: 'Reasoning, communication, and professional capabilities', color: '#5A3E6B' },
                    ].map(group => (
                      <div key={group.label}>
                        <div className="flex items-center gap-2 mb-4">
                          <h2 className="font-bold text-navy">{group.label}</h2>
                          <span className="text-xs text-gray-400">{group.desc}</span>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {group.skills.map(skill => {
                            const color = proficiencyColor(skill.score)
                            return (
                              <button key={skill.id} onClick={() => { setActiveSkill(skill); setView('skill') }}
                                className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all text-left w-full">
                                <div className="flex items-start justify-between mb-3">
                                  <p className="font-semibold text-navy text-sm leading-tight flex-1 pr-2">{skill.name}</p>
                                  <span className="text-lg font-black flex-shrink-0" style={{ color }}>{skill.score}%</span>
                                </div>
                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
                                  <div className="h-full rounded-full transition-all duration-700"
                                    style={{ width: `${skill.score}%`, background: color }} />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold" style={{ color }}>{proficiencyLabel(skill.score)}</span>
                                  <div className="flex gap-1.5">
                                    {['Chat', 'Quiz', 'Guide'].map(a => (
                                      <span key={a} className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                        style={{ background: group.color + '12', color: group.color }}>{a}</span>
                                    ))}
                                  </div>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {tab === 'progress' && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                    <p className="text-gray-400 text-sm">Progress chart shows trajectory over time as you complete quizzes and coaching sessions.</p>
                    <div className="mt-6 flex items-end justify-center gap-2 h-32">
                      {[30,38,42,50,47,58,62,67,63,72,70,74].map((h, i) => (
                        <div key={i} className="flex-1 rounded-t-sm max-w-[28px]"
                          style={{ height: `${h}%`, background: i < 10 ? 'rgba(0,168,168,0.3)' : '#00A8A8' }} />
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">12-week trajectory — Integration Techniques</p>
                  </div>
                )}
              </div>
            )}

            {/* ── SKILL DETAIL ── */}
            {view === 'skill' && activeSkill && (
              <div className="max-w-2xl">
                <button onClick={() => setView('dashboard')} className="text-xs text-gray-400 hover:text-navy mb-4 block">← Dashboard</button>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full mb-3 inline-block"
                      style={{ background: activeSkill.type === 'explicit' ? 'rgba(0,168,168,0.1)' : 'rgba(90,62,107,0.1)',
                               color: activeSkill.type === 'explicit' ? '#00A8A8' : '#5A3E6B' }}>
                      {activeSkill.type} skill
                    </span>
                    <h1 className="font-serif font-light text-navy" style={{ fontSize: '28px', letterSpacing: '-0.02em' }}>{activeSkill.name}</h1>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-3xl font-black" style={{ color: proficiencyColor(activeSkill.score) }}>{activeSkill.score}%</div>
                    <div className="text-xs font-bold mt-1" style={{ color: proficiencyColor(activeSkill.score) }}>{proficiencyLabel(activeSkill.score)}</div>
                  </div>
                </div>

                {activeSkill.score < 51 && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.1em] mb-2">Assessment evidence</p>
                    <p className="text-sm text-gray-600 leading-relaxed">Student attempted substitution problems but consistently chose the wrong expression for u. Shows understanding of the mechanic but not the selection heuristic. Notation errors suggest procedural gaps with differentials.</p>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-3 mb-6">
                  <button onClick={() => setView('chat')}
                    className="bg-navy text-white rounded-2xl p-5 text-center hover:opacity-90 transition-opacity">
                    <div className="text-2xl mb-2">💬</div>
                    <p className="font-bold text-sm">Coaching Chat</p>
                    <p className="text-xs text-white/50 mt-1">AI tutor for this skill</p>
                  </button>
                  <button onClick={() => { setQuizIdx(0); setQuizAnswer(null); setQuizDone(false); setView('quiz') }}
                    className="rounded-2xl p-5 text-center hover:opacity-90 transition-opacity"
                    style={{ background: '#00A8A8' }}>
                    <div className="text-2xl mb-2 text-white">◈</div>
                    <p className="font-bold text-sm text-white">Practice Quiz</p>
                    <p className="text-xs text-white/70 mt-1">Test and improve score</p>
                  </button>
                  <button onClick={() => setView('guide')}
                    className="rounded-2xl p-5 text-center hover:opacity-90 transition-opacity"
                    style={{ background: '#4F8A5B' }}>
                    <div className="text-2xl mb-2 text-white">📖</div>
                    <p className="font-bold text-sm text-white">Study Guide</p>
                    <p className="text-xs text-white/70 mt-1">AI-written just for you</p>
                  </button>
                </div>
              </div>
            )}

            {/* ── CHAT ── */}
            {view === 'chat' && (
              <div className="max-w-2xl flex flex-col" style={{ height: 'calc(100vh - 200px)' }}>
                <div className="bg-white rounded-t-2xl border border-gray-200 border-b-0 px-5 py-4 flex items-center justify-between">
                  <div>
                    <button onClick={() => setView('skill')} className="text-xs text-gray-400 hover:text-navy block mb-1">← {activeSkill?.name}</button>
                    <h1 className="font-bold text-navy">{activeSkill?.name} — Coaching</h1>
                    <p className="text-xs text-gray-400">Current proficiency: {activeSkill?.score}%</p>
                  </div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: '#00A8A8' }}>AI</div>
                </div>
                <div className="flex-1 overflow-y-auto bg-white border-x border-gray-200 px-5 py-4 space-y-4">
                  {CHAT_HISTORY.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user' ? 'text-white rounded-br-sm' : 'bg-gray-50 border border-gray-200 text-gray-700 rounded-bl-sm'}`}
                        style={msg.role === 'user' ? { background: '#0C1F3F' } : {}}
                        dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
                    </div>
                  ))}
                  <div className="flex justify-start">
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-gray-400 italic">
                      This is a demo — sign up to chat with the real AI coach →
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-b-2xl border border-gray-200 border-t px-4 py-3 flex gap-3">
                  <input value={chatMsg} onChange={e => setChatMsg(e.target.value)} placeholder="Ask a question…"
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-navy" />
                  <a href="/signup" className="px-5 py-2.5 rounded-xl font-bold text-sm text-white" style={{ background: '#00A8A8' }}>Sign up →</a>
                </div>
              </div>
            )}

            {/* ── QUIZ ── */}
            {view === 'quiz' && (
              <div className="max-w-2xl">
                <button onClick={() => setView('skill')} className="text-xs text-gray-400 hover:text-navy mb-4 block">← {activeSkill?.name}</button>
                {!quizDone ? (
                  <div className="bg-white rounded-2xl border border-gray-200 p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(quizIdx / QUIZ.length) * 100}%`, background: '#00A8A8' }} />
                      </div>
                      <span className="text-xs text-gray-400">{quizIdx + 1}/{QUIZ.length}</span>
                    </div>
                    <p className="font-semibold text-navy text-lg leading-relaxed mb-6">{QUIZ[quizIdx].q}</p>
                    <div className="space-y-3 mb-6">
                      {QUIZ[quizIdx].choices.map((c, i) => (
                        <button key={i} onClick={() => setQuizAnswer(i)}
                          className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm transition-all ${quizAnswer === i ? 'border-brand-teal font-medium' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                          style={quizAnswer === i ? { background: 'rgba(0,168,168,0.06)', color: '#0C1F3F' } : {}}>
                          {c}
                        </button>
                      ))}
                    </div>
                    {quizAnswer !== null && quizIdx < QUIZ.length - 1 && (
                      <button onClick={() => { setQuizIdx(i => i + 1); setQuizAnswer(null) }}
                        className="w-full py-3 rounded-xl font-bold text-sm text-white" style={{ background: '#00A8A8' }}>
                        Next →
                      </button>
                    )}
                    {quizAnswer !== null && quizIdx === QUIZ.length - 1 && (
                      <button onClick={() => setQuizDone(true)}
                        className="w-full py-3 rounded-xl font-bold text-sm text-white" style={{ background: '#4F8A5B' }}>
                        See Results →
                      </button>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center mb-4">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.1em] mb-3">Quiz Complete</p>
                      <div className="text-5xl font-black mb-2" style={{ color: '#00A8A8' }}>+12%</div>
                      <p className="font-bold text-navy">Integration Techniques: 34% → 46%</p>
                      <p className="text-sm text-gray-500 mt-2">Showed improvement in substitution selection. Practice more worked examples to solidify.</p>
                    </div>
                    <div className="space-y-3">
                      {QUIZ.map((q, i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 flex gap-3">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5 flex-shrink-0 bg-green-500">✓</div>
                          <p className="text-sm text-gray-600">{q.explanation}</p>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => setView('skill')} className="mt-4 w-full py-3 rounded-xl font-bold text-sm text-navy border border-gray-200">← Back to skill</button>
                  </div>
                )}
              </div>
            )}

            {/* ── STUDY GUIDE ── */}
            {view === 'guide' && (
              <div className="max-w-2xl">
                <button onClick={() => setView('skill')} className="text-xs text-gray-400 hover:text-navy mb-4 block">← {activeSkill?.name}</button>
                <div className="bg-white rounded-2xl border border-gray-200 p-8">
                  <h2 className="font-bold text-navy text-xl mb-1">Integration Techniques</h2>
                  <p className="text-xs text-gray-400 mb-6">Study guide · Calibrated to 34% proficiency · Explicit skill</p>

                  <h3 className="font-bold text-navy mb-2">Why This Matters</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-5">Integration is the mathematical language of accumulation — it underlies everything from physics (calculating displacement from velocity) to probability (finding areas under curves). Mastering integration techniques unlocks the second half of calculus and every course built on top of it.</p>

                  <h3 className="font-bold text-navy mb-2">Common Misconceptions at Your Level</h3>
                  <ul className="space-y-2 mb-5">
                    {['Thinking u-substitution always works (it doesn\'t — you need the derivative of u to appear)', 'Forgetting to change the bounds of integration when substituting in definite integrals', 'Treating du like a regular variable rather than a differential'].map((m, i) => (
                      <li key={i} className="flex gap-2 text-sm text-gray-600"><span className="text-brand-coral font-bold flex-shrink-0">✗</span>{m}</li>
                    ))}
                  </ul>

                  <h3 className="font-bold text-navy mb-2">Step-by-Step Framework: U-Substitution</h3>
                  <ol className="space-y-2 mb-5">
                    {['Identify a composite function inside the integral', 'Let u = the "inside" expression', 'Compute du/dx, then solve for dx', 'Substitute u and dx into the integral', 'Integrate with respect to u', 'Substitute back in terms of x'].map((s, i) => (
                      <li key={i} className="flex gap-2 text-sm text-gray-600"><span className="font-bold text-brand-teal w-4">{i + 1}.</span>{s}</li>
                    ))}
                  </ol>

                  <div className="rounded-xl p-4 text-center mt-6" style={{ background: 'rgba(0,168,168,0.06)', border: '1px solid rgba(0,168,168,0.15)' }}>
                    <p className="text-sm text-gray-500 mb-3">Sign up to get the full study guide with 3 worked examples and 5 self-check questions, generated for your exact proficiency level.</p>
                    <a href="/signup" className="inline-block px-6 py-2.5 rounded-xl font-bold text-sm text-white" style={{ background: '#00A8A8' }}>Get Full Study Guide →</a>
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  )
}
