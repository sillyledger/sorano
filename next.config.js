/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/',
        has: [{ type: 'host', value: 'app.sorano.space' }],
        destination: '/dashboard',
      },
      {
        source: '/board/:path*',
        has: [{ type: 'host', value: 'app.sorano.space' }],
        destination: '/board/:path*',
      },
      {
        source: '/notes/:path*',
        has: [{ type: 'host', value: 'app.sorano.space' }],
        destination: '/notes/:path*',
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'app.sorano.space' }],
        destination: '/dashboard/:path*',
      },
    ]
  },
}
module.exports = nextConfig
