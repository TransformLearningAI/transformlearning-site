'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function StudentSignupPage() {
  const [form, setForm] = useState({ full_name: '', institution: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function set(field) { return e => setForm(f => ({ ...f, [field]: e.target.value })) }

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
      window.location.href = '/my-progress'
    } catch (err) { clearTimeout(timeout); setError(err.message || 'Something went wrong'); setLoading(false) }
  }

  const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }

  return (
    <div>
      <h1 className="font-serif font-light text-white mb-2" style={{ fontSize: '36px', letterSpacing: '-0.02em' }}>
        See where you stand.
      </h1>
      <p className="text-white/30 text-sm mb-8">Create your free student account. Upload a syllabus or program guide and start mapping your skills.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-white/25 uppercase tracking-[0.12em] mb-2">Your Name</label>
            <input type="text" value={form.full_name} onChange={set('full_name')} required
              className="w-full rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none placeholder-white/15" style={inputStyle}
              placeholder="Marcus Thompson" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-white/25 uppercase tracking-[0.12em] mb-2">School / College</label>
            <input type="text" value={form.institution} onChange={set('institution')}
              className="w-full rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none placeholder-white/15" style={inputStyle}
              placeholder="State University (optional)" />
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-white/25 uppercase tracking-[0.12em] mb-2">Email</label>
          <input type="email" value={form.email} onChange={set('email')} required
            className="w-full rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none placeholder-white/15" style={inputStyle}
            placeholder="you@school.edu" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-white/25 uppercase tracking-[0.12em] mb-2">Password</label>
          <input type="password" value={form.password} onChange={set('password')} required
            className="w-full rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none placeholder-white/15" style={inputStyle}
            placeholder="At least 8 characters" />
        </div>

        {error && (
          <div className="rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(244,63,94,0.08)', color: '#FB7185', border: '1px solid rgba(244,63,94,0.15)' }}>
            {error}
          </div>
        )}

        <button type="submit" disabled={loading}
          className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-50 hover:opacity-90"
          style={{ background: '#00A8A8' }}>
          {loading ? 'Creating account…' : 'Create Free Student Account →'}
        </button>
      </form>

      <p className="text-white/20 text-xs mt-6 text-center">
        Already have an account? <a href="/login" className="font-bold hover:underline" style={{ color: '#00CED1' }}>Sign in</a>
      </p>
      <p className="text-white/15 text-xs mt-2 text-center">
        Are you faculty? <a href="/signup" className="font-bold hover:underline" style={{ color: '#00CED1' }}>Create a faculty account</a>
      </p>
    </div>
  )
}
