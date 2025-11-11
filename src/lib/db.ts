import { PrismaClient } from '../generated/prisma'; 

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

let db: PrismaClient;
try {
  db = globalThis.prisma || new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
  console.log('PrismaClient initialized successfully');
} catch (error) {
  console.error('PrismaClient initialization failed:', error);
  throw error;
}

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db;
}

export { db };