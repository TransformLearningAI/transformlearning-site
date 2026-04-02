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
            <svg width="36" height="36" viewBox="0 0 44 44" fill="none">
              <rect width="44" height="44" rx="14" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
              <path d="M22 10L12 34H18L22 25L26 34H32L22 10Z" fill="#00A8A8"/>
              <path d="M17 28H27" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
            </svg>
            <span className="font-bold text-white text-lg tracking-tight">
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
