import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  AppstoreOutlined,
  CloseOutlined,
  LogoutOutlined,
  MenuOutlined,
  SolutionOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'
import type { ReactNode } from 'react'
import Logo from '../components/common/Logo'
import UserAvatar from '../components/common/UserAvatar'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { logoutUser } from '../store/slices/authSlice'
import { ROLE_LABELS, ROUTES } from '../constants'

interface NavItem {
  to: string
  label: string
  icon: ReactNode
}

const NAV_ITEMS: NavItem[] = [
  { to: ROUTES.dashboard, label: 'İdarə paneli', icon: <AppstoreOutlined /> },
  { to: ROUTES.students, label: 'Bütün şagirdlər', icon: <TeamOutlined /> },
  { to: ROUTES.teachers, label: 'Bütün müəllimlər', icon: <SolutionOutlined /> },
  { to: ROUTES.profile, label: 'Profil', icon: <UserOutlined /> },
]

const Sidebar = ({ onNavigate }: { onNavigate?: () => void }) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)

  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate(`${ROUTES.login}?role=${user?.role ?? 'student'}`, { replace: true })
  }

  return (
    <div className="flex h-full flex-col px-3 py-5">
      <Logo className="mb-8 px-2 text-gray-900" />

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === ROUTES.dashboard}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] transition-colors ${
                isActive
                  ? 'bg-brand-light font-semibold text-brand'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <span className="text-lg leading-none">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {user && (
        <div className="border-t border-gray-200 pt-4">
          <div className="mb-3 flex items-center gap-3 px-1">
            <UserAvatar name={user.data.name} size={34} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900">{user.data.name}</p>
              <p className="text-xs text-gray-500">{ROLE_LABELS[user.role]}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50"
          >
            <LogoutOutlined />
            Çıxış
          </button>
        </div>
      )}
    </div>
  )
}

const DashboardLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#f3f4f6]">
      {/* Böyük ekranlarda sabit sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 border-r border-gray-200 bg-white lg:block">
        <Sidebar />
      </aside>

      {/* Kiçik ekranlarda açılan menyu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <aside className="relative h-full w-64 bg-white shadow-xl">
            <button
              type="button"
              aria-label="Menyunu bağla"
              onClick={() => setMenuOpen(false)}
              className="absolute right-3 top-5 cursor-pointer p-1 text-gray-500"
            >
              <CloseOutlined />
            </button>
            <Sidebar onNavigate={() => setMenuOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 lg:hidden">
          <Logo className="text-gray-900" />
          <button
            type="button"
            aria-label="Menyunu aç"
            onClick={() => setMenuOpen(true)}
            className="cursor-pointer p-2 text-lg text-gray-700"
          >
            <MenuOutlined />
          </button>
        </header>

        <main className="w-full max-w-[1280px] flex-1 px-4 py-6 sm:px-8 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
