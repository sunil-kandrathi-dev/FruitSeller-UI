import { apiRequest } from './httpClient'
import { unwrapApiCollection } from './normalize'

/** Shared CRUD helpers used by feature-specific API modules. */
export function createResource<TRecord, TCreate>(
  endpoint: string,
  normalize: (record: unknown) => TRecord = (record) => record as TRecord,
) {
  return {
    list: async (signal?: AbortSignal) => {
      const payload = await apiRequest<unknown>(endpoint, { signal })
      return unwrapApiCollection(payload).map(normalize)
    },
    create: async (record: TCreate) => {
      const payload = await apiRequest<unknown>(endpoint, {
        method: 'POST',
        body: JSON.stringify(record),
      })
      return payload === undefined ? undefined as TRecord : normalize(payload)
    },
  }
}
