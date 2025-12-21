// src/services/applications.service.ts
import { http } from '@/config/http'
import type { ApiSuccessResponse } from '@/types/api'
import type {
  Application,
  ApplicationsPaginatedData,
  ApplicationsQuery,
} from '@/features/job-application/job-application.types'

export interface CreateApplicationPayload {
  jobId: string
  resumeId: string
  coverLetter?: string
}

export async function createApplication(
  payload: CreateApplicationPayload,
): Promise<Application> {
  const { data } = await http.post<ApiSuccessResponse<Application>>(
    '/applications',
    payload,
  )

  return data.data
}

export async function fetchApplications(
  params: ApplicationsQuery,
): Promise<ApplicationsPaginatedData> {
  const { data } =
    await http.get<ApiSuccessResponse<ApplicationsPaginatedData>>(
      '/applications',
      {
        params,
      },
    )

  return data.data
}