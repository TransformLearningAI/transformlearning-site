export default function Footer() {
  const nav = [
    { label: 'How It Works',  href: '#how-it-works' },
    { label: 'For Faculty',   href: '#for-faculty' },
    { label: 'Pricing',       href: '#pricing' },
    { label: 'About Us',      href: '#about' },
    { label: 'Pilot Partner', href: '#pilot' },
    { label: 'Investors',     href: '/investors' },
  ]

  return (
    <footer className="border-t border-white/8 py-14 relative overflow-hidden" style={{ background: '#071429' }}>

      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: 'radial-gradient(ellipse at 50% 120%, rgba(0,168,168,0.06) 0%, transparent 60%)' }} />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="flex flex-col items-center gap-8 text-center">

          {/* Tagline */}
          <p className="font-serif italic text-white/50"
             style={{ fontSize: 'clamp(28px, 4vw, 48px)', letterSpacing: '-0.02em', lineHeight: 1 }}>
            You have arrived.
          </p>

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.07)' }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L2 14H6L8 10L10 14H14L8 2Z" fill="currentColor"/>
              </svg>
            </div>
            <span className="font-bold text-white text-sm">
              arrival<span style={{ color: '#00A8A8' }}>.ai</span>
            </span>
          </div>

          {/* Nav */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            {nav.map(l => (
              <a key={l.href} href={l.href}
                 className="text-xs text-white/30 hover:text-white/60 transition-colors font-medium">
                {l.label}
              </a>
            ))}
          </nav>

          <p className="text-xs text-white/20">© {new Date().getFullYear()} Arrival</p>
        </div>
      </div>
    </footer>
  )
}
