import { useCallback, useEffect, useState } from 'react'

type CollectionApi<TRecord, TCreate> = {
  list: (signal?: AbortSignal) => Promise<TRecord[]>
  create: (record: TCreate) => Promise<TRecord>
}

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'The request failed.'

function readCollection<TRecord>(payload: unknown): TRecord[] {
  if (Array.isArray(payload)) return payload as TRecord[]

  if (payload && typeof payload === 'object') {
    const container = payload as Record<string, unknown>
    for (const key of ['data', 'items', 'results', 'value', '$values']) {
      const nested = container[key]
      if (Array.isArray(nested)) return nested as TRecord[]
      if (nested && typeof nested === 'object') {
        try {
          return readCollection<TRecord>(nested)
        } catch {
          // Try the next common collection wrapper key.
        }
      }
    }
  }

  throw new Error('The API response is not a list. Expected an array or a data/items/results list.')
}

export function useApiCollection<TRecord, TCreate>(
  api: CollectionApi<TRecord, TCreate>,
) {
  const [records, setRecords] = useState<TRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async (signal?: AbortSignal) => {
    try {
      const result = readCollection<TRecord>(await api.list(signal) as unknown)
      if (!signal?.aborted) {
        setRecords(result)
        setError('')
      }
    } catch (requestError) {
      if (!signal?.aborted) setError(errorMessage(requestError))
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }, [api])

  const reload = useCallback(async () => {
    setLoading(true)
    await load()
  }, [load])

  useEffect(() => {
    const controller = new AbortController()
    void Promise.resolve().then(() => load(controller.signal))
    return () => controller.abort()
  }, [load])

  const create = async (record: TCreate) => {
    setError('')
    try {
      const created = await api.create(record)
      if (created === undefined || created === null) {
        await load()
      } else {
        setRecords((current) => [created, ...current])
      }
      return created
    } catch (requestError) {
      setError(errorMessage(requestError))
      throw requestError
    }
  }

  return { records, setRecords, loading, error, reload, create }
}
