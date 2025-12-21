import { create } from 'zustand'
import { fetchJobs as fetchJobsService } from '@/services/jobs.service'
import type {
  Job,
  JobsQuery,
  EmploymentType,
  WorkModel,
  SortBy,
  SortOrder,
} from '@/features/jobs/jobs.types'

interface JobsFilters {
  companyId?: string
  search?: string
  employmentType?: EmploymentType
  workModel?: WorkModel
  location?: string
  minSalary?: number
  maxSalary?: number
  sortBy: SortBy
  sortOrder: SortOrder
}

interface JobsPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface JobsState {
  jobs: Job[]
  loading: boolean
  error: string | null

  filters: JobsFilters
  pagination: JobsPagination

  setCompanyId: (companyId?: string) => void
  setFilters: (partial: Partial<Omit<JobsFilters, 'companyId'>>) => void
  setPage: (page: number) => void
  resetFilters: () => void

  fetchJobs: () => Promise<void>
}

export const useJobsStore = create<JobsState>((set, get) => ({
  jobs: [],
  loading: false,
  error: null,

  filters: {
    companyId: undefined,
    search: undefined,
    employmentType: undefined,
    workModel: undefined,
    location: undefined,
    minSalary: undefined,
    maxSalary: undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },

  pagination: {
    page: 1,
    limit: 2,
    total: 0,
    totalPages: 1,
  },

  setCompanyId: (companyId) =>
    set((state) => ({
      ...state,
      filters: { ...state.filters, companyId: companyId || undefined },
      pagination: { ...state.pagination, page: 1 },
    })),

  setFilters: (partial) =>
    set((state) => ({
      ...state,
      filters: { ...state.filters, ...partial },
      pagination: { ...state.pagination, page: 1 },
    })),

  setPage: (page) =>
    set((state) => ({
      ...state,
      pagination: { ...state.pagination, page },
    })),

  resetFilters: () =>
    set((state) => ({
      ...state,
      filters: {
        companyId: undefined,
        search: undefined,
        employmentType: undefined,
        workModel: undefined,
        location: undefined,
        minSalary: undefined,
        maxSalary: undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      },
      pagination: { ...state.pagination, page: 1 },
    })),

  fetchJobs: async () => {
    const { filters, pagination } = get()

    set({ loading: true, error: null })

    try {
      const query: JobsQuery = {
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search,
        employmentType: filters.employmentType,
        workModel: filters.workModel,
        location: filters.location,
        minSalary: filters.minSalary,
        maxSalary: filters.maxSalary,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      }

      if (filters.companyId) query.companyId = filters.companyId

      const { items, meta } = await fetchJobsService(query)

      set((state) => ({
        ...state,
        jobs: items,
        pagination: {
          ...state.pagination,
          page: meta.page,
          limit: meta.limit,
          total: meta.total,
          totalPages: meta.totalPages,
        },
        loading: false,
      }))
    } catch (err: any) {
      set({
        loading: false,
        error: err?.message ?? 'Erro ao carregar vagas',
      })
    }
  },
}))