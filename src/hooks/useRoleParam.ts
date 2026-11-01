import { useSearchParams } from 'react-router-dom'
import type { UserRole } from '../types/auth'

const isUserRole = (value: string | null): value is UserRole =>
  value === 'student' || value === 'teacher'

// Seçilmiş rolu URL-də saxlayırıq (?role=teacher), səhifə yenilənəndə itməsin
export const useRoleParam = (): [UserRole, (role: UserRole) => void] => {
  const [searchParams, setSearchParams] = useSearchParams()
  const param = searchParams.get('role')
  const role: UserRole = isUserRole(param) ? param : 'student'

  const setRole = (next: UserRole) => {
    setSearchParams({ role: next }, { replace: true })
  }

  return [role, setRole]
}
