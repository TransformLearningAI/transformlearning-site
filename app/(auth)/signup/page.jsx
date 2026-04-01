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
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.full_name, institution: form.institution, role: 'faculty' },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })
    if (error) { setError(error.message); setLoading(false); return }

    if (data.session) {
      // Email confirm off — session returned immediately, create profile explicitly
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: form.full_name, institution: form.institution, role: 'faculty' }),
      })
      window.location.href = '/courses'
    } else {
      router.push('/login?message=check_email')
    }
  }

  return (
    <div>
      <h1 className="font-serif font-light text-white mb-2" style={{ fontSize: '36px', letterSpacing: '-0.02em' }}>
        Get started.
      </h1>
      <p className="text-white/50 text-sm mb-8">Create your faculty account — free during the pilot program.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: 'Full Name', field: 'full_name', type: 'text', placeholder: 'Dr. Jane Smith' },
          { label: 'Institution', field: 'institution', type: 'text', placeholder: 'State University' },
          { label: 'Email', field: 'email', type: 'email', placeholder: 'you@institution.edu' },
          { label: 'Password', field: 'password', type: 'password', placeholder: '••••••••' },
        ].map(({ label, field, type, placeholder }) => (
          <div key={field}>
            <label className="block text-xs font-bold text-white/50 uppercase tracking-[0.1em] mb-2">{label}</label>
            <input
              type={type} value={form[field]} onChange={set(field)} required
              className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-brand-teal transition-colors"
              placeholder={placeholder}
            />
          </div>
        ))}

        {error && (
          <div className="rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(255,107,74,0.1)', color: '#FF6B4A', border: '1px solid rgba(255,107,74,0.2)' }}>
            {error}
          </div>
        )}

        <button
          type="submit" disabled={loading}
          className="w-full py-3 rounded-xl font-bold text-sm text-white transition-opacity disabled:opacity-60"
          style={{ background: '#00A8A8' }}>
          {loading ? 'Creating account…' : 'Create Faculty Account →'}
        </button>
      </form>

      <p className="text-white/40 text-sm mt-6 text-center">
        Already have an account?{' '}
        <a href="/login" className="text-brand-teal hover:underline">Sign in</a>
      </p>
    </div>
  )
}
