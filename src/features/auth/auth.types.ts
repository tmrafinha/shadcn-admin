export type UserRole = 'CANDIDATE' | 'RECRUITER' | 'COMPANY_ADMIN' | 'ADMIN'

export interface AuthApiUser {
  id: string
  email: string
  name: string
  role: UserRole
  companyId: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponseData {
  user: AuthApiUser
  token: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  role: UserRole
}

export type RegisterResponseData = LoginResponseData