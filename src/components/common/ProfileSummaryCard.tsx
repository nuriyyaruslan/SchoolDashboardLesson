import UserAvatar from './UserAvatar'
import { ROLE_LABELS, formatGradeValue } from '../../constants'
import { formatDateTime, orDash } from '../../utils/format'
import type { AuthUser } from '../../types/auth'

// Profil və detal səhifələrindəki sol kart: avatar, ad, rol və qısa məlumat
const ProfileSummaryCard = ({ user }: { user: AuthUser }) => {
  const { data } = user
  const badge =
    user.role === 'student'
      ? `${ROLE_LABELS.student} · ${formatGradeValue(user.data.grade)}`
      : `${ROLE_LABELS.teacher}${user.data.position ? ` · ${user.data.position}` : ''}`

  const rows: [string, string][] = [
    ['ID', `#${data.id}`],
    ['Telefon', orDash(data.phone)],
    ...(user.role === 'student'
      ? ([
          ['Şəhər', orDash(user.data.city)],
          ['Dərs vaxtı', orDash(user.data.time)],
          ['Valideyn', orDash(user.data.parent_name)],
        ] as [string, string][])
      : ([['Vəzifə', orDash(user.data.position)]] as [string, string][])),
    ['Yaradılıb', formatDateTime(data.created_at)],
    ['Yenilənib', formatDateTime(data.updated_at)],
  ]

  return (
    <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 text-center">
      <div className="mb-3 flex justify-center">
        <UserAvatar name={data.name} size={72} />
      </div>
      <h2 className="text-xl font-semibold text-gray-900">{data.name}</h2>
      <p className="mb-3 text-sm text-gray-500">{data.email}</p>
      <span className="inline-block rounded-full bg-brand-light px-3 py-1 text-[13px] font-semibold text-brand">
        {badge}
      </span>

      <dl className="mt-5 divide-y divide-gray-100 border-t border-gray-100 text-left text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 py-3">
            <dt className="text-gray-500">{label}</dt>
            <dd className="text-right font-medium text-gray-900">{value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  )
}

export default ProfileSummaryCard
