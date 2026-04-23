import Link from 'next/link'

export const metadata = {
  title: 'Links — Transform Learning',
  description: 'All Transform Learning tools in one place. Free AI study tools, career coaching, and more.',
}

const LINKS = [
  {
    title: 'Upload Your Syllabus — See What You Actually Know',
    desc: 'AI maps every skill. Finds your gaps. Coaches you through them. Free.',
    href: 'https://transformlearning.ai',
    color: '#00A8A8',
    primary: true,
  },
  {
    title: 'Exam Prep That Knows Your Gaps',
    desc: 'Scaffolded practice, timed drills, AI study guides matched to your course.',
    href: 'https://study.transformlearning.ai',
    color: '#0C1F3F',
  },
  {
    title: 'Not Sure What Comes Next? (High School)',
    desc: 'Free AI career coach. 5 minutes. No sign-up. Honest match percentages.',
    href: 'https://findmyway.today',
    color: '#C4522A',
  },
  {
    title: 'Veterans: Translate Your Service Into a Career',
    desc: '19 career paths. Hidden skills audit. GI Bill + clearance guidance.',
    href: 'https://holdfast.today',
    color: '#3D4F2F',
  },
  {
    title: 'Rebuilding After Incarceration?',
    desc: 'Career coaching that knows which employers hire. No judgment.',
    href: 'https://soltas.ai',
    color: '#2D5016',
  },
]

export default function LinksPage() {
  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10" style={{ background: '#0C1F3F' }}>
      {/* Logo */}
      <div className="mb-2">
        <span className="font-bold text-white text-xl tracking-tight">
          transform<span style={{ color: '#00A8A8' }}>learning</span>
        </span>
      </div>
      <p className="text-xs text-white/40 mb-8">Upload your syllabus. See what you actually know.</p>

      {/* Links */}
      <div className="w-full max-w-md space-y-3">
        {LINKS.map(link => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-xl p-4 transition-all hover:scale-[1.02] hover:shadow-lg"
            style={{
              background: link.primary ? link.color : 'rgba(255,255,255,0.06)',
              border: link.primary ? 'none' : '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <p className="text-sm font-bold text-white">{link.title}</p>
            <p className="text-xs mt-1" style={{ color: link.primary ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)' }}>
              {link.desc}
            </p>
          </a>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-10 text-center">
        <p className="text-xs text-white/20">All tools free for students</p>
        <p className="text-xs text-white/20 mt-1">Proudly built in Pittsburgh</p>
      </div>
    </div>
  )
}
