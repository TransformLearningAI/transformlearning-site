const STEPS = [
  {
    num: '1',
    phase: 'Architect',
    title: 'Map your course and connect your LMS',
    body: 'We start with your course and your students. Transform Learning maps the progression signals that matter for your specific gateway course and connects to your existing LMS — Canvas integration first, minimal setup required.',
    color: '#003769',
  },
  {
    num: '2',
    phase: 'Activate',
    title: 'See what you couldn\'t see before',
    body: 'Faculty get immediate access to a dashboard that surfaces real progression signals — not activity metrics — within the first week of use. The critical moment: seeing a pattern that was invisible until now.',
    color: '#2F7DF6',
  },
  {
    num: '3',
    phase: 'Amplify',
    title: 'Turn course proof into institutional adoption',
    body: 'Pilot results become the evidence base that moves adoption from one section to a department. Department results build the case for an institutional partnership. The evidence travels with the platform.',
    color: '#186900',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-brand-soft py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="mb-14">
          <p className="eyebrow mb-4">The Model</p>
          <h2 className="section-headline">
            Architect. Activate. Amplify.
          </h2>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 relative">

          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-10 left-[calc(33.33%+16px)] right-[calc(33.33%+16px)] h-px bg-brand-border" />

          {STEPS.map((s, i) => (
            <div key={s.num} className="relative">
              {/* Step number circle */}
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-lg mb-6 relative z-10"
                   style={{ background: s.color }}>
                {s.num}
              </div>

              {/* Phase label */}
              <div className="text-xs font-bold uppercase tracking-[0.14em] mb-2"
                   style={{ color: s.color }}>
                {s.phase}
              </div>

              <h3 className="text-xl font-bold text-navy mb-3">{s.title}</h3>
              <p className="text-sm leading-relaxed text-brand-gray">{s.body}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
