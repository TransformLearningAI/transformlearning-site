const OUTCOMES = [
  {
    audience: 'Academic Outcomes',
    color: '#2F7DF6',
    headline: 'Reduction in DFW rates',
    items: [
      'Measurable improvement in course pass rates',
      'Baseline comparisons that document what changed',
      'Evidence of intervention timing effectiveness',
    ],
  },
  {
    audience: 'Faculty Outcomes',
    color: '#003769',
    headline: 'Clearer decisions, faster action',
    items: [
      'Less uncertainty in instructional decision-making',
      'Faster, better-targeted interventions',
      'A workflow that takes less time than the guesswork it replaces',
    ],
  },
  {
    audience: 'Institutional Outcomes',
    color: '#186900',
    headline: 'Evidence institutions can act on',
    items: [
      'Retention indicators connected to student success reporting',
      'Performance data usable for accreditation narratives',
      'Department-to-institution expansion pathway',
    ],
  },
]

export default function Outcomes() {
  return (
    <section className="bg-brand-mist py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="eyebrow mb-4">What Changes</p>
          <h2 className="section-headline">
            Results faculty can show. Institutions can act on.
          </h2>
        </div>

        {/* Outcome cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {OUTCOMES.map(o => (
            <div key={o.audience} className="bg-white border border-brand-border rounded-2xl p-7">
              <div className="text-[11px] font-bold uppercase tracking-[0.14em] mb-2"
                   style={{ color: o.color }}>
                {o.audience}
              </div>
              <h3 className="text-xl font-bold text-navy mb-4">{o.headline}</h3>
              <ul className="space-y-3">
                {o.items.map(item => (
                  <li key={item} className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                         style={{ background: o.color }} />
                    <span className="text-sm leading-relaxed text-brand-gray">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Pull quote */}
        <div className="max-w-3xl mx-auto bg-white border-l-4 border-navy rounded-2xl px-8 py-6">
          <p className="text-xl font-bold text-navy leading-relaxed">
            "In higher education, proof is not a support element. It is a condition of adoption."
          </p>
          <p className="text-sm text-brand-gray mt-2">
            Every pilot is structured to generate the kind of evidence that moves departments and institutions to act.
          </p>
        </div>

      </div>
    </section>
  )
}
