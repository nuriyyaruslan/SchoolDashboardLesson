import axios from 'axios'
import type { ApiError, ApiErrorResponse } from '../types/api'

// İstənilən xətanı vahid ApiError formasına salırıq
export const toApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    if (!error.response) {
      return { status: null, message: 'Serverə qoşulmaq mümkün olmadı. İnterneti yoxlayın.' }
    }
    const { status, data } = error.response
    return {
      status,
      message: data?.message || 'Gözlənilməz xəta baş verdi',
      errors: data?.errors,
    }
  }
  return { status: null, message: 'Gözlənilməz xəta baş verdi' }
}
