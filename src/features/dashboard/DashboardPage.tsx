
import { useEffect, useState } from 'react'
import { dashboardApi } from './api/dashboardApi'
import type { DashboardSummary } from './api/types'
import dashboardContent from './data/dashboardContent.json'

const { quickActions } = dashboardContent
const numberFormat = new Intl.NumberFormat('en-IN')
const currencyFormat = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})
const stockColors = ['bg-red-100', 'bg-lime-100', 'bg-rose-100', 'bg-emerald-100']

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    dashboardApi
      .get(controller.signal)
      .then((data) => {
        setDashboard(data)
        setError('')
      })
      .catch((requestError: unknown) => {
        if (controller.signal.aborted) return
        setError(requestError instanceof Error ? requestError.message : 'Unable to load dashboard data.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [])

  const summaryCards = [
    {
      label: "Today's sales",
      value: dashboard ? currencyFormat.format(dashboard.todaySalesTotal) : '—',
      description: 'Sales recorded today',
      symbol: '↗',
      accent: 'bg-[#E6F3D7]',
    },
    {
      label: 'Boxes distributed',
      value: dashboard ? numberFormat.format(dashboard.todayBoxesDistributed) : '—',
      description: 'Across all customer shops',
      symbol: '▦',
      accent: 'bg-[#FCE8D5]',
    },
    {
      label: 'Collections',
      value: dashboard ? currencyFormat.format(dashboard.todayPaymentCollections) : '—',
      description: 'Payments received today',
      symbol: '₹',
      accent: 'bg-[#DCEBE8]',
    },
    {
      label: 'Outstanding',
      value: dashboard ? currencyFormat.format(dashboard.totalOutstandingBalance) : '—',
      description: 'Pending customer balances',
      symbol: '◷',
      accent: 'bg-[#F5E2E0]',
    },
  ]

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-[#173D2B] p-6 text-white md:p-8">
        <div className="relative z-10 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D7F36A]">
            YOUR BUSINESS AT A GLANCE
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            Every box counts.<br />
            Every rupee matters.
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-6 text-white/70">
            Keep track of your fresh stock, shop deliveries and collections
            from one simple workspace.
          </p>
          <button className="mt-6 rounded-xl bg-[#D7F36A] px-5 py-3 text-sm font-bold text-[#173D2B] transition hover:bg-[#e5ff88]">
            + Record daily sale
          </button>
        </div>
        <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full border-[32px] border-white/5" />
        <div className="pointer-events-none absolute -bottom-28 right-16 h-56 w-56 rounded-full bg-[#D7F36A]/10" />
        <div className="absolute right-8 top-8 hidden text-7xl opacity-80 lg:block" aria-hidden="true">
          🍎
        </div>
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-[#173D2B]">Today's numbers</h2>
            <p className="mt-1 text-sm text-[#758276]">
              A quick look at your daily operations
            </p>
          </div>
          <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#758276] ring-1 ring-[#E4E8DD]">
            {loading ? 'Loading…' : error ? 'Unavailable' : 'Live data'}
          </span>
        </div>

        {error && (
          <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            Could not load dashboard data: {error}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <article
              key={card.label}
              className="rounded-2xl border border-[#E4E8DD] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-[#758276]">{card.label}</p>
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg text-[#173D2B] ${card.accent}`}>
                  {card.symbol}
                </span>
              </div>
              <p className="mt-5 text-3xl font-bold tracking-tight text-[#173D2B]">
                {card.value}
              </p>
              <p className="mt-2 text-xs text-[#899388]">{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-2xl border border-[#E4E8DD] bg-white p-5 md:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-bold text-[#173D2B]">Stock at a glance</h2>
              <p className="mt-1 text-sm text-[#758276]">
                Your current fruit inventory
              </p>
            </div>
            <span className="rounded-lg bg-[#EAF2E3] px-3 py-2 text-xs font-semibold text-[#28563A]">
              {loading ? '…' : `${dashboard?.currentStockByFruit.length ?? 0} fruits`}
            </span>
          </div>

          <div className="mt-5 divide-y divide-[#EDF0E9]">
            {(dashboard?.currentStockByFruit ?? []).map((fruit, index) => (
              <div key={fruit.fruitId} className="flex items-center gap-3 py-4">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stockColors[index % stockColors.length]}`}>
                  <span className="text-xl text-[#28563A]">●</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#27382D]">
                    {fruit.fruitName}
                  </p>
                  <p className="mt-1 text-xs text-[#899388]">Current stock</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#173D2B]">{numberFormat.format(fruit.currentStock)}</p>
                  <p className="text-xs text-[#899388]">boxes</p>
                </div>
              </div>
            ))}
          </div>

          {loading && <p className="mt-5 text-sm text-[#758276]">Loading stock…</p>}
          {!loading && error && (
            <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">
              Stock could not be loaded. Check the API connection above.
            </p>
          )}
          {!loading && !error && dashboard?.currentStockByFruit.length === 0 && (
            <p className="mt-5 text-sm text-[#758276]">No current stock records.</p>
          )}
        </div>

        <div className="rounded-2xl border border-[#E4E8DD] bg-white p-5 md:p-6">
          <h2 className="font-bold text-[#173D2B]">Quick actions</h2>
          <p className="mt-1 text-sm text-[#758276]">
            Common tasks, one click away
          </p>

          <div className="mt-5 space-y-3">
            {quickActions.map((action) => (
              <button
                key={action.title}
                type="button"
                disabled
                title="We'll connect this action in a later step."
                className="flex w-full cursor-not-allowed items-center gap-3 rounded-xl border border-[#E4E8DD] p-4 text-left opacity-80"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF2E3] text-lg font-semibold text-[#28563A]">
                  {action.symbol}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-[#27382D]">
                    {action.title}
                  </span>
                  <span className="mt-1 block text-xs text-[#899388]">
                    {action.description}
                  </span>
                </span>
                <span className="text-[#899388]" aria-hidden="true">→</span>
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-xl bg-[#173D2B] p-4 text-white">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#D7F36A]">
              Business tip
            </p>
            <p className="mt-2 text-sm leading-6 text-white/80">
              Record every purchase and delivery to keep stock and customer
              balances accurate.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
