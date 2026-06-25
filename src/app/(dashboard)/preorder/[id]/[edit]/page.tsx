import { PreorderForm } from '@/components/modules/preorder/PreorderForm'

export default function PreorderEditPage() {
  const mockData = {
    name: 'Multi variant 3',
    products: '1',
    preorderWhen: 'REGARDLESS_OF_STOCK' as const,
    startsAt: '2025-12-15T20:24',
    endsAt: '',
    status: true,
  }

  return (
    <div className="mx-auto w-full max-w-4xl flex-1">
      <PreorderForm data={mockData} />
    </div>
  )
}
