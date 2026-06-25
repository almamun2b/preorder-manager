import { PrismaClient } from '@/generated/prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const dbUrl = `${process.env.DATABASE_URL}`

const adapter = new PrismaBetterSqlite3({ url: dbUrl })

const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === 'development'
      ? ['info', 'warn', 'error']
      : ['error'],
  adapter,
})

export { prisma }
