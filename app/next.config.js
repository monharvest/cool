const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  output: process.env.NEXT_OUTPUT_MODE,
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../'),
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: { 
    unoptimized: true,
    domains: ['images.unsplash.com'],
  },
  // Cloudflare Pages optimizations
  trailingSlash: false,
  compress: true,
  poweredByHeader: false,
  
  // Webpack configuration for Cloudflare compatibility
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ensure proper module resolution for serverless environment
      config.externals = [...(config.externals || []), '_http_common'];
    }
    return config;
  },
  
  // Handle environment variables
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
};

module.exports = nextConfig;
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  output: 'export', // Add this line for static export
  trailingSlash: true,
  images: { 
    unoptimized: true,
    domains: ['images.unsplash.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Handle environment variables
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
};

module.exports = nextConfig;
