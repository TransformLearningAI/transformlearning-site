'use client'

import Link from 'next/link'
import { useState } from 'react'

const TOOLS = [
  {
    name: 'study.transformlearning.ai',
    tagline: 'Adaptive study, powered by what you actually know.',
    href: 'https://study.transformlearning.ai',
    color: '#00A8A8',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="4" width="22" height="18" rx="3" stroke="currentColor" strokeWidth="1.8" fill="none"/>
        <path d="M9 11H19M9 15H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="21" cy="18" r="4" fill="#00A8A8" stroke="white" strokeWidth="1.5"/>
        <path d="M20 17.5L21 18.5L22.5 17" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    audience: 'Students & Organizations',
    desc: 'Upload any syllabus, program guide, or course list. The AI maps every skill, measures your actual proficiency through adaptive quizzes, and generates study materials targeted to your specific gaps — not generic review, but exactly what you need to work on next.',
    features: [
      'AI skill extraction from any educational document',
      'Adaptive proficiency quizzes calibrated to your level',
      'Personalized study guides targeted to measured gaps',
      'AI coaching conversations focused on specific skills',
      'Trajectory tracking — see if you\'re improving, flat, or declining',
    ],
    availability: 'Free for individual students. Institutional licenses for colleges and universities.',
  },
  {
    name: 'transformlearning.ai',
    tagline: 'The proficiency engine for teaching and learning.',
    href: '/',
    color: '#0C1F3F',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M5 22C8 16 12 11 17 9C21 7.5 24 8 25 10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <circle cx="25" cy="10.5" r="2.5" fill="#4F8A5B"/>
        <path d="M5 24H23" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.2"/>
      </svg>
    ),
    audience: 'Faculty & Institutions',
    desc: 'A Bayesian competency estimation system for higher education. Faculty submit a syllabus, the AI maps every skill, and students receive continuous proficiency estimates with credible intervals — not grades, but a transparent, governed diagnostic of what they actually understand.',
    features: [
      'Bayesian competency estimation with uncertainty quantification',
      'Multi-source evidence fusion (assessments, work uploads, coaching)',
      'Four-layer integrity framework with equity assurance',
      'Faculty dashboards with per-student and per-skill analytics',
      'Pilot program with dedicated onboarding for institutions',
    ],
    availability: 'Free pilot program for colleges and community colleges.',
  },
  {
    name: 'findmyway.today',
    tagline: 'Figure out what comes next.',
    href: 'https://findmyway.today',
    color: '#C4522A',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="1.8" fill="none"/>
        <path d="M14 8V14L18 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="14" cy="14" r="1.5" fill="#C4522A"/>
      </svg>
    ),
    audience: 'High School Students & Counselors',
    desc: 'An AI career coach that helps high school students explore what to do after graduation — without pushing college as the default answer. Interactive games, a guided conversation with an AI mentor, and a personalized path report with honest match percentages.',
    features: [
      'AI-guided career conversation (5 minutes, no sign-up)',
      'Interactive games: Pick Your World, Your Vibe, Money Real Talk',
      'Personalized path reports with match percentages',
      'Counselor tools — share a link, receive student results automatically',
      'Bilingual (English and Spanish)',
    ],
    availability: 'Free for all students. Counselor tools available at no cost.',
  },
  {
    name: 'soltas.ai',
    tagline: 'Your next chapter starts here.',
    href: 'https://soltas.ai',
    color: '#2D5016',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 5v18M8 14c0-4 2.5-7 6-7s6 3 6 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="14" cy="8" r="2.5" fill="#A3BE8C"/>
      </svg>
    ),
    audience: 'People Rebuilding After Incarceration',
    desc: 'Free AI career coaching built for formerly incarcerated men and women in the United States. Real jobs that actually hire people with records. Honest about the barriers. Real resources — housing, legal aid, workforce programs, and employers near you. No sign-up. No judgment.',
    features: [
      'AI career coach tuned for reentry — knows which paths hire with records',
      '10 career paths with honest background check reality for each',
      'Specific next steps: training programs, Fair Chance employers, unions',
      'Resource directory: housing, legal aid, benefits, workforce programs',
      'Built with input from reentry organizations',
    ],
    availability: 'Free forever for anyone who needs it.',
  },
  {
    name: 'holdfast.today',
    tagline: 'You served. Now build what\'s yours.',
    href: 'https://holdfast.today',
    color: '#1B2A4A',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 4v20M8 8l6-4 6 4M8 20l6 4 6-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="14" cy="14" r="3" fill="#C49A3C"/>
      </svg>
    ),
    audience: 'Veterans & Transitioning Service Members',
    desc: 'Free AI career coaching built for veterans. Translates military experience into civilian career paths — not just your MOS, but the leadership, problem-solving, and discipline the civilian world doesn\'t know how to read on a DD-214. Hidden skills discovery, career matching, GI Bill and VA resource guidance.',
    features: [
      'AI career coach that understands military experience and rank structure',
      'Hidden Skills Audit — translates service into professional language',
      '12 career paths with clearance advantage and Veterans\' Preference info',
      'Reality Check — factors GI Bill, clearance, disability rating, family',
      'Resource directory: USAJOBS, SkillBridge, VET TEC, Hire Heroes, VA benefits',
    ],
    availability: 'Free for all veterans and transitioning service members.',
  },
]

const INTEREST_OPTIONS = [
  'Integrating AI into teaching and curriculum',
  'Competency-based program redesign',
  'Student proficiency measurement and analytics',
  'AI coaching and adaptive learning tools',
  'Portable skill credentials and micro-credentials',
  'Career guidance and post-graduation pathways',
  'Institutional analytics and program evaluation',
  'Global education access and equity',
  'Workforce-education alignment',
  'Research collaboration or partnership',
]

const ROLE_OPTIONS = [
  'Faculty / Professor',
  'Department Chair',
  'Dean / Provost / VP Academic Affairs',
  'Institutional Research / Assessment',
  'IT / Learning Technology',
  'Curriculum Designer / Instructional Designer',
  'K-12 Administrator or Counselor',
  'Workforce Development / Training',
  'Government / Policy',
  'Investor / Advisor',
  'Student',
  'Researcher',
  'Other',
]

function InquiryForm() {
  const [form, setForm] = useState({ name: '', email: '', organization: '', role: '', interests: [], message: '' })
  const [status, setStatus] = useState('idle')
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const toggleInterest = (i) => setForm(f => ({
    ...f,
    interests: f.interests.includes(i) ? f.interests.filter(x => x !== i) : [...f.interests, i],
  }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) return
    setStatus('sending')
    try {
      const res = await fetch('/api/tools-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch { setStatus('error') }
  }

  return (
    <section id="connect" className="py-16 lg:py-24" style={{ background: '#F4F7FB' }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left — context */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] mb-4" style={{ color: '#00A8A8' }}>
              Get involved
            </p>
            <h2 className="font-serif font-light mb-6"
                style={{ fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.1, letterSpacing: '-0.02em', color: '#0C1F3F' }}>
              Interested in the future of AI in education?
            </h2>
            <p className="text-base text-gray-500 leading-relaxed mb-6">
              We&apos;re building these tools in partnership with educators, institutions, and
              organizations that see AI not as a threat to education but as an opportunity to
              fundamentally rethink how teaching and learning work. If you&apos;re thinking about
              these problems &mdash; at any scale, in any context &mdash; we want to hear from you.
            </p>
            <p className="text-base text-gray-500 leading-relaxed mb-8">
              Whether you&apos;re a faculty member experimenting with AI in your classroom, a dean
              exploring competency-based models, a training organization rethinking credentialing,
              or a policymaker shaping the future of education &mdash; tell us what you&apos;re
              working on and where you think AI fits.
            </p>
            <div className="space-y-3">
              {[
                'We respond personally to every inquiry',
                'No sales pitch — just a conversation about what you\'re building',
                'Pilot partnerships available for institutions ready to move',
              ].map(item => (
                <div key={item} className="flex items-start gap-2.5">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="mt-0.5 flex-shrink-0">
                    <path d="M2 7L5.5 10.5L12 3.5" stroke="#4F8A5B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-sm text-gray-600">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8" style={{ boxShadow: '0 4px 24px rgba(12,31,63,0.06)' }}>
            {status === 'sent' ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: '#4F8A5B' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="font-serif font-light text-xl mb-3" style={{ color: '#0C1F3F' }}>Thank you.</h3>
                <p className="text-sm text-gray-500">We&apos;ll follow up at <strong className="text-gray-900">{form.email}</strong> shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400 mb-1.5">Your name *</label>
                    <input type="text" required value={form.name} onChange={e => upd('name', e.target.value)}
                      placeholder="Dr. Sarah Kim"
                      className="w-full px-4 py-3 rounded-xl text-sm border border-gray-200 outline-none focus:border-[#00A8A8] transition-colors" style={{ background: '#F9FAFB' }} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400 mb-1.5">Email *</label>
                    <input type="email" required value={form.email} onChange={e => upd('email', e.target.value)}
                      placeholder="sarah@university.edu"
                      className="w-full px-4 py-3 rounded-xl text-sm border border-gray-200 outline-none focus:border-[#00A8A8] transition-colors" style={{ background: '#F9FAFB' }} />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400 mb-1.5">Organization</label>
                    <input type="text" value={form.organization} onChange={e => upd('organization', e.target.value)}
                      placeholder="University, company, or org"
                      className="w-full px-4 py-3 rounded-xl text-sm border border-gray-200 outline-none focus:border-[#00A8A8] transition-colors" style={{ background: '#F9FAFB' }} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400 mb-1.5">Your role</label>
                    <select value={form.role} onChange={e => upd('role', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-sm border border-gray-200 outline-none focus:border-[#00A8A8] transition-colors appearance-none" style={{ background: '#F9FAFB' }}>
                      <option value="">Select...</option>
                      {ROLE_OPTIONS.map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400 mb-2.5">What interests you? (select all that apply)</label>
                  <div className="flex flex-wrap gap-2">
                    {INTEREST_OPTIONS.map(i => (
                      <button key={i} type="button" onClick={() => toggleInterest(i)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                        style={{
                          background: form.interests.includes(i) ? '#00A8A8' : '#F4F7FB',
                          color: form.interests.includes(i) ? 'white' : '#6B7280',
                          border: form.interests.includes(i) ? '1px solid #00A8A8' : '1px solid #E5E7EB',
                        }}>
                        {i}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400 mb-1.5">Tell us what you&apos;re working on</label>
                  <textarea value={form.message} onChange={e => upd('message', e.target.value)} rows={4}
                    placeholder="What problems are you trying to solve? How are you thinking about AI in education? What would be most useful to you?"
                    className="w-full px-4 py-3 rounded-xl text-sm border border-gray-200 outline-none focus:border-[#00A8A8] transition-colors resize-none" style={{ background: '#F9FAFB' }} />
                </div>

                <button type="submit" disabled={!form.name.trim() || !form.email.trim() || status === 'sending'}
                  className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: '#0C1F3F' }}>
                  {status === 'sending' ? 'Sending...' : 'Start the Conversation →'}
                </button>

                {status === 'error' && (
                  <p className="text-xs text-red-500 text-center">Something went wrong. Please try again.</p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#0C1F3F' }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 12C4.5 8 7 5 10 4C12.5 3 14.5 3.5 15 5" stroke="#00A8A8" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                <circle cx="15" cy="5" r="1.2" fill="#4F8A5B"/>
              </svg>
            </div>
            <span className="font-bold text-sm" style={{ color: '#0C1F3F' }}>
              transform<span style={{ color: '#00A8A8' }}>learning</span>
            </span>
          </Link>
          <Link href="/" className="text-xs font-medium text-gray-500 hover:text-gray-900">&larr; Back to site</Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative overflow-hidden" style={{ background: '#0C1F3F' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(0,168,168,0.08) 0%, transparent 60%), radial-gradient(circle at 70% 30%, rgba(79,138,91,0.06) 0%, transparent 50%)',
        }} />
        <div className="relative max-w-5xl mx-auto px-6 py-20 lg:py-28">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/5 mb-8">
            <span className="w-2 h-2 rounded-full" style={{ background: '#4F8A5B' }} />
            <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Our Tools</span>
          </div>

          <h1 className="font-serif font-light text-white mb-6"
              style={{ fontSize: 'clamp(36px, 6vw, 64px)', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
            AI tools that meet learners<br />
            <em className="italic" style={{ color: '#00A8A8' }}>where they actually are.</em>
          </h1>

          <p className="text-xl text-white/70 leading-relaxed max-w-2xl mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            We believe that honest information about your own potential should be free, specific,
            and available to everyone &mdash; regardless of where you started, what you&apos;ve been
            through, or what the system assumes about you.
          </p>

          <p className="text-base text-white/50 leading-relaxed max-w-2xl mb-10">
            Transform Learning builds AI tools for people at turning points. A college student who
            needs to see what grades hide. A teenager figuring out what comes after high school.
            Someone coming home after incarceration. A veteran building a civilian life. Each tool
            is built for a specific moment &mdash; because generic advice helps no one.
          </p>

          {/* App links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-4xl">
            {[
              { name: 'study.transformlearning.ai', label: 'Students', color: '#00A8A8', href: 'https://study-app-jeff-7385s-projects.vercel.app', desc: 'Know what you actually know' },
              { name: 'transformlearning.ai', label: 'Postsecondary Learning', color: '#0C1F3F', href: '/', desc: 'Skills and knowledge measurement' },
              { name: 'findmyway.today', label: 'High School', color: '#C4522A', href: 'https://findmyway.today', desc: 'Figure out what comes next' },
              { name: 'soltas.ai', label: 'Reentry', color: '#2D5016', href: 'https://soltas.ai', desc: 'Rebuild with what you have' },
              { name: 'holdfast.today', label: 'Veterans', color: '#1B2A4A', href: 'https://holdfast.today', desc: 'You served. Now build yours.' },
            ].map(app => (
              <a key={app.name} href={app.href} target={app.href.startsWith('http') ? '_blank' : undefined}
                 rel={app.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                 className="rounded-xl px-4 py-4 transition-all hover:scale-[1.02] hover:shadow-lg"
                 style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: app.color === '#0C1F3F' ? '#00A8A8' : app.color }}>{app.label}</p>
                <p className="text-sm text-white/70 font-semibold mb-1 break-all leading-tight">{app.name}</p>
                <p className="text-xs text-white/40 leading-snug">{app.desc}</p>
              </a>
            ))}
          </div>

          <div className="flex flex-wrap gap-8 text-sm text-white/40 mt-8">
            <span>Free for individuals</span>
            <span>·</span>
            <span>No sign-up required</span>
            <span>·</span>
            <span>No judgment</span>
          </div>
        </div>
      </header>

      {/* Ethos */}
      <section className="py-16 lg:py-20" style={{ background: '#F4F7FB' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-bold uppercase tracking-[0.14em] mb-4" style={{ color: '#00A8A8' }}>
              Our Ethos
            </p>
            <h2 className="font-serif font-light mb-6"
                style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', lineHeight: 1.15, letterSpacing: '-0.02em', color: '#0C1F3F' }}>
              The systems we built to help people learn, choose careers, and rebuild their lives
              share a single design flaw: they tell people what the institution needs them to hear
              instead of what is actually true.
            </h2>
            <p className="text-base text-gray-500 leading-relaxed mb-6">
              Grades compress months of learning into a single letter. Career quizzes reduce a
              human being to a personality type. Reentry programs hand out pamphlets. Transition
              offices run you through a PowerPoint. None of it is built for you. All of it is
              built for the system.
            </p>
            <p className="text-base text-gray-500 leading-relaxed mb-6">
              We build tools that do something different. They ask real questions. They listen to
              the answers. They surface what you already know but haven&apos;t been shown. And they
              tell you the truth &mdash; about where you stand, what fits, and what&apos;s actually
              possible &mdash; without pretending to know more than they do.
            </p>
            <p className="text-base font-semibold leading-relaxed" style={{ color: '#0C1F3F' }}>
              Every tool we build follows three rules: it must be honest about what it knows,
              transparent about how it knows it, and free for anyone who needs it.
            </p>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] mb-10" style={{ color: '#00A8A8' }}>
            The Suite
          </p>

          <div className="space-y-8">
            {TOOLS.map((tool, i) => (
              <div key={tool.name} className="rounded-2xl border border-gray-200 overflow-hidden">
                {/* Tool header */}
                <div className="p-8 lg:p-10" style={{ background: tool.color === '#0C1F3F' ? '#0C1F3F' : 'white' }}>
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                             style={{
                               background: tool.color === '#0C1F3F' ? 'rgba(255,255,255,0.1)' : `${tool.color}10`,
                               color: tool.color === '#0C1F3F' ? 'white' : tool.color,
                             }}>
                          {tool.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg"
                              style={{ color: tool.color === '#0C1F3F' ? 'white' : '#0C1F3F' }}>
                            {tool.name}
                          </h3>
                          <p className="text-xs font-bold uppercase tracking-wider"
                             style={{ color: tool.color === '#0C1F3F' ? 'rgba(255,255,255,0.4)' : tool.color }}>
                            {tool.audience}
                          </p>
                        </div>
                      </div>

                      <p className="font-serif font-light mb-4"
                         style={{
                           fontSize: 'clamp(20px, 3vw, 28px)', lineHeight: 1.2, letterSpacing: '-0.01em',
                           color: tool.color === '#0C1F3F' ? '#00A8A8' : '#0C1F3F',
                         }}>
                        {tool.tagline}
                      </p>

                      <p className="text-sm leading-relaxed mb-6"
                         style={{ color: tool.color === '#0C1F3F' ? 'rgba(255,255,255,0.6)' : '#6B7280' }}>
                        {tool.desc}
                      </p>

                      <ul className="space-y-2 mb-6">
                        {tool.features.map(f => (
                          <li key={f} className="flex items-start gap-2.5">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="mt-0.5 flex-shrink-0">
                              <path d="M2 7L5.5 10.5L12 3.5" stroke={tool.color === '#0C1F3F' ? '#00A8A8' : tool.color}
                                    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span className="text-sm"
                                  style={{ color: tool.color === '#0C1F3F' ? 'rgba(255,255,255,0.7)' : '#6B7280' }}>
                              {f}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <div className="flex flex-wrap items-center gap-4">
                        <a href={tool.href}
                           className="inline-block px-6 py-3 rounded-lg text-sm font-bold transition-all hover:opacity-90"
                           style={{
                             background: tool.color === '#0C1F3F' ? '#00A8A8' : tool.color,
                             color: 'white',
                           }}>
                          {tool.name === 'transformlearning.ai' ? 'Learn More →' : `Visit ${tool.name} →`}
                        </a>
                        <span className="text-xs"
                              style={{ color: tool.color === '#0C1F3F' ? 'rgba(255,255,255,0.3)' : '#9CA3AF' }}>
                          {tool.availability}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For organizations */}
      <section className="py-16 lg:py-24" style={{ background: '#F4F7FB' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] mb-4" style={{ color: '#00A8A8' }}>
                For Organizations
              </p>
              <h2 className="font-serif font-light mb-6"
                  style={{ fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.1, letterSpacing: '-0.02em', color: '#0C1F3F' }}>
                Institutional licenses for colleges, universities, and training programs.
              </h2>
              <p className="text-base text-gray-500 leading-relaxed mb-6">
                Every tool in the Transform Learning suite is available as an institutional license.
                Deploy across departments, integrate with your LMS, and give your faculty real-time
                visibility into what their students actually know &mdash; not what a gradebook says
                they know.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  'Unlimited faculty and student accounts',
                  'Dedicated onboarding and training',
                  'Custom skill framework development',
                  'Institutional analytics and reporting',
                  'Data stays in your jurisdiction — SOC 2 compliant',
                ].map(f => (
                  <div key={f} className="flex items-center gap-2.5">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7L5.5 10.5L12 3.5" stroke="#4F8A5B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-sm text-gray-600">{f}</span>
                  </div>
                ))}
              </div>
              <a href="/#pilot"
                 className="inline-block px-8 py-4 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                 style={{ background: '#0C1F3F' }}>
                Start a Pilot Conversation →
              </a>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Community Colleges', desc: 'Retention tools that show students where they stand before it\'s too late to intervene.', color: '#00A8A8' },
                { label: 'Research Universities', desc: 'Faculty-facing analytics for large sections with per-student skill visibility.', color: '#0C1F3F' },
                { label: 'Workforce Training', desc: 'Competency verification for technical and professional development programs.', color: '#4F8A5B' },
                { label: 'K-12 Systems', desc: 'Career guidance tools that help students explore paths beyond the four-year degree.', color: '#C4522A' },
              ].map(org => (
                <div key={org.label} className="rounded-xl bg-white border border-gray-200 p-5 flex items-start gap-4">
                  <div className="w-3 h-3 rounded-full mt-1 flex-shrink-0" style={{ background: org.color }} />
                  <div>
                    <h4 className="text-sm font-bold mb-1" style={{ color: '#0C1F3F' }}>{org.label}</h4>
                    <p className="text-sm text-gray-500">{org.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Future */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.14em] mb-4" style={{ color: '#4F8A5B' }}>
              Where we&apos;re going
            </p>
            <h2 className="font-serif font-light mb-6"
                style={{ fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 1.1, letterSpacing: '-0.02em', color: '#0C1F3F' }}>
              Comprehensive AI infrastructure for reimagining education.
            </h2>
            <p className="text-base text-gray-500 leading-relaxed mb-10">
              The tools above are the foundation. What we are building is larger: a comprehensive,
              AI-integrated platform for reorganizing how higher education works &mdash; from how
              institutions design programs, to how students move through them, to how learning is
              measured, credentialed, and connected to the world beyond campus. Not incremental
              improvement. Structural reimagination.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              {
                title: 'Competency-Based Program Design',
                desc: 'AI tools that help institutions redesign degree programs around demonstrated competency rather than seat time. Map the skill landscape of an entire program, identify redundancies and gaps across courses, and build flexible pathways that let students progress when they\'re ready — not when the calendar says so.',
                color: '#0C1F3F',
                horizon: 'In development',
              },
              {
                title: 'Institutional Intelligence',
                desc: 'Real-time analytics that show deans and provosts what their students actually know at the program level — not grade distributions, but competency distributions. Which skills are systematically weak across a cohort? Where is the curriculum producing the outcomes it promises, and where is it falling short?',
                color: '#00A8A8',
                horizon: 'In development',
              },
              {
                title: 'Portable Skill Credentials',
                desc: 'A verifiable, portable record of what a student can do — not what courses they sat through. Competency credentials that travel with the student across institutions and into the workforce, backed by the same Bayesian estimation and integrity framework that powers the measurement tools.',
                color: '#4F8A5B',
                horizon: '2027',
              },
              {
                title: 'Global Learning Networks',
                desc: 'Infrastructure that connects learners, educators, and institutions across borders. A student in Nairobi and a student in Pittsburgh working on the same skill can access the same adaptive tools, the same AI coaching, and the same credentialing — calibrated to their context, not constrained by it.',
                color: '#5A3E6B',
                horizon: '2027–2028',
              },
              {
                title: 'AI-Native Curriculum Models',
                desc: 'New models for teaching and learning built for a world where AI is a permanent participant. Not "how do we use AI in the classroom" — but how do we redesign the classroom itself when students have access to intelligence that can answer any factual question instantly? What does education optimize for when information is free?',
                color: '#C4522A',
                horizon: '2027–2028',
              },
              {
                title: 'Workforce-Education Integration',
                desc: 'Tools that close the gap between what institutions teach and what employers need. Real-time skill demand data flowing back into curriculum design. Students who can see, before they enroll, which programs produce the competencies that lead to the outcomes they want — and institutions that can adapt when the landscape shifts.',
                color: '#FF6B4A',
                horizon: '2028',
              },
            ].map(item => (
              <div key={item.title} className="rounded-2xl border border-gray-200 p-7">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                        style={{ background: `${item.color}10`, color: item.color }}>
                    {item.horizon}
                  </span>
                </div>
                <h3 className="font-bold text-base mb-2" style={{ color: '#0C1F3F' }}>{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <blockquote className="font-serif font-light border-l-4 pl-6 my-8 max-w-3xl"
                      style={{ borderColor: '#4F8A5B', fontSize: 'clamp(20px, 2.5vw, 28px)', lineHeight: 1.3, letterSpacing: '-0.01em', color: '#0C1F3F' }}>
            The question is not how to add AI to education. The question is what education becomes
            when AI is assumed &mdash; when every student has a coach, every skill is measurable,
            every credential is verifiable, and every institution can see, in real time, whether
            it is producing what it promises.
          </blockquote>
        </div>
      </section>

      {/* Inquiry Form */}
      <InquiryForm />

      {/* CTA */}
      <section className="py-16 lg:py-20" style={{ background: '#0C1F3F' }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-serif font-light text-white mb-4"
              style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            Built for the world. Free for students.
          </h2>
          <p className="text-base text-white/50 mb-8 max-w-xl mx-auto">
            We believe the tools that help students understand what they know and choose where to go
            next should be available to everyone &mdash; regardless of institution, income, or location.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://study.transformlearning.ai"
               className="px-8 py-4 rounded-xl text-sm font-bold text-white"
               style={{ background: '#00A8A8', boxShadow: '0 0 30px rgba(0,168,168,0.3)' }}>
              Try Study Tools Free →
            </a>
            <Link href="/students"
               className="border border-white/20 text-white px-8 py-4 rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors">
              For Students →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400">
          <span>&copy; {new Date().getFullYear()} transformlearning.ai</span>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-gray-600">Home</Link>
            <Link href="/students" className="hover:text-gray-600">Students</Link>
            <Link href="/blog" className="hover:text-gray-600">Blog</Link>
            <Link href="/methodology" className="hover:text-gray-600">Methodology</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
