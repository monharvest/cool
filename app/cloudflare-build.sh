
#!/bin/bash

echo "Starting Cloudflare Pages build process..."

# Install dependencies
echo "Installing dependencies..."
yarn install

# Set environment for build
export NODE_ENV=production

# Generate Prisma client
echo "Generating Prisma client..."
yarn prisma generate

# Build the Next.js application
echo "Building Next.js application..."
yarn build

# Optimize for Cloudflare Pages
echo "Optimizing for Cloudflare Pages..."
mkdir -p .next/static
cp -r .next/server/static/* .next/static/ 2>/dev/null || true

echo "Build completed successfully!"
