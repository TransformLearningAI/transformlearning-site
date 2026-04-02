'use client'
import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import Tour from './Tour'

export default function AppShell({ profile, enrollments = [], children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showTour, setShowTour] = useState(false)

  useEffect(() => {
    // Show tour on first visit
    if (!localStorage.getItem('arrival_tour_done')) {
      setShowTour(true)
    }
  }, [])

  function completeTour() {
    setShowTour(false)
    localStorage.setItem('arrival_tour_done', '1')
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#F4F7FB' }}>
      <Sidebar profile={profile} enrollments={enrollments} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 sticky top-0 z-10">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 6h14M3 10h14M3 14h14" stroke="#374151" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="Search courses or actions..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-teal-500 transition-colors"
                style={{ background: '#F9FAFB' }}
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Tour button */}
            <button onClick={() => setShowTour(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3"/><path d="M7 4v3l2 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
              Tour
            </button>

            {/* Classes dropdown */}
            <button className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors">
              Classes
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M3 4l2 2 2-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
            </button>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M13.5 6.75a4.5 4.5 0 10-9 0c0 5.25-2.25 6.75-2.25 6.75h13.5s-2.25-1.5-2.25-6.75z" stroke="#6B7280" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M10.3 15.75a1.5 1.5 0 01-2.6 0" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>

            {/* Upload button */}
            <button className="px-4 py-2 rounded-xl text-white text-xs font-bold hover:opacity-90 transition-opacity"
                    style={{ background: '#2D8B6F' }}>
              Upload
            </button>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                 style={{ background: '#2D8B6F' }}>
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
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden"
             onClick={() => setSidebarOpen(false)} />
      )}

      {/* Tour */}
      {showTour && <Tour onComplete={completeTour} />}
    </div>
  )
}
