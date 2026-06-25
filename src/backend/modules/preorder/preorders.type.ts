import z from 'zod'
import { Order } from './preorders.validation'

type TGetAllPreordersQuery = z.infer<typeof Order.getAllPreordersQuerySchema>

type TCreatePreorder = z.infer<typeof Order.createPreorderSchema>

type TUpdatePreorder = z.infer<typeof Order.updatePreorderSchema>

type TUpdateStatus = z.infer<typeof Order.updateStatusSchema>

export type {
  TCreatePreorder,
  TGetAllPreordersQuery,
  TUpdatePreorder,
  TUpdateStatus,
}
