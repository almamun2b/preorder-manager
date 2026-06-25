import { AppError } from '@/backend/utils/errors'
import { NextResponse } from 'next/server'
import { z } from 'zod'

type ApiResponse<T = unknown> = {
  success: boolean
  message: string
  data?: T
  errors?: z.core.$ZodIssue[]
  meta?: {
    page: number
    limit: number
    total: number
    totalPage: number
  }
}

function handleApiError(error: unknown): NextResponse<ApiResponse> {
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        success: false,
        message: 'Validation error',
        errors: error.issues,
      } as ApiResponse,
      { status: 400 }
    )
  }

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      } as ApiResponse,
      { status: error.statusCode }
    )
  }

  console.error('Unhandled error:', error)
  return NextResponse.json(
    {
      success: false,
      message: 'Internal server error',
    } as ApiResponse,
    { status: 500 }
  )
}

async function handleAsyncError<T>(
  handler: () => Promise<NextResponse<ApiResponse<T>>>
): Promise<NextResponse<ApiResponse<T>>> {
  try {
    return await handler()
  } catch (error) {
    return handleApiError(error) as NextResponse<ApiResponse<T>>
  }
}

export function withErrorHandler<T>(
  handler: () => Promise<NextResponse<ApiResponse<T>>>
): Promise<NextResponse<ApiResponse<T>>> {
  return handleAsyncError(handler)
}
