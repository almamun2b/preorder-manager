import { getPreorderById } from '@/app/actions/preorder'
import { PreorderForm } from '@/components/modules/preorder/PreorderForm'
import { date } from '@/lib/date'
import { notFound } from 'next/navigation'

interface PreorderEditPageProps {
  params: Promise<{ id: string }>
}

const PreorderEditPage = async ({ params }: PreorderEditPageProps) => {
  const { id } = await params

  const preorderData = await getPreorderById(id)

  if (!preorderData.success || !preorderData.data) {
    notFound()
  }

  const preorder = preorderData.data

  const formData = {
    ...preorder,
    products: preorder.products.toString(),
    startsAt: preorder.startsAt
      ? date.utcToLocal(preorder.startsAt, 'yyyy-MM-dd HH:mm')
      : '',
    endsAt: preorder.endsAt
      ? date.utcToLocal(preorder.endsAt, 'yyyy-MM-dd HH:mm')
      : '',
  }

  return (
    <div className="mx-auto w-full max-w-4xl flex-1">
      <PreorderForm data={formData} id={id} isEdit />
    </div>
  )
}

export default PreorderEditPage
