import { Skeleton } from 'antd'
import { formatGradeValue } from '../../constants'
import type { Student } from '../../types/auth'

interface LessonScheduleProps {
  students: Student[]
  loading: boolean
}

// Dərs vaxtı olan şagirdlər, saata görə sıralanmış
const LessonSchedule = ({ students, loading }: LessonScheduleProps) => {
  const lessons = students
    .filter((s): s is Student & { time: string } => Boolean(s.time))
    .sort((a, b) => a.time.localeCompare(b.time))

  return (
    <section className="rounded-2xl border border-gray-200 bg-white px-5 py-4">
      <h2 className="mb-2 text-lg font-semibold text-gray-900">Dərs saatları</h2>

      {loading ? (
        <Skeleton active paragraph={{ rows: 5 }} title={false} />
      ) : lessons.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-500">Dərs vaxtı təyin olunmayıb</p>
      ) : (
        <ul className="max-h-[420px] divide-y divide-gray-100 overflow-y-auto">
          {lessons.map((s) => (
            <li key={s.id} className="flex items-center gap-5 py-3">
              <span className="w-12 font-mono font-semibold text-brand">{s.time}</span>
              <div className="min-w-0 leading-tight">
                <p className="truncate font-semibold text-gray-900">{s.name}</p>
                <p className="truncate text-[13px] text-gray-500">
                  {[s.grade && formatGradeValue(s.grade), s.city].filter(Boolean).join(' · ')}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default LessonSchedule
