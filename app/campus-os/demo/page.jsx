'use client';

import Link from 'next/link';

const NAVY = '#0C1F3F'
const TEAL = '#00A8A8'
const GREEN = '#4F8A5B'
const PLUM = '#5A3E6B'
const CORAL = '#FF6B4A'
const WARM_BG = '#FAF8F5'
const WARM_BORDER = '#EBE6E0'
const MUTED = '#6b635a'
const serif = 'Georgia, serif'

const shifts = [
  {
    title: 'Signal Hub',
    href: '/campus-os/demo/signal-hub',
    description: 'Student signals radiate to every guide who can act. No chain of command for data. Simultaneous awareness.',
    color: TEAL,
  },
  {
    title: 'Student Control',
    href: '/campus-os/demo/student-control',
    description: 'The student as operator. AI learning path, guide schedule, peer network, competency evidence map.',
    color: NAVY,
  },
  {
    title: 'Decision Router',
    href: '/campus-os/demo/decision-router',
    description: 'AI surfaces decisions needing human judgment. Routes to the one person who can act.',
    color: PLUM,
  },
  {
    title: 'Peer Marketplace',
    href: '/campus-os/demo/peer-marketplace',
    description: 'AI-matched peer coaching. Complementary skill profiles. Mastery meets struggle.',
    color: TEAL,
  },
  {
    title: 'Continuous Journey',
    href: '/campus-os/demo/continuous-journey',
    description: 'First inquiry through alumni. One unbroken thread. No handoffs. No gaps.',
    color: GREEN,
  },
  {
    title: 'Impact Allocation',
    href: '/campus-os/demo/impact-allocation',
    description: 'Resources follow learning evidence. Budget flows to where gaps are closing.',
    color: CORAL,
  },
  {
    title: 'Outcome Networks',
    href: '/campus-os/demo/outcome-networks',
    description: 'Learning outcomes across the knowledge graph. One network per outcome, not one silo per department.',
    color: GREEN,
  },
  {
    title: 'Live Pulse',
    href: '/campus-os/demo/live-pulse',
    description: 'Real-time institutional health. Every metric, every signal, right now.',
    color: CORAL,
  },
]

const roleViews = [
  { title: 'Student', href: '/campus-os/demo/student' },
  { title: 'Guide', href: '/campus-os/demo/guide-dashboard' },
  { title: 'Program Director', href: '/campus-os/demo/chair' },
  { title: 'Campus Director', href: '/campus-os/demo/dean' },
  { title: 'President', href: '/campus-os/demo/president' },
  { title: 'Finance', href: '/campus-os/demo/finance' },
  { title: 'Admissions', href: '/campus-os/demo/admissions' },
]

export default function CampusOSDemoHub() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: WARM_BG }}>
      {/* Nav */}
      <nav className="border-b" style={{ borderColor: WARM_BORDER, backgroundColor: 'white' }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight" style={{ color: NAVY }}>
            transform<span style={{ color: TEAL }}>learning</span>
          </Link>
          <Link href="/campus-os" className="text-sm font-medium hover:underline" style={{ color: NAVY }}>
            &larr; Campus OS
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-14 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-4" style={{ color: TEAL }}>Campus OS</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight" style={{ fontFamily: serif, color: NAVY }}>
          The university, rebuilt.
        </h1>
        <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: MUTED }}>
          AI instruction engine. Six guide types. Peer marketplace. Evidence-based everything.
          Each demo shows a structural component of the new model.
        </p>
      </div>

      {/* Demo Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {shifts.map(item => (
            <Link
              key={item.title}
              href={item.href}
              className="group block rounded-xl border bg-white p-7 transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
              style={{ borderColor: WARM_BORDER }}
            >
              <div className="w-8 h-1 rounded-full mb-5" style={{ backgroundColor: item.color }} />
              <h2 className="text-lg font-semibold mb-2" style={{ color: NAVY }}>{item.title}</h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color: MUTED }}>{item.description}</p>
              <span className="text-sm font-medium inline-block group-hover:translate-x-1 transition-transform" style={{ color: item.color }}>
                Explore &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Role-Based Views */}
      <div className="border-t" style={{ borderColor: WARM_BORDER }}>
        <div className="max-w-6xl mx-auto px-6 py-10 text-center">
          <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: MUTED }}>
            Role-based views
          </p>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {roleViews.map(role => (
              <Link key={role.title} href={role.href} className="text-sm hover:underline transition-colors" style={{ color: MUTED }}>
                {role.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
