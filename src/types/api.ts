export interface ApiMeta {
  timestamp: string
  durationMs: number
}

export interface ApiErrorDetail {
  field?: string
  message: string
  code?: string
}

export interface ApiSuccessResponse<T> {
  success: true
  data: T
  message: string | null
  meta: ApiMeta
  errors: null
}

export interface ApiErrorResponse {
  success: false
  data: null
  message: string | null
  meta: ApiMeta
  errors: ApiErrorDetail[] | null
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse