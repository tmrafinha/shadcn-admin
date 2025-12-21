import { create } from 'zustand'
import { fetchDashboardApplicationsOverview } from '@/services/dashboard.service'
import type { DashboardApplicationsOverview } from '@/features/dashboard/dashboard.types'

interface DashboardApplicationsState {
  overview: DashboardApplicationsOverview | null
  loading: boolean
  error: string | null

  fetchOverview: () => Promise<void>
}

export const useDashboardApplicationsStore = create<DashboardApplicationsState>(
  (set) => ({
    overview: null,
    loading: false,
    error: null,

    fetchOverview: async () => {
      set({ loading: true, error: null })

      try {
        const overview = await fetchDashboardApplicationsOverview()
        set({ overview, loading: false })
      } catch (err: any) {
        set({
          loading: false,
          error:
            err?.message ?? 'Erro ao carregar painel de candidaturas',
        })
      }
    },
  }),
)