'use client'
import { useState } from 'react'

export default function Nav() {
  const [open, setOpen] = useState(false)

  const links = [
    { label: 'For Students',  href: '/students' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'For Faculty',  href: '#for-faculty' },
    { label: 'Pricing',      href: '#pricing' },
    { label: 'Blog',          href: '/blog' },
    { label: 'Methodology',  href: '/methodology' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-brand-border">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-navy focus:text-white focus:rounded-lg focus:text-sm focus:font-bold">Skip to main content</a>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <a href="/" className="flex items-center gap-4 group">
          <svg width="40" height="40" viewBox="0 0 56 56" fill="none" className="flex-shrink-0" aria-hidden="true">
            <rect width="56" height="56" rx="14" fill="#0C1F3F"/>
            {/* Rising arc — transformation */}
            <path d="M14 38C18 28 24 20 32 16C38 13 44 14 46 18" stroke="#00A8A8" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
            {/* Dot at peak — arrival/destination */}
            <circle cx="46" cy="18" r="3" fill="#4F8A5B"/>
            {/* Ground line */}
            <path d="M12 42H44" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.15"/>
          </svg>
          <div className="leading-none">
            <span className="font-bold text-navy text-xl tracking-tight">
              transform<span style={{ color: '#00A8A8' }}>learning</span>
            </span>
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] mt-1" style={{ color: '#5F7691' }}>
              Changing how learning works
            </p>
          </div>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a key={l.href} href={l.href}
               className="text-sm font-medium text-brand-text hover:text-navy transition-colors">
              {l.label}
            </a>
          ))}
          <a href="#pilot"
             className="text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity"
             style={{ background: '#00A8A8' }}>
            Become a Pilot Partner →
          </a>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 rounded-lg hover:bg-brand-mist transition-colors"
                onClick={() => setOpen(!open)} aria-label="Toggle navigation menu">
          {open ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4 4L16 16M16 4L4 16" stroke="#0C1F3F" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M3 5H17M3 10H17M3 15H17" stroke="#0C1F3F" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-brand-border bg-white px-6 py-4 space-y-1">
          {links.map(l => (
            <a key={l.href} href={l.href}
               className="block text-sm font-medium text-brand-text py-2.5 border-b border-brand-border/50"
               onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a href="#pilot"
             className="block text-white px-5 py-3 rounded-lg text-sm font-bold text-center mt-4"
             style={{ background: '#00A8A8' }}
             onClick={() => setOpen(false)}>
            Become a Pilot Partner →
          </a>
        </div>
      )}
    </nav>
  )
}
