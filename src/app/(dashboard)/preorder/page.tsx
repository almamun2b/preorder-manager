import { getAllPreorders } from '@/app/actions/preorder'
import { TPreordersQueryParams } from '@/backend/modules/preorder/preorders.type'
import { PreordersTable } from '@/components/modules/preorder/PreordersTable'

interface PreorderPageProps {
  searchParams: Promise<TPreordersQueryParams>
}

const PreorderPage = async ({ searchParams }: PreorderPageProps) => {
  const queryParams = await searchParams

  const preorders = await getAllPreorders(queryParams)

  if (!preorders.success) {
    return <div>Failed to load preorders</div>
  }

  return <PreordersTable data={preorders} />
}

export default PreorderPage
