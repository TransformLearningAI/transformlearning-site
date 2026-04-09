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
          <div className="flex items-center gap-4">
            <svg width="40" height="40" viewBox="0 0 56 56" fill="none" aria-hidden="true">
              <rect width="56" height="56" rx="14" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
              <path d="M14 38C18 28 24 20 32 16C38 13 44 14 46 18" stroke="#00A8A8" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
              <circle cx="46" cy="18" r="3" fill="#4F8A5B"/>
              <path d="M12 42H44" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.15"/>
            </svg>
            <div>
              <span className="font-bold text-white text-xl tracking-tight">
                transform<span style={{ color: '#00A8A8' }}>learning</span>
              </span>
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] mt-0.5 text-white/30">Changing how learning works</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            {nav.map(l => (
              <a key={l.href} href={l.href}
                 className="text-xs text-white/60 hover:text-white/80 transition-colors font-medium">
                {l.label}
              </a>
            ))}
          </nav>

          <p className="text-xs text-white/50">© {new Date().getFullYear()} Arrival</p>
        </div>
      </div>
    </footer>
  )
}
