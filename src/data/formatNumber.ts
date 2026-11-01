const indianNumberFormat = new Intl.NumberFormat('en-IN')

/** Avoid crashing UI rendering when an API record has a missing numeric field. */
export function formatNumber(value: unknown): string {
  return typeof value === 'number' && Number.isFinite(value)
    ? indianNumberFormat.format(value)
    : '—'
}
