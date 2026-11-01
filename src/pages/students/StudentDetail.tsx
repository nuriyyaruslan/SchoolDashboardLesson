import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { App, Button, Popconfirm } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import PageHeader from '../../components/common/PageHeader'
import ProfileSummaryCard from '../../components/common/ProfileSummaryCard'
import DetailList from '../../components/common/DetailList'
import DetailState from '../../components/common/DetailState'
import GradeBadge from '../../components/common/GradeBadge'
import StudentFormModal from '../../components/students/StudentFormModal'
import { useResource } from '../../hooks/useResource'
import { studentService } from '../../services/studentService'
import { ROUTES } from '../../constants'
import { formatDateTime, orDash } from '../../utils/format'
import { toApiError } from '../../utils/apiError'

const NOT_FOUND = { status: 404, message: 'Belə ID ilə şagird yoxdur.' }

const StudentDetail = () => {
  const { studentId } = useParams()
  const id = Number(studentId)
  const validId = Number.isInteger(id) && id > 0
  const navigate = useNavigate()
  const { message } = App.useApp()

  // Yanlış ID-də (/students/abc) sorğu göndərmirik
  const resource = useResource(() => (validId ? studentService.get(id) : Promise.reject(NOT_FOUND)), id)
  const { reload } = resource
  const student = validId ? resource.data : null
  const loading = validId && resource.loading
  const error = validId ? resource.error : NOT_FOUND

  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!student) return
    setDeleting(true)
    try {
      await studentService.remove(student.id)
      message.success(`${student.name} silindi`)
      navigate(ROUTES.students, { replace: true })
    } catch (err) {
      message.error(toApiError(err).message)
      setDeleting(false)
    }
  }

  const crumb = (
    <>
      <Link to={ROUTES.students} className="text-gray-500 hover:text-gray-900">
        Şagirdlər
      </Link>
      {student && ` / ${student.name}`}
    </>
  )

  return (
    <>
      <PageHeader
        crumb={crumb}
        title={student?.name ?? 'Şagird'}
        extra={
          student && (
            <div className="flex gap-2">
              <Button size="large" icon={<EditOutlined />} onClick={() => setEditing(true)}>
                Redaktə et
              </Button>
              <Popconfirm
                title="Şagirdi silmək istəyirsiniz?"
                description={`${student.name} birdəfəlik silinəcək.`}
                okText="Sil"
                cancelText="Ləğv et"
                okButtonProps={{ danger: true }}
                onConfirm={handleDelete}
              >
                <Button size="large" danger icon={<DeleteOutlined />} loading={deleting}>
                  Sil
                </Button>
              </Popconfirm>
            </div>
          )
        }
      />

      {!student || loading ? (
        <DetailState
          loading={loading}
          error={error}
          backTo={ROUTES.students}
          backLabel="Şagird siyahısına qayıt"
          notFoundText="Şagird tapılmadı"
          onRetry={reload}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
          <ProfileSummaryCard user={{ role: 'student', data: student }} />
          <DetailList
            title="Şagird məlumatları"
            items={[
              { label: 'Ad, soyad', value: student.name },
              { label: 'Valideynin adı', value: orDash(student.parent_name) },
              { label: 'Şəhər', value: orDash(student.city) },
              { label: 'Telefon', value: <span className="font-mono">{orDash(student.phone)}</span> },
              { label: 'Email', value: <a href={`mailto:${student.email}`}>{student.email}</a> },
              { label: 'Sinif', value: <GradeBadge grade={student.grade} /> },
              { label: 'Dərs vaxtı', value: <span className="font-mono">{orDash(student.time)}</span> },
              { label: 'ID', value: `#${student.id}` },
              { label: 'Yaradılıb', value: formatDateTime(student.created_at) },
              { label: 'Yenilənib', value: formatDateTime(student.updated_at) },
            ]}
          />
        </div>
      )}

      <StudentFormModal
        open={editing}
        student={student}
        onClose={() => setEditing(false)}
        onSaved={() => {
          setEditing(false)
          reload()
        }}
      />
    </>
  )
}

export default StudentDetail
