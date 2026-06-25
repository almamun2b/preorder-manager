// import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from '@/generated/prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const dbUrl = `${process.env.DATABASE_URL}`
const authToken = `${process.env.DATABASE_AUTH_TOKEN}`

// const adapter = new PrismaBetterSqlite3({ url: dbUrl })
const adapter = new PrismaLibSql({ url: dbUrl, authToken })

const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === 'development'
      ? ['info', 'warn', 'error']
      : ['error'],
  adapter,
})

export { prisma }
