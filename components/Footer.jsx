export default function Footer() {
  const nav = [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'For Faculty',  href: '#for-faculty' },
    { label: 'Pricing',      href: '#pricing' },
    { label: 'Pilot Partner', href: '#pilot' },
  ]

  return (
    <footer className="bg-navy-dark border-t border-white/10 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 13L8 3L13 13" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5.5 9.5H10.5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-bold text-white text-sm">
              transform learning<span className="text-brand-blue">.ai</span>
            </span>
          </div>

          {/* Nav */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            {nav.map(l => (
              <a key={l.href} href={l.href}
                 className="text-xs text-white/40 hover:text-white/70 transition-colors font-medium">
                {l.label}
              </a>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Transform Learning
          </p>
        </div>
      </div>
    </footer>
  )
}
