import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

// Activate a free unlimited ambassador account
// Usage: POST /api/ambassador-activate
// Body: { "email": "ambassador@example.com" }
// Protected by a simple secret key

export async function POST(req) {
  try {
    const { email, secret } = await req.json()

    // Simple auth — only you can activate ambassadors
    if (secret !== process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(-10)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    const db = await createServiceClient()

    // Find the user by email
    const { data: profile, error: findError } = await db
      .from('profiles')
      .select('id, full_name, email, subscription_status')
      .eq('email', email)
      .single()

    if (findError || !profile) {
      return NextResponse.json({ error: `No account found for ${email}. They need to sign up first.` }, { status: 404 })
    }

    // Update their subscription status to 'ambassador'
    const { error: updateError } = await db
      .from('profiles')
      .update({ subscription_status: 'ambassador' })
      .eq('id', profile.id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      message: `Ambassador account activated for ${profile.full_name} (${email})`,
      previous_status: profile.subscription_status,
      new_status: 'ambassador',
    })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// GET endpoint — list all ambassador accounts
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const secret = searchParams.get('secret')

    if (secret !== process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(-10)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = await createServiceClient()
    const { data, error } = await db
      .from('profiles')
      .select('id, full_name, email, created_at')
      .eq('subscription_status', 'ambassador')
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ ambassadors: data, count: data?.length || 0 })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
