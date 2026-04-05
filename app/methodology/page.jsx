import Link from 'next/link'

export const metadata = {
  title: 'Methodology — Restricted Access — Arrival',
  description: 'Request access to the Arrival proficiency scoring methodology white paper.',
}

export default function MethodologyGate() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
             style={{ background: '#0C1F3F' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="11" width="18" height="11" rx="2" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M7 11V7a5 5 0 0110 0v4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          </svg>
        </div>
        <h1 className="font-serif font-light text-navy text-3xl mb-4" style={{ letterSpacing: '-0.02em' }}>
          This page requires access.
        </h1>
        <p className="text-sm text-brand-gray leading-relaxed mb-3">
          The Arrival Proficiency Scoring Methodology white paper contains proprietary information about
          our multi-source evidence weighting, trajectory analysis, confidence intervals, and governance architecture.
        </p>
        <p className="text-sm text-brand-gray leading-relaxed mb-8">
          Access is available to educators, institutional leaders, investors, and press.
        </p>
        <Link href="/access"
          className="inline-block px-8 py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
          style={{ background: '#0C1F3F' }}>
          Request Access &rarr;
        </Link>
        <div className="mt-6">
          <Link href="/" className="text-xs text-brand-gray hover:text-navy transition-colors">
            &larr; Back to site
          </Link>
        </div>
      </div>
    </div>
  )
}
