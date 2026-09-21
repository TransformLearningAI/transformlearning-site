export const metadata = {
  title: 'Ambassador FAQ — Transform Learning',
  description: 'Frequently asked questions about the Transform Learning Ambassador Program — commissions, payments, content guidelines, and more.',
}

const faqs = [
  {
    q: 'How are commissions paid?',
    a: 'Your choice: PayPal, Venmo, Zelle, or direct deposit. You tell us which you prefer when your first commission is ready. No checks — everything is electronic and fast.',
  },
  {
    q: 'When are payments sent, and is there a minimum?',
    a: 'Commissions are calculated on the last day of each calendar month. Payment is sent within 30 days after that. The minimum payout is $10 — if you earn less than $10 in a month, it rolls over to the next month until you hit $10.',
  },
  {
    q: 'I\'m under 18. Would payments go to me or my parent?',
    a: 'Payments go to your parent or guardian by default. If your parent wants to authorize payment directly to you (through their PayPal, Venmo, etc.), they can do that in writing. Either way, your parent stays informed and in control. Ambassadors under 18 need a signed parental consent form on file — email jeff@yourclassroom.ai to request one.',
  },
  {
    q: 'Will I need to submit any tax or banking information?',
    a: 'Not right away. If your total commissions exceed $600 in a calendar year, we\'d need a W-9 form (which your parent would complete if you\'re a minor). For most ambassadors, commissions won\'t reach that threshold early on. We\'ll let you know well in advance if we need anything.',
  },
  {
    q: 'Is the 20% commission recurring or one-time?',
    a: 'Recurring. You earn 20% of the monthly subscription revenue for every month that your referred student stays subscribed — for up to 12 months per referred student. So if someone you refer pays $10/month and stays for 8 months, you earn $2/month for 8 months ($16 total from that one referral).',
  },
  {
    q: 'Is there a dashboard where I can track my sign-ups and earnings?',
    a: 'Yes. Once your tracking links are active, your referrals are tracked automatically. We also send you a monthly summary showing your sign-ups, paid conversions, and commission earned.',
  },
  {
    q: 'Do free sign-ups count toward my earnings?',
    a: 'Free sign-ups are tracked and credited to you, but you only earn commission when a referred student upgrades to a paid plan. The good news: if someone signs up free through your link today and upgrades six months from now, you still get credit. The referral never expires.',
  },
  {
    q: 'What exactly are my required responsibilities each month?',
    a: 'The target is 1 feed post per month (Reel or TikTok) and at least 2 Instagram Stories per week tagging @TransformLearning.AI. That said — life happens. If you have exams, get sick, or need a break for a week, just communicate with us. Consistency over time matters more than any single week.',
  },
  {
    q: 'Do I have to keep the link in my Instagram bio permanently?',
    a: 'Only while you\'re an active ambassador. If you leave the program, you can remove it. While you\'re active, keeping it in your bio is how you earn passive referrals — people click it even when you\'re not actively posting.',
  },
  {
    q: 'Are there rules about what I can say? Do you review content before posting?',
    a: 'We do NOT review or approve your content before you post — it\'s your voice and your audience. We trust you. The rules are simple: be honest about what the platform does, don\'t guarantee academic results (don\'t say "you\'ll pass your class"), don\'t say anything discriminatory or harmful, and include a disclosure (#ad or #partner) — this is required by the FTC for anyone being compensated for promoting a product.',
  },
  {
    q: 'How long does the agreement last? Can either side end it?',
    a: 'There\'s no fixed term — you can participate as long as you want. Either you or we can end the relationship at any time, for any reason, with a simple email. If you leave, any outstanding commissions above $10 will still be paid to you within 30 days. No penalties, no hard feelings.',
  },
  {
    q: 'Do I get a free paid account?',
    a: 'Yes! All active ambassadors receive a free unlimited account with full access to all paid features. We activate it once you\'re accepted into the program. You should know the product inside and out — that\'s how you create authentic content.',
  },
  {
    q: 'How old do I have to be to join?',
    a: 'You must be at least 16 years old. If you\'re 16 or 17, you\'ll need a parent or guardian to sign a consent form before we can activate your account and tracking links. Email jeff@yourclassroom.ai for the form.',
  },
  {
    q: 'What content ideas work best?',
    a: 'Screen recordings of you actually using the platform beat everything else. Show yourself uploading a syllabus, taking a quiz, using the AI coach. "Honest review" and "study with me" formats work great. Share in your Instagram Stories, TikTok, and WhatsApp/Discord study groups. The more authentic, the better.',
  },
  {
    q: 'Can I be an ambassador if I have a small following?',
    a: 'Absolutely. We care about the quality of your audience, not the size. A student with 200 real followers who trust them is more valuable than someone with 10,000 bots. Start where you are. One viral video can change everything.',
  },
]

export default function AmbassadorFAQPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1a', color: '#fff', padding: 'clamp(40px,8vw,80px) 28px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <p style={{ color: '#00A8A8', fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>Ambassador Program</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px,5vw,42px)', fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 32 }}>
          Frequently Asked <span style={{ color: '#00A8A8' }}>Questions</span>
        </h1>

        {faqs.map((faq, i) => (
          <div key={i} style={{ marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: '#fff' }}>{faq.q}</h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
          </div>
        ))}

        <div style={{ marginTop: 40, padding: 24, background: 'rgba(0,168,168,0.08)', borderRadius: 12, border: '1px solid rgba(0,168,168,0.2)', textAlign: 'center' }}>
          <p style={{ color: '#00A8A8', fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Still have questions?</p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Email jeff@yourclassroom.ai — I answer personally.</p>
        </div>

        <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: 11, textAlign: 'center', marginTop: 24 }}>
          <a href="/ambassador/join" style={{ color: '#00A8A8' }}>Apply to be an ambassador</a> &middot;{' '}
          <a href="/ambassador" style={{ color: 'rgba(255,255,255,0.3)' }}>Get your tracking links</a> &middot;{' '}
          <a href="/ambassador/terms" style={{ color: 'rgba(255,255,255,0.3)' }}>Program terms</a> &middot;{' '}
          <a href="/ambassador/community" style={{ color: 'rgba(255,255,255,0.3)' }}>Ambassador community</a>
        </p>
      </div>
    </div>
  )
}
