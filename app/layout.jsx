import './globals.css'

export const metadata = {
  title: 'Transform Learning — Learning Progression Intelligence for Higher Education',
  description: 'Real-time visibility into student progression in gateway courses. Early risk signals. Targeted interventions. Built for faculty.',
  openGraph: {
    title: 'Transform Learning',
    description: 'See where every student stands — before the grade does.',
    url: 'https://transformlearning.ai',
    siteName: 'Transform Learning',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
