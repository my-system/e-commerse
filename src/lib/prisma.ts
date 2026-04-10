import { PrismaClient } from '@prisma/client'
import { createPrismaWithMiddleware } from './prisma-middleware'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = createPrismaWithMiddleware()
}

export const prisma = globalForPrisma.prisma
