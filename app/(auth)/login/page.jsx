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
      <p className="text-white/50 text-sm mb-8">Sign in to your Arrival account.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-white/50 uppercase tracking-[0.1em] mb-2">Email</label>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)} required
            className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-brand-teal transition-colors"
            placeholder="you@institution.edu"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-white/50 uppercase tracking-[0.1em] mb-2">Password</label>
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)} required
            className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-brand-teal transition-colors"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div className="rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(255,107,74,0.1)', color: '#FF6B4A', border: '1px solid rgba(255,107,74,0.2)' }}>
            {error}
          </div>
        )}

        <button
          type="submit" disabled={loading}
          className="w-full py-3 rounded-xl font-bold text-sm text-white transition-opacity disabled:opacity-60"
          style={{ background: '#00A8A8' }}>
          {loading ? 'Signing in…' : 'Sign In →'}
        </button>
      </form>

      <p className="text-white/40 text-sm mt-6 text-center">
        Faculty?{' '}
        <a href="/signup" className="text-brand-teal hover:underline">Create an account</a>
      </p>
    </div>
  )
}
