import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'
import type { UserRole } from '@/features/auth/auth.types'

const ACCESS_TOKEN = 'thisisjustarandomstring'
const USER_COOKIE = 'authUser'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  companyId: string | null
}

interface AuthSlice {
  user: AuthUser | null
  accessToken: string
  setUser: (user: AuthUser | null) => void
  setAccessToken: (accessToken: string) => void
  resetAccessToken: () => void
  reset: () => void
}

interface AuthState {
  auth: AuthSlice
}

export const useAuthStore = create<AuthState>()((set) => {
  const cookieState = getCookie(ACCESS_TOKEN)
  const initToken = cookieState ? JSON.parse(cookieState) : ''
  
  // Recupera o user do cookie, se existir
  const storedUser = getCookie(USER_COOKIE)
  const initUser = storedUser ? JSON.parse(storedUser) : null

  return {
    auth: {
      user: initUser,
      accessToken: initToken,

      setUser: (user) =>
        set((state) => {
          if (user) {
            setCookie(USER_COOKIE, JSON.stringify(user)) // Salva o usuário no cookie
          } else {
            removeCookie(USER_COOKIE) // Remove o usuário do cookie se for null
          }
          return { ...state, auth: { ...state.auth, user } }
        }),

      setAccessToken: (accessToken) =>
        set((state) => {
          setCookie(ACCESS_TOKEN, JSON.stringify(accessToken)) // Salva o token no cookie
          return { ...state, auth: { ...state.auth, accessToken } }
        }),

      resetAccessToken: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          return { ...state, auth: { ...state.auth, accessToken: '' } }
        }),

      reset: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          removeCookie(USER_COOKIE) // Limpa o cookie do usuário
          return { ...state, auth: { ...state.auth, user: null, accessToken: '' } }
        }),
    },
  }
})