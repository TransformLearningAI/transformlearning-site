const PROBLEMS = [
  {
    title: 'Fragmented signals',
    body: 'Grade data arrives weeks after the intervention window has closed. The signal tells you what happened — not what to do.',
    color: '#2F7DF6',
  },
  {
    title: 'No early warning',
    body: 'At-risk students are invisible until they fail or withdraw. By then, the options are limited and the cost is already paid.',
    color: '#FF6B4A',
  },
  {
    title: 'Guesswork timing',
    body: 'Without progression signals, intervention is reactive rather than strategic. The right action at the wrong moment rarely works.',
    color: '#2F7DF6',
  },
  {
    title: 'Gateway courses most exposed',
    body: 'The courses that drive DFW rates and retention loss get the least instructional intelligence — and carry the highest consequences.',
    color: '#FF6B4A',
  },
]

export default function Problem() {
  return (
    <section id="for-faculty" className="bg-brand-mist py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left: pull quote */}
          <div>
            <p className="eyebrow mb-4">The Challenge</p>
            <blockquote className="text-3xl lg:text-4xl font-bold tracking-tight text-navy leading-[1.15] border-l-4 border-navy pl-6 mb-6">
              Faculty are making instructional decisions without the information they need — and by the time the data arrives, it's too late to act.
            </blockquote>
            <p className="body-text pl-6">
              Higher education institutions lack timely visibility into student progression.
              Faculty operate with fragmented signals, delayed awareness, and no reliable way
              to know which student needs an intervention — and when.
            </p>
          </div>

          {/* Right: problem cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PROBLEMS.map(p => (
              <div key={p.title} className="bg-white border border-brand-border rounded-2xl p-5">
                <div className="w-2 h-2 rounded-full mb-3" style={{ background: p.color }} />
                <h3 className="text-base font-bold text-navy mb-2">{p.title}</h3>
                <p className="text-sm leading-relaxed text-brand-gray">{p.body}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
