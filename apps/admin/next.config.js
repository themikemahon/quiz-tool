/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@quiz-tool/db'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      },
    ],
  },
};

module.exports = nextConfig;
