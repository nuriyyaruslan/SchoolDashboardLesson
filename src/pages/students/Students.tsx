import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { App, Button, Input, Popconfirm, Select, Table, Tooltip } from 'antd'
import type { TableColumnsType } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import PageHeader from '../../components/common/PageHeader'
import GradeBadge from '../../components/common/GradeBadge'
import TableFooter from '../../components/common/TableFooter'
import ListErrorNotice from '../../components/common/ListErrorNotice'
import StudentFormModal from '../../components/students/StudentFormModal'
import { useResourceList } from '../../hooks/useResourceList'
import { studentService } from '../../services/studentService'
import { LIST_PER_PAGE, TABLE_PAGE_SIZE, formatGradeValue, studentPath } from '../../constants'
import { formatDateTime, includesText, orDash, uniqueSorted } from '../../utils/format'
import { toApiError } from '../../utils/apiError'
import type { Student } from '../../types/auth'

const Students = () => {
  const { message } = App.useApp()
  const [searchParams] = useSearchParams()

  const { items, loading, error, reload } = useResourceList(() =>
    studentService.list({ per_page: LIST_PER_PAGE }),
  )

  // Dashboard-dakı axtarışdan ?q= ilə gələ bilər
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [grade, setGrade] = useState<string>()
  const [city, setCity] = useState<string>()
  const [page, setPage] = useState(1)

  // null — modal bağlıdır, 'new' — yeni şagird, Student — redaktə
  const [editing, setEditing] = useState<Student | 'new' | null>(null)

  // Filtrlər kiçik siyahı üzərində brauzerdə tətbiq olunur (server şəhər və telefon üzrə axtarmır)
  const filtered = useMemo(
    () =>
      items.filter(
        (s) =>
          includesText([s.name, s.email, s.phone], query) &&
          (!grade || s.grade === grade) &&
          (!city || s.city === city),
      ),
    [items, query, grade, city],
  )

  const gradeOptions = useMemo(
    () => uniqueSorted(items.map((s) => s.grade)).map((g) => ({ label: formatGradeValue(g), value: g })),
    [items],
  )
  const cityOptions = useMemo(
    () => uniqueSorted(items.map((s) => s.city)).map((c) => ({ label: c, value: c })),
    [items],
  )

  // Son səhifədəki yeganə sətir silinəndə boş səhifədə qalmayaq — sonuncu dolu səhifəyə keçirik
  const lastPage = Math.max(1, Math.ceil(filtered.length / TABLE_PAGE_SIZE))
  const currentPage = Math.min(page, lastPage)
  const pageItems = filtered.slice((currentPage - 1) * TABLE_PAGE_SIZE, currentPage * TABLE_PAGE_SIZE)

  // Filtr dəyişəndə birinci səhifəyə qayıdırıq
  const withPageReset =
    <T,>(setter: (value: T) => void) =>
    (value: T) => {
      setter(value)
      setPage(1)
    }

  const handleDelete = async (student: Student) => {
    try {
      await studentService.remove(student.id)
      message.success(`${student.name} silindi`)
      reload()
    } catch (err) {
      message.error(toApiError(err).message)
    }
  }

  const columns: TableColumnsType<Student> = [
    { title: 'ID', dataIndex: 'id', render: (id: number) => <span className="text-gray-500">#{id}</span> },
    {
      title: 'Ad, soyad',
      dataIndex: 'name',
      render: (name: string, student) => (
        <Link to={studentPath(student.id)} className="font-semibold text-gray-900 hover:text-brand">
          {name}
        </Link>
      ),
    },
    { title: 'Vaxt', dataIndex: 'time', render: (time: string | null) => <span className="font-mono">{orDash(time)}</span> },
    { title: 'Valideyn', dataIndex: 'parent_name', render: orDash },
    { title: 'Şəhər', dataIndex: 'city', render: orDash },
    { title: 'Telefon', dataIndex: 'phone', render: (phone: string | null) => <span className="font-mono">{orDash(phone)}</span> },
    { title: 'Email', dataIndex: 'email', render: (email: string) => <a href={`mailto:${email}`}>{email}</a> },
    { title: 'Sinif', dataIndex: 'grade', render: (g: string | null) => <GradeBadge grade={g} format="short" /> },
    { title: 'Yaradılıb', dataIndex: 'created_at', render: (value: string) => formatDateTime(value) },
    { title: 'Yenilənib', dataIndex: 'updated_at', render: (value: string) => formatDateTime(value) },
    {
      title: 'Əməliyyatlar',
      key: 'actions',
      fixed: 'right',
      render: (_, student) => (
        <div className="flex gap-1">
          <Tooltip title="Redaktə et">
            <Button type="text" icon={<EditOutlined />} onClick={() => setEditing(student)} />
          </Tooltip>
          <Popconfirm
            title="Şagirdi silmək istəyirsiniz?"
            description={`${student.name} birdəfəlik silinəcək.`}
            okText="Sil"
            cancelText="Ləğv et"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(student)}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        crumb="Şagirdlər"
        title="Bütün şagirdlər"
        count={error ? undefined : items.length}
        extra={
          <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => setEditing('new')}>
            Yeni şagird
          </Button>
        }
      />

      {error ? (
        <ListErrorNotice error={error} onRetry={reload} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="flex flex-col gap-3 p-4 sm:flex-row">
            <Input
              size="large"
              allowClear
              prefix={<SearchOutlined className="text-gray-400" />}
              placeholder="Ad, email və ya telefon"
              value={query}
              onChange={(e) => withPageReset(setQuery)(e.target.value)}
              className="sm:flex-1"
            />
            <Select
              size="large"
              allowClear
              placeholder="Bütün siniflər"
              options={gradeOptions}
              value={grade}
              onChange={withPageReset(setGrade)}
              className="sm:w-44"
            />
            <Select
              size="large"
              allowClear
              placeholder="Bütün şəhərlər"
              options={cityOptions}
              value={city}
              onChange={withPageReset(setCity)}
              className="sm:w-44"
            />
          </div>

          <Table<Student>
            rowKey="id"
            columns={columns}
            dataSource={pageItems}
            loading={loading}
            pagination={false}
            scroll={{ x: 'max-content' }}
            locale={{ emptyText: 'Şagird tapılmadı' }}
          />

          <TableFooter
            page={currentPage}
            pageSize={TABLE_PAGE_SIZE}
            total={filtered.length}
            noun="şagird"
            onChange={setPage}
          />
        </div>
      )}

      <StudentFormModal
        open={editing !== null}
        student={editing === 'new' ? null : editing}
        onClose={() => setEditing(null)}
        onSaved={() => {
          setEditing(null)
          reload()
        }}
      />
    </>
  )
}

export default Students
