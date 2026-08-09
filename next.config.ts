import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
      },
      {
        protocol: 'https',
        hostname: 'static.tvmaze.com',
      },
      {
        protocol: 'https',
        hostname: 'static.wikia.nocookie.net',
      }
    ],
  },
};

export default nextConfig;
