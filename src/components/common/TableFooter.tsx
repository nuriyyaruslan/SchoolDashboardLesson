import { Pagination } from 'antd'

interface TableFooterProps {
  page: number
  pageSize: number
  total: number
  // "şagird" / "müəllim"
  noun: string
  onChange: (page: number) => void
}

// Dizayndakı "1–6 / 6 şagird göstərilir   Əvvəlki 1 Növbəti" sətri
const TableFooter = ({ page, pageSize, total, noun, onChange }: TableFooterProps) => {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <div className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-gray-500">
        {from}–{to} / {total} {noun} göstərilir
      </p>
      <Pagination
        current={page}
        pageSize={pageSize}
        total={total}
        onChange={onChange}
        showSizeChanger={false}
        itemRender={(_, type, element) => {
          if (type === 'prev') return <span className="px-2">Əvvəlki</span>
          if (type === 'next') return <span className="px-2">Növbəti</span>
          return element
        }}
      />
    </div>
  )
}

export default TableFooter
