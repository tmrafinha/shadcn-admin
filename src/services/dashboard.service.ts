import { http } from '@/config/http'
import type { ApiSuccessResponse } from '@/types/api'
import type { DashboardApplicationsOverview } from '@/features/dashboard/dashboard.types'

export async function fetchDashboardApplicationsOverview(): Promise<DashboardApplicationsOverview> {
  const { data } =
    await http.get<ApiSuccessResponse<DashboardApplicationsOverview>>(
      '/dashboards/applications/overview',
    )

  return data.data
}