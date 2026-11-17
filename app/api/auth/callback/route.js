import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Only allow same-site relative paths as a post-login destination.
function safeNext(next) {
  if (!next || typeof next !== 'string') return '/my-progress'
  if (!next.startsWith('/') || next.startsWith('//')) return '/my-progress'
  return next
}

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const next = safeNext(searchParams.get('next'))

  // Supabase reports a failed verification (expired, already used) as query params.
  const errDesc = searchParams.get('error_description') || searchParams.get('error_code')
  if (errDesc) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errDesc)}`)
  }

  const supabase = await createClient()

  // PKCE flow: ?code=... (OAuth, and email links when emailRedirectTo points here)
  const code = searchParams.get('code')
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(`${origin}${next}`)
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
  }

  // Token-hash flow: ?token_hash=...&type=signup|email|recovery|invite|magiclink
  // Used when the Supabase email template links straight to this route.
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
    if (!error) return NextResponse.redirect(`${origin}${next}`)
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
