import type { ReactNode } from 'react'

export interface DetailItem {
  label: string
  value: ReactNode
}

interface DetailListProps {
  title: string
  items: DetailItem[]
  extra?: ReactNode
}

// Detal səhifəsinin sağ tərəfi: bütün sahələr iki sütunda
const DetailList = ({ title, items, extra }: DetailListProps) => {
  return (
    <section className="h-fit rounded-2xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {extra}
      </div>
      <dl className="grid grid-cols-1 gap-x-6 px-6 sm:grid-cols-2">
        {items.map(({ label, value }) => (
          <div key={label} className="border-b border-gray-100 py-4">
            <dt className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
            <dd className="font-medium break-words text-gray-900">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export default DetailList
