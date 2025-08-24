
// Cloudflare-compatible database configuration using Node.js runtime
import { PrismaClient } from '@prisma/client';

declare global {
  var __prisma: PrismaClient | undefined;
}

// Database configuration optimized for serverless environments
const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
};

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// For serverless environments, we don't need explicit connection/disconnection
export const connectToDatabase = async () => {
  return prisma;
};

// Graceful disconnect (optional in serverless)
export const disconnectFromDatabase = async () => {
  // In serverless environments, connections are managed automatically
  // await prisma.$disconnect();
};
