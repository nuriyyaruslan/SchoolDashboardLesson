import { Link } from 'react-router-dom'
import { Button, Result } from 'antd'
import { ROUTES } from '../../constants'
import type { ApiError } from '../../types/api'

interface ListErrorNoticeProps {
  error: ApiError
  onRetry: () => void
}

// Siyahı sorğusu alınmayanda göstərilir: 403 — bu hesabın icazəsi yoxdur, qalanı — ümumi xəta
const ListErrorNotice = ({ error, onRetry }: ListErrorNoticeProps) => {
  const forbidden = error.status === 403

  return (
    <div className="rounded-2xl border border-gray-200 bg-white">
      <Result
        status={forbidden ? '403' : 'error'}
        title={forbidden ? 'Bu siyahıya baxmaq üçün icazəniz yoxdur' : 'Siyahını yükləmək mümkün olmadı'}
        subTitle={error.message}
        extra={
          forbidden ? (
            <Link to={ROUTES.profile}>
              <Button type="primary">Profilimə keç</Button>
            </Link>
          ) : (
            <Button type="primary" onClick={onRetry}>
              Yenidən yoxla
            </Button>
          )
        }
      />
    </div>
  )
}

export default ListErrorNotice
