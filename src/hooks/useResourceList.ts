import { useCallback, useEffect, useState } from 'react'
import { toApiError } from '../utils/apiError'
import type { ApiError, PaginatedResponse } from '../types/api'

interface ResourceListState<T> {
  items: T[]
  total: number
  loading: boolean
  error: ApiError | null
  reload: () => void
}

/**
 * Siyahını serverdən yükləyir. enabled=false olduqda sorğu göndərilmir
 * (məsələn, şagird hesabı ilə /students-ə müraciət etmək olmur).
 */
export const useResourceList = <T>(
  loader: () => Promise<PaginatedResponse<T>>,
  enabled = true,
): ResourceListState<T> => {
  const [items, setItems] = useState<T[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState<ApiError | null>(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    setLoading(true)
    setError(null)
    loader()
      .then((response) => {
        if (cancelled) return
        setItems(response.data)
        setTotal(response.meta.total)
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
    // loader hər render-də yenidən yaranır, ona görə yalnız version-a baxırıq
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, version])

  const reload = useCallback(() => setVersion((v) => v + 1), [])

  return { items, total, loading, error, reload }
}
