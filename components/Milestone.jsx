export default function Milestone({ label, color = '#00A8A8' }) {
  return (
    <div className="flex items-center justify-center py-6" style={{ background: 'transparent' }}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-px" style={{ background: `linear-gradient(90deg, transparent, ${color})` }} />
        <div className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}40` }} />
        {label && (
          <span className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color }}>
            {label}
          </span>
        )}
        <div className="w-2 h-2 rounded-full" style={{ background: color, opacity: 0.3 }} />
        <div className="w-12 h-px" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
      </div>
    </div>
  )
}
