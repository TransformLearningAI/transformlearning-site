import { getSubscriptionStatus } from '@/lib/subscription'
import UpgradeButton from '@/components/UpgradeButton'

export const metadata = {
  title: 'Upgrade — AI Coach',
}

export default async function UpgradePage() {
  const { subscribed, status } = await getSubscriptionStatus()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8">
        {subscribed ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-[#00A8A8]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#00A8A8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#0C1F3F] mb-2">You&apos;re Subscribed</h1>
            <p className="text-gray-600 mb-6">
              Your AI Coach subscription is <span className="font-semibold text-[#00A8A8]">{status}</span>. You have full access to unlimited coaching conversations.
            </p>
            <a
              href="/settings"
              className="text-[#00A8A8] hover:underline font-medium"
            >
              Manage subscription in Settings &rarr;
            </a>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#0C1F3F] mb-2">Unlock AI Coach</h1>
            <p className="text-gray-600 mb-6">
              Get personalized, one-on-one AI coaching to accelerate your learning.
            </p>

            <div className="mb-8">
              <span className="text-5xl font-bold text-[#0C1F3F]">$10</span>
              <span className="text-gray-500 text-lg">/month</span>
            </div>

            <ul className="text-left space-y-3 mb-8">
              {[
                'Unlimited AI coaching conversations',
                'Personalized skill-by-skill guidance',
                'Adaptive pacing based on your proficiency',
                'Practice exercises tailored to your gaps',
                'Available 24/7 — learn on your schedule',
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#00A8A8] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <UpgradeButton className="w-full px-8 py-3 bg-[#00A8A8] text-white font-semibold rounded-lg hover:bg-[#008f8f] transition disabled:opacity-50 text-lg">
              Subscribe — $10/month
            </UpgradeButton>

            <p className="text-xs text-gray-400 mt-4">
              Cancel anytime. Powered by Stripe.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
