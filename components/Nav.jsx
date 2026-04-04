'use client'
import { useState } from 'react'

export default function Nav() {
  const [open, setOpen] = useState(false)

  const links = [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'For Faculty',  href: '#for-faculty' },
    { label: 'Pricing',      href: '#pricing' },
    { label: 'About',        href: '#about' },
    { label: 'Methodology',  href: '/methodology' },
    { label: 'Investors',    href: '/investors' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-brand-border">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <a href="/" className="flex items-center gap-4 group">
          <svg width="46" height="46" viewBox="0 0 56 56" fill="none" className="flex-shrink-0">
            <rect width="56" height="56" rx="16" fill="#0C1F3F"/>
            {/* Teal A mark */}
            <path d="M28 12L16 44H22.5L28 31L33.5 44H40L28 12Z" fill="#00A8A8"/>
            {/* Green accent bar */}
            <path d="M21 37H35" stroke="#4F8A5B" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
            {/* Subtle contour ring */}
            <circle cx="28" cy="26" r="9" stroke="white" strokeWidth="0.8" opacity="0.12"/>
          </svg>
          <div className="leading-none">
            <span className="font-bold text-navy text-xl tracking-tight">
              arrival<span style={{ color: '#00A8A8' }}>.ai</span>
            </span>
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] mt-1" style={{ color: '#5F7691' }}>
              Adaptive Learning OS
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
