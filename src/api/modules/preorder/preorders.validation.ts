import { z } from 'zod'
const preorderSchema = z.object({
  id: z.uuid({ message: 'Invalid UUID format for id' }),
  name: z
    .string()
    .min(1, { message: 'Preorder name is required' })
    .max(255, { message: 'Preorder name must be less than 255 characters' }),
  products: z
    .number({ message: 'Products must be a number' })
    .int({ message: 'Products must be an integer' })
    .min(1, { message: 'At least 1 product is required' }),
  preorderWhen: z.enum(['REGARDLESS_OF_STOCK', 'OUT_OF_STOCK'], {
    message:
      "Preorder condition must be either 'REGARDLESS_OF_STOCK' or 'OUT_OF_STOCK'",
  }),
  startsAt: z.date({ message: 'Start date must be a valid Date' }).optional(),
  endsAt: z.date({ message: 'End date must be a valid Date' }).optional(),
  status: z.boolean({ message: 'Status must be true or false' }).default(true),
  createdAt: z.date({ message: 'CreatedAt must be a valid Date' }),
  updatedAt: z.date({ message: 'UpdatedAt must be a valid Date' }),
})

export const Order = { preorderSchema }
