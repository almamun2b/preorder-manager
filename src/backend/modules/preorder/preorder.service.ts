import { prisma } from '@/backend/config/prisma'
import { AppError } from '@/backend/utils/errors'
import { QueryBuilder } from '@/backend/utils/queryBuilder'
import {
  TCreatePreorder,
  TPreordersQueryParams,
  TUpdatePreorder,
} from './preorders.type'

const getAllPreorders = async (params: TPreordersQueryParams) => {
  const {
    status,
    sortBy,
    sortOrder = 'desc',
    page = 1,
    limit = 10,
    search,
  } = params

  try {
    const queryBuilder = new QueryBuilder(prisma.preorder)
      .search({
        searchText: search,
        fields: ['name'],
      })
      .filter({
        status:
          status === 'active'
            ? true
            : status === 'inactive'
              ? false
              : undefined,
      })
      .sortBy({
        sortBy,
        sortOrder,
      })
      .paginate({
        page,
        limit,
      })

    const result = await queryBuilder.executeWithMeta()

    return {
      success: true,
      message: 'Preorders retrieved successfully',
      data: result.data,
      meta: result.meta,
    }
  } catch {
    throw new AppError('Failed to retrieve preorders', 500)
  }
}

const getPreorderById = async (id: string) => {
  try {
    const preorder = await prisma.preorder.findUnique({
      where: { id },
    })

    if (!preorder) {
      throw new AppError('Preorder not found', 404)
    }

    return {
      success: true,
      message: 'Preorder retrieved successfully',
      data: preorder,
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }
    throw new AppError('Failed to retrieve preorder', 500)
  }
}

const createPreorder = async (data: TCreatePreorder) => {
  try {
    const preorder = await prisma.preorder.create({
      data,
    })

    return {
      success: true,
      message: 'Preorder created successfully',
      data: preorder,
    }
  } catch {
    throw new AppError('Failed to create preorder', 500)
  }
}

const updatePreorder = async (id: string, data: TUpdatePreorder) => {
  try {
    const existing = await prisma.preorder.findUnique({
      where: { id },
    })

    if (!existing) {
      throw new AppError('Preorder not found', 404)
    }

    const preorder = await prisma.preorder.update({
      where: { id },
      data,
    })

    return {
      success: true,
      message: 'Preorder updated successfully',
      data: preorder,
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }
    throw new AppError('Failed to update preorder', 500)
  }
}

const deletePreorder = async (id: string) => {
  try {
    const existing = await prisma.preorder.findUnique({
      where: { id },
    })

    if (!existing) {
      throw new AppError('Preorder not found', 404)
    }

    await prisma.preorder.delete({
      where: { id },
    })

    return {
      success: true,
      message: 'Preorder deleted successfully',
      data: null,
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }
    throw new AppError('Failed to delete preorder', 500)
  }
}

const updatePreorderStatus = async (id: string, status: boolean) => {
  try {
    const existing = await prisma.preorder.findUnique({
      where: { id },
    })

    if (!existing) {
      throw new AppError('Preorder not found', 404)
    }

    const preorder = await prisma.preorder.update({
      where: { id },
      data: { status },
    })

    return {
      success: true,
      message: 'Preorder status updated successfully',
      data: preorder,
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }
    throw new AppError('Failed to update preorder status', 500)
  }
}

export const PreorderService = {
  getAllPreorders,
  getPreorderById,
  createPreorder,
  updatePreorder,
  deletePreorder,
  updatePreorderStatus,
}
