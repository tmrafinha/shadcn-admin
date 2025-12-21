import type { PaginationMeta } from '@/features/jobs/jobs.types'

export interface Resume {
  id: string
  userId: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  storageUrl: string
  uploadedAt: string
  deletedAt?: string | null
}

export interface ResumesPaginatedData {
  items: Resume[]
  meta: PaginationMeta
}