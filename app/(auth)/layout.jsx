export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-navy relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
      }} />
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(0,168,168,0.1) 0%, transparent 70%)' }} />
      <div className="relative w-full max-w-md px-6 py-12">
        <a href="/" className="flex items-center gap-2 mb-10 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
               style={{ background: '#00A8A8' }}>
            <span className="text-white font-bold text-sm">TL</span>
          </div>
          <span className="text-white font-semibold text-sm">Transform Learning</span>
        </a>
        {children}
      </div>
    </div>
  )
}
