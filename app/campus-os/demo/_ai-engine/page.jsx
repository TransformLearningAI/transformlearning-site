'use client'

import { useState } from 'react'
import Link from 'next/link'

const NAVY = '#0C1F3F'
const TEAL = '#00A8A8'
const GREEN = '#4F8A5B'
const PLUM = '#5A3E6B'
const CORAL = '#FF6B4A'
const WARM_BG = '#FAF8F5'
const WARM_BORDER = '#EBE6E0'
const MUTED = '#6b635a'
const BODY = '#3a3530'
const serif = 'Georgia, serif'

/* Knowledge graph mock nodes */
const graphNodes = [
  { id: 'poly', label: 'Polynomial Division', x: 50, y: 20, color: TEAL, size: 28 },
  { id: 'long', label: 'Long Division', x: 30, y: 45, color: GREEN, size: 22 },
  { id: 'frac', label: 'Fraction Ops', x: 70, y: 50, color: CORAL, size: 22 },
  { id: 'vars', label: 'Variables', x: 15, y: 70, color: PLUM, size: 18 },
  { id: 'order', label: 'Order of Ops', x: 50, y: 75, color: TEAL, size: 18 },
  { id: 'factor', label: 'Factoring', x: 82, y: 30, color: GREEN, size: 20 },
  { id: 'expr', label: 'Expressions', x: 85, y: 70, color: PLUM, size: 18 },
]
const graphEdges = [
  ['poly', 'long'], ['poly', 'frac'], ['poly', 'factor'],
  ['long', 'vars'], ['long', 'order'], ['frac', 'order'],
  ['frac', 'expr'], ['factor', 'expr'], ['vars', 'order'],
]

/* Evidence map student skills */
const evidenceSkills = [
  { name: 'Cell Division', status: 'mastered', pct: 94, color: GREEN },
  { name: 'DNA Replication', status: 'mastered', pct: 88, color: GREEN },
  { name: 'Protein Synthesis', status: 'in-progress', pct: 62, color: '#D4A017' },
  { name: 'Membrane Transport', status: 'gap', pct: 23, color: CORAL },
  { name: 'Cell Signaling', status: 'gap', pct: 18, color: CORAL },
  { name: 'Osmotic Regulation', status: 'not-assessed', pct: 0, color: '#ccc' },
  { name: 'Enzyme Kinetics', status: 'not-assessed', pct: 0, color: '#ccc' },
]

/* Agent modes */
const agentModes = [
  { title: 'Diagnostician', color: TEAL, desc: 'Pure assessment. Precision questioning. Finds the exact gap without teaching — maps the student\'s knowledge state against the graph.', example: '"Can you walk me through what happens when a sodium ion encounters a cell membrane?"' },
  { title: 'Socratic Tutor', color: PLUM, desc: 'Blends assessment with teaching. Guided inquiry. Asks questions that lead the student to discover the answer themselves.', example: '"You said the ion passes through freely. What would happen if that were true — would cells need energy to maintain ion gradients?"' },
  { title: 'Direct Instructor', color: GREEN, desc: 'Identifies the gap, explains directly, then confirms understanding. Efficient for foundational skills where discovery learning is too slow.', example: '"Membrane transport requires energy because ions move against their concentration gradient. This is called active transport. Can you explain why this matters for nerve signals?"' },
]

/* Handoff triggers */
const handoffs = [
  { trigger: '3+ failed attempts, AI confidence < 20%', target: 'Practitioner Guide', color: TEAL },
  { trigger: 'Engagement drop > 60%, behavioral flags', target: 'Resilience Mentor', color: NAVY },
  { trigger: 'Student explicitly requests human', target: 'Nearest available guide', color: GREEN },
  { trigger: 'Physical demonstration required', target: 'Master Craftsperson', color: CORAL },
  { trigger: 'Argumentation / values debate needed', target: 'Socratic Provocateur', color: PLUM },
  { trigger: 'Strong cross-domain competency cluster', target: 'Integration Coach', color: GREEN },
]

/* Synthetic learner personas */
const personas = [
  { name: 'Confident but Wrong', desc: 'Argues back with incorrect reasoning', color: CORAL },
  { name: 'Silent Struggler', desc: "Won't reveal confusion, says 'I'm fine'", color: NAVY },
  { name: 'Grade Optimizer', desc: 'Just wants the answer, resists the process', color: PLUM },
  { name: 'Eager Novice', desc: 'Enthusiastic but overwhelmed', color: TEAL },
  { name: 'Capable but Disengaged', desc: 'Knows the material, won\'t engage', color: '#999' },
  { name: 'Anxious Perfectionist', desc: "Freezes, won't attempt without certainty", color: GREEN },
  { name: 'ESL Learner', desc: 'Understanding exceeds ability to express it', color: CORAL },
]

export default function AIEnginePage() {
  const [activeTab, setActiveTab] = useState(0)

  const tabs = [
    { label: 'The Board', sublabel: 'Knowledge Graph' },
    { label: 'Win Conditions', sublabel: 'Mastery Criteria' },
    { label: 'Rules of the Game', sublabel: 'Agent Behavior' },
    { label: 'Feedback Loop', sublabel: 'Evidence Map' },
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: WARM_BG }}>
      <nav className="border-b bg-white" style={{ borderColor: WARM_BORDER }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight" style={{ color: NAVY }}>
            transform<span style={{ color: TEAL }}>learning</span>
          </Link>
          <Link href="/campus-os/demo" className="text-sm font-medium hover:underline" style={{ color: NAVY }}>&larr; All Demos</Link>
        </div>
      </nav>

      <header className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-4" style={{ color: TEAL }}>Campus OS</p>
        <h1 className="tracking-tight leading-tight mb-4" style={{ fontFamily: serif, color: NAVY, fontSize: 'clamp(36px, 5vw, 56px)', letterSpacing: '-0.03em' }}>
          The AI Instruction Engine
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: MUTED }}>
          How a machine learns to teach. Four components. Proven fidelity.
        </p>
      </header>

      {/* Four Components — Tabbed */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(i)}
              className="px-5 py-3 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: activeTab === i ? NAVY : 'white',
                color: activeTab === i ? 'white' : NAVY,
                border: `1px solid ${activeTab === i ? NAVY : WARM_BORDER}`,
              }}
            >
              <span className="block font-bold">{tab.label}</span>
              <span className="block text-xs opacity-60">{tab.sublabel}</span>
            </button>
          ))}
        </div>

        {/* Tab 0: Knowledge Graph */}
        {activeTab === 0 && (
          <div className="rounded-xl border bg-white p-8" style={{ borderColor: WARM_BORDER }}>
            <h3 className="text-xl font-bold mb-2" style={{ color: NAVY }}>The Board — Knowledge Graph</h3>
            <p className="text-sm mb-6" style={{ color: MUTED }}>Every concept, every skill, every prerequisite relationship — mapped. The AI traverses this graph to diagnose gaps and sequence learning.</p>
            <div className="relative rounded-lg p-6 mb-6" style={{ backgroundColor: NAVY, minHeight: 320 }}>
              <svg className="w-full h-full absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                {graphEdges.map(([from, to], i) => {
                  const a = graphNodes.find(n => n.id === from)
                  const b = graphNodes.find(n => n.id === to)
                  return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="rgba(0,168,168,0.2)" strokeWidth="0.3" />
                })}
                {graphNodes.map(node => (
                  <g key={node.id}>
                    <circle cx={node.x} cy={node.y} r={node.size / 8} fill={node.color + '40'} stroke={node.color} strokeWidth="0.4" />
                    <text x={node.x} y={node.y + node.size / 8 + 4} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="2.8" fontFamily="sans-serif">{node.label}</text>
                  </g>
                ))}
              </svg>
            </div>
            <p className="text-xs text-center" style={{ color: MUTED }}>Prerequisite relationships: Polynomial Division requires Long Division + Fraction Ops + Factoring. A gap in fractions breaks everything above it.</p>
          </div>
        )}

        {/* Tab 1: Mastery Criteria */}
        {activeTab === 1 && (
          <div className="rounded-xl border bg-white p-8" style={{ borderColor: WARM_BORDER }}>
            <h3 className="text-xl font-bold mb-2" style={{ color: NAVY }}>Win Conditions — Mastery Criteria</h3>
            <p className="text-sm mb-6" style={{ color: MUTED }}>What does &ldquo;understanding&rdquo; actually look like? AI-readable rubrics at every node in the knowledge graph.</p>
            {[
              { skill: 'Fraction Operations', criteria: 'Can simplify, add, subtract, multiply, and divide fractions with unlike denominators without procedural error. Can explain why the operations work, not just perform them.', color: CORAL },
              { skill: 'Thesis Construction', criteria: 'Can articulate a defensible claim, provide 3+ supporting arguments with evidence, anticipate and address at least one counterargument, and maintain logical coherence across 500+ words.', color: PLUM },
              { skill: 'Membrane Transport', criteria: 'Can distinguish active from passive transport, explain the role of ATP in active transport, predict the direction of osmotic flow given solute concentrations, and diagram a sodium-potassium pump cycle.', color: TEAL },
            ].map(item => (
              <div key={item.skill} className="rounded-lg border p-5 mb-4" style={{ borderColor: item.color + '30', backgroundColor: item.color + '06' }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <h4 className="font-bold text-sm" style={{ color: NAVY }}>{item.skill}</h4>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: BODY }}>{item.criteria}</p>
              </div>
            ))}
            <p className="text-xs mt-4" style={{ color: MUTED }}>Not &ldquo;got 80% on the test.&rdquo; Specific, observable, assessable at the skill level.</p>
          </div>
        )}

        {/* Tab 2: Agent Behavior */}
        {activeTab === 2 && (
          <div className="rounded-xl border bg-white p-8" style={{ borderColor: WARM_BORDER }}>
            <h3 className="text-xl font-bold mb-2" style={{ color: NAVY }}>Rules of the Game — Agent Behavior</h3>
            <p className="text-sm mb-6" style={{ color: MUTED }}>How the AI teaches — not just what it says. Pedagogical instructions embedded in every interaction.</p>
            <div className="rounded-lg p-5 mb-6 font-mono text-xs leading-relaxed" style={{ backgroundColor: NAVY, color: TEAL }}>
              <p className="text-white/40 mb-2"># Pedagogical constraints</p>
              <p className="mb-1"><span className="text-white/60">1.</span> Ask before telling — never give the answer directly</p>
              <p className="mb-1"><span className="text-white/60">2.</span> When student is confident but wrong, present contradicting evidence</p>
              <p className="mb-1"><span className="text-white/60">3.</span> Fade scaffolding after 2 consecutive correct demonstrations</p>
              <p className="mb-1"><span className="text-white/60">4.</span> Never claim personhood or shared experience</p>
              <p className="mb-1"><span className="text-white/60">5.</span> Maintain position when student pushes back incorrectly</p>
              <p className="mb-3"><span className="text-white/60">6.</span> Escalate to human guide when confidence &lt; 20% after 3 attempts</p>
              <p className="text-white/40 mt-4"># Based on cognitive apprenticeship (Collins, Brown & Newman)</p>
              <p className="mb-1"><span className="text-white/60">→</span> Model → Coach → Scaffold → Articulate → Reflect → Explore</p>
            </div>
            <p className="text-xs" style={{ color: MUTED }}>Every rule is testable. Every rule has fidelity criteria. We don&apos;t just design the pedagogy — we prove the AI follows it.</p>
          </div>
        )}

        {/* Tab 3: Evidence Map */}
        {activeTab === 3 && (
          <div className="rounded-xl border bg-white p-8" style={{ borderColor: WARM_BORDER }}>
            <h3 className="text-xl font-bold mb-2" style={{ color: NAVY }}>The Feedback Loop — Evidence Map</h3>
            <p className="text-sm mb-6" style={{ color: MUTED }}>Not a grade. A map of understanding. Every skill assessed, tracked, and visible — to the student and to every guide who can act.</p>
            <div className="rounded-lg border p-5 mb-4" style={{ borderColor: WARM_BORDER }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: CORAL }}>EV</div>
                <div>
                  <p className="font-bold text-sm" style={{ color: NAVY }}>Elena Vasquez</p>
                  <p className="text-xs" style={{ color: MUTED }}>Biology 201 — Week 7</p>
                </div>
              </div>
              {evidenceSkills.map(skill => (
                <div key={skill.name} className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: BODY }}>{skill.name}</span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: skill.color }} />
                      <span style={{ color: skill.color }}>{skill.status === 'not-assessed' ? 'Not assessed' : `${skill.pct}%`}</span>
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ backgroundColor: WARM_BORDER }}>
                    <div className="h-2 rounded-full transition-all" style={{ width: `${skill.pct}%`, backgroundColor: skill.color }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs" style={{ color: MUTED }}>The graph is the product, not the chat. Value accumulates in the evidence record — transforming opaque percentages into granular understanding maps.</p>
          </div>
        )}
      </section>

      {/* Three Agent Modes */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-center mb-4 tracking-tight" style={{ fontFamily: serif, color: NAVY, fontSize: 'clamp(24px, 3.5vw, 36px)' }}>
            Three agent modes
          </h2>
          <p className="text-center text-sm mb-12" style={{ color: MUTED }}>Same knowledge graph. Same evidence map. Three different teaching philosophies. The system chooses based on the learner&apos;s state.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {agentModes.map(mode => (
              <div key={mode.title} className="rounded-xl border p-6" style={{ borderColor: mode.color + '30' }}>
                <div className="w-8 h-1 rounded-full mb-4" style={{ backgroundColor: mode.color }} />
                <h3 className="font-bold mb-2" style={{ color: NAVY }}>{mode.title}</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: BODY }}>{mode.desc}</p>
                <div className="rounded-lg p-3 text-xs italic" style={{ backgroundColor: mode.color + '08', color: mode.color }}>
                  {mode.example}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* When the AI Steps Back */}
      <section className="py-20" style={{ backgroundColor: WARM_BG }}>
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-center mb-4 tracking-tight" style={{ fontFamily: serif, color: NAVY, fontSize: 'clamp(24px, 3.5vw, 36px)' }}>
            When the AI steps back
          </h2>
          <p className="text-center text-sm mb-12" style={{ color: MUTED }}>The AI handles 85% of instruction. Here&apos;s when it routes to a human.</p>
          <div className="space-y-3">
            {handoffs.map((h, i) => (
              <div key={i} className="rounded-lg border bg-white p-5 flex items-center gap-4" style={{ borderColor: WARM_BORDER }}>
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: h.color }} />
                <div className="flex-1">
                  <p className="text-sm" style={{ color: BODY }}>{h.trigger}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: h.color + '15', color: h.color }}>
                    → {h.target}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Fidelity */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-center mb-4 tracking-tight" style={{ fontFamily: serif, color: NAVY, fontSize: 'clamp(24px, 3.5vw, 36px)' }}>
            Process fidelity
          </h2>
          <p className="text-center text-sm mb-4" style={{ color: MUTED }}>How do we know the AI is actually teaching?</p>
          <p className="text-center text-xs mb-12 max-w-xl mx-auto" style={{ color: MUTED }}>
            &ldquo;Process fidelity has to come before outcome claims.&rdquo; Before asking whether students learned, prove the AI executes the pedagogy it claims to.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="rounded-xl border p-6 text-center" style={{ borderColor: TEAL + '30' }}>
              <p className="text-4xl font-bold mb-2" style={{ color: TEAL }}>27</p>
              <p className="text-sm font-medium" style={{ color: NAVY }}>Fidelity Criteria</p>
              <p className="text-xs mt-1" style={{ color: MUTED }}>7 critical (must-pass), 20 quality. Binary: did it or didn&apos;t it.</p>
            </div>
            <div className="rounded-xl border p-6 text-center" style={{ borderColor: PLUM + '30' }}>
              <p className="text-4xl font-bold mb-2" style={{ color: PLUM }}>7</p>
              <p className="text-sm font-medium" style={{ color: NAVY }}>Synthetic Learner Personas</p>
              <p className="text-xs mt-1" style={{ color: MUTED }}>Stress-test the agent with the students who break it.</p>
            </div>
            <div className="rounded-xl border p-6 text-center" style={{ borderColor: GREEN + '30' }}>
              <p className="text-4xl font-bold mb-2" style={{ color: GREEN }}>90%</p>
              <p className="text-sm font-medium" style={{ color: NAVY }}>Human Agreement</p>
              <p className="text-xs mt-1" style={{ color: MUTED }}>LLM-as-judge pipeline matches inter-rater reliability.</p>
            </div>
          </div>

          {/* Personas */}
          <h3 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: MUTED }}>Synthetic Learner Personas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {personas.map(p => (
              <div key={p.name} className="rounded-lg border p-3" style={{ borderColor: p.color + '30' }}>
                <p className="text-xs font-bold mb-1" style={{ color: p.color }}>{p.name}</p>
                <p className="text-xs" style={{ color: MUTED }}>{p.desc}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl p-6 text-center" style={{ backgroundColor: NAVY }}>
            <p className="text-sm text-white/60 leading-relaxed">
              Most AI education companies demo and ship. We demo, <span className="text-white font-semibold">prove fidelity</span>, then ship.
            </p>
            <p className="text-xs text-white/30 mt-2">
              A demo is not evidence. Process fidelity converts a prompt from a demo into a deployable pedagogical artifact.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center" style={{ backgroundColor: WARM_BG }}>
        <Link href="/campus-os/demo/guides" className="text-sm font-semibold hover:underline" style={{ color: PLUM }}>
          Meet the guides &rarr;
        </Link>
      </section>
    </div>
  )
}
