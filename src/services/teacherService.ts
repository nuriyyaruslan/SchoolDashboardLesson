import { http } from './http'
import type { DataResponse, PaginatedResponse } from '../types/api'
import type { Teacher } from '../types/auth'
import type { ListParams, TeacherInput } from '../types/management'

// Bütün sorğular müəllim access tokeni tələb edir
export const teacherService = {
  list: (params?: ListParams) =>
    http.get<PaginatedResponse<Teacher>>('/teachers', { params }).then((res) => res.data),

  get: (id: number) =>
    http.get<DataResponse<Teacher>>(`/teachers/${id}`).then((res) => res.data.data),

  create: (body: TeacherInput) =>
    http.post<DataResponse<Teacher>>('/teachers', body).then((res) => res.data.data),

  // PUT bütün sahələri gözləyir; password göndərilməsə, köhnə şifrə qalır
  update: (id: number, body: TeacherInput) =>
    http.put<DataResponse<Teacher>>(`/teachers/${id}`, body).then((res) => res.data.data),

  remove: (id: number) => http.delete(`/teachers/${id}`),
}
