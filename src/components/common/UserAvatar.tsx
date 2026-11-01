import { getInitials } from '../../utils/format'

interface UserAvatarProps {
  name: string
  // "dark" — müəllim kartları və sidebar, "light" — cədvəl sətirləri
  variant?: 'dark' | 'light'
  size?: number
}

const UserAvatar = ({ name, variant = 'dark', size = 40 }: UserAvatarProps) => {
  const colors = variant === 'dark' ? 'bg-sidebar text-emerald-300' : 'bg-gray-100 text-gray-600'

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${colors}`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {getInitials(name)}
    </span>
  )
}

export default UserAvatar
