import z from 'zod'
import { Order } from './preorders.validation'

type TPreordersQueryParams = z.infer<typeof Order.preordersQueryParamsSchema>

type TCreatePreorder = z.infer<typeof Order.createPreorderSchema>

type TUpdatePreorder = z.infer<typeof Order.updatePreorderSchema>

type TUpdateStatus = z.infer<typeof Order.updateStatusSchema>

export type {
  TCreatePreorder,
  TPreordersQueryParams,
  TUpdatePreorder,
  TUpdateStatus,
}
