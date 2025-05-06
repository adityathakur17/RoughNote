/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pixabay.com",
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
      },
    ],
  },

  eslint: {
    // Only run ESLint on local development
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },

};

export default nextConfig;
