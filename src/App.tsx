import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/dashboard/Dashboard'
import Students from './pages/students/Students'
import Teachers from './pages/teachers/Teachers'
import StudentDetail from './pages/students/StudentDetail'
import TeacherDetail from './pages/teachers/TeacherDetail'
import Profile from './pages/profile/Profile'
import DashboardLayout from './layouts/DashboardLayout'
import GuestRoute from './components/routing/GuestRoute'
import ProtectedRoute from './components/routing/ProtectedRoute'
import { ROUTES } from './constants'

function App() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path={ROUTES.login} element={<Login />} />
        <Route path={ROUTES.register} element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path={ROUTES.dashboard} element={<Dashboard />} />
          <Route path={ROUTES.students} element={<Students />} />
          <Route path={ROUTES.teachers} element={<Teachers />} />
          <Route path={ROUTES.studentDetail} element={<StudentDetail />} />
          <Route path={ROUTES.teacherDetail} element={<TeacherDetail />} />
          <Route path={ROUTES.profile} element={<Profile />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.dashboard} replace />} />
    </Routes>
  )
}

export default App;
