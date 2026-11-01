import { formatGradeValue } from '../../constants'

interface GradeBadgeProps {
  grade: string | null
  // "short" — yalnız rəqəm (cədvəl), "full" — "9-cu sinif"
  format?: 'short' | 'full'
}

const GradeBadge = ({ grade, format = 'full' }: GradeBadgeProps) => {
  if (!grade) return <span className="text-gray-400">—</span>

  return (
    <span className="inline-flex min-w-7 justify-center rounded-full bg-brand-light px-2.5 py-0.5 text-[13px] font-semibold text-brand">
      {format === 'short' ? grade : formatGradeValue(grade)}
    </span>
  )
}

export default GradeBadge
