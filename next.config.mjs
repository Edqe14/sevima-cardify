import './src/lib/env.mjs';
import { withSuperjson } from 'next-superjson';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname: '*.googleusercontent.com',
      },
    ],
  },
};

export default withSuperjson()(nextConfig);
