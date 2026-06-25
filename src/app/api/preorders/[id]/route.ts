import { PreorderController } from '@/backend/modules/preorder/preorder.controller'
import { NextRequest } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return PreorderController.getPreorderById(req, id)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return PreorderController.updatePreorder(req, id)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return PreorderController.deletePreorder(req, id)
}
