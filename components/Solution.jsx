const PILLARS = [
  {
    num: '01',
    title: 'See it early',
    body: 'Real-time visibility into where every student stands in their progression toward mastery. No waiting for exam results to reveal what was already happening three weeks before.',
    color: '#2F7DF6',
  },
  {
    num: '02',
    title: 'Act with precision',
    body: 'Intervention signals delivered at the right moment — specific, actionable, and timed while there\'s still a semester left to change the outcome.',
    color: '#003769',
  },
  {
    num: '03',
    title: 'Prove it worked',
    body: 'Documented outcome tracking that creates the evidence base faculty can stand behind — and institutions can act on for departmental and system-wide adoption.',
    color: '#186900',
  },
]

export default function Solution() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="eyebrow mb-4">The Platform</p>
          <h2 className="section-headline mb-5">
            Transform Learning is a Learning Progression Intelligence System.
          </h2>
          <p className="text-lg text-brand-gray leading-relaxed">
            Not another LMS add-on. Not a grade tracker. A purpose-built system
            that tells faculty what's actually happening with student mastery —
            in real time, in the courses where it matters most.
          </p>
        </div>

        {/* 3 pillars */}
        <div className="grid md:grid-cols-3 gap-6">
          {PILLARS.map(p => (
            <div key={p.num}
                 className="bg-brand-soft border border-brand-border rounded-2xl p-7 relative overflow-hidden">
              <div className="absolute top-5 right-5 text-6xl font-black leading-none select-none"
                   style={{ color: p.color, opacity: 0.06 }}>
                {p.num}
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                   style={{ background: p.color + '15' }}>
                <div className="w-3 h-3 rounded-full" style={{ background: p.color }} />
              </div>
              <h3 className="text-xl font-bold text-navy mb-3">{p.title}</h3>
              <p className="text-sm leading-relaxed text-brand-gray">{p.body}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
