// src/features/applications/applications.types.ts

import type { EmploymentType, WorkModel, CompanySize } from '@/features/jobs/jobs.types'

export type ApplicationStatusApi =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'INTERVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'WITHDRAWN'

export interface ApplicationCompany {
  id: string
  name: string
  website: string | null
  description: string | null
  industry: string | null
  size: CompanySize | null
  logoUrl: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface ApplicationJob {
  id: string
  companyId: string
  title: string
  slug: string
  description: string
  employmentType: EmploymentType
  workModel: WorkModel
  location: string | null
  salaryMin: number | null
  salaryMax: number | null
  techStack: string[]
  responsibilities: string[]
  requirementsMust: string[]
  requirementsNice: string[]
  benefits: string[]
  viewsCount: number
  applicationsCount: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string
  deletedAt: string | null
  company: ApplicationCompany
}

export interface ApplicationCandidate {
  id: string
  email: string
  name: string
  role: string
  companyId: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface ApplicationResume {
  id: string
  userId: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  storageUrl: string
  uploadedAt: string
  deletedAt: string | null
}

export interface Application {
  id: string
  candidateId: string
  jobId: string
  resumeId: string
  status: ApplicationStatusApi
  coverLetter: string | null
  appliedAt: string
  updatedAt: string
  deletedAt: string | null
  job: ApplicationJob
  candidate: ApplicationCandidate
  resume: ApplicationResume
}

export interface ApplicationsQuery {
  page: number
  limit: number
  status?: ApplicationStatusApi
  jobId?: string
  sortBy?: 'appliedAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
}

export interface ApplicationsPaginatedData {
  items: Application[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}