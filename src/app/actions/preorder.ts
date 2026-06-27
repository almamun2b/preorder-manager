'use server'

import {
  TCreatePreorder,
  TPreordersQueryParams,
  TUpdatePreorder,
  TUpdateStatus,
} from '@/backend/modules/preorder/preorders.type'
import { $fetch } from '@/lib/$fetch'
import type { QueryParams } from '@/lib/fetch'
import { PreorderDetailResponse, PreordersResponse } from '@/types/preorder'
import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'

const CACHE_TAGS = {
  PREORDERS: 'preorders',
  PREORDER: (id: string) => `preorder-${id}`,
}

const getAllPreorders = async (params?: TPreordersQueryParams) => {
  try {
    const { data } = await $fetch.get<PreordersResponse>('/preorders', {
      params: params as QueryParams,
      next: {
        tags: [CACHE_TAGS.PREORDERS],
      },
    })

    return data
  } catch (error) {
    console.error('Failed to fetch preorders:', error)
    throw new Error('Failed to fetch preorders. Please try again.')
  }
}

const getPreorderById = async (id: string) => {
  try {
    const { data } = await $fetch.get<PreorderDetailResponse>(
      `/preorders/${id}`,
      {
        next: {
          tags: [CACHE_TAGS.PREORDER(id)],
        },
      }
    )

    return data
  } catch (error) {
    console.error('Failed to fetch preorder:', error)
    throw new Error('Failed to fetch preorder. Please try again.')
  }
}

const createPreorder = async (data: TCreatePreorder) => {
  try {
    const { data: response } = await $fetch.post<
      PreorderDetailResponse,
      TCreatePreorder
    >('/preorders', data)

    revalidateTag(CACHE_TAGS.PREORDERS, 'max')

    return response
  } catch (error) {
    console.error('Failed to create preorder:', error)
    throw new Error('Failed to create preorder. Please try again.')
  } finally {
    redirect('/preorder')
  }
}

const updatePreorder = async (id: string, data: TUpdatePreorder) => {
  try {
    const { data: response } = await $fetch.patch<
      PreorderDetailResponse,
      TUpdatePreorder
    >(`/preorders/${id}`, data)

    revalidateTag(CACHE_TAGS.PREORDERS, 'max')
    revalidateTag(CACHE_TAGS.PREORDER(id), 'max')

    return response
  } catch (error) {
    console.error('Failed to update preorder:', error)
    throw new Error('Failed to update preorder. Please try again.')
  } finally {
    redirect('/preorder')
  }
}

const updatePreorderStatus = async (id: string, status: boolean) => {
  try {
    const { data: response } = await $fetch.patch<
      PreorderDetailResponse,
      TUpdateStatus
    >(`/preorders/${id}/status`, { status })

    revalidateTag(CACHE_TAGS.PREORDERS, { expire: 0 })
    revalidateTag(CACHE_TAGS.PREORDER(id), { expire: 0 })

    return response
  } catch (error) {
    console.error('Failed to update preorder status:', error)
    throw new Error('Failed to update preorder status. Please try again.')
  }
}

const deletePreorder = async (id: string) => {
  try {
    const { data: response } = await $fetch.delete<PreorderDetailResponse>(
      `/preorders/${id}`
    )

    revalidateTag(CACHE_TAGS.PREORDERS, { expire: 0 })
    return response
  } catch (error) {
    console.error('Failed to delete preorder:', error)
    throw new Error('Failed to delete preorder. Please try again.')
  }
}

export {
  createPreorder,
  deletePreorder,
  getAllPreorders,
  getPreorderById,
  updatePreorder,
  updatePreorderStatus,
}
