'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

/* ─── role data ─── */
const roles = [
  {
    slug: 'student',
    title: 'Student',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
      </svg>
    ),
    description: 'Track your skill mastery, get AI coaching, and own your learning journey.',
  },
  {
    slug: 'professor',
    title: 'Professor',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    description: 'See real-time skill gaps across your sections and intervene before it\'s too late.',
  },
  {
    slug: 'chair',
    title: 'Department Chair',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
      </svg>
    ),
    description: 'Compare sections, align curriculum, and surface department-wide trends.',
  },
  {
    slug: 'dean',
    title: 'Dean',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
      </svg>
    ),
    description: 'Monitor college-level performance, DFW rates, and cross-department alignment.',
  },
  {
    slug: 'president',
    title: 'President',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
      </svg>
    ),
    description: 'Institution-wide KPIs, strategic readiness, and board-level reporting at a glance.',
  },
  {
    slug: 'academic-affairs',
    title: 'Academic Affairs',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
      </svg>
    ),
    description: 'Accreditation-ready evidence, curriculum mapping, and learning outcome alignment.',
  },
  {
    slug: 'finance',
    title: 'Finance',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
      </svg>
    ),
    description: 'Tie learning outcomes to retention revenue and quantify ROI on interventions.',
  },
  {
    slug: 'admissions',
    title: 'Admissions',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
    description: 'Predict yield, identify at-risk admits, and personalize the enrollment journey.',
  },
]

/* ─── how-it-works steps ─── */
const steps = [
  {
    number: '01',
    title: 'Connect',
    subtitle: 'Submit a syllabus',
    description: 'Upload any syllabus or course outline. Campus OS ingests it in seconds — no integrations, no IT tickets.',
    color: 'from-brand-teal to-brand-green',
    iconColor: 'text-brand-teal',
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'See',
    subtitle: 'AI maps every skill',
    description: 'Our engine extracts competencies, maps prerequisites, and surfaces skill relationships across your entire curriculum.',
    color: 'from-brand-purple to-brand-teal',
    iconColor: 'text-brand-purple',
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Act',
    subtitle: 'Close gaps with coaching',
    description: 'Students receive personalized AI coaching. Faculty get early alerts. Leaders get evidence. Everyone moves forward.',
    color: 'from-brand-coral to-brand-purple',
    iconColor: 'text-brand-coral',
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
      </svg>
    ),
  },
]

/* ─── outcomes data ─── */
const outcomes = [
  { value: '38%', label: 'DFW Rate Reduction', description: 'Fewer students failing or withdrawing from gateway courses' },
  { value: '24%', label: 'Retention Improvement', description: 'More students returning term over term with measurable skill growth' },
  { value: '12hrs', label: 'Faculty Time Saved', description: 'Per week per instructor through automated skill tracking and alerts' },
  { value: '100%', label: 'Accreditation Evidence', description: 'Continuous, auditable learning outcome data — always ready for review' },
]


export default function CampusOSPage() {
  const revealRefs = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
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
      {/* ───────── NAV ───────── */}
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-white/80 border-b border-brand-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="font-sans text-xl font-bold tracking-tight text-navy">
              arrival<span className="text-brand-teal">.ai</span>
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <a
              href="https://transformlearning.ai"
              className="text-sm font-medium text-brand-gray hover:text-navy transition-colors hidden sm:block"
            >
              transformlearning.ai
            </a>
            <Link
              href="/campus-os/demo"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-brand-teal to-brand-green hover:shadow-lg hover:shadow-brand-teal/25 transition-all duration-300"
            >
              Launch Demo
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </nav>

      {/* ───────── HERO ───────── */}
      <section className="relative pt-32 pb-24 md:pt-44 md:pb-36 overflow-hidden">
        {/* background */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-navy" />
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(0,168,168,0.2) 0%, transparent 50%),
                              radial-gradient(circle at 75% 75%, rgba(90,62,107,0.15) 0%, transparent 50%),
                              radial-gradient(circle at 50% 50%, rgba(79,138,91,0.1) 0%, transparent 60%)`
          }}
        />
        {/* subtle grid */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        {/* animated accent orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-brand-teal/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-brand-purple/10 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div ref={addRevealRef} className="reveal">
            <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.14em] text-brand-teal bg-brand-teal/10 border border-brand-teal/20 mb-8">
              <span className="w-2 h-2 rounded-full bg-brand-teal animate-pulse" />
              Now available for pilot partners
            </p>
          </div>

          <h1
            ref={addRevealRef}
            className="reveal font-serif font-light text-white leading-[0.95] tracking-tight mb-8"
            style={{ fontSize: 'clamp(48px, 7vw, 96px)', letterSpacing: '-0.03em' }}
          >
            Campus{' '}
            <span className="gradient-text">OS</span>
          </h1>

          <p
            ref={addRevealRef}
            className="reveal reveal-delay-1 text-xl md:text-2xl lg:text-3xl font-serif font-light text-white/70 max-w-3xl mx-auto mb-12 leading-snug"
          >
            One operating system. Every role.{' '}
            <span className="text-brand-teal">Complete visibility.</span>
          </p>

          <div ref={addRevealRef} className="reveal reveal-delay-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/campus-os/demo"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full text-lg font-semibold text-navy bg-gradient-to-r from-brand-teal to-brand-green hover:shadow-2xl hover:shadow-brand-teal/30 hover:scale-[1.03] transition-all duration-300"
            >
              See it in action
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <a
              href="https://transformlearning.ai"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-lg font-medium text-white/60 border border-white/10 hover:border-white/25 hover:text-white/80 transition-all duration-300"
            >
              Learn more
            </a>
          </div>

          {/* role pill strip */}
          <div ref={addRevealRef} className="reveal reveal-delay-3 mt-16 flex flex-wrap justify-center gap-3">
            {roles.map((role) => (
              <span
                key={role.slug}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium text-white/50 bg-white/5 border border-white/10"
              >
                {role.title}
              </span>
            ))}
          </div>
        </div>

        {/* bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ───────── ROLE GRID ───────── */}
      <section className="relative py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div ref={addRevealRef} className="reveal text-center mb-16">
            <p className="eyebrow text-brand-teal mb-4">Role-based dashboards</p>
            <h2 className="section-headline mb-4">
              Every seat at the table.{' '}
              <span className="teal-gradient-text">One source of truth.</span>
            </h2>
            <p className="body-text max-w-2xl mx-auto">
              Campus OS gives every stakeholder a tailored view of the same underlying intelligence — from first-year students to the president&rsquo;s office.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {roles.map((role, i) => (
              <Link
                key={role.slug}
                href={`/campus-os/demo/${role.slug}`}
                ref={addRevealRef}
                className={`reveal reveal-delay-${Math.min(i % 4 + 1, 5)} group relative gradient-border p-6 rounded-2xl card-lift cursor-pointer`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-teal/10 to-brand-green/10 flex items-center justify-center text-brand-teal group-hover:scale-110 transition-transform duration-300">
                    {role.icon}
                  </div>
                  <svg className="w-5 h-5 text-brand-gray/30 group-hover:text-brand-teal group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </div>
                <h3 className="font-sans text-lg font-semibold text-navy mb-2 group-hover:text-brand-teal transition-colors">
                  {role.title}
                </h3>
                <p className="text-sm text-brand-gray leading-relaxed">
                  {role.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── HOW IT WORKS ───────── */}
      <section className="relative py-24 md:py-32 bg-brand-soft overflow-hidden">
        {/* background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-brand-teal/[0.03] blur-[100px]" />

        <div className="relative max-w-6xl mx-auto px-6">
          <div ref={addRevealRef} className="reveal text-center mb-20">
            <p className="eyebrow text-brand-teal mb-4">How it works</p>
            <h2 className="section-headline">
              Three steps to{' '}
              <span className="teal-gradient-text">complete visibility</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step, i) => (
              <div
                key={step.number}
                ref={addRevealRef}
                className={`reveal reveal-delay-${i + 1} relative`}
              >
                {/* connector line (desktop only) */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-full w-full h-px bg-gradient-to-r from-brand-border to-transparent z-0" />
                )}

                <div className="relative">
                  {/* step number */}
                  <span className="block font-sans text-6xl font-bold text-navy/[0.06] mb-4 leading-none">
                    {step.number}
                  </span>

                  {/* icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white mb-6 shadow-lg`}>
                    {step.icon}
                  </div>

                  <h3 className="font-serif text-3xl font-light text-navy mb-1 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm font-semibold text-brand-teal uppercase tracking-wider mb-4">
                    {step.subtitle}
                  </p>
                  <p className="body-text">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── OUTCOMES ───────── */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* dark background */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-dark to-navy" />
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(0,168,168,0.2) 0%, transparent 50%),
                              radial-gradient(circle at 80% 50%, rgba(255,107,74,0.1) 0%, transparent 50%)`
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6">
          <div ref={addRevealRef} className="reveal text-center mb-16">
            <p className="eyebrow text-brand-teal mb-4">Proven outcomes</p>
            <h2 className="font-serif font-light text-white leading-tight tracking-tight mb-4" style={{ fontSize: 'clamp(32px, 4.5vw, 56px)', letterSpacing: '-0.03em' }}>
              The numbers{' '}
              <span className="gradient-text">speak for themselves</span>
            </h2>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">
              Campus OS transforms how institutions understand and improve student success — with measurable impact from day one.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {outcomes.map((outcome, i) => (
              <div
                key={outcome.label}
                ref={addRevealRef}
                className={`reveal reveal-delay-${i + 1} relative group rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-8 hover:border-brand-teal/30 hover:bg-white/[0.06] transition-all duration-500`}
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-teal/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <p className="font-serif text-5xl font-light text-brand-teal mb-3 tracking-tight">
                  {outcome.value}
                </p>
                <p className="font-sans text-base font-semibold text-white mb-2">
                  {outcome.label}
                </p>
                <p className="text-sm text-white/40 leading-relaxed">
                  {outcome.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── FINAL CTA ───────── */}
      <section className="relative py-24 md:py-32 bg-white overflow-hidden">
        {/* decorative background */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(0,168,168,0.3) 0%, transparent 70%)`
          }}
        />

        <div ref={addRevealRef} className="reveal relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="section-headline mb-6">
            Ready to see{' '}
            <span className="teal-gradient-text">Campus OS</span>
            ?
          </h2>
          <p className="body-text text-lg max-w-xl mx-auto mb-10">
            Book a live walkthrough. We&rsquo;ll show you every dashboard, every role, and exactly how Campus OS maps to your institution.
          </p>
          <Link
            href="/campus-os/demo"
            className="group inline-flex items-center gap-3 px-10 py-5 rounded-full text-lg font-semibold text-white bg-gradient-to-r from-navy to-navy-light hover:shadow-2xl hover:shadow-navy/30 hover:scale-[1.03] transition-all duration-300"
          >
            See it in action
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <p className="mt-6 text-sm text-brand-gray">
            No login required. Explore the full demo instantly.
          </p>
        </div>
      </section>

      {/* ───────── FOOTER ───────── */}
      <footer className="bg-navy py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-sans text-lg font-bold text-white/80">
              arrival<span className="text-brand-teal">.ai</span>
            </span>
            <span className="text-white/20 text-sm ml-3">Campus OS</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-white/40">
            <a href="https://transformlearning.ai" className="hover:text-white/70 transition-colors">
              transformlearning.ai
            </a>
            <span className="text-white/10">|</span>
            <Link href="/campus-os/demo" className="hover:text-white/70 transition-colors">
              Demo
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
