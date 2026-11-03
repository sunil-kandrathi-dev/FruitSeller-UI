import { apiRequest } from '../../../data/api/httpClient'
import type { ReportsData } from './types'

export const reportsApi = {
  get: (signal?: AbortSignal) => apiRequest<ReportsData>('/reports', { signal }),
}
