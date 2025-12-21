export type EmploymentType = 'CLT' | 'PJ' | 'FREELANCE' | 'INTERNSHIP'
export type WorkModel = 'REMOTE' | 'HYBRID' | 'ON_SITE'

export type SortBy =
  | 'createdAt'
  | 'salaryMin'
  | 'salaryMax'
  | 'applicationsCount'
export type SortOrder = 'asc' | 'desc'

export type CompanySize = 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE'

export interface JobsQuery {
  page: number
  limit: number
  companyId?: string

  search?: string
  employmentType?: EmploymentType
  workModel?: WorkModel
  location?: string

  minSalary?: number
  maxSalary?: number

  sortBy?: SortBy
  sortOrder?: SortOrder
}

export interface Company {
  id: string
  name: string
  website?: string | null
  description?: string | null
  industry?: string | null
  size?: CompanySize | null
  logoUrl?: string | null
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}

export interface Job {
  id: string
  companyId: string
  company: Company
  appliedByCurrentUser?: boolean

  title: string
  slug: string
  description: string

  employmentType: EmploymentType
  workModel: WorkModel
  location?: string | null
  salaryMin?: number | null
  salaryMax?: number | null

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
  deletedAt?: string | null
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface JobsPaginatedData {
  items: Job[]
  meta: PaginationMeta
}