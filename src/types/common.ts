/**
 * Common shared types used throughout the application
 */

export type Nullable<T> = T | null

export type Optional<T> = T | undefined

export type ID = string | number

export type Timestamp = string | Date

export interface SelectOption<T = string> {
  label: string
  value: T
  disabled?: boolean
}

export interface TableColumn<T = any> {
  key: keyof T
  label: string
  sortable?: boolean
  width?: number
  render?: (value: any, row: T) => React.ReactNode
}

export interface SortConfig<T = any> {
  key: keyof T
  direction: 'asc' | 'desc'
}

export interface FilterConfig<T = any> {
  key: keyof T
  value: any
  operator?: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in'
}

export interface PaginationConfig {
  page: number
  limit: number
  total?: number
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface AsyncState<T> {
  data: T | null
  isLoading: boolean
  error: Error | null
  status: LoadingState
}

export interface FileUpload {
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
}
