// Laravel-in xəta cavabı: 422-də "errors" olur, 401 və s.-də yalnız "message"
export interface ApiErrorResponse {
  message: string
  errors?: Record<string, string[]>
}

// Thunk-lardan rejectWithValue ilə qaytarılan xəta
export interface ApiError {
  status: number | null
  message: string
  errors?: Record<string, string[]>
}

// Laravel paginator cavabı (/students, /teachers)
export interface PaginatedResponse<T> {
  data: T[]
  links: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number | null
    last_page: number
    per_page: number
    to: number | null
    total: number
  }
}

// Tək resurs cavabı: { data: {...} }
export interface DataResponse<T> {
  data: T
}
