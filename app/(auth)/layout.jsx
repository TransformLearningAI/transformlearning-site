export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: '#0A0E1A' }}>
      {/* Nebula effects */}
      <div className="absolute w-[600px] h-[600px] rounded-full pointer-events-none" style={{ top: '-10%', right: '-5%', background: 'radial-gradient(circle, rgba(0,206,209,0.08) 0%, transparent 70%)' }} />
      <div className="absolute w-[500px] h-[500px] rounded-full pointer-events-none" style={{ bottom: '-15%', left: '-5%', background: 'radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)' }} />
      <div className="absolute w-[400px] h-[400px] rounded-full pointer-events-none" style={{ top: '40%', left: '50%', background: 'radial-gradient(circle, rgba(74,222,128,0.04) 0%, transparent 70%)' }} />

      {/* Subtle star field */}
      <div className="absolute inset-0 pointer-events-none opacity-30" style={{
        backgroundImage: `radial-gradient(1px 1px at 10% 20%, white, transparent),
          radial-gradient(1px 1px at 80% 10%, white, transparent),
          radial-gradient(1px 1px at 30% 80%, white, transparent),
          radial-gradient(1px 1px at 70% 60%, white, transparent),
          radial-gradient(1px 1px at 50% 40%, white, transparent),
          radial-gradient(1px 1px at 90% 90%, white, transparent),
          radial-gradient(1px 1px at 15% 55%, white, transparent),
          radial-gradient(1px 1px at 60% 30%, white, transparent)`,
      }} />

      <div className="relative z-10 w-full max-w-md px-6 py-12">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 mb-12 group">
          <svg width="44" height="44" viewBox="0 0 56 56" fill="none">
            <rect width="56" height="56" rx="16" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
            <path d="M28 12L16 44H22.5L28 31L33.5 44H40L28 12Z" fill="#00CED1"/>
            <path d="M21 37H35" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
            <circle cx="28" cy="26" r="9" stroke="white" strokeWidth="0.8" opacity="0.1"/>
          </svg>
          <div>
            <span className="text-white font-bold text-xl tracking-tight">arrival<span style={{ color: '#00CED1' }}>.ai</span></span>
            <p className="text-white/20 text-[9px] uppercase tracking-[0.18em] mt-0.5">Adaptive Learning OS</p>
          </div>
        </a>
        {children}
      </div>
    </div>
  )
}
