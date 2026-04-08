'use client'
import { useState, useEffect, useRef } from 'react'
import Sidebar from './Sidebar'
import Tour from './Tour'
import ThemePicker, { ThemeProvider, useTheme } from './ThemePicker'

function AppShellInner({ profile, enrollments, children }) {
  const { theme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showTour, setShowTour] = useState(false)
  const [showNotifs, setShowNotifs] = useState(false)
  const fileRef = useRef(null)

  useEffect(() => {
    if (!localStorage.getItem('arrival_tour_done')) setShowTour(true)
  }, [])

  function completeTour() {
    setShowTour(false)
    localStorage.setItem('arrival_tour_done', '1')
  }

  function handleFileUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    alert(`File "${file.name}" selected. Upload API coming soon.`)
  }

  const notifications = [
    { id: 1, text: 'Welcome to Arrival! Take the tour to learn how the Skill Galaxy works.', time: 'Just now', unread: true },
    { id: 2, text: 'Your XP system is active. Complete quizzes and coaching to level up.', time: '1h ago', unread: true },
    { id: 3, text: 'New skill framework mapped from your syllabus.', time: '2h ago', unread: false },
  ]

  return (
    <div className="min-h-screen flex" style={{ background: theme.bg }}>
      <Sidebar profile={profile} enrollments={enrollments} open={sidebarOpen} onClose={() => setSidebarOpen(false)} theme={theme} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="px-5 py-3 flex items-center gap-4 sticky top-0 z-10" style={{ background: theme.surface, borderBottom: `1px solid ${theme.border}` }}>
          <button className="lg:hidden p-3 rounded-lg hover:bg-white/5" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 6h14M3 10h14M3 14h14" stroke={theme.textMuted} strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>

          <a href="/" className="flex items-center gap-3 mr-4">
            <svg width="36" height="36" viewBox="0 0 56 56" fill="none" className="flex-shrink-0" aria-hidden="true">
              <rect width="56" height="56" rx="16" fill={theme.surfaceLight} stroke={theme.border} strokeWidth="1"/>
              <path d="M28 12L16 44H22.5L28 31L33.5 44H40L28 12Z" fill={theme.accent}/>
              <path d="M21 37H35" stroke={theme.success} strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
            </svg>
            <span className="font-bold text-base tracking-tight hidden sm:block" style={{ color: theme.text }}>
              arrival<span style={{ color: theme.accent }}>.ai</span>
            </span>
          </a>

          <div className="flex-1 max-w-md">
            <div className="relative">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.textDim }} aria-hidden="true">
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/><path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <label htmlFor="app-search" className="sr-only">Search</label>
              <input id="app-search" type="text" placeholder="Search courses or actions..."
                className="w-full pl-9 pr-4 py-2 rounded-xl text-sm focus:outline-none"
                style={{ background: theme.surfaceLight, border: `1px solid ${theme.border}`, color: theme.text, '::placeholder': { color: theme.textDim } }} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setShowTour(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              style={{ border: `1px solid ${theme.border}`, color: theme.textMuted }}>
              Tour
            </button>

            <ThemePicker />

            <div className="relative">
              <button onClick={() => setShowNotifs(!showNotifs)} className="relative p-3 rounded-lg hover:opacity-80 transition-opacity" aria-label="Notifications">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M13.5 6.75a4.5 4.5 0 10-9 0c0 5.25-2.25 6.75-2.25 6.75h13.5s-2.25-1.5-2.25-6.75z" stroke={theme.textMuted} strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M10.3 15.75a1.5 1.5 0 01-2.6 0" stroke={theme.textMuted} strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full" style={{ background: theme.accent, boxShadow: `0 0 6px ${theme.accent}60` }} />
                )}
              </button>
              {showNotifs && (
                <>
                  <div className="fixed inset-0 z-30" role="button" tabIndex="0" onClick={() => setShowNotifs(false)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setShowNotifs(false) }} />
                  <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl z-40 overflow-hidden shadow-2xl"
                       style={{ background: theme.surface, border: `1px solid ${theme.border}` }}>
                    <div className="px-4 py-3" style={{ borderBottom: `1px solid ${theme.border}` }}>
                      <h3 className="text-sm font-bold" style={{ color: theme.text }}>Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map(n => (
                        <div key={n.id} className="px-4 py-3" style={{ borderBottom: `1px solid ${theme.border}`, background: n.unread ? `${theme.accent}08` : 'transparent' }}>
                          <div className="flex items-start gap-2">
                            {n.unread && <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: theme.accent }} />}
                            <div>
                              <p className="text-xs leading-relaxed" style={{ color: theme.textMuted }}>{n.text}</p>
                              <p className="text-[10px] mt-1" style={{ color: theme.textDim }}>{n.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <input ref={fileRef} type="file" className="hidden" accept=".pdf,.docx,.doc,.txt,.pptx" onChange={handleFileUpload} />
            <button onClick={() => fileRef.current?.click()}
              className="px-4 py-2 rounded-xl text-white text-xs font-bold hover:opacity-90 transition-opacity"
              style={{ background: theme.accentGrad }}>
              Upload
            </button>

            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                 style={{ background: theme.secondary }}>
              {profile.full_name?.[0]?.toUpperCase() ?? profile.email[0].toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      {showTour && <Tour onComplete={completeTour} />}
    </div>
  )
}

export default function AppShell({ profile, enrollments = [], children }) {
  return (
    <ThemeProvider>
      <AppShellInner profile={profile} enrollments={enrollments}>{children}</AppShellInner>
    </ThemeProvider>
  )
}
