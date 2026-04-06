import ScrollReveal from './ScrollReveal'

const OUTCOMES = [
  {
    audience: 'Academic', color: '#00A8A8',
    headline: 'Reduction in DFW rates.',
    items: ['Measurable improvement in course pass rates', 'Baseline comparisons that document what changed', 'Evidence of intervention timing effectiveness'],
  },
  {
    audience: 'Faculty', color: '#0C1F3F',
    headline: 'Clarity. Not more data.',
    items: ['Clearer decisions with less uncertainty', 'Faster, better-targeted interventions', 'A workflow that replaces the guesswork'],
  },
  {
    audience: 'Institutional', color: '#4F8A5B',
    headline: 'From hoping to knowing.',
    items: ['Retention indicators for student success reporting', 'Performance data for accreditation narratives', 'Department-to-institution expansion pathway'],
  },
]

export default function Outcomes() {
  return (
    <section className="py-32 lg:py-40 relative overflow-hidden" style={{ background: '#0C1F3F' }}>

      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(0,168,168,0.12) 0%, transparent 60%)' }} />

      <div className="absolute left-0 bottom-0 font-serif font-light select-none pointer-events-none"
           style={{ fontSize: '280px', lineHeight: 1, color: 'rgba(255,255,255,0.025)', letterSpacing: '-0.05em' }}>
        05
      </div>

      <div className="relative max-w-6xl mx-auto px-6">

        <div className="text-center max-w-3xl mx-auto mb-16">
          <ScrollReveal>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/40 mb-6">What Changes</p>
            <h2 className="font-serif font-light text-white mb-4"
                style={{ fontSize: 'clamp(36px, 5.5vw, 72px)', lineHeight: 1.0, letterSpacing: '-0.03em' }}>
              Results faculty can show.<br />
              <em className="italic" style={{ color: '#00A8A8' }}>Institutions can act on.</em>
            </h2>
          </ScrollReveal>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {OUTCOMES.map((o, i) => (
            <ScrollReveal key={o.audience} delay={i + 1}>
              <div className="card-lift rounded-2xl p-8 h-full border border-white/10"
                   style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)' }}>
                <div className="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: o.color }}>
                  {o.audience} Outcomes
                </div>
                <h3 className="font-serif font-light text-white mb-5"
                    style={{ fontSize: '28px', lineHeight: 1.15, letterSpacing: '-0.01em' }}>
                  {o.headline}
                </h3>
                <ul className="space-y-3">
                  {o.items.map(item => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: o.color }} />
                      <span className="text-sm leading-relaxed text-white/55">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Pull quote */}
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-serif font-light text-white/80 leading-snug"
               style={{ fontSize: 'clamp(22px, 3vw, 36px)', letterSpacing: '-0.02em' }}>
              "Proof is not a support element.<br />
              <em className="italic" style={{ color: '#00A8A8' }}>It is a condition of adoption.</em>"
            </p>
          </div>
        </ScrollReveal>

      </div>
    </section>
  )
}
