// src/features/applications/applications-store.ts
import { create } from 'zustand'
import { fetchApplications } from '@/services/applications.service'
import type { EmploymentType, WorkModel } from '@/features/jobs/jobs.types'
import type { Task } from '@/features/applications/data/schema'
import type {
  ApplicationStatusApi,
  Application,
  ApplicationsQuery,
  ApplicationsPaginatedData,
} from '@/features/job-application/job-application.types'

// Helpers visuais (mesmos de jobs)
const EMPLOYMENT_LABELS: Record<EmploymentType, string> = {
  CLT: 'CLT',
  PJ: 'PJ',
  FREELANCE: 'Freelancer',
  INTERNSHIP: 'Estágio',
}

const WORK_MODEL_LABELS: Record<WorkModel, string> = {
  REMOTE: '100% Remoto',
  HYBRID: 'Híbrido',
  ON_SITE: 'Presencial',
}

function formatSalary(min?: number | null, max?: number | null): string {
  if (min == null && max == null) return 'A combinar'

  const fmt = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  if (min != null && max != null) return `${fmt(min)} - ${fmt(max)}`
  if (min != null) return `A partir de ${fmt(min)}`
  return `Até ${fmt(max!)}`
}

// Mapeia status da API -> status de UI (etiquetas)
function mapStatus(apiStatus: ApplicationStatusApi): string {
  switch (apiStatus) {
    case 'PENDING':
      return 'candidatado'
    case 'UNDER_REVIEW':
      return 'em_analise'
    case 'INTERVIEW':
      return 'entrevista'
    case 'APPROVED':
      return 'oferta'
    case 'REJECTED':
      return 'reprovado'
    case 'WITHDRAWN':
      return 'cancelado'
    default:
      return apiStatus
  }
}

// Só pra eventualmente mudar cor/prioridade se quiser
function mapPriority(apiStatus: ApplicationStatusApi): string {
  switch (apiStatus) {
    case 'APPROVED':
    case 'INTERVIEW':
      return 'high'
    case 'UNDER_REVIEW':
    case 'PENDING':
      return 'medium'
    case 'REJECTED':
    case 'WITHDRAWN':
      return 'low'
    default:
      return 'medium'
  }
}

// Mapeia Application (API) -> Task (tabela de candidaturas)
export function mapApplicationToTask(app: Application): Task {
  const job = app.job
  const company = job.company

  const salaryRange = formatSalary(job.salaryMin, job.salaryMax)

  return {
    id: app.id,
    title: job.title,
    status: mapStatus(app.status),
    label: 'application',
    priority: mapPriority(app.status),

    company: company?.name,
    companyLogoUrl: company?.logoUrl ?? null,
    location: job.location ?? undefined,
    model: WORK_MODEL_LABELS[job.workModel],
    // 👇 AQUI estava o erro: EMPLOYMENT_LABELS(...) -> EMPLOYMENT_LABELS[...]
    type: EMPLOYMENT_LABELS[job.employmentType],
    level: undefined,
    appliedAt: new Date(app.appliedAt),
    lastUpdate: new Date(app.updatedAt),
    salaryRange,
    source: 'Go Dev',
  }
}

type ApplicationsFilters = {
  status?: ApplicationStatusApi
  jobId?: string
}

type ApplicationsPagination = {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface ApplicationsState {
  items: Task[]
  loading: boolean
  error: string | null

  filters: ApplicationsFilters
  pagination: ApplicationsPagination

  setStatus: (status?: ApplicationStatusApi) => void
  setPage: (page: number) => void
  resetFilters: () => void

  fetchApplications: () => Promise<void>
}

export const useApplicationsStore = create<ApplicationsState>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  filters: {
    status: undefined,
    jobId: undefined,
  },

  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  },

  setStatus: (status) =>
    set((state) => ({
      ...state,
      filters: { ...state.filters, status },
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
        status: undefined,
        jobId: undefined,
      },
      pagination: { ...state.pagination, page: 1 },
    })),

  fetchApplications: async () => {
    const { filters, pagination } = get()

    set({ loading: true, error: null })

    try {
      const query: ApplicationsQuery = {
        page: pagination.page,
        limit: pagination.limit,
        status: filters.status,
        jobId: filters.jobId,
        sortBy: 'appliedAt',
        sortOrder: 'desc',
      }

      const { items, meta }: ApplicationsPaginatedData =
        await fetchApplications(query)

      const mapped = items.map(mapApplicationToTask)

      set((state) => ({
        ...state,
        items: mapped,
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
        error: err?.message ?? 'Erro ao carregar candidaturas',
      })
    }
  },
}))