import { http } from '@/config/http'
import type { ApiSuccessResponse } from '@/types/api'
import type { AuthApiUser } from '@/features/auth/auth.types'

export type UpdateUserPayload = {
  name?: string
  password?: string
}

export async function updateUserProfile(
  id: string,
  payload: UpdateUserPayload,
): Promise<AuthApiUser> {
  const { data } = await http.put<ApiSuccessResponse<AuthApiUser>>(
    `/users/${id}`,
    payload,
  )

  return data.data
}

export async function updateMyProfile(payload: UpdateUserPayload) {
  const { data } = await http.put<ApiSuccessResponse<AuthApiUser>>(
    '/users/me',
    payload,
  )
  return data.data
}