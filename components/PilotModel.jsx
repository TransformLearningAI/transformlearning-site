const PHASES = [
  {
    phase: 'Phase 1',
    color: '#0C1F3F',
    title: 'Faculty Engagement',
    body: 'We start with a conversation about your course, not a product demo. Pilots begin with faculty who have a real instructional problem and a course where evidence will be visible.',
    detail: 'Diagnostic conversation → confirm fit → define baseline conditions',
  },
  {
    phase: 'Phase 2',
    color: '#00A8A8',
    title: 'Structured Deployment',
    body: 'One course. Three to five sections. 100–300 students. Six to eight weeks. Framed explicitly as a research-informed instructional collaboration, not a software trial.',
    detail: 'Dashboard access → faculty onboarding in under 30 min (optional LMS integration available)',
  },
  {
    phase: 'Phase 3',
    color: '#4F8A5B',
    title: 'Evidence Capture',
    body: 'Assignment completion behavior, intervention timing, grade trajectory shifts, and faculty usability — all measured against a documented baseline.',
    detail: 'Baseline comparison → outcome documentation → case study development',
  },
  {
    phase: 'Phase 4',
    color: '#FF6B4A',
    title: 'Expansion Decision',
    body: 'Course-level proof converts to department adoption. Department results build the case for institutional licensing. The evidence created in Phase 3 drives every conversation in Phase 4.',
    detail: 'Department brief → chair conversation → institutional licensing pathway',
  },
]

export default function PilotModel() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="max-w-2xl mb-14">
          <p className="eyebrow mb-4">Getting Started</p>
          <h2 className="section-headline mb-4">
            A structured pilot built to prove — not just explore.
          </h2>
          <p className="body-text">
            Every pilot has clear baselines, measurable outcome targets, and a clear
            conversion pathway from day one. This is not an experiment. It's a structured
            collaboration.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-6 bottom-6 w-px bg-brand-border hidden md:block" />

          <div className="space-y-6">
            {PHASES.map((p, i) => (
              <div key={p.phase} className="flex gap-8 md:gap-10 items-start">

                {/* Circle */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold z-10 relative"
                     style={{ background: p.color }}>
                  {i + 1}
                </div>

                {/* Content */}
                <div className="flex-1 bg-brand-soft border border-brand-border rounded-2xl p-6 pb-5">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="text-xs font-bold uppercase tracking-[0.12em]"
                          style={{ color: p.color }}>
                      {p.phase}
                    </span>
                    <h3 className="text-lg font-bold text-navy">{p.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-brand-gray mb-3">{p.body}</p>
                  <div className="text-xs text-brand-gray/70 font-medium border-t border-brand-border pt-3">
                    {p.detail}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
