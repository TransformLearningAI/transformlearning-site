'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [form, setForm] = useState({ full_name: '', institution: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function set(field) { return e => setForm(f => ({ ...f, [field]: e.target.value })) }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const timeout = setTimeout(() => {
      setError('Request timed out — please try again.')
      setLoading(false)
    }, 15000)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { full_name: form.full_name, institution: form.institution, role: 'faculty' },
        },
      })
      clearTimeout(timeout)
      if (error) { setError(error.message); setLoading(false); return }
      window.location.href = '/courses'
    } catch (err) {
      clearTimeout(timeout)
      setError(err.message || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#5A3E6B' }}>
          <span className="text-white text-sm">📋</span>
        </div>
        <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.15em]">Faculty Account</span>
      </div>

      <h1 className="font-serif font-light text-white mb-2" style={{ fontSize: '32px', letterSpacing: '-0.02em' }}>
        Build the terrain.
      </h1>
      <p className="text-white/40 text-sm mb-8">Create your account — free during the pilot. Upload a syllabus and your students' skill landscape generates automatically.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-white/40 uppercase tracking-[0.1em] mb-2">Full Name</label>
            <input type="text" value={form.full_name} onChange={set('full_name')} required
              className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-brand-teal"
              placeholder="Dr. Jane Smith" />
          </div>
          <div>
            <label className="block text-xs font-bold text-white/40 uppercase tracking-[0.1em] mb-2">Institution</label>
            <input type="text" value={form.institution} onChange={set('institution')} required
              className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-brand-teal"
              placeholder="State University" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-white/40 uppercase tracking-[0.1em] mb-2">Email</label>
          <input type="email" value={form.email} onChange={set('email')} required
            className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-brand-teal"
            placeholder="you@institution.edu" />
        </div>
        <div>
          <label className="block text-xs font-bold text-white/40 uppercase tracking-[0.1em] mb-2">Password</label>
          <input type="password" value={form.password} onChange={set('password')} required
            className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-brand-teal"
            placeholder="At least 8 characters" />
        </div>

        {error && (
          <div className="rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(255,107,74,0.1)', color: '#FF6B4A', border: '1px solid rgba(255,107,74,0.15)' }}>
            {error}
          </div>
        )}

        <button type="submit" disabled={loading}
          className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-60 hover:opacity-90"
          style={{ background: '#5A3E6B' }}>
          {loading ? 'Creating account…' : 'Create Faculty Account →'}
        </button>
      </form>

      <p className="text-white/30 text-xs mt-6 text-center">
        Already have an account? <a href="/login" className="text-brand-teal hover:underline font-bold">Sign in</a>
      </p>
    </div>
  )
}
