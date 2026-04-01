import ScrollReveal from './ScrollReveal'

const PROBLEMS = [
  { title: 'Students don\'t know where they stand', body: 'Without a clear view of their own progression, students can\'t self-correct. By the time a grade signals a problem, the window to act has closed.', color: '#00A8A8', icon: '◈' },
  { title: 'Faculty get signals too late',          body: 'Grade data arrives weeks after the intervention window closes. The signal tells you what happened — not what to do.', color: '#FF6B4A', icon: '⚠' },
  { title: 'No path forward is visible',            body: 'Students know they\'re struggling but not why, and not what to do next. Confusion without direction leads to withdrawal.', color: '#00A8A8', icon: '⊙' },
  { title: 'Gateway courses most exposed',          body: 'The courses that drive DFW rates and retention loss carry the highest consequences — and give students the least clarity about where they stand.', color: '#FF6B4A', icon: '▲' },
]

export default function Problem() {
  return (
    <section id="for-faculty" className="py-24 lg:py-32 relative overflow-hidden" style={{ background: '#F4F7FB' }}>

      <div className="absolute -right-10 top-1/2 -translate-y-1/2 font-serif font-light select-none pointer-events-none"
           style={{ fontSize: '320px', lineHeight: 1, color: 'rgba(12,31,63,0.04)', letterSpacing: '-0.05em' }}>
        01
      </div>

      <div className="max-w-6xl mx-auto px-6 relative">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-16 items-start">

          <div>
            <ScrollReveal>
              <p className="eyebrow mb-5">The Challenge</p>
              <h2 className="font-serif font-light text-navy mb-8"
                  style={{ fontSize: 'clamp(38px, 5vw, 64px)', lineHeight: 1.0, letterSpacing: '-0.03em' }}>
                Students can't fix what they can't see.
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={2}>
              <p className="text-lg text-brand-gray leading-relaxed mb-6">
                Students don't know where they stand until grades arrive — and by then it's too late to change course. Faculty can't see what's happening beneath the surface until the semester is already over.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={3}>
              <div className="relative pl-6 mt-10">
                <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full"
                     style={{ background: 'linear-gradient(180deg, #00A8A8, #4F8A5B)' }} />
                <blockquote className="font-serif font-light text-navy"
                            style={{ fontSize: 'clamp(20px, 2.5vw, 28px)', lineHeight: 1.3, letterSpacing: '-0.01em' }}>
                  "We built the intelligence that transforms institutions from hoping to knowing."
                </blockquote>
              </div>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PROBLEMS.map((p, i) => (
              <ScrollReveal key={p.title} delay={i + 1}>
                <div className="card-lift bg-white rounded-2xl p-6 border border-brand-border h-full"
                     style={{ boxShadow: '0 4px 24px rgba(12,31,63,0.06)' }}>
                  <div className="text-2xl mb-3 font-light" style={{ color: p.color }}>{p.icon}</div>
                  <h3 className="font-bold text-navy mb-2 text-base">{p.title}</h3>
                  <p className="text-sm leading-relaxed text-brand-gray">{p.body}</p>
                  <div className="mt-4 h-0.5 rounded-full w-8" style={{ background: p.color }} />
                </div>
              </ScrollReveal>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
