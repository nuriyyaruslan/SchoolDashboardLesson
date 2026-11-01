import { Link } from 'react-router-dom'
import { Button, Result, Spin } from 'antd'
import type { ApiError } from '../../types/api'

interface DetailStateProps {
  loading: boolean
  error: ApiError | null
  // Siyahıya qayıtmaq üçün link və mətn
  backTo: string
  backLabel: string
  notFoundText: string
  onRetry: () => void
}

// Detal səhifəsində yüklənmə, tapılmadı (404), icazə yoxdur (403) və digər xəta halları
const DetailState = ({ loading, error, backTo, backLabel, notFoundText, onRetry }: DetailStateProps) => {
  if (loading) {
    return (
      <div className="flex justify-center rounded-2xl border border-gray-200 bg-white py-24">
        <Spin size="large" />
      </div>
    )
  }

  const status = error?.status
  const backButton = (
    <Link to={backTo}>
      <Button type={status === 404 || status === 403 ? 'primary' : 'default'}>{backLabel}</Button>
    </Link>
  )

  return (
    <div className="rounded-2xl border border-gray-200 bg-white">
      <Result
        status={status === 404 ? '404' : status === 403 ? '403' : 'error'}
        title={
          status === 404
            ? notFoundText
            : status === 403
              ? 'Bu məlumata baxmaq üçün icazəniz yoxdur'
              : 'Məlumatı yükləmək mümkün olmadı'
        }
        subTitle={error?.message}
        extra={
          status === 404 || status === 403 ? (
            backButton
          ) : (
            <div className="flex justify-center gap-2">
              {backButton}
              <Button type="primary" onClick={onRetry}>
                Yenidən yoxla
              </Button>
            </div>
          )
        }
      />
    </div>
  )
}

export default DetailState
