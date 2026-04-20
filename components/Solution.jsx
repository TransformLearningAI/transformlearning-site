import ScrollReveal from './ScrollReveal'

const PILLARS = [
  {
    num: '01', label: 'Revealed Clarity', color: '#F4F7FB',
    title: 'We remove noise to reveal\nwhat matters.',
    body: 'True proficiency. Exposed with precision. The engine uncovers every student\'s actual skill level — both foundational knowledge and core skills like problem decomposition and reasoning. It determines where they truly stand, not just where grades suggest.',
  },
  {
    num: '02', label: 'Trusted Wisdom', color: '#0C1F3F',
    title: 'See the gap.\nAddress it immediately.',
    body: 'Every decision grounded in context. Once deficiencies surface, students don\'t just know — they act. Personalized coaching sessions, adaptive practice quizzes, focused study guides, and review materials are served directly to each student for exactly the skills that need work.',
  },
  {
    num: '03', label: 'Quiet Intelligence', color: '#5A3E6B',
    title: 'The system listens.\nSignals. Patterns. Shifts over time.',
    body: 'Practice builds mastery. The system connects what matters and speaks to move forward — not just that they tried, but that they\'re actually improving. Each closed gap is recorded. Faculty see the movement. Students feel it.',
  },
  {
    num: '04', label: 'Steady Movement', color: '#4F8A5B',
    title: 'Effort becomes traction.\nTraction becomes proof.',
    body: 'Consistent forward progress without overwhelm. Documented outcome tracking across cohorts creates the evidence base that moves adoption from one course to a department to an institution. DFW rates tracked. Pass rates rising. The improvement is real — and reproducible.',
  },
]

export default function Solution() {
  return (
    <section className="bg-white py-32 lg:py-40 relative overflow-hidden">

      {/* Background decorative text */}
      <div className="absolute -left-8 bottom-0 font-serif font-light select-none pointer-events-none"
           style={{ fontSize: '280px', lineHeight: 1, color: 'rgba(12,31,63,0.03)', letterSpacing: '-0.05em' }}
           aria-hidden="true">
        02
      </div>

      <div className="max-w-6xl mx-auto px-6 relative">

        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <ScrollReveal>
            <p className="eyebrow mb-6">The Platform</p>
            <h2 className="font-serif font-light text-navy mb-6"
                style={{ fontSize: 'clamp(36px, 5.5vw, 72px)', lineHeight: 1.0, letterSpacing: '-0.03em' }}>
              Not an AI tool. An adaptive,{' '}
              <em className="italic" style={{ color: '#00A8A8' }}>prescriptive learning operating&nbsp;system.</em>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={2}>
            <p className="text-lg text-brand-gray leading-relaxed max-w-2xl mx-auto">
              The AI isn't the product — it's the underlying intelligence. What we've built is a proficiency engine that reads signals, recognizes patterns, applies judgment, and shows students exactly where they stand against mastery. Not by removing challenge, but by introducing the right amount of tension at the right moment. Students don't just see where they stand. They fix it.
            </p>
          </ScrollReveal>
        </div>

        {/* Pillars — alternating editorial layout */}
        <div className="space-y-24">
          {PILLARS.map((p, i) => (
            <ScrollReveal key={p.num} delay={1}>
              <div className={`grid lg:grid-cols-[1fr_1fr] gap-16 items-center ${i % 2 === 1 ? 'lg:direction-rtl' : ''}`}
                   style={{ direction: i % 2 === 1 ? 'rtl' : 'ltr' }}>
                <div style={{ direction: 'ltr' }}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-0.5 rounded-full" style={{ background: p.color }} />
                    <div className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: p.color }}>
                      {p.label}
                    </div>
                  </div>
                  <h3 className="font-serif font-light text-navy mb-6"
                      style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', lineHeight: 1.15, letterSpacing: '-0.02em', whiteSpace: 'pre-line' }}>
                    {p.title}
                  </h3>
                  <p className="text-base leading-relaxed text-brand-gray">{p.body}</p>
                </div>
                <div className="flex items-center justify-center" style={{ direction: 'ltr' }}>
                  <div className="font-serif font-light select-none"
                       style={{ fontSize: 'clamp(120px, 15vw, 200px)', lineHeight: 1, color: p.color, opacity: 0.06, letterSpacing: '-0.04em' }}
                       aria-hidden="true">
                    {p.num}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  )
}
