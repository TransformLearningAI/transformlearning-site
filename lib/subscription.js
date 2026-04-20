import { createClient } from '@/lib/supabase/server'

export async function getSubscriptionStatus() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { subscribed: false, status: null }

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('subscription_status')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Failed to fetch subscription status:', error.message)
      return { subscribed: false, status: 'error' }
    }

    const status = profile?.subscription_status || 'none'
    return { subscribed: status === 'active' || status === 'trialing', status }
  } catch (err) {
    console.error('Subscription status check failed:', err.message)
    return { subscribed: false, status: 'error' }
  }
}
