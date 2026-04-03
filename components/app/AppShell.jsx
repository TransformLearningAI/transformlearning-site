'use client'
import { useState, useEffect, useRef } from 'react'
import Sidebar from './Sidebar'
import Tour from './Tour'
import ThemePicker, { ThemeProvider, useTheme } from './ThemePicker'

export default function AppShell({ profile, enrollments = [], children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showTour, setShowTour] = useState(false)
  const [showNotifs, setShowNotifs] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
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
    // TODO: wire to /api/uploads when ready
    alert(`File "${file.name}" selected. Upload API coming soon.`)
  }

  const notifications = [
    { id: 1, text: 'Welcome to Arrival! Take the tour to learn how the Skill Galaxy works.', time: 'Just now', unread: true },
    { id: 2, text: 'Your XP system is active. Complete quizzes and coaching to level up.', time: '1h ago', unread: true },
    { id: 3, text: 'New skill framework mapped from your syllabus.', time: '2h ago', unread: false },
  ]

  return (
    <ThemeProvider>
    <div className="min-h-screen flex" style={{ background: '#0A0E1A' }}>
      <Sidebar profile={profile} enrollments={enrollments} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="px-5 py-3 flex items-center gap-4 sticky top-0 z-10" style={{ background: '#0D1117', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {/* Mobile menu */}
          <button className="lg:hidden p-2 rounded-lg hover:bg-white/5" onClick={() => setSidebarOpen(true)}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 6h14M3 10h14M3 14h14" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>

          {/* Logo — large, top left */}
          <a href="/" className="flex items-center gap-3 mr-4">
            <svg width="36" height="36" viewBox="0 0 56 56" fill="none" className="flex-shrink-0">
              <rect width="56" height="56" rx="16" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
              <path d="M28 12L16 44H22.5L28 31L33.5 44H40L28 12Z" fill="#00CED1"/>
              <path d="M21 37H35" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
            </svg>
            <span className="text-white font-bold text-base tracking-tight hidden sm:block">
              arrival<span style={{ color: '#00CED1' }}>.ai</span>
            </span>
          </a>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20">
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/><path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input type="text" placeholder="Search courses or actions..."
                className="w-full pl-9 pr-4 py-2 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }} />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button onClick={() => setShowTour(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/30 hover:text-white/50 transition-colors"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3"/><path d="M7 4v3l2 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
              Tour
            </button>

            {/* Theme picker */}
            <ThemePicker />

            {/* Notifications — working dropdown */}
            <div className="relative">
              <button onClick={() => { setShowNotifs(!showNotifs); setShowUpload(false) }}
                className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M13.5 6.75a4.5 4.5 0 10-9 0c0 5.25-2.25 6.75-2.25 6.75h13.5s-2.25-1.5-2.25-6.75z" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M10.3 15.75a1.5 1.5 0 01-2.6 0" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-cyan-400" style={{ boxShadow: '0 0 6px rgba(0,206,209,0.6)' }} />
                )}
              </button>
              {showNotifs && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowNotifs(false)} />
                  <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl z-40 overflow-hidden shadow-2xl"
                       style={{ background: '#141922', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="px-4 py-3 border-b border-white/5">
                      <h3 className="text-sm font-bold text-white">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map(n => (
                        <div key={n.id} className={`px-4 py-3 border-b border-white/5 ${n.unread ? 'bg-cyan-400/5' : ''}`}>
                          <div className="flex items-start gap-2">
                            {n.unread && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />}
                            <div>
                              <p className="text-xs text-white/70 leading-relaxed">{n.text}</p>
                              <p className="text-[10px] text-white/20 mt-1">{n.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Upload — working file picker */}
            <input ref={fileRef} type="file" className="hidden" accept=".pdf,.docx,.doc,.txt,.pptx" onChange={handleFileUpload} />
            <button onClick={() => fileRef.current?.click()}
              className="px-4 py-2 rounded-xl text-white text-xs font-bold hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(135deg, #00CED1, #0891B2)' }}>
              Upload
            </button>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                 style={{ background: 'linear-gradient(135deg, #A78BFA, #7C3AED)' }}>
              {profile.full_name?.[0]?.toUpperCase() ?? profile.email[0].toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Tour */}
      {showTour && <Tour onComplete={completeTour} />}
    </div>
    </ThemeProvider>
  )
}
