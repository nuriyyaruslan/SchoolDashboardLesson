import { useNavigate } from 'react-router-dom'
import { Alert, Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/dashboard/StatCard'
import RecentStudents from '../../components/dashboard/RecentStudents'
import LessonSchedule from '../../components/dashboard/LessonSchedule'
import TeacherCards from '../../components/dashboard/TeacherCards'
import { useResourceList } from '../../hooks/useResourceList'
import { useAppSelector } from '../../store/hooks'
import { studentService } from '../../services/studentService'
import { teacherService } from '../../services/teacherService'
import { LIST_PER_PAGE, ROUTES, formatGradeValue } from '../../constants'
import { orDash, uniqueSorted } from '../../utils/format'
import type { AuthUser, Student } from '../../types/auth'

const RECENT_COUNT = 5
const TEACHER_CARD_COUNT = 4

const byNewest = (a: Student, b: Student) => b.created_at.localeCompare(a.created_at)

// Müəllim üçün ümumi statistika və siyahılar
const TeacherDashboard = () => {
  const students = useResourceList(() => studentService.list({ per_page: LIST_PER_PAGE }))
  const teachers = useResourceList(() => teacherService.list({ per_page: LIST_PER_PAGE }))

  const gradeCount = uniqueSorted(students.items.map((s) => s.grade)).length
  const cityCount = uniqueSorted(students.items.map((s) => s.city)).length
  const recent = [...students.items].sort(byNewest).slice(0, RECENT_COUNT)
  const error = students.error ?? teachers.error

  return (
    <div className="space-y-6">
      {error && <Alert type="error" showIcon title="Məlumatları yükləmək olmadı" description={error.message} />}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Ümumi şagird" value={students.total} hint="Sistemdə qeydiyyatda" />
        <StatCard label="Ümumi müəllim" value={teachers.total} hint="Aktiv hesablar" />
        <StatCard label="Siniflər" value={gradeCount} hint="Şagirdlərin sinifləri üzrə" />
        <StatCard label="Şəhərlər" value={cityCount} hint="Şagirdlərin yaşadığı" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <RecentStudents students={recent} loading={students.loading} />
        <LessonSchedule students={students.items} loading={students.loading} />
      </div>

      <TeacherCards teachers={teachers.items.slice(0, TEACHER_CARD_COUNT)} loading={teachers.loading} />
    </div>
  )
}

// Şagird siyahılara baxa bilmir — öz dərs məlumatlarını görür
const StudentDashboard = ({ student }: { student: Student }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Sinif" value={formatGradeValue(student.grade)} hint="Oxuduğunuz sinif" />
        <StatCard label="Dərs vaxtı" value={orDash(student.time)} hint="Həftəlik dərs saatınız" />
        <StatCard label="Şəhər" value={orDash(student.city)} hint="Yaşadığınız şəhər" />
        <StatCard label="Valideyn" value={orDash(student.parent_name)} hint="Əlaqə üçün" />
      </div>
      <Alert
        type="info"
        showIcon
        title="Şagird və müəllim siyahıları yalnız müəllim hesabı ilə görünür."
      />
    </div>
  )
}

const Dashboard = () => {
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user) as AuthUser
  const firstName = user.data.name.split(' ')[0]

  const handleSearch = (value: string) => {
    const q = value.trim()
    if (q) navigate(`${ROUTES.students}?q=${encodeURIComponent(q)}`)
  }

  return (
    <>
      <PageHeader
        overline={dayjs().format('D MMMM YYYY, dddd')}
        title={`Salam, ${firstName}`}
        extra={
          user.role === 'teacher' && (
            <Input
              size="large"
              allowClear
              prefix={<SearchOutlined className="text-gray-400" />}
              placeholder="Şagird axtar"
              onPressEnter={(e) => handleSearch(e.currentTarget.value)}
              className="sm:w-80"
            />
          )
        }
      />

      {user.role === 'teacher' ? <TeacherDashboard /> : <StudentDashboard student={user.data} />}
    </>
  )
}

export default Dashboard
