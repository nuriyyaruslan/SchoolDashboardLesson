import { http } from './http'
import type { DataResponse, PaginatedResponse } from '../types/api'
import type { Student } from '../types/auth'
import type { ListParams, StudentInput } from '../types/management'

// Bütün sorğular müəllim access tokeni tələb edir
export const studentService = {
  list: (params?: ListParams) =>
    http.get<PaginatedResponse<Student>>('/students', { params }).then((res) => res.data),

  get: (id: number) =>
    http.get<DataResponse<Student>>(`/students/${id}`).then((res) => res.data.data),

  create: (body: StudentInput) =>
    http.post<DataResponse<Student>>('/students', body).then((res) => res.data.data),

  // PUT bütün sahələri gözləyir; password göndərilməsə, köhnə şifrə qalır
  update: (id: number, body: StudentInput) =>
    http.put<DataResponse<Student>>(`/students/${id}`, body).then((res) => res.data.data),

  remove: (id: number) => http.delete(`/students/${id}`),
}
