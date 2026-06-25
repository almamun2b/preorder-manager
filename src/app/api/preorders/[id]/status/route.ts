import { PreorderController } from '@/backend/modules/preorder/preorder.controller'
import { NextRequest } from 'next/server'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return PreorderController.updatePreorderStatus(req, id)
}
