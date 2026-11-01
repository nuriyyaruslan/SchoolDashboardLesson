import { Link } from 'react-router-dom'
import { Skeleton } from 'antd'
import UserAvatar from '../common/UserAvatar'
import { ROUTES } from '../../constants'
import type { Teacher } from '../../types/auth'

interface TeacherCardsProps {
  teachers: Teacher[]
  loading: boolean
}

const TeacherCards = ({ teachers, loading }: TeacherCardsProps) => {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Müəllimlər</h2>
        <Link to={ROUTES.teachers} className="text-sm font-semibold">
          Hamısına bax
        </Link>
      </div>

      {loading ? (
        <Skeleton active />
      ) : teachers.length === 0 ? (
        <p className="rounded-2xl border border-gray-200 bg-white py-6 text-center text-sm text-gray-500">
          Hələ müəllim yoxdur
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {teachers.map((teacher) => (
            <div key={teacher.id} className="rounded-2xl border border-gray-200 bg-white p-4">
              <div className="mb-3 flex items-center gap-3">
                <UserAvatar name={teacher.name} />
                <div className="min-w-0 leading-tight">
                  <p className="truncate font-semibold text-gray-900">{teacher.name}</p>
                  <p className="truncate text-[13px] text-gray-500">{teacher.position || 'Vəzifə qeyd olunmayıb'}</p>
                </div>
              </div>
              {teacher.phone && (
                <span className="rounded-full bg-gray-100 px-3 py-1 font-mono text-[13px] text-gray-700">
                  {teacher.phone}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default TeacherCards
