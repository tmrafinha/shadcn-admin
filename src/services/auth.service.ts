// src/services/auth.service.ts
import { http } from '@/config/http'
import type { ApiSuccessResponse } from '@/types/api'
import type {
  LoginPayload,
  LoginResponseData,
  RegisterPayload,
  RegisterResponseData,
} from '@/features/auth/auth.types'

export async function login(
  payload: LoginPayload,
): Promise<LoginResponseData> {
  const { data } = await http.post<ApiSuccessResponse<LoginResponseData>>(
    '/auth/login',
    payload,
  )

  return data.data
}

export async function register(
  payload: RegisterPayload,
): Promise<RegisterResponseData> {
  const { data } = await http.post<ApiSuccessResponse<RegisterResponseData>>(
    '/auth/register',
    payload,
  )

  return data.data
}