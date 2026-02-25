import axios from 'axios'
import { useAuthStore } from '@/stores/auth-store'

export const http = axios.create({
  // http://localhost:3000/
  baseURL: 'https://godev-backend.onrender.com/',
  // baseURL: 'http://localhost:3000/',

  withCredentials: true,

  // 🔥 Faz arrays virarem:
  // country=USA&country=Germany
  // em vez de:
  // country[]=USA&country[]=Germany
  paramsSerializer: (params) => {
    const searchParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => {
          if (v !== undefined && v !== null) {
            searchParams.append(key, String(v))
          }
        })
      } else if (value !== undefined && value !== null) {
        searchParams.append(key, String(value))
      }
    })

    return searchParams.toString()
  },
})

http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().auth.accessToken

  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (import.meta.env.DEV) {
      console.error('[API ERROR]', error)
    }
    return Promise.reject(error)
  },
)