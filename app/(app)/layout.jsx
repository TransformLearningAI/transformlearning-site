import { createClient, createServiceClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppShell from '@/components/app/AppShell'

export default async function AppLayout({ children }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  let { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Profile may not exist yet if trigger was slow — create it on the fly
  if (!profile) {
    const service = await createServiceClient()
    const meta = user.user_metadata || {}
    await service.from('profiles').upsert({
      id: user.id,
      email: user.email,
      role: meta.role || 'faculty',
      full_name: meta.full_name || null,
      institution: meta.institution || null,
    }, { onConflict: 'id' })
    const { data: newProfile } = await service.from('profiles').select('*').eq('id', user.id).single()
    profile = newProfile
  }

  if (!profile) redirect('/login')

  return <AppShell profile={profile}>{children}</AppShell>
}
