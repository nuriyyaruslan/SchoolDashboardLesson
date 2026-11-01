import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants'

interface PageHeaderProps {
  // Breadcrumb-da "İdarə paneli / ..." hissəsindən sonrakı ad
  crumb?: ReactNode
  // Breadcrumb əvəzinə göstərilən kiçik mətn (məs: tarix)
  overline?: string
  title: string
  count?: number
  extra?: ReactNode
}

const PageHeader = ({ crumb, overline, title, count, extra }: PageHeaderProps) => {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="mb-1 text-sm text-gray-500">
          {crumb ? (
            <>
              <Link to={ROUTES.dashboard} className="text-gray-500 hover:text-gray-900">
                İdarə paneli
              </Link>
              {' / '}
              {crumb}
            </>
          ) : (
            overline
          )}
        </p>
        <h1 className="text-[28px] font-bold leading-tight text-gray-900">
          {title}
          {count !== undefined && <span className="ml-2 text-base font-normal text-gray-500">({count})</span>}
        </h1>
      </div>
      {extra}
    </div>
  )
}

export default PageHeader
