import { TPreordersQueryParams } from '@/backend/modules/preorder/preorders.type'
import { PreordersTable } from '@/components/modules/preorder/PreordersTable'
import { PreordersResponse } from '@/types/preorder'

const preorders: PreordersResponse = {
  success: true,
  message: 'Preorders retrieved successfully',
  data: [
    {
      id: '0715a88a-68fb-4f7f-ab3c-9e2351e99127',
      name: 'Apple Watch Series 12',
      products: 40,
      preorderWhen: 'REGARDLESS_OF_STOCK',
      startsAt: '2026-09-01T00:00:00.000Z',
      endsAt: '2026-09-30T23:59:59.000Z',
      status: true,
      createdAt: '2026-06-25T19:53:35.970Z',
      updatedAt: '2026-06-25T19:53:35.970Z',
    },
    {
      id: '1e5dfd49-ea37-4461-9c52-e8065e21abdd',
      name: 'Summer Sale 2024',
      products: 100,
      preorderWhen: 'REGARDLESS_OF_STOCK',
      startsAt: '2024-06-01T00:00:00.000Z',
      endsAt: '2024-08-31T23:59:59.999Z',
      status: true,
      createdAt: '2026-06-25T19:53:06.533Z',
      updatedAt: '2026-06-25T19:53:06.533Z',
    },
    {
      id: '3ad60f01-d1a5-4395-bef5-e561466f118a',
      name: 'HomePod Mini 3',
      products: 80,
      preorderWhen: 'OUT_OF_STOCK',
      startsAt: '2026-07-15T00:00:00.000Z',
      endsAt: '2026-07-25T23:59:59.000Z',
      status: true,
      createdAt: '2026-06-25T19:53:35.970Z',
      updatedAt: '2026-06-25T19:53:35.970Z',
    },
    {
      id: '5fe1f246-0fe7-46f1-ad8f-bd520c97d717',
      name: 'iPad Ultra',
      products: 60,
      preorderWhen: 'OUT_OF_STOCK',
      startsAt: '2026-10-01T00:00:00.000Z',
      endsAt: '2026-10-20T23:59:59.000Z',
      status: true,
      createdAt: '2026-06-25T19:53:35.970Z',
      updatedAt: '2026-06-25T19:53:35.970Z',
    },
    {
      id: '61dd05bd-df00-4620-8853-243b963e1b0c',
      name: 'MacBook Pro M7',
      products: 50,
      preorderWhen: 'OUT_OF_STOCK',
      startsAt: '2026-08-01T00:00:00.000Z',
      endsAt: '2026-08-15T23:59:59.000Z',
      status: true,
      createdAt: '2026-06-25T19:53:35.970Z',
      updatedAt: '2026-06-25T19:53:35.970Z',
    },
    {
      id: 'a3fae625-9747-45a5-a701-9febcb1a91d9',
      name: 'Apple TV 8K',
      products: 30,
      preorderWhen: 'OUT_OF_STOCK',
      startsAt: '2026-09-05T00:00:00.000Z',
      endsAt: '2026-09-25T23:59:59.000Z',
      status: false,
      createdAt: '2026-06-25T19:53:35.970Z',
      updatedAt: '2026-06-25T19:53:35.970Z',
    },
    {
      id: 'b51f0b5e-7675-4081-a073-a4a606e6cf26',
      name: 'iPhone 18 Pro Max',
      products: 100,
      preorderWhen: 'REGARDLESS_OF_STOCK',
      startsAt: '2026-07-01T00:00:00.000Z',
      endsAt: '2026-07-31T23:59:59.000Z',
      status: true,
      createdAt: '2026-06-25T19:53:35.970Z',
      updatedAt: '2026-06-25T19:53:35.970Z',
    },
    {
      id: 'c36deff2-8f8f-49c6-9872-b309810406ed',
      name: 'Magic Keyboard 2',
      products: 120,
      preorderWhen: 'REGARDLESS_OF_STOCK',
      startsAt: '2026-08-10T00:00:00.000Z',
      endsAt: '2026-08-20T23:59:59.000Z',
      status: false,
      createdAt: '2026-06-25T19:53:35.970Z',
      updatedAt: '2026-06-25T19:53:35.970Z',
    },
    {
      id: 'c688aa09-70ba-410d-9794-915c21bb76bc',
      name: 'Vision Pro 2',
      products: 15,
      preorderWhen: 'REGARDLESS_OF_STOCK',
      startsAt: '2026-11-01T00:00:00.000Z',
      endsAt: '2026-11-15T23:59:59.000Z',
      status: false,
      createdAt: '2026-06-25T19:53:35.970Z',
      updatedAt: '2026-06-25T19:53:35.970Z',
    },
    {
      id: 'ccc1539f-712b-4e55-97b2-c305749ba39b',
      name: 'Mac Studio 2026',
      products: 10,
      preorderWhen: 'REGARDLESS_OF_STOCK',
      startsAt: '2026-12-01T00:00:00.000Z',
      endsAt: '2026-12-31T23:59:59.000Z',
      status: true,
      createdAt: '2026-06-25T19:53:35.970Z',
      updatedAt: '2026-06-25T19:53:35.970Z',
    },
  ],
  meta: {
    page: 1,
    limit: 10,
    total: 11,
    totalPage: 2,
  },
}

interface PreorderPageProps {
  searchParams: Promise<TPreordersQueryParams>
}

const PreorderPage = async ({ searchParams }: PreorderPageProps) => {
  const rawQueryParams = await searchParams

  console.log(rawQueryParams, 'params')
  return (
    <div className="flex">
      <PreordersTable data={preorders} />
    </div>
  )
}

export default PreorderPage
