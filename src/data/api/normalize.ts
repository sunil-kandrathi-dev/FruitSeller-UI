type ApiObject = Record<string, unknown>

export function asApiObject(value: unknown): ApiObject {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Expected an API record object.')
  }
  return value as ApiObject
}

export function readApiValue(record: ApiObject, keys: string[]): unknown {
  for (const key of keys) {
    if (record[key] !== undefined && record[key] !== null) return record[key]
  }

  const normalizedKeys = new Set(keys.map((key) => key.toLowerCase().replace(/[^a-z0-9]/g, '')))
  const matchingKey = Object.keys(record).find((key) =>
    normalizedKeys.has(key.toLowerCase().replace(/[^a-z0-9]/g, '')),
  )
  if (matchingKey) return record[matchingKey]

  return undefined
}

export function readApiString(record: ApiObject, keys: string[]): string {
  const value = readApiValue(record, keys)
  if (typeof value === 'string' && value.trim()) return value
  if (typeof value === 'number') return String(value)
  throw new Error(`API record is missing a required field (${keys.join(' / ')}).`)
}

export function readApiNumber(record: ApiObject, keys: string[]): number {
  const value = readApiValue(record, keys)
  const number = typeof value === 'number' ? value : Number(value)
  if (value !== undefined && value !== '' && Number.isFinite(number)) return number
  throw new Error(`API record is missing a numeric field (${keys.join(' / ')}).`)
}

export function readOptionalApiNumber(record: ApiObject, keys: string[]): number | null {
  const value = readApiValue(record, keys)
  if (value === undefined || value === '') return null
  const number = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(number) ? number : null
}

export function readApiId(record: ApiObject, keys: string[], fallback: string): string {
  const value = readApiValue(record, keys)
  return value === undefined ? fallback : String(value)
}

export function unwrapApiCollection(value: unknown): unknown[] {
  if (Array.isArray(value)) return value
  if (value && typeof value === 'object') {
    const object = value as ApiObject
    for (const key of ['data', 'items', 'results', 'value', '$values']) {
      const nested = object[key]
      if (Array.isArray(nested)) return nested
      if (nested && typeof nested === 'object') {
        try {
          return unwrapApiCollection(nested)
        } catch {
          // Continue checking common wrapper fields.
        }
      }
    }
  }
  throw new Error('The API response is not a list. Expected an array or a data/items/results list.')
}
