'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else router.push('/dashboard')
  }

  return (
    <div>
      <h1 className="font-serif font-light text-white mb-2" style={{ fontSize: '36px', letterSpacing: '-0.02em' }}>
        Welcome back.
      </h1>
      <p className="text-white/30 text-sm mb-8">Sign in to see your constellation.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-white/25 uppercase tracking-[0.12em] mb-2">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
            className="w-full rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none transition-colors placeholder-white/15"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            onFocus={e => e.target.style.borderColor = 'rgba(0,206,209,0.4)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            placeholder="you@university.edu" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-white/25 uppercase tracking-[0.12em] mb-2">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
            className="w-full rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none transition-colors placeholder-white/15"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            onFocus={e => e.target.style.borderColor = 'rgba(0,206,209,0.4)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            placeholder="••••••••" />
        </div>

        {error && (
          <div className="rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(244,63,94,0.08)', color: '#FB7185', border: '1px solid rgba(244,63,94,0.15)' }}>
            {error}
          </div>
        )}

        <button type="submit" disabled={loading}
          className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-50 hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #00CED1, #0891B2)' }}>
          {loading ? 'Signing in…' : 'Sign In →'}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-white/5 text-center space-y-2">
        <p className="text-white/20 text-xs">
          Faculty? <a href="/signup" className="font-bold hover:underline" style={{ color: '#00CED1' }}>Create an account</a>
        </p>
        <p className="text-white/10 text-[10px]">Students are invited by their instructor</p>
      </div>
    </div>
  )
}
