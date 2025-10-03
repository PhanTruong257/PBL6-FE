export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  errors?: Record<string, string[]>
}

export interface ApiError {
  success: false
  message: string
  errors?: Record<string, string[]>
  statusCode: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ApiSuccessResponse<T> extends ApiResponse<T> {
  success: true
}

export interface ApiErrorResponse extends ApiError {
  success: false
}
