import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy — Transform Learning',
  description: 'Transform Learning privacy policy. How we collect, use, and protect your data.',
}

export default function PrivacyPage() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="font-serif font-light text-navy" style={{ fontSize: 'clamp(32px, 5vw, 48px)', lineHeight: 1.1, letterSpacing: '-0.03em' }}>
          Privacy Policy
        </h1>
        <p className="text-sm text-brand-gray mt-2 mb-10">Last updated: May 1, 2026</p>

        <div className="space-y-8 text-[15px] text-brand-gray leading-relaxed">

          <section>
            <h2 className="text-lg font-bold text-navy mb-2">Overview</h2>
            <p>
              Transform Learning (<Link href="/" className="text-brand-teal hover:underline">transformlearning.ai</Link>) provides AI-powered educational tools for higher education institutions and students. This policy explains how we collect, use, and protect your information. Transform Learning is founded and operated by Jeff Ritter, PhD.
            </p>
          </section>

          <section className="bg-brand-mist border border-brand-border rounded-xl p-6">
            <h2 className="text-lg font-bold text-navy mb-2">FERPA Compliance</h2>
            <p className="mb-3">
              Transform Learning is designed to support FERPA compliance for partnering institutions:
            </p>
            <ul className="space-y-2 text-sm">
              <li><strong>Institutional partnerships:</strong> When deployed by a college or university, Transform Learning operates under the institution&rsquo;s FERPA authority as a &ldquo;school official&rdquo; with a legitimate educational interest.</li>
              <li><strong>Student data protection:</strong> Student assessment data, proficiency scores, and learning records are accessible only to the student and authorized institutional personnel.</li>
              <li><strong>No unauthorized disclosure:</strong> We do not share student education records with third parties without consent or valid FERPA exception.</li>
              <li><strong>Data governance:</strong> All AI assessments pass through ethical governance layers with fairness constraints, confidence thresholds, and privacy controls.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy mb-2">Information We Collect</h2>
            <h3 className="font-bold text-navy mt-4 mb-1">Account Information</h3>
            <p>When you create an account: email address, name, and password (hashed). This is used solely for authentication and account access.</p>

            <h3 className="font-bold text-navy mt-4 mb-1">Educational Data</h3>
            <p>Course enrollments, skill assessments, proficiency scores, and study guide interactions. This data is used to provide personalized learning support and is accessible only to you and authorized institutional administrators.</p>

            <h3 className="font-bold text-navy mt-4 mb-1">Usage Analytics</h3>
            <p>Anonymous page view data via Vercel Analytics (cookieless, privacy-friendly). General geographic region, browser type, and pages visited. This data cannot identify individual users.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy mb-2">How We Use Your Data</h2>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Provide AI-powered skill assessments and study recommendations</li>
              <li>Generate proficiency scores using Bayesian competency estimation</li>
              <li>Enable institutional partners to support student success</li>
              <li>Improve the platform through aggregated, anonymized analytics</li>
            </ul>
            <p className="mt-3"><strong>We never:</strong> sell your data, share it with advertisers, use it for marketing to third parties, or disclose education records without authorization.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy mb-2">AI Processing</h2>
            <p>
              Transform Learning uses Anthropic&rsquo;s Claude API to power skill assessments, quiz generation, and study recommendations. Your academic content (syllabi, quiz responses) is sent to the API for processing. Anthropic does not use API inputs to train their models. See <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-teal hover:underline">Anthropic&rsquo;s Privacy Policy</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy mb-2">Data Security</h2>
            <p>
              All connections are encrypted via HTTPS/TLS. Data is stored in Supabase (PostgreSQL) with row-level security policies. Passwords are hashed using bcrypt. Access to student data is restricted through role-based permissions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy mb-2">Data Retention</h2>
            <p>
              Account and educational data is retained as long as your account is active. You may request deletion of your account and all associated data at any time by contacting us. Anonymized, aggregated analytics are retained indefinitely.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy mb-2">Third-Party Services</h2>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>Supabase</strong> &mdash; database and authentication</li>
              <li><strong>Anthropic (Claude API)</strong> &mdash; AI processing</li>
              <li><strong>Vercel</strong> &mdash; hosting and anonymous analytics</li>
              <li><strong>Stripe</strong> &mdash; payment processing</li>
              <li><strong>Resend</strong> &mdash; transactional email</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy mb-2">Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
              <li>Access your personal data and education records</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your account and data</li>
              <li>Export your data in a portable format</li>
              <li>Opt out of non-essential communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy mb-2">Contact</h2>
            <p>
              For privacy questions, data requests, or FERPA inquiries:<br />
              Jeff Ritter, PhD<br />
              Founder, Transform Learning<br />
              <a href="mailto:jeff@yourclassroom.ai" className="text-brand-teal hover:underline">jeff@yourclassroom.ai</a>
            </p>
          </section>

        </div>
      </div>
    </section>
  )
}
