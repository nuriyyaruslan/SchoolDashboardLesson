import { http } from './http'
import type {
  LoginRequest,
  MeResponse,
  Student,
  StudentLoginResponse,
  StudentRegisterRequest,
  StudentRegisterResponse,
  Teacher,
  TeacherLoginResponse,
  TeacherRegisterRequest,
  TeacherRegisterResponse,
  UserRole,
} from '../types/auth'

export const authService = {
  studentLogin: (body: LoginRequest) =>
    http.post<StudentLoginResponse>('/student/login', body).then((res) => res.data),

  teacherLogin: (body: LoginRequest) =>
    http.post<TeacherLoginResponse>('/teacher/login', body).then((res) => res.data),

  studentRegister: (body: StudentRegisterRequest) =>
    http.post<StudentRegisterResponse>('/student/register', body).then((res) => res.data),

  teacherRegister: (body: TeacherRegisterRequest) =>
    http.post<TeacherRegisterResponse>('/teacher/register', body).then((res) => res.data),

  studentMe: () => http.get<MeResponse<Student>>('/student/me').then((res) => res.data.data),

  teacherMe: () => http.get<MeResponse<Teacher>>('/teacher/me').then((res) => res.data.data),

  logout: (role: UserRole) => http.post(`/${role}/logout`),
}
