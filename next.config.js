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
        source: '/:path*',
        has: [{ type: 'host', value: 'app.sorano.space' }],
        destination: '/dashboard/:path*',
      },
    ]
  },
}

module.exports = nextConfig
