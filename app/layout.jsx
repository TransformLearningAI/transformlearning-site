import './globals.css'
import { Analytics } from '@vercel/analytics/react'

export const metadata = {
  metadataBase: new URL('https://transformlearning.ai'),
  title: 'Transform Learning — AI-Powered Proficiency Measurement for Higher Education',
  description: 'AI tools that show students and faculty what grades can\'t. Bayesian competency estimation, adaptive skill mapping, AI coaching. Free for students.',
  keywords: ['adaptive learning', 'AI in education', 'student proficiency', 'gateway courses', 'DFW rates', 'higher education AI', 'learning analytics', 'student retention', 'AI coaching', 'proficiency tracking', 'Bayesian competency estimation', 'adaptive skill mapping'],
  openGraph: {
    title: 'Transform Learning — AI-Powered Proficiency Measurement for Higher Education',
    description: 'AI tools that show students and faculty what grades can\'t. Bayesian competency estimation, adaptive skill mapping, AI coaching. Free for students.',
    url: 'https://transformlearning.ai',
    siteName: 'Transform Learning',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Transform Learning — AI-Powered Proficiency Measurement for Higher Education',
    description: 'AI tools that show students and faculty what grades can\'t. Bayesian competency estimation, adaptive skill mapping, AI coaching. Free for students.',
  },
  alternates: {
    canonical: 'https://transformlearning.ai',
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Transform Learning",
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
