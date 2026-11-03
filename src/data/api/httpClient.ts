/** Shared HTTP boundary. Configure VITE_API_BASE_URL when the backend is available. */
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function getErrorMessage(responseBody: string, status: number): string {
  if (!responseBody) return `Request failed (${status})`

  try {
    const body: unknown = JSON.parse(responseBody)
    if (!body || typeof body !== 'object' || Array.isArray(body)) return responseBody

    const problem = body as Record<string, unknown>
    const validationErrors = problem.errors
    if (validationErrors && typeof validationErrors === 'object' && !Array.isArray(validationErrors)) {
      const messages = Object.values(validationErrors)
        .flatMap((value) => Array.isArray(value) ? value : [value])
        .filter((value): value is string => typeof value === 'string' && value.trim() !== '')
      if (messages.length > 0) return messages.join(' ')
    }

    for (const key of ['detail', 'message', 'title']) {
      const message = problem[key]
      if (typeof message === 'string' && message.trim() !== '') return message
    }
  } catch {
    return responseBody
  }

  return responseBody
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL is not configured.')
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  })

  if (!response.ok) {
    const responseBody = await response.text()
    throw new ApiError(getErrorMessage(responseBody, response.status), response.status)
  }

  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}
