import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!process.env.STRIPE_PRICE_ID) {
    console.error('STRIPE_PRICE_ID is not configured')
    return NextResponse.json({ error: 'Payment configuration error' }, { status: 500 })
  }

  if (!process.env.NEXT_PUBLIC_APP_URL) {
    console.error('NEXT_PUBLIC_APP_URL is not configured')
    return NextResponse.json({ error: 'App configuration error' }, { status: 500 })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
      client_reference_id: user.id,
      customer_email: user.email,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout session creation failed:', err.message)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
