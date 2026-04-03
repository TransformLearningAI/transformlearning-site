import ScrollReveal from './ScrollReveal'

const STEPS = [
  {
    num: '1', phase: 'Architect', color: '#0C1F3F',
    title: 'Faculty submit a syllabus. That\'s it.',
    body: 'Arrival maps any syllabus into a complete skill and knowledge framework. No faculty dashboard to learn, no workflow to change, no ongoing workload. Faculty provide the course — we build the intelligence behind it.',
    detail: 'Setup in under 30 minutes',
  },
  {
    num: '2', phase: 'Activate', color: '#00A8A8',
    title: 'Students see their gaps — and close them.',
    body: 'Each student gets a personalized progress dashboard revealing their true proficiency on every foundational skill and transferable capability in the course. Where a gap exists, the system acts: coaching sessions, adaptive quizzes, study guides, and practice — targeted to that exact skill. Students can upload their own work or take an assessment to establish their real starting point. Faculty require regular check-ins. The engagement loop does the rest.',
    detail: 'Diagnose → coach → close the gap',
  },
  {
    num: '3', phase: 'Amplify', color: '#4F8A5B',
    title: 'Better outcomes. Repeatable evidence.',
    body: 'When students know where they stand, they act differently. DFW rates drop. Pass rates rise. Faculty see the results without doing the work. Pilot proof becomes the evidence base that moves adoption from one course to a department to an institution.',
    detail: 'Repeatable expansion model',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 lg:py-32 relative overflow-hidden"
             style={{ background: 'linear-gradient(180deg, #F9FBFD 0%, #F4F7FB 100%)' }}>

      <div className="absolute right-0 top-1/2 -translate-y-1/2 font-serif font-light select-none pointer-events-none"
           style={{ fontSize: '280px', lineHeight: 1, color: 'rgba(12,31,63,0.03)', letterSpacing: '-0.05em' }}>
        03
      </div>

      <div className="max-w-6xl mx-auto px-6 relative">

        <div className="mb-16">
          <ScrollReveal>
            <p className="eyebrow mb-5">The Model</p>
            <h2 className="font-serif font-light text-navy"
                style={{ fontSize: 'clamp(38px, 5.5vw, 72px)', lineHeight: 1.0, letterSpacing: '-0.03em' }}>
              Architect.<br />Activate.<br />
              <em className="italic" style={{ color: '#00A8A8' }}>Amplify.</em>
            </h2>
          </ScrollReveal>
        </div>

        <div className="space-y-6">
          {STEPS.map((s, i) => (
            <ScrollReveal key={s.num} delay={i + 1}>
              <div className="card-lift group grid md:grid-cols-[80px_1fr_1fr] gap-8 items-center bg-white rounded-2xl p-8 border border-brand-border"
                   style={{ boxShadow: '0 4px 24px rgba(12,31,63,0.05)' }}>

                {/* Big number */}
                <div className="font-serif font-light text-center select-none"
                     style={{ fontSize: '72px', lineHeight: 1, color: s.color, opacity: 0.25 }}>
                  {s.num}
                </div>

                {/* Title */}
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.14em] mb-2" style={{ color: s.color }}>{s.phase}</div>
                  <h3 className="font-serif font-light text-navy"
                      style={{ fontSize: 'clamp(20px, 2.5vw, 28px)', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                    {s.title}
                  </h3>
                </div>

                {/* Body + detail */}
                <div>
                  <p className="text-sm leading-relaxed text-brand-gray mb-4">{s.body}</p>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
                       style={{ background: s.color + '12', color: s.color }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
                    {s.detail}
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
