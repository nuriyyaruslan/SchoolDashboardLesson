import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { tokenStorage } from '../utils/tokenStorage'
import type { TokenResponse } from '../types/auth'

export const API_BASE_URL = 'https://sheet.washing.az/api'

export const http = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

// Sessiya tam bitəndə (refresh də alınmadıqda) store-dakı logout-u çağırmaq üçün.
// Store-u burada import etmirik ki, dairəvi asılılıq yaranmasın.
let onUnauthorized: () => void = () => {}
export const setUnauthorizedHandler = (handler: () => void) => {
  onUnauthorized = handler
}

// Login/register/refresh sorğularına token əlavə etmirik və 401-də refresh etmirik
const AUTH_URLS = ['/login', '/register', '/refresh']
const isAuthUrl = (url?: string) => AUTH_URLS.some((path) => url?.endsWith(path))

/* ---------- Access tokenin yenilənməsi ---------- */

// Eyni anda bir neçə sorğu refresh istəsə, sorğu yalnız bir dəfə göndərilsin
let refreshPromise: Promise<string> | null = null

const refreshAccessToken = (): Promise<string> => {
  const role = tokenStorage.getRole()
  const refreshToken = tokenStorage.getRefreshToken()
  if (!role || !refreshToken) return Promise.reject(new Error('Refresh token yoxdur'))

  if (!refreshPromise) {
    // Adi axios ilə göndəririk ki, interceptor-lar təkrar işə düşməsin
    refreshPromise = axios
      .post<TokenResponse>(`${API_BASE_URL}/${role}/refresh`, null, {
        headers: { Accept: 'application/json', Authorization: `Bearer ${refreshToken}` },
      })
      .then(({ data }) => {
        tokenStorage.save(data, role)
        return data.access_token
      })
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

/* ---------- Request: Authorization: Bearer <access_token> ---------- */

http.interceptors.request.use(async (config) => {
  if (isAuthUrl(config.url) || config.headers.Authorization) return config

  // Token artıq bitibsə, sorğunu göndərməzdən əvvəl yeniləyirik
  if (tokenStorage.isAccessTokenExpired() && tokenStorage.getRefreshToken()) {
    try {
      await refreshAccessToken()
    } catch {
      // alınmadı — köhnə tokenlə gedir, 401 gələrsə aşağıda sessiya bağlanacaq
    }
  }

  const token = tokenStorage.getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

/* ---------- Response: 401-də bir dəfə refresh edib təkrarlayırıq ---------- */

interface RetryConfig extends InternalAxiosRequestConfig {
  _retried?: boolean
}

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryConfig | undefined

    if (error.response?.status !== 401 || !config || isAuthUrl(config.url)) {
      return Promise.reject(error)
    }

    if (!config._retried && tokenStorage.getRefreshToken()) {
      config._retried = true
      try {
        const token = await refreshAccessToken()
        config.headers.Authorization = `Bearer ${token}`
        return http(config)
      } catch {
        // refresh token da etibarsızdır — aşağıda sessiyanı bağlayırıq
      }
    }

    onUnauthorized()
    return Promise.reject(error)
  },
)
