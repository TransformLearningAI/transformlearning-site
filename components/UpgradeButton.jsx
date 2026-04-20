'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function UpgradeButton({ className = '', children = 'Upgrade Now' }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  async function handleClick() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })

      if (res.status === 401) {
        router.push('/login')
        return
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Something went wrong. Please try again.')
        setLoading(false)
        return
      }

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('No checkout URL returned:', data)
        setError('Unable to start checkout. Please try again.')
        setLoading(false)
      }
    } catch (err) {
      console.error('Checkout error:', err)
      setError('Network error. Please check your connection and try again.')
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className={className || 'px-8 py-3 bg-[#00A8A8] text-white font-semibold rounded-lg hover:bg-[#008f8f] transition disabled:opacity-50'}
      >
        {loading ? 'Redirecting...' : children}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
