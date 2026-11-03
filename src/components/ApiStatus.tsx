type ApiStatusProps = {
  loading: boolean
  error: string
  onRetry: () => void
}

export default function ApiStatus({ loading, error, onRetry }: ApiStatusProps) {
  if (loading) {
    return <p role="status" className="rounded-xl bg-white p-4 text-sm text-[#758276] ring-1 ring-[#E4E8DD]">Loading data…</p>
  }

  if (error) {
    return (
      <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        <span>Request failed: {error}</span>
        <button type="button" onClick={onRetry} className="font-semibold underline">Try again</button>
      </div>
    )
  }

  return null
}
