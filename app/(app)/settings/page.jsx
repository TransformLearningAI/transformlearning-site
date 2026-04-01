import { createClient } from '@/lib/supabase/server'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  return (
    <div className="max-w-xl">
      <h1 className="font-serif font-light text-navy mb-6" style={{ fontSize: '36px', letterSpacing: '-0.02em' }}>Settings</h1>
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="font-bold text-navy mb-4">Your Account</h2>
        <dl className="space-y-3">
          {[
            { label: 'Name', value: profile?.full_name || '—' },
            { label: 'Email', value: profile?.email },
            { label: 'Role', value: profile?.role },
            { label: 'Institution', value: profile?.institution || '—' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <dt className="text-xs font-bold text-gray-400 uppercase tracking-[0.1em]">{label}</dt>
              <dd className="text-sm text-navy capitalize">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
