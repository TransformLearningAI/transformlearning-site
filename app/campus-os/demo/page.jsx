'use client';

import Link from 'next/link';

const roles = [
  {
    title: 'Student',
    href: '/campus-os/demo/student',
    description: 'Track your skills, close gaps, see your path forward',
    color: '#00A8A8',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
      </svg>
    ),
  },
  {
    title: 'Professor',
    href: '/campus-os/demo/professor',
    description: 'Monitor cohort progress, identify at-risk students, intervene early',
    color: '#0C1F3F',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <path d="M9 7h6M9 11h4" />
      </svg>
    ),
  },
  {
    title: 'Department Chair',
    href: '/campus-os/demo/chair',
    description: 'Compare sections, track DFW rates, coordinate faculty',
    color: '#4F8A5B',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: 'Dean',
    href: '/campus-os/demo/dean',
    description: 'College-wide retention, program health, accreditation readiness',
    color: '#5A3E6B',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M3 21h18" />
        <path d="M5 21V7l7-4 7 4v14" />
        <path d="M9 21v-6h6v6" />
        <path d="M9 10h1M14 10h1" />
      </svg>
    ),
  },
  {
    title: 'President',
    href: '/campus-os/demo/president',
    description: 'Institution KPIs, enrollment health, strategic plan progress',
    color: '#0C1F3F',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    title: 'Academic Affairs',
    href: '/campus-os/demo/academic-affairs',
    description: 'Curriculum effectiveness, learning outcomes, program review',
    color: '#00A8A8',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M9 5H2v7l6.3 6.3a1 1 0 0 0 1.4 0l5.3-5.3a1 1 0 0 0 0-1.4L9 5z" />
        <circle cx="6" cy="9" r="1" fill="currentColor" />
        <path d="M14 5l7 7-5.3 5.3" />
      </svg>
    ),
  },
  {
    title: 'Finance',
    href: '/campus-os/demo/finance',
    description: 'DFW cost impact, retention revenue, tuition discount analysis',
    color: '#FF6B4A',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    title: 'Admissions',
    href: '/campus-os/demo/admissions',
    description: 'Application pipeline, yield rates, enrollment funnel',
    color: '#4F8A5B',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        <path d="M9 14l2 2 4-4" />
      </svg>
    ),
  },
];

export default function CampusOSDemoHub() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight" style={{ color: '#0C1F3F' }}>
            arrival.ai
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
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-12 text-center">
        <h1
          className="text-4xl md:text-5xl font-bold tracking-tight"
          style={{ fontFamily: 'Georgia, serif', color: '#0C1F3F' }}
        >
          Campus OS Demo
        </h1>
        <p className="mt-4 text-lg text-gray-500 max-w-xl mx-auto">
          Select a role to explore its dashboard.
        </p>
      </div>

      {/* Card Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role) => (
            <Link
              key={role.title}
              href={role.href}
              className="group block rounded-xl border border-gray-200 bg-white p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
            >
              {/* Icon badge */}
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-5"
                style={{ backgroundColor: role.color + '14', color: role.color }}
              >
                {role.icon}
              </div>

              {/* Title */}
              <h2 className="text-lg font-semibold" style={{ color: '#0C1F3F' }}>
                {role.title}
              </h2>

              {/* Description */}
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                {role.description}
              </p>

              {/* CTA */}
              <span
                className="inline-block mt-4 text-sm font-medium transition-colors duration-200"
                style={{ color: role.color }}
              >
                View Dashboard{' '}
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                  &rarr;
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
