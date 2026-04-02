import ScrollReveal from './ScrollReveal'

const PILLARS = [
  {
    num: '01', label: 'Diagnose', color: '#00A8A8',
    title: 'True proficiency.\nExposed with precision.',
    body: 'Transform Learning uncovers every student\'s actual skill level — both explicit knowledge and implicit skills like problem decomposition and reasoning. Students upload their work or take targeted assessments. The system determines where they truly stand, not just where grades suggest.',
  },
  {
    num: '02', label: 'Close the Gap', color: '#0C1F3F',
    title: 'See the gap.\nAddress it immediately.',
    body: 'Once deficiencies surface, students don\'t just know — they act. Personalized coaching sessions, adaptive practice quizzes, focused study guides, and review materials are served directly to each student for exactly the skills that need work. Gap-to-action in one step.',
  },
  {
    num: '03', label: 'Build Mastery', color: '#5A3E6B',
    title: 'Practice builds mastery.\nMastery changes outcomes.',
    body: 'The system tracks progression as students work through remediation — not just that they tried, but that they\'re actually improving. Each closed gap is recorded. Faculty see the movement. Students feel it. The data becomes the evidence that institutions need to expand.',
  },
  {
    num: '04', label: 'Prove It', color: '#4F8A5B',
    title: 'Effort becomes traction.\nTraction becomes proof.',
    body: 'Documented outcome tracking across cohorts creates the evidence base that moves adoption from one course to a department to an institution. DFW rates tracked. Pass rates rising. The improvement is real — and reproducible.',
  },
]

export default function Solution() {
  return (
    <section className="bg-white py-24 lg:py-32 relative overflow-hidden">

      {/* Background decorative text */}
      <div className="absolute -left-8 bottom-0 font-serif font-light select-none pointer-events-none"
           style={{ fontSize: '280px', lineHeight: 1, color: 'rgba(12,31,63,0.03)', letterSpacing: '-0.05em' }}>
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
              The AI isn't the product — it's the underlying intelligence. What we've built is a wayfinding system that reads signals, recognizes patterns, applies judgment, and guides students toward an arrival point. Not by removing challenge, but by introducing the right amount of tension at the right moment. Students don't just see where they stand. They fix it.
            </p>
          </ScrollReveal>
        </div>

        {/* Pillars */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLARS.map((p, i) => (
            <ScrollReveal key={p.num} delay={i + 1}>
              <div className="card-lift gradient-border h-full relative"
                   style={{ boxShadow: '0 8px 40px rgba(12,31,63,0.07)' }}>
                <div className="p-8 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-6">
                    <div className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: p.color }}>
                      {p.label}
                    </div>
                    <div className="font-serif font-light text-5xl leading-none select-none"
                         style={{ color: p.color, opacity: 0.15 }}>
                      {p.num}
                    </div>
                  </div>
                  <h3 className="font-serif font-light text-navy mb-4 flex-1"
                      style={{ fontSize: '24px', lineHeight: 1.2, letterSpacing: '-0.01em', whiteSpace: 'pre-line' }}>
                    {p.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-brand-gray mb-6">{p.body}</p>
                  <div className="h-0.5 rounded-full w-12" style={{ background: `linear-gradient(90deg, ${p.color}, transparent)` }} />
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  )
}
