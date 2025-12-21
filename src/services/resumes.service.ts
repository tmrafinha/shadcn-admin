import { http } from '@/config/http'
import {
  ResumesPaginatedData,
  Resume,
} from '@/features/settings/curriculum/resumes.types'
import type { ApiSuccessResponse } from '@/types/api'

export async function fetchResumesPage(
  page = 1,
  limit = 50,
): Promise<ResumesPaginatedData> {
  const { data } = await http.get<ApiSuccessResponse<ResumesPaginatedData>>(
    '/resumes',
    {
      params: { page, limit },
    },
  )

  return data.data
}

export async function fetchResumesList(
  page = 1,
  limit = 50,
): Promise<Resume[]> {
  const { items } = await fetchResumesPage(page, limit)
  return items
}

export async function uploadResume(file: File): Promise<Resume> {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await http.post<ApiSuccessResponse<Resume>>(
    '/resumes',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )

  return data.data
}

export async function deleteResume(id: string): Promise<void> {
  await http.delete(`/resumes/${id}`)
}

export async function getResumeDownloadUrl(id: string): Promise<string> {
  const { data } = await http.get<ApiSuccessResponse<{ url: string }>>(
    `/resumes/${id}/download`,
  )

  return data.data.url
}