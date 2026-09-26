'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { track } from '@vercel/analytics'

export default function StudentSignupPage() {
  const [form, setForm] = useState({ full_name: '', institution: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [utm, setUtm] = useState({})

  // Capture UTM parameters from URL on page load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const utmData = {
      utm_source: params.get('utm_source') || '',
      utm_medium: params.get('utm_medium') || '',
      utm_campaign: params.get('utm_campaign') || '', // Ambassador's name (e.g., "AshlieH")
      utm_id: params.get('utm_id') || '',
    }
    setUtm(utmData)
    // Store in sessionStorage so it persists through Google OAuth redirect
    if (utmData.utm_campaign) {
      sessionStorage.setItem('tl_referral', JSON.stringify(utmData))
    }
  }, [])

  function set(field) { return e => setForm(f => ({ ...f, [field]: e.target.value })) }

  // Track ambassador referral after successful signup
  async function trackReferral(studentId, email, name) {
    const stored = sessionStorage.getItem('tl_referral')
    const utmData = stored ? JSON.parse(stored) : utm
    if (utmData.utm_campaign) {
      await fetch('/api/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ambassador_code: utmData.utm_campaign,
          student_id: studentId,
          student_email: email,
          student_name: name,
          utm_source: utmData.utm_source,
          utm_medium: utmData.utm_medium,
        }),
      }).catch(() => {})
      sessionStorage.removeItem('tl_referral')
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const timeout = setTimeout(() => { setError('Request timed out — please try again.'); setLoading(false) }, 15000)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email: form.email, password: form.password,
        options: { data: { full_name: form.full_name, institution: form.institution, role: 'student' } },
      })
      clearTimeout(timeout)
      if (error) { setError(error.message); setLoading(false); return }
      track('signup', { role: 'student', institution: form.institution || 'not provided' })
      // Track ambassador referral
      await trackReferral(data?.user?.id, form.email, form.full_name)
      // Send welcome email with user data (don't rely on auth cookie)
      await fetch('/api/welcome-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, name: form.full_name }),
      }).catch(() => {})
      window.location.href = '/my-progress'
    } catch (err) { clearTimeout(timeout); setError(err.message || 'Something went wrong'); setLoading(false) }
  }

  const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }

  async function handleGoogle() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/my-progress` },
    })
  }

  return (
    <div>
      <h1 className="font-serif font-light text-white mb-2" style={{ fontSize: '36px', letterSpacing: '-0.02em' }}>
        Know every skill before the exam.
      </h1>
      <p className="text-white/40 text-sm mb-2">Upload your syllabus. AI maps every skill and tracks what you actually know &mdash; not just your grade. Free.</p>
      <p className="text-white/20 text-xs mb-6">Students from Richmond, USF, Arizona, LAU, and NSW Education are already using it.</p>

      {/* Google signup - one tap */}
      <button onClick={handleGoogle}
        className="w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 flex items-center justify-center gap-3 mb-4"
        style={{ background: '#fff', color: '#333', border: '1px solid rgba(255,255,255,0.15)' }}>
        <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
        Sign up with Google →
      </button>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
        <span className="text-white/20 text-xs">or use email</span>
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input type="text" value={form.full_name} onChange={set('full_name')} required
            className="w-full rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none placeholder-white/25" style={inputStyle}
            placeholder="Your name" />
        </div>
        <div>
          <input type="email" value={form.email} onChange={set('email')} required
            className="w-full rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none placeholder-white/25" style={inputStyle}
            placeholder="Email" />
        </div>
        <div>
          <input type="password" value={form.password} onChange={set('password')} required minLength={6}
            className="w-full rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none placeholder-white/25" style={inputStyle}
            placeholder="Password (6+ characters)" />
        </div>
        <div>
          <input type="text" value={form.institution} onChange={set('institution')}
            className="w-full rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none placeholder-white/25" style={inputStyle}
            placeholder="School or institution (optional)" />
        </div>

        {error && (
          <div className="rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(244,63,94,0.08)', color: '#FB7185', border: '1px solid rgba(244,63,94,0.15)' }}>
            {error}
          </div>
        )}

        <button type="submit" disabled={loading}
          className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-50 hover:opacity-90"
          style={{ background: '#00A8A8' }}>
          {loading ? 'Creating account…' : 'Create Free Account →'}
        </button>
      </form>

      <p className="text-white/20 text-xs mt-5 text-center">
        Already have an account? <a href="/login" className="font-bold hover:underline" style={{ color: '#00CED1' }}>Sign in</a>
      </p>
      <p className="text-white/15 text-xs mt-2 text-center">
        Are you faculty? <a href="/signup" className="font-bold hover:underline" style={{ color: '#00CED1' }}>Create a faculty account</a>
      </p>
    </div>
  )
}
