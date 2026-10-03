'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

/* ─── Design tokens (Rachel-inspired: warm, editorial, serif-driven) ─── */
const NAVY = '#0C1F3F'
const TEAL = '#00A8A8'
const GREEN = '#4F8A5B'
const PLUM = '#5A3E6B'
const CORAL = '#FF6B4A'
const WARM_BG = '#FAF8F5'
const WARM_BORDER = '#EBE6E0'
const BODY_COLOR = '#3a3530'
const MUTED = '#6b635a'
const serif = 'Georgia, "Cormorant Garamond", serif'

/* ─── Network Visualization ─── */
function NetworkVisualization() {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
      ctx.scale(2, 2)
    }
    resize()
    window.addEventListener('resize', resize)

    const w = canvas.offsetWidth
    const h = canvas.offsetHeight
    const layers = [
      { color: TEAL, count: 8, label: 'AI' },
      { color: PLUM, count: 5, label: 'Guides' },
      { color: GREEN, count: 6, label: 'Peers' },
      { color: CORAL, count: 5, label: 'Campus' },
    ]

    const nodes = []
    layers.forEach((layer, li) => {
      for (let i = 0; i < layer.count; i++) {
        const angle = (i / layer.count) * Math.PI * 2 + li * 0.5
        const radius = 60 + li * 40 + Math.random() * 30
        nodes.push({
          x: w / 2 + Math.cos(angle) * radius + (Math.random() - 0.5) * 40,
          y: h / 2 + Math.sin(angle) * radius + (Math.random() - 0.5) * 30,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          r: 2 + Math.random() * 2.5,
          pulse: Math.random() * Math.PI * 2,
          color: layer.color,
        })
      }
    })

    const edges = []
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x
        const dy = nodes[i].y - nodes[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 140) edges.push({ from: i, to: j, signal: Math.random(), signalSpeed: 0.003 + Math.random() * 0.008 })
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, w, h)
      nodes.forEach(n => { n.x += n.vx; n.y += n.vy; n.pulse += 0.015; if (n.x < 30 || n.x > w - 30) n.vx *= -1; if (n.y < 30 || n.y > h - 30) n.vy *= -1 })
      edges.forEach(e => {
        const f = nodes[e.from], t = nodes[e.to]
        const dx = t.x - f.x, dy = t.y - f.y, dist = Math.sqrt(dx * dx + dy * dy)
        ctx.beginPath(); ctx.moveTo(f.x, f.y); ctx.lineTo(t.x, t.y)
        ctx.strokeStyle = `rgba(0,168,168,${0.06 * (1 - dist / 140)})`; ctx.lineWidth = 0.5; ctx.stroke()
        e.signal = (e.signal + e.signalSpeed) % 1
        ctx.beginPath(); ctx.arc(f.x + dx * e.signal, f.y + dy * e.signal, 1.2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0,168,168,${0.25 * (1 - dist / 140)})`; ctx.fill()
      })
      nodes.forEach(n => {
        const pr = n.r + Math.sin(n.pulse) * 1
        ctx.beginPath(); ctx.arc(n.x, n.y, pr + 6, 0, Math.PI * 2)
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, pr + 6)
        g.addColorStop(0, n.color + '18'); g.addColorStop(1, n.color + '00')
        ctx.fillStyle = g; ctx.fill()
        ctx.beginPath(); ctx.arc(n.x, n.y, pr, 0, Math.PI * 2)
        ctx.fillStyle = n.color + '80'; ctx.fill()
      })
      animationRef.current = requestAnimationFrame(animate)
    }
    animate()
    return () => { window.removeEventListener('resize', resize); if (animationRef.current) cancelAnimationFrame(animationRef.current) }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-50 pointer-events-none" style={{ mixBlendMode: 'screen' }} />
}

/* ─── The Four Layers ─── */
const layers = [
  {
    title: 'AI Platform',
    pct: '85%',
    subtitle: 'of instruction',
    color: TEAL,
    cost: '~$1,500/student/year',
    items: ['Knowledge delivery', 'Adaptive assessment', 'Skill mapping', 'Personalized feedback', 'Progress tracking', 'Study guides'],
    desc: 'The engine. Every concept mapped, every skill assessed, every gap diagnosed. Not a chatbot — a teaching system with 27 fidelity criteria proving it works.',
  },
  {
    title: 'Guides',
    pct: '10%',
    subtitle: 'of human moments',
    color: PLUM,
    cost: '~$2,000/student/year',
    items: ['Practitioner-in-Residence', 'Socratic Provocateur', 'Master Craftsperson', 'Integration Coach', 'Resilience Mentor', 'Industry Bridge'],
    desc: 'Not professors. Not TAs. Six new roles for the moments only humans can handle — field work, Socratic debate, crisis support, career connection.',
  },
  {
    title: 'Peers',
    pct: 'The missing layer',
    subtitle: '',
    color: GREEN,
    cost: '$0/student/year',
    items: ['Complementary skill matching', 'Study partnerships', 'Accountability', 'Teaching-as-learning', 'Normalization', 'Belonging'],
    desc: 'AI matches students by complementary strengths. The student who mastered derivatives yesterday coaches the student struggling today. The highest-ROI intervention on campus.',
  },
  {
    title: 'Campus',
    pct: 'What AI',
    subtitle: "can't replace",
    color: CORAL,
    cost: '~$8,000/student/year',
    items: ['Community', 'Hands-on labs', 'Field work', 'Dining & housing', 'Late-night conversations', 'Identity formation'],
    desc: "The thing no platform can deliver. You come here and put your hands in the dirt, argue at 2am, cook for real customers, become a person. That's the campus.",
  },
]

/* ─── New Shifts ─── */
const shifts = [
  { title: 'The Unbundling', href: '/campus-os/demo/unbundling', color: TEAL, desc: 'What AI teaches. What humans give. What the campus holds. The four layers that replace the $45,000 bundle.' },
  { title: 'AI Instruction Engine', href: '/campus-os/demo/ai-engine', color: NAVY, desc: 'Knowledge graphs, adaptive assessment, agent behavior, evidence maps. How the platform actually teaches.' },
  { title: 'The Guides', href: '/campus-os/demo/guides', color: PLUM, desc: 'Six new roles for the moments only humans can handle. Not professors. Not TAs. Something new.' },
  { title: 'Guide Dashboard', href: '/campus-os/demo/guide-dashboard', color: GREEN, desc: 'What a guide sees: AI-flagged students, intervention queues, impact metrics. The command center.' },
  { title: 'The Economics', href: '/campus-os/demo/economics', color: CORAL, desc: 'What happens when instruction costs drop 70%. Interactive model: traditional vs. AI + guides.' },
  { title: 'Accreditation Map', href: '/campus-os/demo/accreditation', color: NAVY, desc: 'How every component satisfies QAA (UK) and regional (US) accreditation. The regulatory path.' },
  { title: 'Peer Marketplace', href: '/campus-os/demo/peer-marketplace', color: TEAL, desc: 'AI-matched peer learning. Mastery meets struggle. The layer nobody else is building.' },
  { title: 'Signal Hub', href: '/campus-os/demo/signal-hub', color: GREEN, desc: 'Student signals radiate to every guide who can act. No chain of command for data.' },
  { title: 'Decision Router', href: '/campus-os/demo/decision-router', color: PLUM, desc: 'AI surfaces decisions needing human judgment. Routes to the one person who can act.' },
  { title: 'Live Pulse', href: '/campus-os/demo/live-pulse', color: CORAL, desc: 'Real-time institutional health. Every metric, every signal, right now.' },
  { title: 'Student Control', href: '/campus-os/demo/student-control', color: TEAL, desc: 'The student as operator. AI learning path, guide availability, peer network, competency dashboard.' },
  { title: 'Continuous Journey', href: '/campus-os/demo/continuous-journey', color: NAVY, desc: 'First inquiry through alumni. One unbroken thread. No handoffs.' },
]

/* ─── Role views ─── */
const roles = [
  { title: 'Student', href: '/campus-os/demo/student' },
  { title: 'Guide', href: '/campus-os/demo/guide-dashboard' },
  { title: 'Program Director', href: '/campus-os/demo/chair' },
  { title: 'Campus Director', href: '/campus-os/demo/dean' },
  { title: 'President', href: '/campus-os/demo/president' },
  { title: 'Finance', href: '/campus-os/demo/finance' },
  { title: 'Admissions', href: '/campus-os/demo/admissions' },
]

export default function CampusOSPage() {
  const [hoveredLayer, setHoveredLayer] = useState(null)

  return (
    <main className="min-h-screen" style={{ backgroundColor: WARM_BG }}>

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundColor: NAVY }} />
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `radial-gradient(circle at 30% 40%, ${TEAL}20 0%, transparent 50%), radial-gradient(circle at 70% 60%, ${PLUM}15 0%, transparent 50%), radial-gradient(circle at 50% 80%, ${GREEN}10 0%, transparent 40%)` }} />
        <NetworkVisualization />

        <div className="relative max-w-5xl mx-auto px-6 text-center py-32">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] mb-6" style={{ color: TEAL }}>
            Campus OS
          </p>
          <h1
            className="text-white leading-[0.9] tracking-tight mb-8"
            style={{ fontFamily: serif, fontSize: 'clamp(48px, 8vw, 100px)', letterSpacing: '-0.04em' }}
          >
            The university,<br />
            rebuilt from<br />
            <span style={{ color: TEAL }}>learning up.</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/50 max-w-3xl mx-auto mb-6 leading-relaxed font-light">
            AI handles instruction. Guides handle the human moments.<br className="hidden md:block" />
            Peers handle each other. The campus holds it all together.
          </p>
          <p className="text-lg text-white/30 max-w-2xl mx-auto mb-16 leading-relaxed">
            A real degree. A real community. $13,500 instead of $45,000.
          </p>

          <Link
            href="/campus-os/demo"
            className="group inline-flex items-center gap-3 px-10 py-5 rounded-full text-lg font-semibold transition-all duration-300"
            style={{ backgroundColor: TEAL, color: NAVY }}
          >
            Explore the model
            <svg className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#FAF8F5] to-transparent" />
      </section>

      {/* ─── THE QUESTION ─── */}
      <section className="py-28 md:py-40" style={{ backgroundColor: WARM_BG }}>
        <div className="max-w-4xl mx-auto px-6">
          <p className="leading-tight tracking-tight mb-20" style={{ fontFamily: serif, color: NAVY, fontSize: 'clamp(28px, 4.5vw, 48px)', letterSpacing: '-0.03em' }}>
            What if instruction costs dropped{' '}
            <span style={{ color: CORAL }}>70%</span> — and the learning got{' '}
            <span style={{ color: TEAL }}>better?</span>
          </p>

          <div className="space-y-14">
            {[
              { text: 'AI can now teach — not just answer questions, but actually teach — with measurable fidelity. 27 criteria. 90% agreement with human evaluators.', color: TEAL },
              { text: "That means the expensive part of a university — faculty delivering content to classrooms — isn't the only option anymore.", color: PLUM },
              { text: 'The question becomes: what do you still need humans for? And what do you need a campus for? The answers are different than you think.', color: CORAL },
            ].map((p, i) => (
              <div key={i} className="flex items-start gap-6">
                <div className="flex-shrink-0 w-1 self-stretch rounded-full mt-1" style={{ backgroundColor: p.color }} />
                <p className="text-lg md:text-xl leading-relaxed font-light" style={{ color: BODY_COLOR }}>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── THE FOUR LAYERS ─── */}
      <section className="py-28 md:py-40 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] mb-4" style={{ color: TEAL }}>
              Four layers
            </p>
            <h2 className="leading-tight tracking-tight" style={{ fontFamily: serif, color: NAVY, fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-0.03em' }}>
              The university, <span style={{ color: TEAL }}>unbundled.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {layers.map((layer, i) => (
              <div
                key={layer.title}
                className="rounded-xl border p-8 md:p-10 transition-all duration-300 cursor-default"
                style={{
                  borderColor: hoveredLayer === i ? layer.color + '60' : WARM_BORDER,
                  backgroundColor: hoveredLayer === i ? layer.color + '06' : 'white',
                }}
                onMouseEnter={() => setHoveredLayer(i)}
                onMouseLeave={() => setHoveredLayer(null)}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: layer.color }} />
                  <h3 className="text-xl font-bold" style={{ color: NAVY }}>{layer.title}</h3>
                </div>

                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-3xl font-bold" style={{ color: layer.color }}>{layer.pct}</span>
                  {layer.subtitle && <span className="text-sm" style={{ color: MUTED }}>{layer.subtitle}</span>}
                </div>

                <p className="text-sm leading-relaxed mb-5" style={{ color: BODY_COLOR }}>{layer.desc}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {layer.items.map(item => (
                    <span key={item} className="text-xs px-3 py-1 rounded-full border" style={{ borderColor: layer.color + '30', color: layer.color }}>
                      {item}
                    </span>
                  ))}
                </div>

                <div className="pt-4 border-t" style={{ borderColor: WARM_BORDER }}>
                  <span className="text-sm font-semibold" style={{ color: NAVY }}>Cost: </span>
                  <span className="text-sm font-bold" style={{ color: layer.color }}>{layer.cost}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-xl p-8 text-center" style={{ backgroundColor: NAVY }}>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed" style={{ fontFamily: serif }}>
              Total: <span className="text-white font-bold" style={{ color: TEAL }}>~$13,500/student/year</span>
              <span className="text-white/40 mx-3">vs.</span>
              <span className="line-through text-white/30">$45,000–65,000 traditional</span>
            </p>
            <p className="text-sm text-white/40 mt-3">
              A real degree. A real community. Because we stopped paying humans to do what software does better.
            </p>
          </div>
        </div>
      </section>

      {/* ─── AI INTELLIGENCE LAYER ─── */}
      <section className="py-28 md:py-40 relative overflow-hidden" style={{ backgroundColor: NAVY }}>
        <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 50% 50%, ${PLUM}15 0%, transparent 60%)` }} />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] mb-6" style={{ color: PLUM }}>
            The intelligence layer
          </p>
          <h2 className="text-white leading-tight tracking-tight mb-10" style={{ fontFamily: serif, fontSize: 'clamp(28px, 4.5vw, 48px)', letterSpacing: '-0.03em' }}>
            AI isn&rsquo;t a feature.<br />
            It&rsquo;s the <span style={{ color: TEAL }}>nervous system.</span>
          </h2>
          <p className="text-lg text-white/40 leading-relaxed mb-14 max-w-2xl mx-auto">
            The AI teaches with proven fidelity. It flags when humans are needed. It matches peers by complementary strength. It routes decisions to the one person who can act. And it does nothing without permission.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Teaches with fidelity', desc: '27 criteria. Synthetic learner stress testing. LLM-as-judge. 90% human agreement.', color: TEAL },
              { label: 'Flags, never decides', desc: 'Routes to guides when confidence drops. Escalates distress signals. Recommends, never acts alone.', color: PLUM },
              { label: 'Proves it works', desc: 'Process fidelity before outcome claims. Not "trust us" — evidence that the system teaches as designed.', color: GREEN },
            ].map(item => (
              <div key={item.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
                <p className="text-lg mb-3" style={{ fontFamily: serif, color: item.color }}>{item.label}</p>
                <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── THE DEMOS ─── */}
      <section className="py-28 md:py-40" style={{ backgroundColor: WARM_BG }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] mb-4" style={{ color: TEAL }}>
              Twelve views
            </p>
            <h2 className="leading-tight tracking-tight" style={{ fontFamily: serif, color: NAVY, fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-0.03em' }}>
              Not features. <span style={{ color: TEAL }}>Structural changes.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {shifts.map(shift => (
              <Link
                key={shift.title}
                href={shift.href}
                className="group block rounded-xl border bg-white p-7 transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
                style={{ borderColor: WARM_BORDER }}
              >
                <div className="w-8 h-1 rounded-full mb-5" style={{ backgroundColor: shift.color }} />
                <h3 className="text-lg font-semibold mb-2" style={{ color: NAVY }}>{shift.title}</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: MUTED }}>{shift.desc}</p>
                <span className="text-sm font-medium group-hover:translate-x-1 inline-block transition-transform" style={{ color: shift.color }}>
                  Explore &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ROLE VIEWS ─── */}
      <div className="border-t" style={{ borderColor: WARM_BORDER }}>
        <div className="max-w-6xl mx-auto px-6 py-10 text-center">
          <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: MUTED }}>
            Role-based views
          </p>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {roles.map(role => (
              <Link key={role.title} href={role.href} className="text-sm transition-colors duration-150 hover:underline" style={{ color: MUTED }}>
                {role.title}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ─── CLOSING ─── */}
      <section className="py-28 md:py-40 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="leading-tight tracking-tight mb-10" style={{ fontFamily: serif, color: NAVY, fontSize: 'clamp(24px, 3.5vw, 40px)', letterSpacing: '-0.02em' }}>
            This isn&rsquo;t incremental improvement.<br />
            This is the university, <span style={{ color: CORAL }}>rebuilt from learning up.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link
              href="/campus-os/demo"
              className="group inline-flex items-center gap-3 px-10 py-5 rounded-full text-lg font-semibold text-white transition-all duration-300 hover:shadow-2xl hover:scale-[1.03]"
              style={{ backgroundColor: NAVY }}
            >
              Explore the demos
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-12 border-t" style={{ backgroundColor: NAVY, borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold text-white/80">
              transform<span style={{ color: TEAL }}>learning</span>
            </span>
            <span className="text-white/20 text-sm">Campus OS</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-white/40">
            <a href="https://transformlearning.ai" className="hover:text-white/70 transition-colors">transformlearning.ai</a>
            <span className="text-white/10">|</span>
            <Link href="/campus-os/demo" className="hover:text-white/70 transition-colors">Demos</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
