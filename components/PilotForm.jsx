'use client'
import { useState } from 'react'

const ROLES = [
  'Faculty / Instructor',
  'Department Chair',
  'Academic Dean',
  'Provost / Academic VP',
  'Institutional Research',
  'IT / LMS Administrator',
  'Other',
]

const COURSES = [
  'College Algebra',
  'Introductory Statistics',
  'General Biology',
  'Other Gateway Course',
]

export default function PilotForm() {
  const [form, setForm]     = useState({ name: '', institution: '', role: '', course: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/pilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Request failed')
      setStatus('success')
      setForm({ name: '', institution: '', role: '', course: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="pilot" className="bg-navy py-20 lg:py-28 relative overflow-hidden">

      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: 'radial-gradient(circle at 75% 50%, rgba(47,125,246,0.1) 0%, transparent 55%)' }} />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-14 items-start">

          {/* Left: copy */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/50 mb-4">
              Ready to start?
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight mb-6">
              See what's actually happening in your gateway courses.
            </h2>
            <p className="text-lg text-white/60 leading-relaxed mb-8">
              Pilots are structured, evidence-based, and designed to produce results
              faculty can stand behind. Tell us about your course and we'll take it
              from there.
            </p>

            <div className="space-y-4">
              {[
                'No lengthy procurement process to start',
                'LMS integration handled with your IT team',
                'Baseline documentation from day one',
                'Evidence package at pilot completion',
              ].map(item => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5L4 7L8 3" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-sm text-white/70">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div className="bg-white rounded-2xl p-8">
            {status === 'success' ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-brand-green/10 flex items-center justify-center mx-auto mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12L10 17L19 7" stroke="#186900" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-navy mb-2">Request received.</h3>
                <p className="text-sm text-brand-gray">
                  We'll be in touch within one business day to schedule an initial conversation.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-bold text-navy mb-6">Become a Pilot Partner</h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-text mb-1.5">Your Name *</label>
                    <input
                      type="text" required value={form.name} onChange={set('name')}
                      placeholder="Dr. Jane Smith"
                      className="w-full px-4 py-2.5 rounded-lg border border-brand-border text-sm text-brand-text placeholder:text-brand-gray/50 focus:outline-none focus:border-navy transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-text mb-1.5">Institution *</label>
                    <input
                      type="text" required value={form.institution} onChange={set('institution')}
                      placeholder="State University"
                      className="w-full px-4 py-2.5 rounded-lg border border-brand-border text-sm text-brand-text placeholder:text-brand-gray/50 focus:outline-none focus:border-navy transition-colors"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-text mb-1.5">Your Role</label>
                    <select
                      value={form.role} onChange={set('role')}
                      className="w-full px-4 py-2.5 rounded-lg border border-brand-border text-sm text-brand-text focus:outline-none focus:border-navy transition-colors bg-white">
                      <option value="">Select a role</option>
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-text mb-1.5">Course of Interest</label>
                    <select
                      value={form.course} onChange={set('course')}
                      className="w-full px-4 py-2.5 rounded-lg border border-brand-border text-sm text-brand-text focus:outline-none focus:border-navy transition-colors bg-white">
                      <option value="">Select a course</option>
                      {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-text mb-1.5">Email Address *</label>
                  <input
                    type="email" required value={form.email} onChange={set('email')}
                    placeholder="you@university.edu"
                    className="w-full px-4 py-2.5 rounded-lg border border-brand-border text-sm text-brand-text placeholder:text-brand-gray/50 focus:outline-none focus:border-navy transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-text mb-1.5">
                    Tell us about your course or challenge <span className="font-normal text-brand-gray">(optional)</span>
                  </label>
                  <textarea
                    value={form.message} onChange={set('message')} rows={3}
                    placeholder="What's the course, enrollment size, and the outcome problem you're trying to solve?"
                    className="w-full px-4 py-2.5 rounded-lg border border-brand-border text-sm text-brand-text placeholder:text-brand-gray/50 focus:outline-none focus:border-navy transition-colors resize-none"
                  />
                </div>

                {status === 'error' && (
                  <p className="text-sm text-red-500">Something went wrong. Please try again or email us directly.</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-navy text-white py-3.5 rounded-lg font-bold text-sm hover:bg-navy-light transition-colors disabled:opacity-60">
                  {status === 'loading' ? 'Sending…' : 'Request a Pilot →'}
                </button>

                <p className="text-xs text-center text-brand-gray">
                  We'll respond within one business day.
                </p>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
