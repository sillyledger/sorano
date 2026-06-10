/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'app.sorano.space' }],
        destination: '/dashboard/:path*',
      },
    ]
  },
}

module.exports = nextConfig
