export default function sitemap() {
  const base = 'https://transformlearning.ai'

  return [
    // Core
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/demo`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/methodology`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/investors`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/access`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/students`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/tools`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },

    // Blog
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/blog/the-people-who-see-the-problem-can-build-the-solution`, lastModified: '2026-04-16', changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/energy-karma-and-groups-of-people`, lastModified: '2026-04-16', changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/navigating-ai-in-education-balancing-innovation`, lastModified: '2026-04-16', changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/slip-sliding-with-a-cannonball`, lastModified: '2026-04-16', changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/the-rise-of-adaptive-learning-platforms`, lastModified: '2026-04-16', changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/life-with-ai-navigating-the-age-of-emergence`, lastModified: '2026-04-16', changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/how-to-believe-in-ai-and-edu-without-really-trying`, lastModified: '2026-04-16', changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/revolutionizing-education-with-ai-technology`, lastModified: '2026-04-16', changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/ai-education-nexus-lexus-read-all-about-it`, lastModified: '2026-04-16', changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/the-future-of-small-colleges-navigating-challenges`, lastModified: '2026-04-16', changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/thank-you-notes-please`, lastModified: '2026-04-16', changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/blog/higher-ed-budget-strains-ai-boon`, lastModified: '2026-04-16', changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/money-bucket-of-training`, lastModified: '2026-04-16', changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/enhancing-teaching-techniques-with-transform-learning`, lastModified: '2026-04-16', changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/revolutionize-education-with-transform-learning`, lastModified: '2026-04-16', changeFrequency: 'monthly', priority: 0.7 },

    // Campus Transformation
    { url: `${base}/campus-transformation`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/campus-transformation/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/campus-transformation/process`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/campus-transformation/cases`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/campus-transformation/inquiry`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/campus-transformation/simulation`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/campus-transformation/game`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/campus-transformation/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/campus-transformation/blog/your-first-client-will-almost-kill-you`, lastModified: '2026-06-22', changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/campus-transformation/blog/when-colleges-close-communities-dont-have-to`, lastModified: '2026-06-15', changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/campus-transformation/blog/the-math-nobody-talks-about`, lastModified: '2026-05-26', changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/campus-transformation/blog/oakland-city-doesnt-have-to-die`, lastModified: '2026-05-21', changeFrequency: 'monthly', priority: 0.8 },

    // Campus OS
    { url: `${base}/campus-os`, lastModified: '2026-04-16', changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/campus-os/demo`, lastModified: '2026-04-16', changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/campus-os/whitepaper`, lastModified: '2026-04-16', changeFrequency: 'monthly', priority: 0.7 },
  ]
}
