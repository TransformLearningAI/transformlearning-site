import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')
  const secret = process.env.STRIPE_WEBHOOK_SECRET

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const service = await createServiceClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object
      const userId = session.client_reference_id
      if (userId) {
        try {
          const { error } = await service
            .from('profiles')
            .update({
              subscription_status: 'active',
              stripe_customer_id: session.customer,
            })
            .eq('id', userId)
          if (error) {
            console.error('DB update failed for checkout.session.completed:', error.message)
            return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
          }
        } catch (err) {
          console.error('DB operation failed for checkout.session.completed:', err.message)
          return NextResponse.json({ error: 'Database operation failed' }, { status: 500 })
        }
      }
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object
      const customerId = subscription.customer
      const status = subscription.status

      let subscriptionStatus
      if (status === 'active' || status === 'trialing') {
        subscriptionStatus = 'active'
      } else if (['past_due', 'canceled', 'unpaid'].includes(status)) {
        subscriptionStatus = status
      } else {
        break
      }

      try {
        const { error } = await service
          .from('profiles')
          .update({ subscription_status: subscriptionStatus })
          .eq('stripe_customer_id', customerId)
        if (error) {
          console.error('DB update failed for customer.subscription.updated:', error.message)
          return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
        }
      } catch (err) {
        console.error('DB operation failed for customer.subscription.updated:', err.message)
        return NextResponse.json({ error: 'Database operation failed' }, { status: 500 })
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object
      const customerId = subscription.customer
      try {
        const { error } = await service
          .from('profiles')
          .update({ subscription_status: 'canceled' })
          .eq('stripe_customer_id', customerId)
        if (error) {
          console.error('DB update failed for customer.subscription.deleted:', error.message)
          return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
        }
      } catch (err) {
        console.error('DB operation failed for customer.subscription.deleted:', err.message)
        return NextResponse.json({ error: 'Database operation failed' }, { status: 500 })
      }
      break
    }

    default:
      console.log('Unhandled Stripe webhook event type:', event.type)
  }

  return NextResponse.json({ received: true })
}
