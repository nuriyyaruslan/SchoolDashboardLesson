import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { App, Button, Input, Popconfirm, Table, Tooltip } from 'antd'
import type { TableColumnsType } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import PageHeader from '../../components/common/PageHeader'
import UserAvatar from '../../components/common/UserAvatar'
import TableFooter from '../../components/common/TableFooter'
import ListErrorNotice from '../../components/common/ListErrorNotice'
import TeacherFormModal from '../../components/teachers/TeacherFormModal'
import { useResourceList } from '../../hooks/useResourceList'
import { useAppSelector } from '../../store/hooks'
import { teacherService } from '../../services/teacherService'
import { LIST_PER_PAGE, TABLE_PAGE_SIZE, teacherPath } from '../../constants'
import { formatDateTime, includesText, orDash } from '../../utils/format'
import { toApiError } from '../../utils/apiError'
import type { Teacher } from '../../types/auth'

const Teachers = () => {
  const { message } = App.useApp()
  const user = useAppSelector((state) => state.auth.user)
  const [searchParams] = useSearchParams()

  const { items, loading, error, reload } = useResourceList(() =>
    teacherService.list({ per_page: LIST_PER_PAGE }),
  )

  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<Teacher | 'new' | null>(null)

  const filtered = useMemo(
    () => items.filter((t) => includesText([t.name, t.email, t.phone, t.position], query)),
    [items, query],
  )
  // Son səhifədəki yeganə sətir silinəndə boş səhifədə qalmayaq — sonuncu dolu səhifəyə keçirik
  const lastPage = Math.max(1, Math.ceil(filtered.length / TABLE_PAGE_SIZE))
  const currentPage = Math.min(page, lastPage)
  const pageItems = filtered.slice((currentPage - 1) * TABLE_PAGE_SIZE, currentPage * TABLE_PAGE_SIZE)

  const handleDelete = async (teacher: Teacher) => {
    try {
      await teacherService.remove(teacher.id)
      message.success(`${teacher.name} silindi`)
      reload()
    } catch (err) {
      message.error(toApiError(err).message)
    }
  }

  const columns: TableColumnsType<Teacher> = [
    { title: 'ID', dataIndex: 'id', render: (id: number) => <span className="text-gray-500">#{id}</span> },
    {
      title: 'Ad, soyad',
      dataIndex: 'name',
      render: (name: string, teacher) => (
        <Link to={teacherPath(teacher.id)} className="flex items-center gap-3 font-semibold text-gray-900 hover:text-brand">
          <UserAvatar name={name} size={30} />
          {name}
        </Link>
      ),
    },
    { title: 'Vəzifə', dataIndex: 'position', render: orDash },
    { title: 'Telefon', dataIndex: 'phone', render: (phone: string | null) => <span className="font-mono">{orDash(phone)}</span> },
    { title: 'Email', dataIndex: 'email', render: (email: string) => <a href={`mailto:${email}`}>{email}</a> },
    { title: 'Yaradılıb', dataIndex: 'created_at', render: (value: string) => formatDateTime(value) },
    { title: 'Yenilənib', dataIndex: 'updated_at', render: (value: string) => formatDateTime(value) },
    {
      title: 'Əməliyyatlar',
      key: 'actions',
      fixed: 'right',
      render: (_, teacher) => {
        // Öz hesabını siyahıdan silmək olmaz — bunun üçün Profil səhifəsi var
        const isSelf = teacher.id === user?.data.id
        return (
          <div className="flex gap-1">
            <Tooltip title="Redaktə et">
              <Button type="text" icon={<EditOutlined />} onClick={() => setEditing(teacher)} />
            </Tooltip>
            {isSelf ? (
              <Tooltip title="Öz hesabınızı Profil bölməsindən silə bilərsiniz">
                <Button type="text" danger disabled icon={<DeleteOutlined />} />
              </Tooltip>
            ) : (
              <Popconfirm
                title="Müəllimi silmək istəyirsiniz?"
                description={`${teacher.name} birdəfəlik silinəcək.`}
                okText="Sil"
                cancelText="Ləğv et"
                okButtonProps={{ danger: true }}
                onConfirm={() => handleDelete(teacher)}
              >
                <Button type="text" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <>
      <PageHeader
        crumb="Müəllimlər"
        title="Bütün müəllimlər"
        count={error ? undefined : items.length}
        extra={
          <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => setEditing('new')}>
            Yeni müəllim
          </Button>
        }
      />

      {error ? (
        <ListErrorNotice error={error} onRetry={reload} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="p-4">
            <Input
              size="large"
              allowClear
              prefix={<SearchOutlined className="text-gray-400" />}
              placeholder="Ad, vəzifə, email və ya telefon"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setPage(1)
              }}
            />
          </div>

          <Table<Teacher>
            rowKey="id"
            columns={columns}
            dataSource={pageItems}
            loading={loading}
            pagination={false}
            scroll={{ x: 'max-content' }}
            locale={{ emptyText: 'Müəllim tapılmadı' }}
          />

          <TableFooter
            page={currentPage}
            pageSize={TABLE_PAGE_SIZE}
            total={filtered.length}
            noun="müəllim"
            onChange={setPage}
          />
        </div>
      )}

      <TeacherFormModal
        open={editing !== null}
        teacher={editing === 'new' ? null : editing}
        onClose={() => setEditing(null)}
        onSaved={() => {
          setEditing(null)
          reload()
        }}
      />
    </>
  )
}

export default Teachers
