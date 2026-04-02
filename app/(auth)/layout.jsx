export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-navy relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
      }} />
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(0,168,168,0.12) 0%, transparent 70%)' }} />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(79,138,91,0.08) 0%, transparent 70%)' }} />
      <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(90,62,107,0.06) 0%, transparent 70%)' }} />

      {/* Left side — brand */}
      <div className="hidden lg:flex flex-col justify-between flex-1 relative px-12 py-10">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 group">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <rect width="44" height="44" rx="14" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
            <path d="M22 10L12 34H18L22 25L26 34H32L22 10Z" fill="#00A8A8"/>
            <path d="M17 28H27" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
          </svg>
          <div>
            <span className="text-white font-bold text-lg tracking-tight">arrival<span style={{ color: '#00A8A8' }}>.ai</span></span>
            <p className="text-white/30 text-[10px] uppercase tracking-[0.15em] mt-0.5">Adaptive Learning OS</p>
          </div>
        </a>

        {/* Brand statement */}
        <div className="max-w-md">
          <h1 className="font-serif font-light text-white/90 mb-4" style={{ fontSize: 'clamp(32px, 4vw, 48px)', lineHeight: 1.05, letterSpacing: '-0.02em' }}>
            The path forward.<br/><em className="italic text-white/60">Revealed.</em>
          </h1>
          <p className="text-white/40 text-sm leading-relaxed max-w-sm">
            A wayfinding system for learning. Know where you are. See where to go. Follow the path forward.
          </p>
        </div>

        {/* Decorative terrain preview */}
        <div className="flex items-center gap-6 text-white/20">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: '#4F8A5B' }} />
            <span className="text-[11px]">Explored</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: '#00A8A8', opacity: 0.6 }} />
            <span className="text-[11px]">Emerging</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: '#DDE5EF', opacity: 0.3 }} />
            <span className="text-[11px]">Uncharted</span>
          </div>
        </div>
      </div>

      {/* Right side — form */}
      <div className="w-full lg:w-[480px] flex items-center justify-center relative">
        <div className="absolute inset-0 lg:rounded-l-[40px]" style={{ background: 'rgba(12,31,63,0.5)', backdropFilter: 'blur(40px)' }} />
        <div className="relative w-full max-w-sm px-8 py-12">
          {/* Mobile logo */}
          <a href="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <svg width="32" height="32" viewBox="0 0 44 44" fill="none">
              <rect width="44" height="44" rx="14" fill="rgba(255,255,255,0.06)"/>
              <path d="M22 10L12 34H18L22 25L26 34H32L22 10Z" fill="#00A8A8"/>
            </svg>
            <span className="text-white font-bold text-sm">arrival<span style={{ color: '#00A8A8' }}>.ai</span></span>
          </a>
          {children}
        </div>
      </div>
    </div>
  )
}
