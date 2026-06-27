import { getAllPreorders } from '@/app/actions/preorder'
import { TPreordersQueryParams } from '@/backend/modules/preorder/preorders.type'
import { PreordersTable } from '@/components/modules/preorder/PreordersTable'

interface PreorderPageProps {
  searchParams: Promise<TPreordersQueryParams>
}

const PreorderPage = async ({ searchParams }: PreorderPageProps) => {
  const rawQueryParams = await searchParams

  const queryParams: TPreordersQueryParams = {
    page: rawQueryParams.page ?? 1,
    limit: rawQueryParams.limit ?? 8,
    sortBy: rawQueryParams.sortBy ?? 'createdAt',
    sortOrder: rawQueryParams.sortOrder ?? 'desc',
    status: rawQueryParams.status ?? 'all',
  }
  const preorders = await getAllPreorders(queryParams)

  if (!preorders.success) {
    return <div>Failed to load preorders</div>
  }

  return <PreordersTable data={preorders} />
}

export default PreorderPage
