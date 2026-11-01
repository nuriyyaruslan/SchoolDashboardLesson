import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../../store/hooks'
import { ROUTES } from '../../constants'

// Login/qeydiyyat səhifələri — daxil olmuş istifadəçini panelə yönləndiririk
const GuestRoute = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  return isAuthenticated ? <Navigate to={ROUTES.dashboard} replace /> : <Outlet />
}

export default GuestRoute
