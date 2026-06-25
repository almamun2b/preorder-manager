import { z } from 'zod'

const createPreorderSchema = z.object({
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
  startsAt: z
    .string()
    .datetime({ message: 'Start date must be a valid ISO datetime' })
    .optional()
    .nullable(),
  endsAt: z
    .string()
    .datetime({ message: 'End date must be a valid ISO datetime' })
    .optional()
    .nullable(),
  status: z
    .boolean({ message: 'Status must be true or false' })
    .optional()
    .default(true),
})

const updatePreorderSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Preorder name is required' })
    .max(255, { message: 'Preorder name must be less than 255 characters' })
    .optional(),
  products: z
    .number({ message: 'Products must be a number' })
    .int({ message: 'Products must be an integer' })
    .min(1, { message: 'At least 1 product is required' })
    .optional(),
  preorderWhen: z
    .enum(['REGARDLESS_OF_STOCK', 'OUT_OF_STOCK'], {
      message:
        "Preorder condition must be either 'REGARDLESS_OF_STOCK' or 'OUT_OF_STOCK'",
    })
    .optional(),
  startsAt: z
    .string()
    .datetime({ message: 'Start date must be a valid ISO datetime' })
    .optional()
    .nullable(),
  endsAt: z
    .string()
    .datetime({ message: 'End date must be a valid ISO datetime' })
    .optional()
    .nullable(),
  status: z.boolean({ message: 'Status must be true or false' }).optional(),
})

const updateStatusSchema = z.object({
  status: z.boolean({ message: 'Status must be true or false' }),
})

const getAllPreordersQuerySchema = z.object({
  status: z.enum(['all', 'active', 'inactive']).optional(),
  sortBy: z.enum(['name', 'createdAt', 'startsAt', 'endsAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z
    .string()
    .transform((val) => parseInt(val, 10))
    .optional(),
  limit: z
    .string()
    .transform((val) => parseInt(val, 10))
    .optional(),
  search: z.string().optional(),
})

export const Order = {
  createPreorderSchema,
  updatePreorderSchema,
  updateStatusSchema,
  getAllPreordersQuerySchema,
}
