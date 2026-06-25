import { withErrorHandler } from '@/backend/middleware/errorHandler'
import { NextRequest, NextResponse } from 'next/server'
import { PreorderService } from './preorder.service'
import { TCreatePreorder } from './preorders.type'
import { Order } from './preorders.validation'

const getAllPreorders = async (req: NextRequest) => {
  return withErrorHandler(async () => {
    const searchParams = req.nextUrl.searchParams

    const queryParams = Order.getAllPreordersQuerySchema.parse({
      status: searchParams.get('status') || undefined,
      sortBy: searchParams.get('sortBy') || undefined,
      sortOrder: searchParams.get('sortOrder') || undefined,
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
      search: searchParams.get('search') || undefined,
    })

    const result = await PreorderService.getAllPreorders(queryParams)

    return NextResponse.json(result, { status: 200 })
  })
}

const getPreorderById = async (req: NextRequest, id: string) => {
  return withErrorHandler(async () => {
    const result = await PreorderService.getPreorderById(id)

    return NextResponse.json(result, { status: 200 })
  })
}

const createPreorder = async (req: NextRequest) => {
  return withErrorHandler(async () => {
    const body = await req.json()

    const validatedData = Order.createPreorderSchema.parse(body)

    const data = {
      ...validatedData,
      startsAt: validatedData.startsAt
        ? new Date(validatedData.startsAt)
        : undefined,
      endsAt: validatedData.endsAt ? new Date(validatedData.endsAt) : undefined,
    }

    const result = await PreorderService.createPreorder(data as TCreatePreorder)

    return NextResponse.json(result, { status: 201 })
  })
}

const updatePreorder = async (req: NextRequest, id: string) => {
  return withErrorHandler(async () => {
    const body = await req.json()

    const validatedData = Order.updatePreorderSchema.parse(body)

    const data: Record<string, unknown> = {}

    if (validatedData.name !== undefined) data.name = validatedData.name
    if (validatedData.products !== undefined)
      data.products = validatedData.products
    if (validatedData.preorderWhen !== undefined)
      data.preorderWhen = validatedData.preorderWhen
    if (validatedData.startsAt !== undefined)
      data.startsAt = validatedData.startsAt
        ? new Date(validatedData.startsAt)
        : undefined
    if (validatedData.endsAt !== undefined)
      data.endsAt = validatedData.endsAt
        ? new Date(validatedData.endsAt)
        : undefined
    if (validatedData.status !== undefined) data.status = validatedData.status

    const result = await PreorderService.updatePreorder(id, data)

    return NextResponse.json(result, { status: 200 })
  })
}

const deletePreorder = async (req: NextRequest, id: string) => {
  return withErrorHandler(async () => {
    const result = await PreorderService.deletePreorder(id)

    return NextResponse.json(result, { status: 200 })
  })
}

const updatePreorderStatus = async (req: NextRequest, id: string) => {
  return withErrorHandler(async () => {
    const body = await req.json()

    const validatedData = Order.updateStatusSchema.parse(body)

    const result = await PreorderService.updatePreorderStatus(
      id,
      validatedData.status
    )

    return NextResponse.json(result, { status: 200 })
  })
}

export const PreorderController = {
  getAllPreorders,
  getPreorderById,
  createPreorder,
  updatePreorder,
  deletePreorder,
  updatePreorderStatus,
}
