import type { ApplicationStatusApi } from '@/features/job-application/job-application.types'
import type { EmploymentType, WorkModel } from '@/features/jobs/jobs.types'

export type DashboardMonthlyApplications = {
  month: number // 1-12
  total: number
}

export type DashboardLastApplication = {
  id: string
  jobTitle: string
  companyName: string | null
  companyLogoUrl: string | null
  location: string | null
  employmentType: EmploymentType | null
  workModel: WorkModel | null
  status: ApplicationStatusApi
  coverLetter: string | null
  appliedAt: string // ISO
  updatedAt: string // ISO
}

export type DashboardApplicationsOverview = {
  kpis: {
    totalActive: number
    underReview: number
    interviews: number
    newMessages: number
  }
  monthlyApplications: DashboardMonthlyApplications[]
  lastApplications: DashboardLastApplication[]
}