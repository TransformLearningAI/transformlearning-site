import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

const ADMIN_EMAILS = ['jeff@yourclassroom.ai']

async function getAdmin(db) {
  const { data: { user } } = await (await import('@/lib/supabase/server')).createClient()
    .catch(() => ({ data: { user: null } }))
  return user
}

// GET — full ambassador dashboard data
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const secret = searchParams.get('secret')

    if (secret !== process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(-10)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = await createServiceClient()

    // Get all ambassador profiles
    const { data: ambassadors, error: ambError } = await db
      .from('profiles')
      .select('id, full_name, email, created_at, subscription_status')
      .eq('subscription_status', 'ambassador')
      .order('created_at', { ascending: false })

    if (ambError) return NextResponse.json({ error: ambError.message }, { status: 500 })

    // Get all referrals
    const { data: referrals, error: refError } = await db
      .from('ambassador_referrals')
      .select('*')
      .order('signup_date', { ascending: false })

    // Get all payments
    const { data: payments, error: payError } = await db
      .from('ambassador_payments')
      .select('*')
      .order('paid_at', { ascending: false })

    // Build stats per ambassador code
    const stats = {}
    ;(referrals || []).forEach(r => {
      const code = r.ambassador_code
      if (!stats[code]) {
        stats[code] = { code, signups: 0, paid_users: 0, total_revenue: 0, commission_owed: 0, referrals: [] }
      }
      stats[code].signups++
      stats[code].referrals.push(r)
      if (r.subscription_status === 'paid') {
        stats[code].paid_users++
        stats[code].total_revenue += parseFloat(r.monthly_revenue || 0)
        stats[code].commission_owed += parseFloat(r.monthly_revenue || 0) * parseFloat(r.commission_rate || 0.20)
      }
    })

    // Subtract payments already made
    ;(payments || []).forEach(p => {
      if (stats[p.ambassador_code]) {
        stats[p.ambassador_code].commission_owed -= parseFloat(p.amount || 0)
      }
    })

    return NextResponse.json({
      ambassadors: ambassadors || [],
      stats: Object.values(stats),
      referrals: referrals || [],
      payments: payments || [],
    })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST — record a payment
export async function POST(req) {
  try {
    const { secret, ambassador_code, amount, method, notes } = await req.json()

    if (secret !== process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(-10)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!ambassador_code || !amount) {
      return NextResponse.json({ error: 'ambassador_code and amount required' }, { status: 400 })
    }

    const db = await createServiceClient()

    // Ensure payments table exists
    const { error: checkError } = await db.from('ambassador_payments').select('id').limit(1)
    if (checkError && checkError.code === '42P01') {
      // Table doesn't exist — will need to be created in Supabase
      return NextResponse.json({
        error: 'ambassador_payments table does not exist. Create it in Supabase: CREATE TABLE ambassador_payments (id uuid DEFAULT gen_random_uuid() PRIMARY KEY, ambassador_code text NOT NULL, amount numeric NOT NULL, method text, notes text, paid_at timestamptz DEFAULT now());'
      }, { status: 500 })
    }

    const { data, error } = await db
      .from('ambassador_payments')
      .insert({
        ambassador_code,
        amount: parseFloat(amount),
        method: method || null,
        notes: notes || null,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ ok: true, payment: data })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
