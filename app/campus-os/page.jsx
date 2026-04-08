'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

/* ─── Network Visualization Component ─── */
function NetworkVisualization() {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const nodesRef = useRef([])
  const edgesRef = useRef([])

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

    // Create nodes in a distributed pattern (not a pyramid)
    const w = canvas.offsetWidth
    const h = canvas.offsetHeight
    const nodeCount = 24
    const nodes = []

    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2
      const radius = 80 + Math.random() * 120
      nodes.push({
        x: w / 2 + Math.cos(angle) * radius + (Math.random() - 0.5) * 60,
        y: h / 2 + Math.sin(angle) * radius + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: 2 + Math.random() * 3,
        pulse: Math.random() * Math.PI * 2,
        color: ['#00A8A8', '#4F8A5B', '#5A3E6B', '#FF6B4A'][Math.floor(Math.random() * 4)],
      })
    }
    nodesRef.current = nodes

    // Create edges
    const edges = []
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x
        const dy = nodes[i].y - nodes[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 160) {
          edges.push({ from: i, to: j, signal: 0, signalSpeed: 0.005 + Math.random() * 0.01 })
        }
      }
    }
    edgesRef.current = edges

    let time = 0
    const animate = () => {
      time += 0.016
      ctx.clearRect(0, 0, w, h)

      // Update node positions with gentle drift
      nodes.forEach((node) => {
        node.x += node.vx
        node.y += node.vy
        node.pulse += 0.02

        // Soft boundary bounce
        if (node.x < 40 || node.x > w - 40) node.vx *= -1
        if (node.y < 40 || node.y > h - 40) node.vy *= -1
      })

      // Draw edges
      edges.forEach((edge) => {
        const from = nodes[edge.from]
        const to = nodes[edge.to]
        const dx = to.x - from.x
        const dy = to.y - from.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        ctx.beginPath()
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(to.x, to.y)
        ctx.strokeStyle = `rgba(0, 168, 168, ${0.08 * (1 - dist / 160)})`
        ctx.lineWidth = 0.5
        ctx.stroke()

        // Traveling signal dot
        edge.signal = (edge.signal + edge.signalSpeed) % 1
        const sx = from.x + dx * edge.signal
        const sy = from.y + dy * edge.signal
        ctx.beginPath()
        ctx.arc(sx, sy, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 168, 168, ${0.3 * (1 - dist / 160)})`
        ctx.fill()
      })

      // Draw nodes
      nodes.forEach((node) => {
        const pulseR = node.r + Math.sin(node.pulse) * 1.5

        // Glow
        ctx.beginPath()
        ctx.arc(node.x, node.y, pulseR + 8, 0, Math.PI * 2)
        const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, pulseR + 8)
        glow.addColorStop(0, node.color + '20')
        glow.addColorStop(1, node.color + '00')
        ctx.fillStyle = glow
        ctx.fill()

        // Core
        ctx.beginPath()
        ctx.arc(node.x, node.y, pulseR, 0, Math.PI * 2)
        ctx.fillStyle = node.color + '90'
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-60 pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}

/* ─── The Eight Shifts data ─── */
const shifts = [
  {
    title: 'Signal Hub',
    href: '/campus-os/demo/signal-hub',
    description: 'Student signals radiate outward to everyone who can act. Simultaneously. No chain of command for data.',
    color: '#00A8A8',
    colorName: 'teal',
  },
  {
    title: 'Student Control Panel',
    href: '/campus-os/demo/student-control',
    description: "Students aren't subjects being measured. They're operators navigating their own path.",
    color: '#0C1F3F',
    colorName: 'navy',
  },
  {
    title: 'Outcome Networks',
    href: '/campus-os/demo/outcome-networks',
    description: "Organize around learning outcomes, not departments. Critical thinking doesn't belong to one chair.",
    color: '#4F8A5B',
    colorName: 'green',
  },
  {
    title: 'Decision Router',
    href: '/campus-os/demo/decision-router',
    description: 'AI surfaces decisions that need human judgment. Routes them to the one person who can act. Kill the committee.',
    color: '#5A3E6B',
    colorName: 'plum',
  },
  {
    title: 'Peer Marketplace',
    href: '/campus-os/demo/peer-marketplace',
    description: 'A student who mastered derivatives yesterday coaches a student struggling today. AI matches them.',
    color: '#00A8A8',
    colorName: 'teal',
  },
  {
    title: 'Continuous Journey',
    href: '/campus-os/demo/continuous-journey',
    description: "One thread from first inquiry through alumni. No handoff. No gap. No 'we recruited you, now you're retention's problem.'",
    color: '#0C1F3F',
    colorName: 'navy',
  },
  {
    title: 'Impact Allocation',
    href: '/campus-os/demo/impact-allocation',
    description: "Money follows learning impact. Not departmental politics. Not last year's budget plus 2%.",
    color: '#FF6B4A',
    colorName: 'coral',
  },
  {
    title: 'Live Pulse',
    href: '/campus-os/demo/live-pulse',
    description: 'Real-time institutional health. Not quarterly reports. Not annual reviews. Right now.',
    color: '#4F8A5B',
    colorName: 'green',
  },
]

/* ─── Color utilities ─── */
function getCardBg(colorName) {
  const map = {
    teal: 'rgba(0, 168, 168, 0.08)',
    navy: 'rgba(12, 31, 63, 0.06)',
    green: 'rgba(79, 138, 91, 0.08)',
    plum: 'rgba(90, 62, 107, 0.08)',
    coral: 'rgba(255, 107, 74, 0.08)',
  }
  return map[colorName] || map.teal
}

function getCardBorderHover(colorName) {
  const map = {
    teal: 'rgba(0, 168, 168, 0.4)',
    navy: 'rgba(12, 31, 63, 0.3)',
    green: 'rgba(79, 138, 91, 0.4)',
    plum: 'rgba(90, 62, 107, 0.4)',
    coral: 'rgba(255, 107, 74, 0.4)',
  }
  return map[colorName] || map.teal
}


export default function CampusOSPage() {
  const revealRefs = useRef([])
  const [hoveredCard, setHoveredCard] = useState(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    )

    revealRefs.current.forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const addRevealRef = (el) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el)
    }
  }

  return (
    <main className="min-h-screen bg-white">

      {/* ─────────────────────────────────────────────────
           HERO
      ───────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Deep navy background */}
        <div className="absolute inset-0 bg-[#0C1F3F]" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 40%, rgba(0,168,168,0.15) 0%, transparent 50%),
                              radial-gradient(circle at 70% 60%, rgba(90,62,107,0.1) 0%, transparent 50%),
                              radial-gradient(circle at 50% 80%, rgba(79,138,91,0.08) 0%, transparent 40%)`,
          }}
        />

        {/* Animated network visualization */}
        <NetworkVisualization />

        {/* Very subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />

        <div className="relative max-w-5xl mx-auto px-6 text-center py-32">
          <h1
            ref={addRevealRef}
            className="reveal font-serif text-white leading-[0.9] tracking-tight mb-8"
            style={{ fontSize: 'clamp(52px, 8vw, 112px)', letterSpacing: '-0.04em' }}
          >
            The org chart<br />
            is <span style={{ color: '#FF6B4A' }}>dead.</span>
          </h1>

          <p
            ref={addRevealRef}
            className="reveal reveal-delay-1 text-xl md:text-2xl lg:text-[28px] font-sans text-white/60 max-w-3xl mx-auto mb-16 leading-relaxed font-light"
          >
            Campus OS replaces hierarchies with intelligence.<br className="hidden md:block" />
            One system. Every signal. No silos.
          </p>

          <div ref={addRevealRef} className="reveal reveal-delay-2">
            <Link
              href="/campus-os/demo"
              className="group inline-flex items-center gap-3 px-10 py-5 rounded-full text-lg font-semibold text-[#0C1F3F] bg-[#00A8A8] hover:bg-[#00bfbf] hover:shadow-2xl hover:shadow-[#00A8A8]/30 hover:scale-[1.03] transition-all duration-300"
            >
              See the future
              <svg
                className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent" />
      </section>


      {/* ─────────────────────────────────────────────────
           THE PROBLEM
      ───────────────────────────────────────────────── */}
      <section className="relative py-28 md:py-40 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div ref={addRevealRef} className="reveal mb-20">
            <p
              className="font-serif text-[#0C1F3F] leading-tight tracking-tight"
              style={{ fontSize: 'clamp(32px, 5vw, 56px)', letterSpacing: '-0.03em' }}
            >
              Higher education runs on a structure designed in{' '}
              <span style={{ color: '#FF6B4A' }}>1850.</span>
            </p>
          </div>

          <div className="space-y-16 md:space-y-20">
            {[
              {
                text: 'Data flows up a chain of command. By the time the president sees it, the student already failed.',
                accent: '#00A8A8',
              },
              {
                text: "Departments are silos. A student's critical thinking crosses 6 departments but nobody connects the dots.",
                accent: '#5A3E6B',
              },
              {
                text: '48 committees meet monthly. AI could route those decisions in 5 minutes.',
                accent: '#FF6B4A',
              },
            ].map((point, i) => (
              <div
                key={i}
                ref={addRevealRef}
                className={`reveal reveal-delay-${i + 1} flex items-start gap-6 md:gap-8`}
              >
                <div
                  className="flex-shrink-0 w-1 self-stretch rounded-full mt-2"
                  style={{ backgroundColor: point.accent }}
                />
                <p className="font-sans text-lg md:text-xl lg:text-2xl text-[#0C1F3F]/70 leading-relaxed font-light">
                  {point.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────────────────
           THE EIGHT SHIFTS
      ───────────────────────────────────────────────── */}
      <section className="relative py-28 md:py-40 bg-[#f8f9fb] overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 0%, rgba(0,168,168,0.3) 0%, transparent 60%)`,
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6">
          <div ref={addRevealRef} className="reveal text-center mb-20">
            <p className="font-sans text-sm font-bold uppercase tracking-[0.2em] text-[#00A8A8] mb-6">
              Eight shifts
            </p>
            <h2
              className="font-serif text-[#0C1F3F] leading-tight tracking-tight"
              style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', letterSpacing: '-0.03em' }}
            >
              Not features. <span style={{ color: '#00A8A8' }}>Structural changes.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
            {shifts.map((shift, i) => (
              <Link
                key={shift.title}
                href={shift.href}
                ref={addRevealRef}
                className={`reveal reveal-delay-${(i % 4) + 1} group relative rounded-2xl p-8 md:p-10 transition-all duration-500 border`}
                style={{
                  backgroundColor: hoveredCard === i ? getCardBg(shift.colorName) : 'white',
                  borderColor: hoveredCard === i ? getCardBorderHover(shift.colorName) : 'rgba(0,0,0,0.06)',
                }}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Color accent bar */}
                <div
                  className="w-10 h-1 rounded-full mb-6"
                  style={{ backgroundColor: shift.color }}
                />

                <div className="flex items-start justify-between mb-4">
                  <h3
                    className="font-serif text-2xl md:text-[28px] tracking-tight leading-tight"
                    style={{ color: '#0C1F3F' }}
                  >
                    {shift.title}
                  </h3>
                  <svg
                    className="w-5 h-5 flex-shrink-0 mt-1 text-[#0C1F3F]/20 group-hover:text-[#00A8A8] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </div>

                <p className="font-sans text-[15px] md:text-base text-[#0C1F3F]/55 leading-relaxed">
                  {shift.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────────────────
           AI INTELLIGENCE LAYER
      ───────────────────────────────────────────────── */}
      <section className="relative py-28 md:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-[#0C1F3F]" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(90,62,107,0.15) 0%, transparent 60%)`,
          }}
        />
        {/* Subtle horizontal scan lines */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 3px,
              rgba(0,168,168,0.15) 3px,
              rgba(0,168,168,0.15) 4px
            )`,
          }}
        />

        <div className="relative max-w-4xl mx-auto px-6">
          <div ref={addRevealRef} className="reveal text-center mb-6">
            <p className="font-sans text-sm font-bold uppercase tracking-[0.2em] text-[#5A3E6B] mb-6">
              The intelligence layer
            </p>
            <h2
              className="font-serif text-white leading-tight tracking-tight mb-10"
              style={{ fontSize: 'clamp(32px, 5vw, 56px)', letterSpacing: '-0.03em' }}
            >
              AI isn&rsquo;t a feature.<br />
              It&rsquo;s the <span style={{ color: '#00A8A8' }}>nervous system.</span>
            </h2>
          </div>

          <div ref={addRevealRef} className="reveal reveal-delay-1 max-w-3xl mx-auto">
            <p className="font-sans text-lg md:text-xl text-white/50 leading-relaxed text-center mb-12">
              Every signal passes through governance constraints. Fairness thresholds.
              Confidence requirements.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Sees everything', desc: 'Every data point, every signal, every pattern across the institution.' },
                { label: 'Judges nothing', desc: 'No autonomous decisions. No black boxes. Full explainability.' },
                { label: 'Acts on permission', desc: 'Human judgment stays in the loop. Always. The AI recommends. People decide.' },
              ].map((item, i) => (
                <div
                  key={item.label}
                  ref={addRevealRef}
                  className={`reveal reveal-delay-${i + 2} rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center`}
                >
                  <p className="font-serif text-lg text-[#00A8A8] mb-3">{item.label}</p>
                  <p className="font-sans text-sm text-white/40 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <p
              ref={addRevealRef}
              className="reveal reveal-delay-4 font-sans text-base md:text-lg text-white/30 text-center mt-12 leading-relaxed italic"
            >
              &ldquo;The AI sees everything. It acts on nothing without permission.&rdquo;
            </p>
          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────────────────
           FINAL CTA
      ───────────────────────────────────────────────── */}
      <section className="relative py-28 md:py-40 bg-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(0,168,168,0.4) 0%, transparent 60%)`,
          }}
        />

        <div ref={addRevealRef} className="reveal relative max-w-3xl mx-auto px-6 text-center">
          <p
            className="font-serif text-[#0C1F3F] leading-tight tracking-tight mb-10"
            style={{ fontSize: 'clamp(28px, 4vw, 48px)', letterSpacing: '-0.03em' }}
          >
            This isn&rsquo;t incremental improvement.<br />
            This is <span style={{ color: '#FF6B4A' }}>structural change.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link
              href="/campus-os/demo"
              className="group inline-flex items-center gap-3 px-10 py-5 rounded-full text-lg font-semibold text-white bg-[#0C1F3F] hover:bg-[#162d52] hover:shadow-2xl hover:shadow-[#0C1F3F]/20 hover:scale-[1.03] transition-all duration-300"
            >
              Explore the demos
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>

            <Link
              href="/campus-os/whitepaper"
              className="inline-flex items-center gap-2 px-8 py-5 rounded-full text-lg font-medium text-[#0C1F3F]/60 border border-[#0C1F3F]/10 hover:border-[#0C1F3F]/25 hover:text-[#0C1F3F]/80 transition-all duration-300"
            >
              Read the white paper
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </Link>
          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────────────────
           FOOTER
      ───────────────────────────────────────────────── */}
      <footer className="bg-[#0C1F3F] py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="font-sans text-lg font-bold text-white/80">
              arrival<span style={{ color: '#00A8A8' }}>.ai</span>
            </span>
            <span className="text-white/20 text-sm">Campus OS</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-white/40">
            <a href="https://transformlearning.ai" className="hover:text-white/70 transition-colors">
              transformlearning.ai
            </a>
            <span className="text-white/10">|</span>
            <Link href="/campus-os/demo" className="hover:text-white/70 transition-colors">
              Demos
            </Link>
            <span className="text-white/10">|</span>
            <Link href="/campus-os/whitepaper" className="hover:text-white/70 transition-colors">
              White Paper
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
