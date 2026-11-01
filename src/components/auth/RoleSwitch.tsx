import { Segmented } from 'antd'
import { ROLE_OPTIONS } from '../../constants'
import type { UserRole } from '../../types/auth'

interface RoleSwitchProps {
  value: UserRole
  onChange: (role: UserRole) => void
  block?: boolean
}

const RoleSwitch = ({ value, onChange, block = false }: RoleSwitchProps) => {
  return (
    <Segmented<UserRole>
      options={ROLE_OPTIONS}
      value={value}
      onChange={onChange}
      block={block}
      size="large"
      className="font-medium"
    />
  )
}

export default RoleSwitch
