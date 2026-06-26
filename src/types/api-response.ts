interface Meta {
  page: number
  limit: number
  total: number
  totalPage: number
}

interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
  meta?: Meta
}

export type { ApiResponse, Meta }
