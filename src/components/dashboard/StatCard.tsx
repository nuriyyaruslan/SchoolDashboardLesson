interface StatCardProps {
  label: string
  value: string | number
  hint: string
}

const StatCard = ({ label, value, hint }: StatCardProps) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 py-5">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="my-2 truncate text-3xl font-semibold text-gray-900">{value}</p>
      <p className="text-[13px] text-gray-500">{hint}</p>
    </div>
  )
}

export default StatCard
