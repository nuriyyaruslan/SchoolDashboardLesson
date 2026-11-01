import { configureStore } from '@reduxjs/toolkit'
import authReducer, { logout } from './slices/authSlice'
import { setUnauthorizedHandler } from '../services/http'

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Token etibarsız olanda (refresh də alınmadıqda) istifadəçini çıxarırıq
setUnauthorizedHandler(() => {
  if (store.getState().auth.isAuthenticated) store.dispatch(logout())
})
