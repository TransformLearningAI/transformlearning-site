'use client'

import { useState } from 'react'
import Link from 'next/link'

const ROLES = [
  'Faculty / Professor',
  'Department Chair',
  'Dean / Provost',
  'Institutional Research',
  'IT / Learning Technology',
  'Investor / Advisor',
  'Journalist / Analyst',
  'Student',
  'Other',
]

const INTERESTS = [
  'Methodology & Scoring White Paper',
  'Investor Overview / Go-to-Market Strategy',
  'Both',
]

export default function AccessPage() {
  const [form, setForm] = useState({ name: '', email: '', organization: '', role: '', interest: '', context: '' })
  const [status, setStatus] = useState('idle')

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.organization.trim()) return
    setStatus('sending')
    try {
      const res = await fetch('/api/request-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) setStatus('sent')
      else setStatus('error')
    } catch { setStatus('error') }
  }

  if (status === 'sent') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
               style={{ background: '#0C1F3F' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="#00A8A8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="font-serif font-light text-navy text-3xl mb-4" style={{ letterSpacing: '-0.02em' }}>Request received.</h1>
          <p className="text-sm text-brand-gray leading-relaxed mb-6">
            Thank you for your interest. We will review your request and follow up within 1-2 business days.
            A confirmation email has been sent to <strong className="text-navy">{form.email}</strong>.
          </p>
          <Link href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-gray hover:text-navy transition-colors">
            &larr; Back to site
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-brand-border">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#0C1F3F' }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L2 14H6L8 10L10 14H14L8 2Z" fill="white"/>
              </svg>
            </div>
            <span className="font-bold text-navy text-sm">
              arrival<span style={{ color: '#00A8A8' }}>.ai</span>
            </span>
          </Link>
          <Link href="/" className="text-xs font-medium text-brand-gray hover:text-navy transition-colors">
            &larr; Back to site
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-border bg-brand-mist mb-6">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="7" width="14" height="8" rx="2" stroke="#0C1F3F" strokeWidth="1.5" fill="none"/>
              <path d="M4 7V5a4 4 0 018 0v2" stroke="#0C1F3F" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            </svg>
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-gray">Restricted Access</span>
          </div>
          <h1 className="font-serif font-light text-navy mb-4"
              style={{ fontSize: 'clamp(28px, 4vw, 42px)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Request access to Arrival materials.
          </h1>
          <p className="text-sm text-brand-gray leading-relaxed max-w-lg">
            Our methodology white paper and investor overview contain proprietary information about
            Arrival's scoring engine, governance architecture, and go-to-market strategy. Access is
            granted to qualified educators, institutional leaders, investors, and press.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gray mb-1.5">
                Full name <span className="text-brand-coral">*</span>
              </label>
              <input type="text" required value={form.name} onChange={e => upd('name', e.target.value)}
                placeholder="Dr. Jane Smith"
                className="w-full px-4 py-3 rounded-xl text-sm border border-brand-border bg-brand-soft outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/20" />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gray mb-1.5">
                Work email <span className="text-brand-coral">*</span>
              </label>
              <input type="email" required value={form.email} onChange={e => upd('email', e.target.value)}
                placeholder="jane.smith@university.edu"
                className="w-full px-4 py-3 rounded-xl text-sm border border-brand-border bg-brand-soft outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/20" />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gray mb-1.5">
                Organization <span className="text-brand-coral">*</span>
              </label>
              <input type="text" required value={form.organization} onChange={e => upd('organization', e.target.value)}
                placeholder="University of Pittsburgh"
                className="w-full px-4 py-3 rounded-xl text-sm border border-brand-border bg-brand-soft outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/20" />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gray mb-1.5">
                Your role
              </label>
              <select value={form.role} onChange={e => upd('role', e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm border border-brand-border bg-brand-soft outline-none focus:border-brand-teal appearance-none">
                <option value="">Select...</option>
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gray mb-1.5">
                Interested in
              </label>
              <select value={form.interest} onChange={e => upd('interest', e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm border border-brand-border bg-brand-soft outline-none focus:border-brand-teal appearance-none">
                <option value="">Select...</option>
                {INTERESTS.map(i => <option key={i}>{i}</option>)}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gray mb-1.5">
                Tell us a bit about your interest
              </label>
              <textarea value={form.context} onChange={e => upd('context', e.target.value)} rows={4}
                placeholder="What brings you here? Are you evaluating Arrival for your institution, exploring investment, covering ed-tech, or something else?"
                className="w-full px-4 py-3 rounded-xl text-sm border border-brand-border bg-brand-soft outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/20 resize-none" />
            </div>
          </div>

          <button type="submit"
            disabled={!form.name.trim() || !form.email.trim() || !form.organization.trim() || status === 'sending'}
            className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: '#0C1F3F' }}>
            {status === 'sending' ? 'Submitting...' : 'Request Access'}
          </button>

          {status === 'error' && (
            <p className="text-xs text-brand-coral text-center">Something went wrong. Please try again.</p>
          )}

          <p className="text-xs text-brand-gray/50 text-center leading-relaxed">
            Requests are reviewed within 1-2 business days. We do not share your information with third parties.
          </p>
        </form>
      </div>
    </div>
  )
}
