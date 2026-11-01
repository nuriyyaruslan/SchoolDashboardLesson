import { useCallback, useEffect, useState } from 'react'
import { toApiError } from '../utils/apiError'
import type { ApiError } from '../types/api'

interface ResourceState<T> {
  data: T | null
  loading: boolean
  error: ApiError | null
  reload: () => void
  // Redaktədən sonra serverin qaytardığı yeni məlumatı birbaşa yazmaq üçün
  setData: (data: T) => void
}

/**
 * Tək resursu serverdən yükləyir (məs: /students/4).
 * key dəyişəndə (başqa id) sorğu yenidən göndərilir.
 */
export const useResource = <T>(loader: () => Promise<T>, key: string | number): ResourceState<T> => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    loader()
      .then((result) => {
        if (!cancelled) setData(result)
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(toApiError(err))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
    // loader hər render-də yenidən yaranır, ona görə yalnız key və version-a baxırıq
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, version])

  const reload = useCallback(() => setVersion((v) => v + 1), [])

  return { data, loading, error, reload, setData }
}
