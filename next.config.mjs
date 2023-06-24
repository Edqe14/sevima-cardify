import './src/lib/env.mjs';
import { withSuperjson } from 'next-superjson';
import withPWAInstance from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        hostname: '*.googleusercontent.com',
      },
    ],
  },
};

const withPWA = withPWAInstance({
  dest: 'public',
});

export default withPWA(withSuperjson()(nextConfig));
