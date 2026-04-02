import './globals.css'
import { Analytics } from '@vercel/analytics/react'

export const metadata = {
  title: 'Arrival — Adaptive Learning Operating System for Higher Education',
  description: 'Real-time visibility into student progression in gateway courses. Early risk signals. Targeted interventions. Built for faculty.',
  openGraph: {
    title: 'Arrival',
    description: 'See where every student stands — before the grade does.',
    url: 'https://transformlearning.ai',
    siteName: 'Arrival',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
