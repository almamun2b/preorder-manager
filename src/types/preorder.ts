import { Meta } from './api-response'

interface Preorder {
  id: string
  name: string
  products: number
  preorderWhen: string
  startsAt: string | null
  endsAt: string | null
  status: boolean
  createdAt: string
  updatedAt: string
}

interface PreordersResponse {
  success: boolean
  message: string
  data: Preorder[]
  meta: Meta
}

export type { Preorder, PreordersResponse }
