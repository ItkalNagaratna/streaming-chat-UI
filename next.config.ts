import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  // Your repository name goes here
  basePath: isProd ? '/streaming-chat-UI' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
