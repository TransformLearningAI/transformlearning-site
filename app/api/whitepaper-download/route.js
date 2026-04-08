import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json({ approved: false })
  }

  const service = await createServiceClient()

  const { data: req } = await service
    .from('whitepaper_requests')
    .select('name, email, status')
    .eq('token', token)
    .single()

  if (!req || req.status !== 'approved') {
    return NextResponse.json({ approved: false })
  }

  return NextResponse.json({ approved: true, name: req.name })
}
