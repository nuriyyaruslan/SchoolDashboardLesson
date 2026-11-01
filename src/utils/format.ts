import dayjs from 'dayjs'

// "Aysel Mammadova" -> "AM"
export const getInitials = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toLocaleUpperCase('az'))
    .join('')

// ISO tarix -> "13.10.2026 16:21"
export const formatDateTime = (value: string | null | undefined, separator = ' '): string =>
  value ? dayjs(value).format(`DD.MM.YYYY${separator}HH:mm`) : '—'

// Boş sahələr cədvəldə tire kimi göstərilir
export const orDash = (value: string | null | undefined): string => value || '—'

// Kiçik/böyük hərf fərqi olmadan axtarış
export const includesText = (values: (string | null | undefined)[], query: string): boolean => {
  const q = query.trim().toLocaleLowerCase('az')
  if (!q) return true
  return values.some((value) => value?.toLocaleLowerCase('az').includes(q))
}

// Təkrarsız və sıralanmış dəyərlər (filtr seçimləri üçün)
export const uniqueSorted = (values: (string | null | undefined)[]): string[] =>
  [...new Set(values.filter((value): value is string => Boolean(value)))].sort((a, b) =>
    a.localeCompare(b, 'az', { numeric: true }),
  )
