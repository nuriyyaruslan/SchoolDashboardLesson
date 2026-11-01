import type { Dayjs } from 'dayjs'

/* ---------- Request-lər (/students, /teachers CRUD) ---------- */

// PUT/POST-da name və email məcburidir, qalanları null ola bilər
export interface StudentInput {
  name: string
  email: string
  time?: string | null
  parent_name?: string | null
  city?: string | null
  phone?: string | null
  grade?: string | null
  password?: string
}

export interface TeacherInput {
  name: string
  email: string
  position?: string | null
  phone?: string | null
  password?: string
}

export interface ListParams {
  q?: string
  per_page?: number
}

/* ---------- Form dəyərləri ---------- */

export interface StudentFormValues {
  fullName: string
  parentName: string
  city: string
  phone: string
  email: string
  grade: number
  lessonTime: Dayjs
  password?: string
}

export interface TeacherFormValues {
  fullName: string
  position: string
  phone: string
  email: string
  password?: string
}

export interface ChangePasswordFormValues {
  currentPassword: string
  password: string
  confirmPassword: string
}
