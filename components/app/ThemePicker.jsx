'use client'
import { useState, useEffect, createContext, useContext } from 'react'

export const THEMES = {
  cosmos: {
    name: 'Cosmos',
    desc: 'Deep space with cyan and purple nebulae',
    preview: ['#020617', '#00CED1', '#A78BFA', '#4ADE80'],
    bg: '#020617',
    surface: '#0D1117',
    surfaceLight: 'rgba(255,255,255,0.05)',
    border: 'rgba(255,255,255,0.08)',
    accent: '#00CED1',
    accentGrad: 'linear-gradient(135deg, #00CED1, #0891B2)',
    secondary: '#A78BFA',
    success: '#4ADE80',
    warning: '#FBBF24',
    danger: '#FB7185',
    text: 'rgba(255,255,255,0.9)',
    textMuted: 'rgba(255,255,255,0.4)',
    textDim: 'rgba(255,255,255,0.15)',
    nebula1: 'rgba(34,211,238,0.14)',
    nebula2: 'rgba(168,85,247,0.16)',
    nebula3: 'rgba(74,222,128,0.06)',
  },
  aurora: {
    name: 'Aurora',
    desc: 'Northern lights with greens and teals',
    preview: ['#041C14', '#34D399', '#06B6D4', '#A3E635'],
    bg: '#041C14',
    surface: '#0A2B1E',
    surfaceLight: 'rgba(52,211,153,0.06)',
    border: 'rgba(52,211,153,0.12)',
    accent: '#34D399',
    accentGrad: 'linear-gradient(135deg, #34D399, #06B6D4)',
    secondary: '#06B6D4',
    success: '#A3E635',
    warning: '#FBBF24',
    danger: '#FB7185',
    text: 'rgba(255,255,255,0.9)',
    textMuted: 'rgba(255,255,255,0.45)',
    textDim: 'rgba(255,255,255,0.15)',
    nebula1: 'rgba(52,211,153,0.12)',
    nebula2: 'rgba(6,182,212,0.10)',
    nebula3: 'rgba(163,230,53,0.06)',
  },
  ocean: {
    name: 'Ocean',
    desc: 'Deep blue with sapphire and aqua tones',
    preview: ['#0C1222', '#3B82F6', '#38BDF8', '#818CF8'],
    bg: '#0C1222',
    surface: '#111B2E',
    surfaceLight: 'rgba(59,130,246,0.06)',
    border: 'rgba(59,130,246,0.12)',
    accent: '#38BDF8',
    accentGrad: 'linear-gradient(135deg, #38BDF8, #3B82F6)',
    secondary: '#818CF8',
    success: '#34D399',
    warning: '#FBBF24',
    danger: '#FB7185',
    text: 'rgba(255,255,255,0.9)',
    textMuted: 'rgba(255,255,255,0.45)',
    textDim: 'rgba(255,255,255,0.15)',
    nebula1: 'rgba(56,189,248,0.12)',
    nebula2: 'rgba(129,140,248,0.10)',
    nebula3: 'rgba(59,130,246,0.06)',
  },
  ember: {
    name: 'Ember',
    desc: 'Warm dark tones with amber and rose',
    preview: ['#1A0E0A', '#F59E0B', '#FB923C', '#F472B6'],
    bg: '#1A0E0A',
    surface: '#261510',
    surfaceLight: 'rgba(245,158,11,0.06)',
    border: 'rgba(245,158,11,0.12)',
    accent: '#F59E0B',
    accentGrad: 'linear-gradient(135deg, #F59E0B, #FB923C)',
    secondary: '#F472B6',
    success: '#4ADE80',
    warning: '#F59E0B',
    danger: '#EF4444',
    text: 'rgba(255,255,255,0.9)',
    textMuted: 'rgba(255,255,255,0.45)',
    textDim: 'rgba(255,255,255,0.15)',
    nebula1: 'rgba(245,158,11,0.12)',
    nebula2: 'rgba(244,114,182,0.10)',
    nebula3: 'rgba(251,146,60,0.06)',
  },
  minimal: {
    name: 'Minimal',
    desc: 'Clean light theme with subtle colors',
    preview: ['#F8FAFC', '#0F172A', '#0EA5E9', '#8B5CF6'],
    bg: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceLight: 'rgba(15,23,42,0.03)',
    border: 'rgba(15,23,42,0.08)',
    accent: '#0EA5E9',
    accentGrad: 'linear-gradient(135deg, #0EA5E9, #6366F1)',
    secondary: '#8B5CF6',
    success: '#22C55E',
    warning: '#EAB308',
    danger: '#EF4444',
    text: '#0F172A',
    textMuted: '#64748B',
    textDim: '#CBD5E1',
    nebula1: 'rgba(14,165,233,0.06)',
    nebula2: 'rgba(139,92,246,0.04)',
    nebula3: 'rgba(34,197,94,0.04)',
  },
}

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [themeId, setThemeId] = useState('cosmos')

  useEffect(() => {
    const saved = localStorage.getItem('arrival_theme')
    if (saved && THEMES[saved]) setThemeId(saved)
  }, [])

  function setTheme(id) {
    setThemeId(id)
    localStorage.setItem('arrival_theme', id)
  }

  return (
    <ThemeContext.Provider value={{ theme: THEMES[themeId], themeId, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext) || { theme: THEMES.cosmos, themeId: 'cosmos', setTheme: () => {} }
}

export default function ThemePicker() {
  const { themeId, setTheme } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="p-2 rounded-lg hover:bg-white/5 transition-colors" title="Change theme">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3" opacity="0.4"/>
          <circle cx="6" cy="7" r="1.5" fill="#00CED1"/>
          <circle cx="11" cy="6" r="1.5" fill="#A78BFA"/>
          <circle cx="9" cy="11" r="1.5" fill="#4ADE80"/>
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl z-40 overflow-hidden shadow-2xl"
               style={{ background: '#141922', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="px-4 py-3 border-b border-white/5">
              <h3 className="text-sm font-bold text-white">Appearance</h3>
              <p className="text-[10px] text-white/30 mt-0.5">Choose your visual style</p>
            </div>
            <div className="p-3 space-y-2">
              {Object.entries(THEMES).map(([id, t]) => (
                <button key={id} onClick={() => { setTheme(id); setOpen(false) }}
                  className={`w-full flex items-center gap-3 rounded-xl p-3 text-left transition-all ${
                    themeId === id ? 'ring-1 ring-cyan-400' : 'hover:bg-white/5'
                  }`}
                  style={themeId === id ? { background: 'rgba(0,206,209,0.08)' } : {}}>
                  {/* Color preview dots */}
                  <div className="flex gap-1 flex-shrink-0">
                    {t.preview.map((c, i) => (
                      <div key={i} className="w-4 h-4 rounded-full border border-white/10" style={{ background: c }} />
                    ))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white">{t.name}</div>
                    <div className="text-[10px] text-white/30 truncate">{t.desc}</div>
                  </div>
                  {themeId === id && <div className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
