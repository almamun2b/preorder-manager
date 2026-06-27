import { prisma } from '@/backend/config/prisma'
import { PreorderWhen } from '@/generated/prisma/enums'

async function main() {
  const result = await prisma.preorder.createMany({
    data: [
      {
        name: 'AirPods Pro 4',
        products: 25,
        preorderWhen: PreorderWhen.OUT_OF_STOCK,
        status: false,
      },
      {
        name: 'Apple Watch Series 12',
        products: 40,
        preorderWhen: PreorderWhen.REGARDLESS_OF_STOCK,
        startsAt: new Date('2026-09-01T00:00:00Z'),
        endsAt: new Date('2026-09-30T23:59:59Z'),
        status: true,
      },
      {
        name: 'iPad Ultra',
        products: 60,
        preorderWhen: PreorderWhen.OUT_OF_STOCK,
        startsAt: new Date('2026-10-01T00:00:00Z'),
        endsAt: new Date('2026-10-20T23:59:59Z'),
        status: true,
      },
      {
        name: 'Vision Pro 2',
        products: 15,
        preorderWhen: PreorderWhen.REGARDLESS_OF_STOCK,
        startsAt: new Date('2026-11-01T00:00:00Z'),
        endsAt: new Date('2026-11-15T23:59:59Z'),
        status: false,
      },
      {
        name: 'HomePod Mini 3',
        products: 80,
        preorderWhen: PreorderWhen.OUT_OF_STOCK,
        startsAt: new Date('2026-07-15T00:00:00Z'),
        endsAt: new Date('2026-07-25T23:59:59Z'),
        status: true,
      },
      {
        name: 'Magic Keyboard 2',
        products: 120,
        preorderWhen: PreorderWhen.REGARDLESS_OF_STOCK,
        startsAt: new Date('2026-08-10T00:00:00Z'),
        endsAt: new Date('2026-08-20T23:59:59Z'),
        status: false,
      },
      {
        name: 'Apple TV 8K',
        products: 30,
        preorderWhen: PreorderWhen.OUT_OF_STOCK,
        startsAt: new Date('2026-09-05T00:00:00Z'),
        endsAt: new Date('2026-09-25T23:59:59Z'),
        status: false,
      },
      {
        name: 'Mac Studio 2026',
        products: 10,
        preorderWhen: PreorderWhen.REGARDLESS_OF_STOCK,
        startsAt: new Date('2026-12-01T00:00:00Z'),
        endsAt: new Date('2026-12-31T23:59:59Z'),
        status: true,
      },
    ],
  })

  console.log(result, 'Preorders seeded successfully')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
