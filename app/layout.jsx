import './globals.css'
import { Analytics } from '@vercel/analytics/react'

export const metadata = {
  title: 'Arrival — AI-Powered Adaptive Learning System for Higher Education',
  description: 'Arrival maps every skill in a course, tracks student proficiency in real time, and closes learning gaps through AI coaching, adaptive quizzes, and peer learning. Free pilot for faculty.',
  keywords: ['adaptive learning', 'AI in education', 'student proficiency', 'gateway courses', 'DFW rates', 'higher education AI', 'learning analytics', 'student retention', 'AI coaching', 'proficiency tracking'],
  openGraph: {
    title: 'Arrival — See Where Every Student Stands Before the Grade Does',
    description: 'AI-powered proficiency tracking for higher education. Maps every skill, catches declining students weeks early, and generates targeted interventions. Free pilot for faculty.',
    url: 'https://transformlearning.ai',
    siteName: 'Arrival',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Arrival — Adaptive Learning Operating System',
    description: 'Real-time student proficiency tracking. AI coaching. Peer learning. Built for faculty who want to see what grades can\'t show.',
  },
  alternates: {
    canonical: 'https://transformlearning.ai',
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Arrival",
  "url": "https://transformlearning.ai",
  "applicationCategory": "EducationalApplication",
  "description": "AI-powered adaptive learning operating system for higher education. Maps student proficiency, tracks learning trajectories, and generates targeted interventions.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Free pilot program for faculty"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Transform Learning",
    "url": "https://transformlearning.ai",
    "founder": {
      "@type": "Person",
      "name": "Jeff Ritter",
      "jobTitle": "Founder & Chief Learning Officer",
      "alumniOf": { "@type": "CollegeOrUniversity", "name": "Hampshire College" }
    }
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
