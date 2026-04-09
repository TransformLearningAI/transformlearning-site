'use client'
import { useState } from 'react'
import Link from 'next/link'

const ROLES = [
  'Faculty / Instructor',
  'Department Chair',
  'Dean',
  'Provost / Academic VP',
  'President / Chancellor',
  'Institutional Research',
  'Finance / CFO',
  'Admissions',
  'IT Administrator',
  'Other',
]

export default function WhitepaperRequest() {
  const [form, setForm] = useState({ name: '', email: '', institution: '', role: '', message: '' })
  const [status, setStatus] = useState('idle')

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/whitepaper-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F8FBFD 0%, #EEF3F8 100%)' }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-bold text-sm" style={{ color: '#0C1F3F' }}>
            transform<span style={{ color: '#00A8A8' }}>learning</span>
          </Link>
          <Link href="/campus-os" className="text-xs text-gray-400 hover:text-gray-600">
            ← Back to Campus OS
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-14 items-start">

          {/* Left: description */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] mb-4" style={{ color: '#00A8A8' }}>
              White Paper
            </p>
            <h1 className="font-serif font-light mb-6"
                style={{ fontSize: 'clamp(32px, 4vw, 48px)', lineHeight: 1.05, letterSpacing: '-0.03em', color: '#0C1F3F' }}>
              Campus OS:<br />Design & Architecture
            </h1>
            <p className="text-base leading-relaxed text-gray-500 mb-8">
              This document details the system architecture, governance framework, and institutional
              deployment model behind Campus OS — the adaptive learning operating system that gives
              every role on campus visibility into what's actually happening with student learning.
            </p>

            <div className="space-y-4">
              {[
                'Complete system architecture and data flow',
                'AI governance and fairness constraints',
                'Role-based dashboard specifications',
                'Pilot deployment methodology',
                'Evidence-based outcome projections',
              ].map(item => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                       style={{ background: 'rgba(0,168,168,0.1)' }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5L4 7L8 3" stroke="#00A8A8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-sm text-gray-600">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 p-5 rounded-2xl border border-gray-200 bg-white">
              <p className="text-xs text-gray-400 leading-relaxed">
                Access to this document requires approval. After submitting your request,
                you'll receive an email with a download link once approved. We typically
                respond within one business day.
              </p>
            </div>
          </div>

          {/* Right: form */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            {status === 'success' ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                     style={{ background: 'rgba(79,138,91,0.1)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12L10 17L19 7" stroke="#4F8A5B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#0C1F3F' }}>Request submitted</h3>
                <p className="text-sm text-gray-500">
                  We'll review your request and send a download link to your email once approved.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-bold mb-2" style={{ color: '#0C1F3F' }}>Request Access</h3>
                <p className="text-sm text-gray-400 mb-6">Fill out the form below to request the white paper.</p>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5">Name *</label>
                    <input type="text" required value={form.name} onChange={set('name')}
                      placeholder="Dr. Jane Smith"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#00A8A8] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5">Institution *</label>
                    <input type="text" required value={form.institution} onChange={set('institution')}
                      placeholder="State University"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#00A8A8] transition-colors" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5">Email *</label>
                    <input type="email" required value={form.email} onChange={set('email')}
                      placeholder="you@university.edu"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#00A8A8] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5">Role</label>
                    <select value={form.role} onChange={set('role')}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#00A8A8] transition-colors bg-white">
                      <option value="">Select a role</option>
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">
                    Why are you interested? <span className="font-normal text-gray-400">(optional)</span>
                  </label>
                  <textarea value={form.message} onChange={set('message')} rows={3}
                    placeholder="Tell us about your institution or what you're exploring..."
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#00A8A8] transition-colors resize-none" />
                </div>

                {status === 'error' && (
                  <p className="text-sm text-red-500">Something went wrong. Please try again.</p>
                )}

                <button type="submit" disabled={status === 'loading'}
                  className="w-full py-3.5 rounded-lg font-bold text-sm text-white transition-colors disabled:opacity-60"
                  style={{ background: '#0C1F3F' }}>
                  {status === 'loading' ? 'Submitting…' : 'Request White Paper →'}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
