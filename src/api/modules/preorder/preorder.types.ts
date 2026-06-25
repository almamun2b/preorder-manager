import type { z } from 'zod'
import { Order } from './preorders.validation'

export type TPreorderSchema = z.infer<typeof Order.preorderSchema>
