import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

// Ensure the ambassador_referrals table exists
async function ensureTable(db) {
  // Try a simple query — if the table doesn't exist, create it
  const { error } = await db.from('ambassador_referrals').select('id').limit(1)
  if (error && error.code === '42P01') {
    // Table doesn't exist — create it via raw SQL
    await db.rpc('create_ambassador_table').catch(() => {})
    // If rpc doesn't work, the table needs to be created in the Supabase dashboard
    // SQL: CREATE TABLE ambassador_referrals (id uuid DEFAULT gen_random_uuid() PRIMARY KEY, ambassador_code text NOT NULL, student_id uuid, student_email text, student_name text, signup_date timestamptz DEFAULT now(), utm_source text, utm_medium text, subscription_status text DEFAULT 'free', monthly_revenue numeric DEFAULT 0, commission_rate numeric DEFAULT 0.20, commission_paid numeric DEFAULT 0, notes text);
  }
}

export async function POST(req) {
  try {
    const db = await createServiceClient()
    const data = await req.json()

    await ensureTable(db)

    const { error } = await db.from('ambassador_referrals').insert({
      ambassador_code: data.ambassador_code,
      student_id: data.student_id || null,
      student_email: data.student_email,
      student_name: data.student_name,
      utm_source: data.utm_source || null,
      utm_medium: data.utm_medium || null,
    })

    if (error) {
      console.error('Referral tracking error:', error)
      // Don't block signup if tracking fails
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Referral API error:', err)
    return NextResponse.json({ ok: true }) // Don't block signup
  }
}

// GET endpoint to view referral stats (for Jeff's dashboard — requires secret)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const secret = searchParams.get('secret')
    if (secret !== process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(-10)) {
      return NextResponse.json({ error: 'Unauthorized. Add ?secret=YOUR_SECRET' }, { status: 401 })
    }

    const db = await createServiceClient()
    const code = searchParams.get('code')

    let query = db.from('ambassador_referrals')
      .select('*')
      .order('signup_date', { ascending: false })

    if (code) {
      query = query.eq('ambassador_code', code)
    }

    const { data, error } = await query

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Calculate summary stats per ambassador
    const summary = {}
    ;(data || []).forEach(row => {
      if (!summary[row.ambassador_code]) {
        summary[row.ambassador_code] = { code: row.ambassador_code, referrals: 0, paid_users: 0, total_revenue: 0, commission_owed: 0 }
      }
      summary[row.ambassador_code].referrals++
      if (row.subscription_status === 'paid') {
        summary[row.ambassador_code].paid_users++
        summary[row.ambassador_code].total_revenue += parseFloat(row.monthly_revenue || 0)
        summary[row.ambassador_code].commission_owed += parseFloat(row.monthly_revenue || 0) * parseFloat(row.commission_rate || 0.20) - parseFloat(row.commission_paid || 0)
      }
    })

    return NextResponse.json({ referrals: data, summary: Object.values(summary) })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
