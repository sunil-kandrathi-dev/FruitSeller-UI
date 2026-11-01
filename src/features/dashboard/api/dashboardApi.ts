import { apiRequest } from '../../../data/api/httpClient'
import type { DashboardSummary } from './types'

export const dashboardApi = {
  get: (signal?: AbortSignal) => apiRequest<DashboardSummary>('/dashboard', { signal }),
}
