'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function AcceptInviteForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [invite, setInvite] = useState(null)
  const [form, setForm] = useState({ full_name: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(true)

  useEffect(() => {
    if (!token) { setError('Invalid invite link.'); setValidating(false); return }
    fetch(`/api/invites/validate?token=${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error)
        else setInvite(data)
        setValidating(false)
      })
  }, [token])

  function set(field) { return e => setForm(f => ({ ...f, [field]: e.target.value })) }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: invite.email,
      password: form.password,
      options: {
        data: { full_name: form.full_name, role: 'student' },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })
    if (signUpError) { setError(signUpError.message); setLoading(false); return }

    // Pass the access token directly — the server cookie may not be set yet
    const accessToken = signUpData?.session?.access_token
    const res = await fetch('/api/enrollments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({ token }),
    })
    const data = await res.json()
    if (data.error) { setError(data.error); setLoading(false); return }
    router.push(`/my-progress/${data.enrollmentId}`)
  }

  if (validating) return <p className="text-white/50 text-sm">Validating invite…</p>

  if (error && !invite) return (
    <div>
      <h1 className="font-serif font-light text-white mb-4" style={{ fontSize: '32px' }}>Invalid invite</h1>
      <p className="text-white/50 text-sm">{error}</p>
      <a href="/" className="text-brand-teal text-sm mt-4 block hover:underline">← Back to home</a>
    </div>
  )

  return (
    <div>
      <h1 className="font-serif font-light text-white mb-2" style={{ fontSize: '32px', letterSpacing: '-0.02em' }}>
        You've been invited.
      </h1>
      <p className="text-white/50 text-sm mb-1">You've been added to <strong className="text-white">{invite?.course_title}</strong>.</p>
      <p className="text-white/40 text-xs mb-8">Creating account for {invite?.email}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-white/50 uppercase tracking-[0.1em] mb-2">Your Name</label>
          <input type="text" value={form.full_name} onChange={set('full_name')} required
            className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-brand-teal"
            placeholder="Your full name" />
        </div>
        <div>
          <label className="block text-xs font-bold text-white/50 uppercase tracking-[0.1em] mb-2">Create Password</label>
          <input type="password" value={form.password} onChange={set('password')} required minLength={8}
            className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-brand-teal"
            placeholder="At least 8 characters" />
        </div>
        {error && (
          <div className="rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(255,107,74,0.1)', color: '#FF6B4A' }}>
            {error}
          </div>
        )}
        <button type="submit" disabled={loading}
          className="w-full py-3 rounded-xl font-bold text-sm text-white disabled:opacity-60"
          style={{ background: '#00A8A8' }}>
          {loading ? 'Setting up your account…' : 'Get Started →'}
        </button>
      </form>
    </div>
  )
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={<p className="text-white/50 text-sm">Loading…</p>}>
      <AcceptInviteForm />
    </Suspense>
  )
}
