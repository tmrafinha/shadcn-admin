import axios from 'axios'
import { useAuthStore } from '@/stores/auth-store'

export const http = axios.create({
  // http://localhost:3000/
  // baseURL: 'https://godev-backend.onrender.com/',
  baseURL: 'https://godev-backend.onrender.com/',

  withCredentials: true,
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