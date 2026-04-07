import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Public paths — no auth needed
  const publicPaths = ['/', '/investors', '/methodology', '/access', '/blog', '/login', '/signup', '/accept-invite', '/demo', '/api/auth', '/api/enrollments', '/api/invites', '/api/request-access', '/api/approve-access']
  const isPublic = publicPaths.some(p => pathname === p || pathname.startsWith(p))

  if (!user && !isPublic && !pathname.startsWith('/_next') && !pathname.startsWith('/api/pilot') && !pathname.startsWith('/api/digest')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // ── Geo analytics: log page views with city/region/country ──
  // Skip API routes, static assets, and Next.js internals
  if (!pathname.startsWith('/api/') && !pathname.startsWith('/_next')) {
    const geo = request.geo || {}
    const row = {
      path: pathname,
      country: geo.country || null,
      region: geo.region || null,
      city: geo.city || null,
      latitude: geo.latitude || null,
      longitude: geo.longitude || null,
      user_agent: request.headers.get('user-agent') || null,
      referer: request.headers.get('referer') || null,
    }

    // Fire-and-forget — don't block the response
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (supabaseUrl && serviceKey) {
      fetch(`${supabaseUrl}/rest/v1/page_views`, {
        method: 'POST',
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify(row),
      }).catch(() => {})
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
