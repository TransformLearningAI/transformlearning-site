'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState('student') // student | faculty
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
      {/* Role toggle */}
      <div className="flex rounded-xl overflow-hidden mb-8" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
        {['student', 'faculty'].map(r => (
          <button key={r} onClick={() => setRole(r)}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
              role === r ? 'text-white' : 'text-white/30 hover:text-white/50'
            }`}
            style={role === r ? { background: r === 'student' ? '#00A8A8' : '#5A3E6B' } : undefined}>
            {r === 'student' ? '🧭 Student' : '📋 Faculty'}
          </button>
        ))}
      </div>

      <h1 className="font-serif font-light text-white mb-2" style={{ fontSize: '32px', letterSpacing: '-0.02em' }}>
        {role === 'student' ? 'Welcome back, explorer.' : 'Welcome back.'}
      </h1>
      <p className="text-white/40 text-sm mb-8">
        {role === 'student' ? 'Your terrain is waiting.' : 'Sign in to manage your courses.'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-white/40 uppercase tracking-[0.1em] mb-2">Email</label>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)} required
            className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-brand-teal transition-colors"
            placeholder={role === 'student' ? 'you@university.edu' : 'you@institution.edu'}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-white/40 uppercase tracking-[0.1em] mb-2">Password</label>
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)} required
            className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-brand-teal transition-colors"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div className="rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(255,107,74,0.1)', color: '#FF6B4A', border: '1px solid rgba(255,107,74,0.15)' }}>
            {error}
          </div>
        )}

        <button type="submit" disabled={loading}
          className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-60 hover:opacity-90"
          style={{ background: role === 'student' ? '#00A8A8' : '#5A3E6B' }}>
          {loading ? 'Signing in…' : 'Sign In →'}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-white/10 text-center">
        <p className="text-white/30 text-xs">
          Faculty? <a href="/signup" className="text-brand-teal hover:underline font-bold">Create an account</a>
        </p>
        <p className="text-white/20 text-[10px] mt-2">
          Students are invited by their instructor
        </p>
      </div>
    </div>
  )
}
