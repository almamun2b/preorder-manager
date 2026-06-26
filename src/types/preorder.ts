import { PreorderWhen } from '@/generated/prisma/enums'
import { Meta, SuccessResponse } from './api-response'

interface Preorder {
  id: string
  name: string
  products: number
  preorderWhen: PreorderWhen
  startsAt: string | null
  endsAt: string | null
  status: boolean
  createdAt: string
  updatedAt: string
}

interface PreordersResponse extends SuccessResponse {
  data: Preorder[]
  meta: Meta
}

interface PreorderDetailResponse extends SuccessResponse {
  data: Preorder | null
}

export type { Preorder, PreorderDetailResponse, PreordersResponse }
