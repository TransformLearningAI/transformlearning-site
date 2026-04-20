'use client'
import { useState } from 'react'
import Link from 'next/link'
import FeedbackWidget from '@/components/FeedbackWidget'

const FREE_FEATURES = [
  {
    icon: '📋',
    title: 'Upload Anything',
    desc: 'A syllabus, program guide, list of courses in your major, degree requirements — whatever you have. The AI maps it into skills you can track.',
  },
  {
    icon: '🗺️',
    title: 'Skill Mapping',
    desc: 'See every skill in your course, program, or major laid out clearly. Know exactly what you need to learn and where you stand on each one.',
  },
  {
    icon: '📊',
    title: 'Proficiency Tracking',
    desc: 'Take adaptive quizzes to measure where you actually are — not where your grade says you are. Track your progress over time with real data.',
  },
  {
    icon: '📈',
    title: 'Trajectory Analysis',
    desc: 'See if your understanding is growing, flat, or declining. Catch problems before they show up in a grade.',
  },
  {
    icon: '📚',
    title: 'Study Guides',
    desc: 'AI-generated study guides targeted to your exact gaps. Not generic review — specific to what you don\'t understand yet.',
  },
  {
    icon: '🤝',
    title: 'Peer Learning',
    desc: 'Get matched with students who recently mastered what you\'re struggling with. Help others with skills you\'ve already nailed.',
  },
]

export default function StudentsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#0C1F3F' }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 12C4.5 8 7 5 10 4C12.5 3 14.5 3.5 15 5" stroke="#00A8A8" strokeWidth="1.5" strokeLinecap="round" fill="none"/><circle cx="15" cy="5" r="1.2" fill="#4F8A5B"/>
              </svg>
            </div>
            <span className="font-bold text-sm" style={{ color: '#0C1F3F' }}>
              transform<span style={{ color: '#00A8A8' }}>learning</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-500 hover:text-gray-900">Log in</Link>
            <Link href="/signup-student" className="text-sm font-bold text-white px-5 py-2.5 rounded-lg" style={{ background: '#00A8A8' }}>
              Get Started Free →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 lg:py-28" style={{ background: '#0C1F3F' }}>
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/5 mb-8">
            <span className="w-2 h-2 rounded-full" style={{ background: '#4F8A5B' }} />
            <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Free for all students</span>
          </div>

          <h1 className="font-serif font-light text-white mb-6"
              style={{ fontSize: 'clamp(36px, 6vw, 72px)', lineHeight: 1.0, letterSpacing: '-0.03em' }}>
            Know where you actually stand.<br />
            <em className="italic" style={{ color: '#00A8A8' }}>Not where your grade says you stand.</em>
          </h1>

          <p className="text-lg text-white/60 leading-relaxed max-w-2xl mx-auto mb-10">
            Upload a syllabus, program guide, or list of courses in your major. The AI maps every skill,
            tracks your proficiency, and shows you exactly where your understanding is strong and where
            it's breaking down — so you can fix it before the exam, not after.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link href="/signup-student"
              className="text-white px-8 py-4 rounded-xl font-bold text-sm"
              style={{ background: '#00A8A8', boxShadow: '0 0 30px rgba(0,168,168,0.3)' }}>
              Start Free →
            </Link>
            <a href="#how-it-works"
              className="border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-sm hover:bg-white/10 transition-colors">
              See How It Works
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm text-white/40">
            <span>✓ No credit card</span>
            <span>✓ Upload any syllabus or program</span>
            <span>✓ Unlimited skill tracking</span>
          </div>
        </div>
      </section>

      {/* What you can do */}
      <section className="py-20 lg:py-28" style={{ background: '#F4F7FB' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.14em] mb-4" style={{ color: '#00A8A8' }}>
              Everything below is free
            </p>
            <h2 className="font-serif font-light mb-4"
                style={{ fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 1.1, letterSpacing: '-0.02em', color: '#0C1F3F' }}>
              Upload. Map. Track. Improve.
            </h2>
            <p className="text-base text-gray-500 max-w-xl mx-auto">
              Whether it's one class, an entire major, or a program you're considering — the platform turns
              any document into a skill map you can track and improve against.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FREE_FEATURES.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-7 border border-gray-200">
                <div className="text-2xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-base mb-2" style={{ color: '#0C1F3F' }}>{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you can upload */}
      <section id="how-it-works" className="py-20 lg:py-28 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif font-light mb-4"
                style={{ fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 1.1, letterSpacing: '-0.02em', color: '#0C1F3F' }}>
              Upload anything. We'll map it.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              { title: 'A course syllabus', desc: 'The AI extracts every skill and knowledge area. You get a map of what you need to learn and can track your progress on each one.', tag: 'Most common' },
              { title: 'A program guide', desc: 'Upload your degree program requirements. See the full landscape of skills across your entire major — not just one class.', tag: 'Big picture' },
              { title: 'A list of courses', desc: 'Paste or upload the courses in your major. The AI identifies the skills that thread across all of them and maps the connections.', tag: 'Cross-course' },
              { title: 'Degree requirements', desc: 'Upload the requirements page from your college catalog. The AI builds a skill framework for your entire degree path.', tag: 'Full path' },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl p-7 border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                        style={{ background: 'rgba(0,168,168,0.1)', color: '#00A8A8' }}>
                    {item.tag}
                  </span>
                </div>
                <h3 className="font-bold text-base mb-2" style={{ color: '#0C1F3F' }}>{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Coach — paid tier */}
      <section className="py-20 lg:py-28" style={{ background: '#0C1F3F' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-white/5 mb-6">
                <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Premium</span>
              </div>
              <h2 className="font-serif font-light text-white mb-6"
                  style={{ fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                AI Learning Coach
              </h2>
              <p className="text-lg text-white/60 leading-relaxed mb-8">
                Everything above is free. But when you're stuck on a concept and need someone to walk you
                through it — step by step, at your pace — the AI coach is there.
              </p>

              <ul className="space-y-4 mb-10">
                {[
                  'Personalized coaching conversations focused on your exact gaps',
                  'Adapts to your pace — gradual, moderate, or fast',
                  'Asks probing questions to find where understanding breaks down',
                  'Connects new concepts to things you already know',
                  'Available 24/7 — no office hours, no wait',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="mt-1 flex-shrink-0" aria-hidden="true">
                      <path d="M2 7L5.5 10.5L12 3.5" stroke="#00A8A8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-sm text-white/70">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">AI Coach</div>
              <div className="flex items-baseline justify-center gap-1 mb-1">
                <span className="text-5xl font-black" style={{ color: '#0C1F3F' }}>$10</span>
                <span className="text-gray-400 text-sm">/month</span>
              </div>
              <p className="text-sm text-gray-400 mb-6">Cancel anytime. No commitment.</p>

              <div className="border-t border-gray-200 pt-6 mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Includes everything free, plus:</p>
                <ul className="space-y-3 text-left">
                  {[
                    'Unlimited AI coaching conversations',
                    'Pace control (gradual → fast)',
                    'Skill-specific deep dives',
                    'Misconception detection & correction',
                    'Practice strategy recommendations',
                  ].map(item => (
                    <li key={item} className="flex items-center gap-2">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M2 6L4.5 8.5L10 3" stroke="#00A8A8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-sm text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link href="/signup-student"
                className="block w-full py-3.5 rounded-lg font-bold text-sm text-white"
                style={{ background: '#0C1F3F' }}>
                Start Free — Upgrade Later →
              </Link>
              <p className="text-xs text-gray-400 mt-3">
                Start with everything free. Add coaching when you need it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-serif font-light text-center mb-12"
              style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', lineHeight: 1.1, letterSpacing: '-0.02em', color: '#0C1F3F' }}>
            Free vs. Coach
          </h2>

          <div className="rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200" style={{ background: '#F4F7FB' }}>
                  <th className="text-left px-6 py-4 font-bold" style={{ color: '#0C1F3F' }}>Feature</th>
                  <th className="px-6 py-4 font-bold text-center" style={{ color: '#0C1F3F' }}>Free</th>
                  <th className="px-6 py-4 font-bold text-center" style={{ color: '#00A8A8' }}>+ Coach ($10/mo)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Upload syllabi, programs, course lists', true, true],
                  ['AI skill mapping', true, true],
                  ['Proficiency tracking & quizzes', true, true],
                  ['Trajectory analysis', true, true],
                  ['AI study guides', true, true],
                  ['Peer learning matches', true, true],
                  ['AI coaching conversations', false, true],
                  ['Pace control (gradual/moderate/fast)', false, true],
                  ['Misconception detection', false, true],
                ].map(([feature, free, paid], i) => (
                  <tr key={i} className={i < 8 ? 'border-b border-gray-100' : ''}>
                    <td className="px-6 py-3.5 text-gray-600">{feature}</td>
                    <td className="px-6 py-3.5 text-center">
                      {free
                        ? <span style={{ color: '#4F8A5B' }}>✓</span>
                        : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      {paid
                        ? <span style={{ color: '#00A8A8' }}>✓</span>
                        : <span className="text-gray-300">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 lg:py-28" style={{ background: '#F4F7FB' }}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-serif font-light mb-4"
              style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', lineHeight: 1.1, letterSpacing: '-0.02em', color: '#0C1F3F' }}>
            Stop guessing. Start seeing.
          </h2>
          <p className="text-base text-gray-500 mb-8">
            Upload your syllabus or program guide. In 30 minutes, you'll know exactly where you stand
            on every skill — and what to do about it.
          </p>
          <Link href="/signup-student"
            className="inline-block text-white px-8 py-4 rounded-xl font-bold text-sm"
            style={{ background: '#00A8A8' }}>
            Get Started Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400">
          <span>© {new Date().getFullYear()} transformlearning.ai</span>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-gray-600">Home</Link>
            <Link href="/blog" className="hover:text-gray-600">Blog</Link>
            <Link href="/methodology" className="hover:text-gray-600">Methodology</Link>
            <Link href="/demo" className="hover:text-gray-600">Demo</Link>
          </div>
        </div>
      </footer>
      <FeedbackWidget page="students" />
    </div>
  )
}
