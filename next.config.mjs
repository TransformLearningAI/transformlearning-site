/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['pdf-parse'],
  async redirects() {
    return [
      {
        source: '/campus-transformation',
        destination: 'https://campustransformation.org',
        permanent: true,
      },
      {
        source: '/campus-transformation/:path*',
        destination: 'https://campustransformation.org/:path*',
        permanent: true,
      },
    ]
  },
}
export default nextConfig
