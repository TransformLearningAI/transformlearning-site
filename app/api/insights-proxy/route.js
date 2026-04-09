import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const PROJECTS = {
  transformlearning: 'prj_4YJwjZtwghfrcdIzozNbsV7qW3RA',
  findmyway: 'prj_GPMLuSFRMPQoxBWu1JMlJY9Ws5Zz',
}

const TEAM_ID = 'team_BvbKsgsARhNgse6FUisG0rmo'

export async function GET(request) {
  // Auth check — only logged-in faculty
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const site = searchParams.get('site')
  const type = searchParams.get('type') || 'path'
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  const projectId = PROJECTS[site]
  if (!projectId) return NextResponse.json({ error: 'Unknown site' }, { status: 400 })

  const token = process.env.VERCEL_API_TOKEN
  if (!token) return NextResponse.json({ error: 'Vercel token not configured' }, { status: 500 })

  try {
    const url = `https://vercel.com/api/web/insights/stats/${type}?teamId=${TEAM_ID}&projectId=${projectId}&from=${from}&to=${to}`
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
