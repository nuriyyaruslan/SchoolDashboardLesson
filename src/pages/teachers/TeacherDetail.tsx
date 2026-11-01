import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { App, Button, Popconfirm, Tooltip } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import PageHeader from '../../components/common/PageHeader'
import ProfileSummaryCard from '../../components/common/ProfileSummaryCard'
import DetailList from '../../components/common/DetailList'
import DetailState from '../../components/common/DetailState'
import TeacherFormModal from '../../components/teachers/TeacherFormModal'
import { useResource } from '../../hooks/useResource'
import { useAppSelector } from '../../store/hooks'
import { teacherService } from '../../services/teacherService'
import { ROUTES } from '../../constants'
import { formatDateTime, orDash } from '../../utils/format'
import { toApiError } from '../../utils/apiError'

const NOT_FOUND = { status: 404, message: 'Belə ID ilə müəllim yoxdur.' }

const TeacherDetail = () => {
  const { teacherId } = useParams()
  const id = Number(teacherId)
  const validId = Number.isInteger(id) && id > 0
  const navigate = useNavigate()
  const { message } = App.useApp()
  const currentUser = useAppSelector((state) => state.auth.user)

  // Yanlış ID-də (/teachers/abc) sorğu göndərmirik
  const resource = useResource(() => (validId ? teacherService.get(id) : Promise.reject(NOT_FOUND)), id)
  const { reload } = resource
  const teacher = validId ? resource.data : null
  const loading = validId && resource.loading
  const error = validId ? resource.error : NOT_FOUND

  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Öz hesabını burada silmək olmaz — bunun üçün Profil səhifəsi var
  const isSelf = currentUser?.role === 'teacher' && teacher?.id === currentUser.data.id

  const handleDelete = async () => {
    if (!teacher) return
    setDeleting(true)
    try {
      await teacherService.remove(teacher.id)
      message.success(`${teacher.name} silindi`)
      navigate(ROUTES.teachers, { replace: true })
    } catch (err) {
      message.error(toApiError(err).message)
      setDeleting(false)
    }
  }

  const crumb = (
    <>
      <Link to={ROUTES.teachers} className="text-gray-500 hover:text-gray-900">
        Müəllimlər
      </Link>
      {teacher && ` / ${teacher.name}`}
    </>
  )

  return (
    <>
      <PageHeader
        crumb={crumb}
        title={teacher?.name ?? 'Müəllim'}
        extra={
          teacher && (
            <div className="flex gap-2">
              <Button size="large" icon={<EditOutlined />} onClick={() => setEditing(true)}>
                Redaktə et
              </Button>
              {isSelf ? (
                <Tooltip title="Öz hesabınızı Profil bölməsindən silə bilərsiniz">
                  <Button size="large" danger disabled icon={<DeleteOutlined />}>
                    Sil
                  </Button>
                </Tooltip>
              ) : (
                <Popconfirm
                  title="Müəllimi silmək istəyirsiniz?"
                  description={`${teacher.name} birdəfəlik silinəcək.`}
                  okText="Sil"
                  cancelText="Ləğv et"
                  okButtonProps={{ danger: true }}
                  onConfirm={handleDelete}
                >
                  <Button size="large" danger icon={<DeleteOutlined />} loading={deleting}>
                    Sil
                  </Button>
                </Popconfirm>
              )}
            </div>
          )
        }
      />

      {!teacher || loading ? (
        <DetailState
          loading={loading}
          error={error}
          backTo={ROUTES.teachers}
          backLabel="Müəllim siyahısına qayıt"
          notFoundText="Müəllim tapılmadı"
          onRetry={reload}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
          <ProfileSummaryCard user={{ role: 'teacher', data: teacher }} />
          <DetailList
            title="Müəllim məlumatları"
            items={[
              { label: 'Ad, soyad', value: teacher.name },
              { label: 'Vəzifə', value: orDash(teacher.position) },
              { label: 'Telefon', value: <span className="font-mono">{orDash(teacher.phone)}</span> },
              { label: 'Email', value: <a href={`mailto:${teacher.email}`}>{teacher.email}</a> },
              { label: 'ID', value: `#${teacher.id}` },
              { label: 'Yaradılıb', value: formatDateTime(teacher.created_at) },
              { label: 'Yenilənib', value: formatDateTime(teacher.updated_at) },
            ]}
          />
        </div>
      )}

      <TeacherFormModal
        open={editing}
        teacher={teacher}
        onClose={() => setEditing(false)}
        onSaved={() => {
          setEditing(false)
          reload()
        }}
      />
    </>
  )
}

export default TeacherDetail
