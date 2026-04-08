'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function DownloadInner() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState('checking') // checking | approved | invalid
  const [name, setName] = useState('')

  useEffect(() => {
    if (!token) { setStatus('invalid'); return }

    fetch(`/api/whitepaper-download?token=${token}`)
      .then(r => r.json())
      .then(d => {
        if (d.approved) {
          setStatus('approved')
          setName(d.name || '')
        } else {
          setStatus('invalid')
        }
      })
      .catch(() => setStatus('invalid'))
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#F4F7FB' }}>
      <div className="bg-white rounded-2xl border border-gray-200 p-12 max-w-md text-center shadow-sm">
        {status === 'checking' && (
          <>
            <div className="w-8 h-8 border-2 border-[#00A8A8] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray-400">Verifying access...</p>
          </>
        )}

        {status === 'approved' && (
          <>
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                 style={{ background: 'rgba(79,138,91,0.1)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 12L10 17L19 7" stroke="#4F8A5B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="text-xl font-bold mb-2" style={{ color: '#0C1F3F' }}>
              {name ? `Welcome, ${name.split(' ')[0]}` : 'Access Granted'}
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              Your access has been approved. Click below to download the Campus OS white paper.
            </p>
            <a href="/campus-os-whitepaper.docx" download
               className="inline-block px-8 py-3.5 rounded-lg font-bold text-sm text-white"
               style={{ background: '#0C1F3F' }}>
              Download White Paper →
            </a>
            <p className="text-xs text-gray-400 mt-6">
              Questions? <a href="mailto:jeff@transformlearning.ai" className="underline">jeff@transformlearning.ai</a>
            </p>
          </>
        )}

        {status === 'invalid' && (
          <>
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                 style={{ background: 'rgba(255,107,74,0.1)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M6 6L18 18M18 6L6 18" stroke="#FF6B4A" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h1 className="text-xl font-bold mb-2" style={{ color: '#0C1F3F' }}>Access Not Available</h1>
            <p className="text-sm text-gray-500 mb-6">
              This link is invalid or your request hasn't been approved yet.
              If you haven't requested access, you can do so below.
            </p>
            <Link href="/campus-os/whitepaper"
              className="inline-block px-8 py-3.5 rounded-lg font-bold text-sm text-white"
              style={{ background: '#0C1F3F' }}>
              Request Access →
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default function WhitepaperDownload() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F4F7FB' }}>
        <div className="w-8 h-8 border-2 border-[#00A8A8] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <DownloadInner />
    </Suspense>
  )
}
