import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { Spin } from 'antd'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchCurrentUser } from '../../store/slices/authSlice'
import { ROUTES } from '../../constants'

// Yalnız daxil olmuş istifadəçilər üçün səhifələr
const ProtectedRoute = () => {
  const dispatch = useAppDispatch()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (isAuthenticated && !user) dispatch(fetchCurrentUser())
  }, [dispatch, isAuthenticated, user])

  if (!isAuthenticated) return <Navigate to={ROUTES.login} replace />

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spin size="large" />
      </div>
    )
  }

  return <Outlet />
}

export default ProtectedRoute
