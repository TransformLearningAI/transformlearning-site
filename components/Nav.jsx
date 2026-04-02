'use client'
import { useState } from 'react'

export default function Nav() {
  const [open, setOpen] = useState(false)

  const links = [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'For Faculty',  href: '#for-faculty' },
    { label: 'Pricing',      href: '#pricing' },
    { label: 'About',        href: '#about' },
    { label: 'Investors',    href: '/investors' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-brand-border">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <a href="/" className="flex items-center gap-3 group">
          <svg width="38" height="38" viewBox="0 0 44 44" fill="none" className="flex-shrink-0">
            <rect width="44" height="44" rx="14" fill="#0C1F3F"/>
            <path d="M22 10L12 34H18L22 25L26 34H32L22 10Z" fill="#00A8A8"/>
            <path d="M17 28H27" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
          </svg>
          <div className="leading-tight">
            <span className="font-bold text-navy text-lg tracking-tight">
              arrival<span style={{ color: '#00A8A8' }}>.ai</span>
            </span>
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
                onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 4L16 16M16 4L4 16" stroke="#0C1F3F" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
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
