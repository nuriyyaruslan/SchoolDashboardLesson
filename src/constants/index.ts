import type { UserRole } from '../types/auth'

export const ROLE_OPTIONS: { label: string; value: UserRole }[] = [
  { label: 'Şagird', value: 'student' },
  { label: 'Müəllim', value: 'teacher' },
]

export const ROLE_LABELS: Record<UserRole, string> = {
  student: 'Şagird',
  teacher: 'Müəllim',
}

// Azərbaycan dilində sıra sayı şəkilçisi rəqəmin son səsinə görə dəyişir
const ORDINAL_SUFFIX: Record<number, string> = {
  1: 'ci', 2: 'ci', 3: 'cü', 4: 'cü', 5: 'ci', 6: 'cı',
  7: 'ci', 8: 'ci', 9: 'cu', 10: 'cu', 11: 'ci',
}

export const formatGrade = (grade: number): string => `${grade}-${ORDINAL_SUFFIX[grade]} sinif`

// API-də sinif string kimi gəlir ("9"), boş və ya qeyri-rəqəm də ola bilər
export const formatGradeValue = (grade: string | null): string => {
  const value = Number(grade)
  return value in ORDINAL_SUFFIX ? formatGrade(value) : grade || '—'
}

export const GRADE_OPTIONS: { label: string; value: number }[] = Array.from(
  { length: 11 },
  (_, i) => ({ label: formatGrade(i + 1), value: i + 1 }),
)

export const ROUTES = {
  login: '/login',
  register: '/register',
  dashboard: '/',
  students: '/students',
  teachers: '/teachers',
  studentDetail: '/students/:studentId',
  teacherDetail: '/teachers/:teacherId',
  profile: '/profile',
} as const

// Detal səhifələrinin konkret linki: /students/4, /teachers/1
export const studentPath = (id: number) => `${ROUTES.students}/${id}`
export const teacherPath = (id: number) => `${ROUTES.teachers}/${id}`

// Siyahılar üçün serverdən bir dəfəyə ala biləcəyimiz maksimum say
export const LIST_PER_PAGE = 100

// Cədvəllərdə bir səhifədə göstərilən sətir sayı
export const TABLE_PAGE_SIZE = 10
