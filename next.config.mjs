/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['@modelcontextprotocol/sdk'],
  },
  async redirects() {
    return [
      {
        source: '/heritage-360',
        destination: '/heritage',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
