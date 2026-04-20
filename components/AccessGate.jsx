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

export default function AccessGate({ children, pageName }) {
  const [granted, setGranted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', organization: '', role: '', interest: pageName || '', context: '' })
  const [status, setStatus] = useState('idle')

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }))

  // Revoked access — these emails can no longer access restricted content
  const REVOKED = ['rydstromryan@gmail.com', 'ryanrydstrom@gmail.com', 'orsismt@gmail.com']

  // Check URL for access key
  useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const key = params.get('access')
      if (key) {
        try {
          // Key format: base64(email)
          const email = atob(key).toLowerCase()
          if (email.includes('@') && !REVOKED.includes(email)) {
            sessionStorage.setItem('tl_access', key)
            setGranted(true)
          }
        } catch { /* invalid key */ }
      }
      // Check session
      const saved = sessionStorage.getItem('tl_access')
      if (saved) {
        try {
          const email = atob(saved).toLowerCase()
          if (!REVOKED.includes(email)) setGranted(true)
        } catch { /* invalid key */ }
      }
    }
  })

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
      if (res.ok) {
        setStatus('sent')
        // Do NOT auto-grant — wait for manual approval
      } else setStatus('error')
    } catch { setStatus('error') }
  }

  if (granted) return children

  return (
    <div className="relative min-h-screen">
      {/* Blurred content behind */}
      <div className="pointer-events-none select-none" style={{ filter: 'blur(8px)', opacity: 0.6 }}>
        {children}
      </div>

      {/* Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(4px)' }}>
        <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-brand-border overflow-hidden" style={{ maxHeight: '90vh', overflowY: 'auto' }}>

          {status === 'sent' ? (
            <div className="p-10 text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                   style={{ background: '#0C1F3F' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="#00A8A8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="font-serif font-light text-navy text-2xl mb-3">Request submitted.</h2>
              <p className="text-sm text-brand-gray">We will review your request and send access credentials to <strong className="text-navy">{form.email}</strong> within 1-2 business days. Thank you for your interest.</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="px-8 pt-8 pb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#0C1F3F' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="1" y="7" width="14" height="8" rx="2" stroke="white" strokeWidth="1.2" fill="none"/>
                      <path d="M4 7V5a4 4 0 018 0v2" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-serif font-light text-navy text-xl" style={{ letterSpacing: '-0.02em' }}>
                      Request access to continue.
                    </h2>
                    <p className="text-[11px] text-brand-gray">Restricted content &middot; 1-2 business day review</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[9px] font-bold uppercase tracking-[0.14em] text-brand-gray mb-1">Full name *</label>
                    <input type="text" required value={form.name} onChange={e => upd('name', e.target.value)}
                      placeholder="Dr. Jane Smith"
                      className="w-full px-3.5 py-2.5 rounded-lg text-sm border border-brand-border bg-brand-soft outline-none focus:border-brand-teal" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-[0.14em] text-brand-gray mb-1">Work email *</label>
                    <input type="email" required value={form.email} onChange={e => upd('email', e.target.value)}
                      placeholder="jane@university.edu"
                      className="w-full px-3.5 py-2.5 rounded-lg text-sm border border-brand-border bg-brand-soft outline-none focus:border-brand-teal" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-[0.14em] text-brand-gray mb-1">Organization *</label>
                    <input type="text" required value={form.organization} onChange={e => upd('organization', e.target.value)}
                      placeholder="University of Pittsburgh"
                      className="w-full px-3.5 py-2.5 rounded-lg text-sm border border-brand-border bg-brand-soft outline-none focus:border-brand-teal" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-[0.14em] text-brand-gray mb-1">Role</label>
                    <select value={form.role} onChange={e => upd('role', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg text-sm border border-brand-border bg-brand-soft outline-none focus:border-brand-teal appearance-none">
                      <option value="">Select...</option>
                      {ROLES.map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-[0.14em] text-brand-gray mb-1">Interested in</label>
                    <select value={form.interest} onChange={e => upd('interest', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg text-sm border border-brand-border bg-brand-soft outline-none focus:border-brand-teal appearance-none">
                      <option value="">Select...</option>
                      {INTERESTS.map(i => <option key={i}>{i}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[9px] font-bold uppercase tracking-[0.14em] text-brand-gray mb-1">Tell us about your interest</label>
                    <textarea value={form.context} onChange={e => upd('context', e.target.value)} rows={3}
                      placeholder="Evaluating for your institution? Exploring investment? Covering ed-tech?"
                      className="w-full px-3.5 py-2.5 rounded-lg text-sm border border-brand-border bg-brand-soft outline-none focus:border-brand-teal resize-none" />
                  </div>
                </div>

                <button type="submit"
                  disabled={!form.name.trim() || !form.email.trim() || !form.organization.trim() || status === 'sending'}
                  className="w-full py-3 rounded-lg text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: '#0C1F3F' }}>
                  {status === 'sending' ? 'Submitting...' : 'Request Access'}
                </button>

                {status === 'error' && (
                  <p className="text-xs text-brand-coral text-center">Something went wrong. Please try again.</p>
                )}

                <p className="text-[10px] text-brand-gray/50 text-center">
                  We review requests within 1-2 business days. Your information is not shared with third parties.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
