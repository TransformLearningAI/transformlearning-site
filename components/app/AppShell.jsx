'use client'
import { useState } from 'react'
import Sidebar from './Sidebar'

export default function AppShell({ profile, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex" style={{ background: '#F4F7FB' }}>
      <Sidebar profile={profile} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 6h14M3 10h14M3 14h14" stroke="#374151" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                 style={{ background: '#00A8A8' }}>
              {profile.full_name?.[0] ?? profile.email[0].toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-navy leading-none">{profile.full_name || profile.email}</p>
              <p className="text-xs text-gray-400 capitalize">{profile.role}</p>
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
    </div>
  )
}
