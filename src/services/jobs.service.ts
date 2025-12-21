import { http } from '@/config/http'
import type {
  JobsQuery,
  Job,
  JobsPaginatedData,
} from '@/features/jobs/jobs.types'
import type { ApiSuccessResponse } from '@/types/api'

export async function fetchJobs(params: JobsQuery): Promise<JobsPaginatedData> {
  const { data } = await http.get<ApiSuccessResponse<JobsPaginatedData>>('/jobs', {
    params,
  })

  return data.data
}

export async function fetchJobById(id: string): Promise<Job> {
  const { data } = await http.get<ApiSuccessResponse<Job>>(`/jobs/${id}`)
  return data.data
}