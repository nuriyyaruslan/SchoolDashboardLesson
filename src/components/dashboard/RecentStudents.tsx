import { Link } from 'react-router-dom'
import { Table } from 'antd'
import type { TableColumnsType } from 'antd'
import UserAvatar from '../common/UserAvatar'
import GradeBadge from '../common/GradeBadge'
import { ROUTES } from '../../constants'
import { formatDateTime, orDash } from '../../utils/format'
import type { Student } from '../../types/auth'

const columns: TableColumnsType<Student> = [
  {
    title: 'Şagird',
    dataIndex: 'name',
    render: (_, student) => (
      <div className="flex items-center gap-3">
        <UserAvatar name={student.name} variant="light" size={32} />
        <div className="leading-tight">
          <p className="font-semibold text-gray-900">{student.name}</p>
          <p className="text-[13px] text-gray-500">{student.email}</p>
        </div>
      </div>
    ),
  },
  { title: 'Sinif', dataIndex: 'grade', render: (grade: string | null) => <GradeBadge grade={grade} /> },
  { title: 'Şəhər', dataIndex: 'city', render: orDash },
  { title: 'Telefon', dataIndex: 'phone', render: (phone: string | null) => <span className="font-mono">{orDash(phone)}</span> },
  { title: 'Qeydiyyat', dataIndex: 'created_at', render: (value: string) => formatDateTime(value, ' · ') },
]

interface RecentStudentsProps {
  students: Student[]
  loading: boolean
}

const RecentStudents = ({ students, loading }: RecentStudentsProps) => {
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between px-5 py-4">
        <h2 className="text-lg font-semibold text-gray-900">Son qeydiyyatlar</h2>
        <Link to={ROUTES.students} className="text-sm font-semibold">
          Hamısına bax
        </Link>
      </div>
      <Table<Student>
        rowKey="id"
        columns={columns}
        dataSource={students}
        loading={loading}
        pagination={false}
        scroll={{ x: 'max-content' }}
        locale={{ emptyText: 'Hələ şagird yoxdur' }}
      />
    </section>
  )
}

export default RecentStudents
