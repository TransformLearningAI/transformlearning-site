const COURSES = [
  {
    name: 'College Algebra',
    tag: 'Highest DFW Risk',
    tagColor: '#FF6B4A',
    body: 'The highest-risk course for first-year persistence. High DFW rates, broad enrollment, and direct connection to completion outcomes. The most important place to start.',
    signals: ['First-year retention impact', 'Broad enrollment volume', 'High measurability'],
  },
  {
    name: 'Introductory Statistics',
    tag: 'Strong Progression Signals',
    tagColor: '#00A8A8',
    body: 'Clear, measurable progression signals and well-defined intervention windows. A natural environment for demonstrating early value and building the evidence base.',
    signals: ['Quantifiable skill milestones', 'Clear intervention windows', 'Evidence-friendly design'],
  },
  {
    name: 'General Biology',
    tag: 'High Institutional Visibility',
    tagColor: '#4F8A5B',
    body: 'High volume, high institutional visibility, strong evidence potential. Results here create departmental credibility that travels quickly to chairs and leadership.',
    signals: ['High-enrollment environment', 'Department-level visibility', 'Rapid credibility building'],
  },
]

export default function Courses() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden" style={{ background: '#0C1F3F' }}>

      <div className="absolute inset-0 pointer-events-none"
           style={{ background: 'radial-gradient(circle at 20% 80%, rgba(0,168,168,0.08) 0%, transparent 50%)' }} />

      <div className="relative max-w-6xl mx-auto px-6">

        <div className="mb-14">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/40 mb-5">Priority Courses</p>
          <h2 className="font-serif font-light text-white max-w-2xl"
              style={{ fontSize: 'clamp(36px, 5vw, 60px)', lineHeight: 1.05, letterSpacing: '-0.02em' }}>
            Built for the courses with the most <em className="italic opacity-80">at stake.</em>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {COURSES.map(c => (
            <div key={c.name}
                 className="rounded-2xl p-6 border border-white/10 relative overflow-hidden"
                 style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(8px)' }}>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-5 text-[11px] font-bold uppercase tracking-[0.1em]"
                   style={{ background: c.tagColor + '20', color: c.tagColor, border: `1px solid ${c.tagColor}30` }}>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.tagColor }} />
                {c.tag}
              </div>

              <h3 className="font-serif font-light text-white mb-3"
                  style={{ fontSize: '26px', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                {c.name}
              </h3>
              <p className="text-sm leading-relaxed text-white/55 mb-5">{c.body}</p>

              <div className="space-y-2 border-t border-white/10 pt-4">
                {c.signals.map(s => (
                  <div key={s} className="flex items-center gap-2">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-xs text-white/45">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
