import { PreorderController } from '@/backend/modules/preorder/preorder.controller'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  return PreorderController.getAllPreorders(req)
}

export async function POST(req: NextRequest) {
  return PreorderController.createPreorder(req)
}
