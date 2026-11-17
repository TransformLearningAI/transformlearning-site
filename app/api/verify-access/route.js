import { NextResponse } from 'next/server'
import { checkAccessKey, isRevoked } from '@/lib/access-token'

// The browser asks here whether an access key is valid. The key is never decoded in the browser.
export async function GET(request) {
  const key = new URL(request.url).searchParams.get('key')
  const email = checkAccessKey(key)

  if (!email || isRevoked(email)) {
    return NextResponse.json({ ok: false }, { status: 403 })
  }
  return NextResponse.json({ ok: true })
}
