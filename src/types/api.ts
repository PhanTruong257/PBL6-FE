/**
 * Standard API Response Interface format.
 * Matches backend IApiResponse interface from api-gateway.
 */
export interface IApiResponse<T = any> {
  /** Response status indicator */
  success: boolean

  /** Human-readable message */
  message: string

  /** Response payload - actual data or null on error */
  data: T

  /** Error information - flexible structure for any error details */
  error?: unknown
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

/**
 * Type guard to check if response is successful
 */
export function isSuccessResponse<T>(
  response: IApiResponse<T>
): response is IApiResponse<T> & { success: true } {
  return response.success === true
}

/**
 * Type guard to check if response has error
 */
export function isErrorResponse<T>(
  response: IApiResponse<T>
): response is IApiResponse<T> & { success: false; error: unknown } {
  return response.success === false
}
