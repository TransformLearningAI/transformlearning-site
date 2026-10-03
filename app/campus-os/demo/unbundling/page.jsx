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

const layers = [
  {
    title: 'AI Platform',
    pct: '85%',
    sub: 'of instruction',
    color: TEAL,
    cost: '~$1,500 / student / year',
    desc: 'The engine. Every concept mapped in a knowledge graph, every skill assessed adaptively, every gap diagnosed before the first exam. Not a chatbot — a teaching system with 27 fidelity criteria and 90% agreement with human evaluators.',
    items: ['Knowledge delivery', 'Adaptive assessment', 'Skill gap diagnosis', 'Personalized feedback', 'Progress tracking', 'AI study guides', 'Evidence maps'],
  },
  {
    title: 'Guides',
    pct: '10%',
    sub: 'of human moments',
    color: PLUM,
    cost: '~$2,000 / student / year',
    desc: 'Not professors. Not TAs. Six new roles for the moments that only humans can handle — field work, Socratic debate, hands-on craft, cross-disciplinary connection, crisis support, career bridging.',
    items: ['Practitioner-in-Residence', 'Socratic Provocateur', 'Master Craftsperson', 'Integration Coach', 'Resilience Mentor', 'Industry Bridge'],
  },
  {
    title: 'Peers',
    pct: 'The missing layer',
    sub: '',
    color: GREEN,
    cost: '$0 / student / year',
    desc: 'AI matches students by complementary strengths. The student who mastered derivatives yesterday coaches the student struggling today. Teaching-as-learning. The highest-ROI intervention on any campus.',
    items: ['Complementary skill matching', 'Study partnerships', 'Accountability', 'Teaching-as-learning', 'Normalization', 'Belonging'],
  },
  {
    title: 'Campus',
    pct: 'What AI',
    sub: "can't replace",
    color: CORAL,
    cost: '~$8,000 / student / year',
    desc: "The thing no platform can deliver. You come here and put your hands in the dirt, argue at 2am, cook for real customers, walk through the forest, become a person. That's the campus.",
    items: ['Community', 'Hands-on labs', 'Field work', 'Dining & housing', 'Late-night conversations', 'Identity formation'],
  },
]

const activities = [
  { activity: 'Content delivery', layer: 'AI', color: TEAL },
  { activity: 'Adaptive assessment', layer: 'AI', color: TEAL },
  { activity: 'Skill gap diagnosis', layer: 'AI', color: TEAL },
  { activity: 'Evidence map tracking', layer: 'AI', color: TEAL },
  { activity: 'Personalized study plans', layer: 'AI', color: TEAL },
  { activity: 'Socratic debate', layer: 'Guide (Provocateur)', color: PLUM },
  { activity: 'Hands-on field work', layer: 'Guide (Practitioner)', color: PLUM },
  { activity: 'Kitchen / workshop skills', layer: 'Guide (Craftsperson)', color: PLUM },
  { activity: 'Cross-disciplinary projects', layer: 'Guide (Integration)', color: PLUM },
  { activity: 'Crisis support', layer: 'Guide (Resilience)', color: PLUM },
  { activity: 'Employer connections', layer: 'Guide (Industry)', color: PLUM },
  { activity: 'Study partnerships', layer: 'Peers', color: GREEN },
  { activity: 'Accountability', layer: 'Peers', color: GREEN },
  { activity: 'Teaching-as-learning', layer: 'Peers', color: GREEN },
  { activity: 'Belonging & community', layer: 'Campus', color: CORAL },
  { activity: 'Identity formation', layer: 'Campus', color: CORAL },
  { activity: 'Late-night conversations', layer: 'Campus', color: CORAL },
  { activity: 'Physical labs & studios', layer: 'Campus', color: CORAL },
]

export default function UnbundlingPage() {
  const [hoveredLayer, setHoveredLayer] = useState(null)

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

      {/* Hero */}
      <header className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-4" style={{ color: TEAL }}>Campus OS</p>
        <h1 className="tracking-tight leading-tight mb-4" style={{ fontFamily: serif, color: NAVY, fontSize: 'clamp(36px, 5vw, 56px)', letterSpacing: '-0.03em' }}>
          The Unbundling
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: MUTED }}>
          What AI teaches. What humans give. What the campus holds.
        </p>
      </header>

      {/* The Four Layers */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {layers.map((layer, i) => (
            <div
              key={layer.title}
              className="rounded-xl border p-8 transition-all duration-300"
              style={{
                borderColor: hoveredLayer === i ? layer.color + '60' : WARM_BORDER,
                backgroundColor: hoveredLayer === i ? layer.color + '06' : 'white',
              }}
              onMouseEnter={() => setHoveredLayer(i)}
              onMouseLeave={() => setHoveredLayer(null)}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: layer.color }} />
                <h3 className="text-xl font-bold" style={{ color: NAVY }}>{layer.title}</h3>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-bold" style={{ color: layer.color }}>{layer.pct}</span>
                {layer.sub && <span className="text-sm" style={{ color: MUTED }}>{layer.sub}</span>}
              </div>
              <p className="text-sm leading-relaxed mb-5" style={{ color: BODY }}>{layer.desc}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {layer.items.map(item => (
                  <span key={item} className="text-xs px-3 py-1 rounded-full border" style={{ borderColor: layer.color + '30', color: layer.color }}>{item}</span>
                ))}
              </div>
              <div className="pt-4 border-t" style={{ borderColor: WARM_BORDER }}>
                <span className="text-sm font-semibold" style={{ color: NAVY }}>Cost: </span>
                <span className="text-sm font-bold" style={{ color: layer.color }}>{layer.cost}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-8 rounded-xl p-8 text-center" style={{ backgroundColor: NAVY }}>
          <p className="text-lg md:text-xl text-white/80 leading-relaxed" style={{ fontFamily: serif }}>
            Total: <span className="font-bold" style={{ color: TEAL }}>~$13,500 / student / year</span>
            <span className="text-white/30 mx-3">vs.</span>
            <span className="line-through text-white/30">$45,000–65,000 traditional</span>
          </p>
        </div>
      </section>

      {/* Old vs New */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-center mb-12 tracking-tight" style={{ fontFamily: serif, color: NAVY, fontSize: 'clamp(24px, 3.5vw, 36px)' }}>
            The old model vs. the new
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-xl border p-8" style={{ borderColor: '#ddd', backgroundColor: '#fafafa' }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#999' }}>Traditional University</h3>
              <ul className="space-y-3 text-sm" style={{ color: BODY }}>
                <li>1 professor per 25 students, full-time salaried</li>
                <li>Tenured faculty, adjunct labor, TAs</li>
                <li>Lecture halls, departments, committees</li>
                <li>48 committees meeting monthly</li>
                <li>Data reaches the dean in 3 weeks</li>
                <li>Students self-diagnose or fail</li>
                <li className="pt-3 border-t font-bold text-lg" style={{ color: '#999' }}>$45,000–65,000 / year</li>
              </ul>
            </div>
            <div className="rounded-xl border p-8" style={{ borderColor: TEAL + '40', backgroundColor: TEAL + '06' }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: TEAL }}>AI + Guides + Peers + Campus</h3>
              <ul className="space-y-3 text-sm" style={{ color: BODY }}>
                <li>AI platform teaches with 27 fidelity criteria</li>
                <li>6 guide types for human-essential moments</li>
                <li>Peer marketplace matches complementary skills</li>
                <li>Decision Router replaces committees</li>
                <li>AI flags the right guide in 3 seconds</li>
                <li>Evidence maps show every gap before exams</li>
                <li className="pt-3 border-t font-bold text-lg" style={{ color: TEAL }}>$13,500 / year</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Who Does What */}
      <section className="py-20" style={{ backgroundColor: WARM_BG }}>
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-center mb-12 tracking-tight" style={{ fontFamily: serif, color: NAVY, fontSize: 'clamp(24px, 3.5vw, 36px)' }}>
            Who does what
          </h2>
          <div className="rounded-xl border bg-white overflow-hidden" style={{ borderColor: WARM_BORDER }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: NAVY }}>
                  <th className="text-left px-5 py-3 font-semibold text-white/80">Learning Activity</th>
                  <th className="text-left px-5 py-3 font-semibold text-white/80">Handled By</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((a, i) => (
                  <tr key={a.activity} className="border-t" style={{ borderColor: WARM_BORDER, backgroundColor: i % 2 === 0 ? 'white' : WARM_BG }}>
                    <td className="px-5 py-3" style={{ color: BODY }}>{a.activity}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: a.color }} />
                        <span className="font-medium" style={{ color: a.color }}>{a.layer}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Bottom Line */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-lg md:text-xl leading-relaxed" style={{ fontFamily: serif, color: NAVY }}>
            A real degree. A real community. <span style={{ color: TEAL }}>$13,500</span> instead of $45,000.
          </p>
          <p className="mt-4 text-sm leading-relaxed" style={{ color: MUTED }}>
            Because we stopped paying humans to do what software does better — and started paying them to do what software never will.
          </p>
          <div className="mt-10">
            <Link href="/campus-os/demo/economics" className="text-sm font-semibold hover:underline" style={{ color: TEAL }}>
              See the economics &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
