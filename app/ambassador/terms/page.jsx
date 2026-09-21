export const metadata = {
  title: 'Ambassador Program Terms — Transform Learning',
}

export default function AmbassadorTermsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1a', color: '#fff', padding: 'clamp(40px,8vw,80px) 28px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', fontSize: 13, lineHeight: 1.7 }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 300, marginBottom: 8 }}>Ambassador Program Terms</h1>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginBottom: 32 }}>Effective September 15, 2026</p>

        <Section title="Eligibility">
          <li>Must be at least <strong>16 years of age</strong></li>
          <li>Ambassadors aged 16-17 must provide <strong>written parental or guardian consent</strong> before participating</li>
          <li>Must be a current student or recent graduate (within 12 months)</li>
        </Section>

        <Section title="Monthly Deliverables">
          <li>1 feed post per month (Reel, TikTok, or equivalent)</li>
          <li>At least 2 Instagram Stories per week tagging @TransformLearning.AI</li>
          <li>Use your personalized tracking links in all posts</li>
          <li>Disclose ambassador relationship per FTC guidelines (#ad or #partner)</li>
        </Section>

        <Section title="Commission">
          <li><strong>20% of monthly subscription revenue</strong> from each student who signs up through your link and upgrades to paid</li>
          <li>Free signups are tracked — if they upgrade later, you get credit</li>
          <li>Commissions calculated on the last day of each month</li>
          <li>Payment within 30 days via PayPal, Venmo, Zelle, or direct deposit</li>
          <li>Minimum payout: $10 (amounts below roll over)</li>
          <li>Commission earned for 12 months per referred user</li>
          <li>No cap on number of referrals</li>
        </Section>

        <Section title="Content Guidelines">
          <li>Be truthful about the platform</li>
          <li>Represent Transform Learning as an AI learning tool, not a way to cheat</li>
          <li>No false claims or guaranteed academic results</li>
          <li>No spam, bots, or artificial engagement</li>
        </Section>

        <Section title="Ambassadors Under 18">
          <li>Ambassadors aged 16-17 require signed parental consent on file</li>
          <li>Commission payments directed to parent/guardian unless otherwise arranged</li>
          <li>Parent/guardian may terminate the arrangement at any time</li>
          <li>Contact jeff@yourclassroom.ai for the parental consent form</li>
        </Section>

        <Section title="Termination">
          <li>Either party may end the relationship at any time via email</li>
          <li>Outstanding commissions above $10 paid within 30 days of termination</li>
          <li>Tracking links deactivated upon termination</li>
        </Section>

        <Section title="Agreement">
          <li>By generating tracking links at transformlearning.ai/ambassador, you acknowledge and agree to these terms</li>
        </Section>

        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, marginTop: 40, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
          TransformLearning.ai is operated by YourClassroom.ai. Questions: jeff@yourclassroom.ai | 412-559-9534
        </p>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ color: '#00A8A8', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{title}</h2>
      <ul style={{ paddingLeft: 18, color: 'rgba(255,255,255,0.6)' }}>{children}</ul>
    </div>
  )
}
