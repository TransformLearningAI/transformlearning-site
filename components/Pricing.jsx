const TIERS = [
  {
    name: 'Pilot',
    price: 'Free',
    priceNote: 'or subsidized',
    desc: 'Establish trust, evidence, and usability fit. The fastest path to seeing real value.',
    features: [
      'Single course, 1 instructor',
      'Up to 300 students',
      '6–8 week structured engagement',
      'Baseline + outcome documentation',
      'Optional LMS integration available',
    ],
    cta: 'Request a Pilot',
    href: '#pilot',
    highlight: true,
  },
  {
    name: 'Course License',
    price: 'Contact us',
    priceNote: 'per course / semester',
    desc: 'Entry model for ongoing course-level use after a successful pilot.',
    features: [
      'Single course, ongoing access',
      'Full dashboard + progression data',
      'Faculty support included',
      'Outcome tracking',
    ],
    cta: 'Contact Us',
    href: '#pilot',
    highlight: false,
  },
  {
    name: 'Department Bundle',
    price: 'Contact us',
    priceNote: 'per department / year',
    desc: 'Multi-section, multi-instructor coordination across a department.',
    features: [
      'Multiple sections and instructors',
      'Coordinated outcomes reporting',
      'Department-level analytics',
      'Chair briefing support',
      'Expansion case study included',
    ],
    cta: 'Contact Us',
    href: '#pilot',
    highlight: false,
  },
  {
    name: 'Institutional License',
    price: 'Contact us',
    priceNote: 'enterprise / annual',
    desc: 'System-level retention, performance, and academic success infrastructure.',
    features: [
      'Institution-wide deployment',
      'Retention + accreditation reporting',
      'Dedicated success partner',
      'Custom integration support',
      'Multi-department analytics',
    ],
    cta: 'Contact Us',
    href: '#pilot',
    highlight: false,
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="bg-white py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="eyebrow mb-4">Packaging</p>
          <h2 className="section-headline mb-4">Start small. Prove it. Expand.</h2>
          <p className="body-text">
            Every engagement begins with a structured pilot. All tiers include baseline
            documentation and measurable outcome targets from day one.
          </p>
        </div>

        {/* Tiers */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TIERS.map(t => (
            <div key={t.name}
                 className={`rounded-2xl p-6 flex flex-col ${
                   t.highlight
                     ? 'bg-navy text-white border-2 border-navy'
                     : 'bg-brand-soft border border-brand-border'
                 }`}>

              <div className={`text-[11px] font-bold uppercase tracking-[0.14em] mb-1 ${
                t.highlight ? 'text-white/60' : 'text-brand-gray'
              }`}>
                {t.name}
              </div>

              <div className={`text-2xl font-black mb-0.5 ${t.highlight ? 'text-white' : 'text-navy'}`}>
                {t.price}
              </div>
              <div className={`text-xs mb-4 ${t.highlight ? 'text-white/50' : 'text-brand-gray'}`}>
                {t.priceNote}
              </div>

              <p className={`text-sm leading-relaxed mb-5 ${t.highlight ? 'text-white/70' : 'text-brand-gray'}`}>
                {t.desc}
              </p>

              <ul className="space-y-2.5 flex-1 mb-6">
                {t.features.map(f => (
                  <li key={f} className="flex items-start gap-2">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="mt-0.5 flex-shrink-0">
                      <path d="M2.5 7L5.5 10L11.5 4"
                            stroke={t.highlight ? 'rgba(255,255,255,0.6)' : '#2F7DF6'}
                            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className={`text-xs leading-relaxed ${t.highlight ? 'text-white/70' : 'text-brand-gray'}`}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <a href={t.href}
                 className={`block text-center px-4 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                   t.highlight
                     ? 'bg-white text-navy hover:bg-brand-mist'
                     : 'border border-navy text-navy hover:bg-brand-mist'
                 }`}>
                {t.cta}
              </a>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
