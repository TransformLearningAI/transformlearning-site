'use client';

import Link from 'next/link';

const shifts = [
  {
    title: 'The Signal Hub',
    href: '/campus-os/demo/signal-hub',
    description:
      "See how one student's learning signals radiate to everyone who needs to act — simultaneously, without hierarchy.",
    color: '#00A8A8',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <circle cx="12" cy="12" r="2" />
        <circle cx="12" cy="12" r="6" opacity="0.6" />
        <circle cx="12" cy="12" r="10" opacity="0.3" />
      </svg>
    ),
  },
  {
    title: 'Student Control Panel',
    href: '/campus-os/demo/student-control',
    description:
      'The student as operator. Full visibility. Full agency. Every resource, every peer, every path — at their fingertips.',
    color: '#0C1F3F',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
        <line x1="12" y1="3" x2="12" y2="5" />
        <line x1="12" y1="19" x2="12" y2="21" />
        <line x1="3" y1="12" x2="5" y2="12" />
        <line x1="19" y1="12" x2="21" y2="12" />
        <line x1="5.6" y1="5.6" x2="7" y2="7" />
        <line x1="17" y1="17" x2="18.4" y2="18.4" />
      </svg>
    ),
  },
  {
    title: 'Outcome Networks',
    href: '/campus-os/demo/outcome-networks',
    description:
      'Learning outcomes that cross departmental lines. One network per outcome, not one silo per department.',
    color: '#4F8A5B',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <circle cx="5" cy="6" r="2.5" />
        <circle cx="19" cy="6" r="2.5" />
        <circle cx="12" cy="18" r="2.5" />
        <circle cx="19" cy="18" r="2.5" />
        <line x1="7" y1="7" x2="10" y2="16" />
        <line x1="17" y1="7" x2="14" y2="16" />
        <line x1="7.5" y1="6" x2="16.5" y2="6" />
        <line x1="14.5" y1="18" x2="16.5" y2="18" />
      </svg>
    ),
  },
  {
    title: 'The Decision Router',
    href: '/campus-os/demo/decision-router',
    description:
      'AI identifies decisions that need human judgment, routes them to the right person with the data to decide in minutes.',
    color: '#5A3E6B',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <circle cx="12" cy="5" r="2" fill="currentColor" opacity="0.3" />
        <line x1="12" y1="7" x2="12" y2="11" />
        <path d="M12 11L6 17" />
        <path d="M12 11L18 17" />
        <path d="M12 11L12 19" />
        <circle cx="6" cy="19" r="2" />
        <circle cx="12" cy="21" r="2" />
        <circle cx="18" cy="19" r="2" />
      </svg>
    ),
  },
  {
    title: 'Peer Marketplace',
    href: '/campus-os/demo/peer-marketplace',
    description:
      'AI-matched peer learning. Mastery meets struggle. 72 hours fresher than any lecture.',
    color: '#00A8A8',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <circle cx="7" cy="8" r="3" />
        <circle cx="17" cy="8" r="3" />
        <path d="M7 11c-2.5 0-4 1.5-4 3v1" />
        <path d="M17 11c2.5 0 4 1.5 4 3v1" />
        <line x1="10" y1="9" x2="14" y2="9" strokeDasharray="1.5 1.5" />
        <path d="M9 17l3 3 3-3" />
      </svg>
    ),
  },
  {
    title: 'Continuous Journey',
    href: '/campus-os/demo/continuous-journey',
    description:
      'First inquiry through alumni. One unbroken thread. No handoffs. No gaps.',
    color: '#0C1F3F',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M3 12c0-4 3-7 7-7h4c4 0 7 3 7 7s-3 7-7 7h-4c-4 0-7-3-7-7z" />
        <circle cx="7" cy="12" r="1.5" fill="currentColor" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        <circle cx="17" cy="12" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: 'Impact Allocation',
    href: '/campus-os/demo/impact-allocation',
    description:
      'Resources follow impact. Budget flows to where learning gaps are closing, not where politics win.',
    color: '#FF6B4A',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M3 8c4-2 6 2 9 0s5-2 9 0" />
        <path d="M3 13c4-2 6 2 9 0s5-2 9 0" />
        <path d="M3 18c4-2 6 2 9 0s5-2 9 0" />
      </svg>
    ),
  },
  {
    title: 'Live Pulse',
    href: '/campus-os/demo/live-pulse',
    description:
      "Real-time institutional health. Every metric, every signal, right now — not next quarter's report.",
    color: '#4F8A5B',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <polyline points="2,12 6,12 9,4 12,20 15,8 18,12 22,12" />
      </svg>
    ),
  },
];

const legacyRoles = [
  { title: 'Student', href: '/campus-os/demo/student' },
  { title: 'Professor', href: '/campus-os/demo/professor' },
  { title: 'Department Chair', href: '/campus-os/demo/chair' },
  { title: 'Dean', href: '/campus-os/demo/dean' },
  { title: 'President', href: '/campus-os/demo/president' },
  { title: 'Academic Affairs', href: '/campus-os/demo/academic-affairs' },
  { title: 'Finance', href: '/campus-os/demo/finance' },
  { title: 'Admissions', href: '/campus-os/demo/admissions' },
];

export default function CampusOSDemoHub() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight" style={{ color: '#0C1F3F' }}>
            transformlearning.ai
          </Link>
          <Link
            href="/campus-os"
            className="text-sm font-medium hover:underline"
            style={{ color: '#0C1F3F' }}
          >
            &larr; Back to Campus OS
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-14 text-center">
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
          style={{ fontFamily: 'Georgia, serif', color: '#0C1F3F' }}
        >
          Eight shifts. One system.
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Each demo shows a structural change powered by AI intelligence. These
          aren&apos;t dashboards for roles. They&apos;re views into a fundamentally
          different operating model.
        </p>
      </div>

      {/* Concept Demo Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {shifts.map((shift) => (
            <Link
              key={shift.title}
              href={shift.href}
              className="group block rounded-xl border border-gray-200 bg-white p-6 transition-all duration-200 hover:shadow-xl hover:-translate-y-1.5"
              style={{
                background: `linear-gradient(to bottom right, white 60%, ${shift.color}06)`,
              }}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-5"
                style={{ backgroundColor: shift.color + '14', color: shift.color }}
              >
                {shift.icon}
              </div>

              {/* Title */}
              <h2 className="text-lg font-semibold" style={{ color: '#0C1F3F' }}>
                {shift.title}
              </h2>

              {/* Description */}
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                {shift.description}
              </p>

              {/* CTA */}
              <span
                className="inline-block mt-4 text-sm font-medium transition-colors duration-200"
                style={{ color: shift.color }}
              >
                Explore{' '}
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                  &rarr;
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Legacy Role-Based Views */}
      <div className="border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-10 text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-4">
            Role-based views (legacy)
          </p>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {legacyRoles.map((role) => (
              <Link
                key={role.title}
                href={role.href}
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors duration-150"
              >
                {role.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
