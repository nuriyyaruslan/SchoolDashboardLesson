import type { Dayjs } from 'dayjs'

// erasableSyntaxOnly aktiv olduğu üçün enum əvəzinə union type istifadə edirik
export type UserRole = 'student' | 'teacher'

/* ---------- API modelləri ---------- */

// API-də email və ad xaricindəki sahələr null ola bilər
export interface Student {
  id: number
  name: string
  time: string | null // "HH:mm"
  parent_name: string | null
  city: string | null
  phone: string | null
  email: string
  grade: string | null
  created_at: string
  updated_at: string
}

export interface Teacher {
  id: number
  name: string
  position: string | null
  phone: string | null
  email: string
  created_at: string
  updated_at: string
}

// Hansı rolun daxil olduğunu bilmək üçün discriminated union
export type AuthUser =
  | { role: 'student'; data: Student }
  | { role: 'teacher'; data: Teacher }

/* ---------- Request-lər ---------- */

export interface LoginRequest {
  email: string
  password: string
}

export interface StudentRegisterRequest {
  name: string
  time: string
  parent_name: string
  city: string
  phone: string
  email: string
  grade: string
  password: string
  password_confirmation: string
}

export interface TeacherRegisterRequest {
  name: string
  position: string
  phone: string
  email: string
  password: string
  password_confirmation: string
}

/* ---------- Response-lar ---------- */

// Login və /{role}/refresh cavabı. Access token qısa ömürlüdür,
// bitəndə refresh token ilə yenisi alınır
export interface TokenResponse {
  token_type: 'Bearer'
  access_token: string
  access_expires_at?: string
  refresh_token?: string
  refresh_expires_at?: string
}

export type StudentTokenResponse = TokenResponse

export interface TeacherTokenResponse extends TokenResponse {
  access_expires_at: string
  refresh_token: string
  refresh_expires_at: string
}

export interface StudentLoginResponse extends StudentTokenResponse {
  student: Student
}

export interface TeacherLoginResponse extends TeacherTokenResponse {
  teacher: Teacher
}

// /student/me və /teacher/me cavabı
export interface MeResponse<T> {
  data: T
}

export interface StudentRegisterResponse {
  message: string
  student: Student
}

export interface TeacherRegisterResponse {
  message: string
  teacher: Teacher
}

/* ---------- Form dəyərləri ---------- */

export interface LoginFormValues {
  email: string
  password: string
  remember: boolean
}

interface BaseRegisterFormValues {
  fullName: string
  phone: string
  email: string
  password: string
  confirmPassword: string
}

export interface StudentRegisterFormValues extends BaseRegisterFormValues {
  parentName: string
  city: string
  grade: number
  lessonTime: Dayjs
}

export interface TeacherRegisterFormValues extends BaseRegisterFormValues {
  position: string
}

export type RegisterFormValues = StudentRegisterFormValues | TeacherRegisterFormValues
