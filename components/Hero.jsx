const STATS = [
  { label: 'Entry Model',         value: 'Faculty-First' },
  { label: 'Initial Focus',       value: 'Gateway Courses' },
  { label: 'Growth Path',         value: 'Faculty → Dept → Institution' },
  { label: 'Adoption Condition',  value: 'Evidence-Driven' },
]

export default function Hero() {
  return (
    <section className="bg-navy relative overflow-hidden">

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
      }} />

      {/* Gradient accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none"
           style={{ background: 'radial-gradient(circle at 80% 30%, rgba(47,125,246,0.12) 0%, transparent 60%)' }} />

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16 lg:pt-28 lg:pb-20">

        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/20 bg-white/[0.07] mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-blue flex-shrink-0" />
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/70">
            Learning Progression Intelligence — Higher Education
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl lg:text-[64px] font-black tracking-[-0.03em] text-white leading-[1.02] max-w-4xl mb-6">
          See where every student stands —&nbsp;before the grade does.
        </h1>

        {/* Subhead */}
        <p className="text-lg lg:text-xl text-white/70 leading-relaxed max-w-2xl mb-10">
          Transform Learning gives faculty real-time visibility into student progression
          in gateway courses. Early risk signals. Targeted interventions.
          Results you can measure and report.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4">
          <a href="#pilot"
             className="bg-white text-navy px-7 py-3.5 rounded-lg font-bold text-sm hover:bg-brand-mist transition-colors">
            Become a Pilot Partner →
          </a>
          <a href="#how-it-works"
             className="border border-white/30 text-white px-7 py-3.5 rounded-lg font-semibold text-sm hover:bg-white/10 transition-colors">
            See How It Works
          </a>
        </div>
      </div>

      {/* Stats strip */}
      <div className="border-t border-white/10 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 divide-x divide-brand-border">
          {STATS.map(s => (
            <div key={s.label} className="px-6 py-5 first:pl-0 lg:first:pl-6">
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gray mb-1">{s.label}</div>
              <div className="text-sm font-bold text-navy">{s.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
