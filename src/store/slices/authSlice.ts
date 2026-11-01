import { createAsyncThunk, createSlice, isAnyOf, type PayloadAction } from '@reduxjs/toolkit'
import { authService } from '../../services/authService'
import { tokenStorage } from '../../utils/tokenStorage'
import { toApiError } from '../../utils/apiError'
import type { ApiError } from '../../types/api'
import type {
  AuthUser,
  LoginRequest,
  Student,
  StudentRegisterRequest,
  Teacher,
  TeacherRegisterRequest,
  UserRole,
} from '../../types/auth'

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  // Token varsa istifadəçi daxil olmuş sayılır (user məlumatı sonra /me ilə gələcək)
  isAuthenticated: Boolean(tokenStorage.getAccessToken()),
  loading: false,
  error: null,
}

const clearSession = (state: AuthState) => {
  tokenStorage.clear()
  state.user = null
  state.isAuthenticated = false
  state.error = null
}

/* ---------- Thunk-lar ---------- */

interface LoginArgs {
  role: UserRole
  credentials: LoginRequest
}

export const login = createAsyncThunk<AuthUser, LoginArgs, { rejectValue: ApiError }>(
  'auth/login',
  async ({ role, credentials }, { rejectWithValue }) => {
    try {
      // 1) Login — tokenləri saxlayırıq
      const { access_token, token_type, access_expires_at, refresh_token, refresh_expires_at } =
        role === 'student'
          ? await authService.studentLogin(credentials)
          : await authService.teacherLogin(credentials)
      tokenStorage.save({ access_token, token_type, access_expires_at, refresh_token, refresh_expires_at }, role)

      // 2) Şəxsi məlumatları /me-dən alırıq (Authorization header interceptor-da əlavə olunur)
      if (role === 'student') return { role, data: await authService.studentMe() }
      return { role, data: await authService.teacherMe() }
    } catch (error) {
      // /me alınmasa yarımçıq sessiya qalmasın
      tokenStorage.clear()
      return rejectWithValue(toApiError(error))
    }
  },
)

export const registerStudent = createAsyncThunk<Student, StudentRegisterRequest, { rejectValue: ApiError }>(
  'auth/registerStudent',
  async (body, { rejectWithValue }) => {
    try {
      const response = await authService.studentRegister(body)
      return response.student
    } catch (error) {
      return rejectWithValue(toApiError(error))
    }
  },
)

export const registerTeacher = createAsyncThunk<Teacher, TeacherRegisterRequest, { rejectValue: ApiError }>(
  'auth/registerTeacher',
  async (body, { rejectWithValue }) => {
    try {
      const response = await authService.teacherRegister(body)
      return response.teacher
    } catch (error) {
      return rejectWithValue(toApiError(error))
    }
  },
)

// Səhifə yenilənəndə token qalır, istifadəçi məlumatını /me ilə yenidən alırıq
export const fetchCurrentUser = createAsyncThunk<AuthUser, void, { rejectValue: ApiError }>(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    const role = tokenStorage.getRole()
    try {
      if (role === 'student') return { role, data: await authService.studentMe() }
      if (role === 'teacher') return { role, data: await authService.teacherMe() }
      return rejectWithValue({ status: 401, message: 'Sessiya tapılmadı' })
    } catch (error) {
      return rejectWithValue(toApiError(error))
    }
  },
)

// Serverdə tokeni ləğv edirik; alınmasa belə lokal sessiya bağlanır
export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  const role = tokenStorage.getRole()
  if (!role) return
  try {
    await authService.logout(role)
  } catch {
    // token artıq etibarsız ola bilər — nəzərə almırıq
  }
})

/* ---------- Slice ---------- */

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: clearSession,
    // Profil yenilənəndən sonra store-dakı istifadəçini əvəz edirik
    setUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload
    },
    clearAuthError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload
      })
      // /me alınmadısa sessiya etibarsızdır — yenidən login lazımdır
      .addCase(fetchCurrentUser.rejected, clearSession)
      .addCase(logoutUser.fulfilled, clearSession)
      // Qeydiyyatdan sonra token gəlmir — istifadəçi login səhifəsinə yönləndirilir
      .addMatcher(isAnyOf(registerStudent.fulfilled, registerTeacher.fulfilled), (state) => {
        state.loading = false
      })
      .addMatcher(isAnyOf(login.pending, registerStudent.pending, registerTeacher.pending), (state) => {
        state.loading = true
        state.error = null
      })
      .addMatcher(isAnyOf(login.rejected, registerStudent.rejected, registerTeacher.rejected), (state, action) => {
        state.loading = false
        state.error = action.payload?.message ?? 'Gözlənilməz xəta baş verdi'
      })
  },
})

export const { logout, setUser, clearAuthError } = authSlice.actions
export default authSlice.reducer
