import type { TokenResponse, UserRole } from '../types/auth'

const KEYS = {
  accessToken: 'access_token',
  accessExpiresAt: 'access_expires_at',
  refreshToken: 'refresh_token',
  role: 'role',
} as const

// localStorage bəzi brauzer rejimlərində xəta ata bilər, ona görə try/catch
const safeGet = (key: string): string | null => {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

const safeSet = (key: string, value: string | undefined) => {
  if (value) localStorage.setItem(key, value)
  else localStorage.removeItem(key)
}

// Token bitməzdən bir az əvvəl yeniləyirik ki, sorğu yolda ikən vaxtı keçməsin
const EXPIRY_MARGIN_MS = 30_000

export const tokenStorage = {
  save(tokens: TokenResponse, role: UserRole) {
    try {
      localStorage.setItem(KEYS.accessToken, tokens.access_token)
      safeSet(KEYS.accessExpiresAt, tokens.access_expires_at)
      // Refresh cavabında yeni refresh token gəlməsə, köhnəsini saxlayırıq
      if (tokens.refresh_token) localStorage.setItem(KEYS.refreshToken, tokens.refresh_token)
      // refresh, me və logout sorğuları rola görə fərqli URL-ə gedir
      localStorage.setItem(KEYS.role, role)
    } catch {
      // saxlamaq mümkün olmadı — sessiya yalnız yaddaşda qalacaq
    }
  },

  getAccessToken: () => safeGet(KEYS.accessToken),
  getRefreshToken: () => safeGet(KEYS.refreshToken),
  getRole: (): UserRole | null => {
    const role = safeGet(KEYS.role)
    return role === 'student' || role === 'teacher' ? role : null
  },

  // Bitmə vaxtı məlum deyilsə, false qaytarırıq — 401 gələndə yenə yeniləyəcəyik
  isAccessTokenExpired: (): boolean => {
    const expiresAt = Date.parse(safeGet(KEYS.accessExpiresAt) ?? '')
    return Number.isFinite(expiresAt) && expiresAt - EXPIRY_MARGIN_MS <= Date.now()
  },

  clear() {
    try {
      Object.values(KEYS).forEach((key) => localStorage.removeItem(key))
    } catch {
      // nəzərə almırıq
    }
  },
}
