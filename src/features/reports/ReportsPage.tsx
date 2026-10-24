import { useMemo, useState } from 'react'

// Sample report data until the backend is connected
const salesData = [
  { date: '2026-10-24', shop: 'Sri Lakshmi Fruits', fruit: 'Pomegranate', boxes: 5, amount: 3000 },
  { date: '2026-10-24', shop: 'Fresh Fruit Centre', fruit: 'Green grapes', boxes: 4, amount: 2000 },
  { date: '2026-10-23', shop: 'Sai Fruit Shop', fruit: 'Apple', boxes: 3, amount: 2100 },
]

const purchaseData = [
  { date: '2026-10-24', fruit: 'Pomegranate', boxes: 25, amount: 12500 },
  { date: '2026-10-23', fruit: 'Green grapes', boxes: 18, amount: 9000 },
  { date: '2026-10-23', fruit: 'Apple', boxes: 12, amount: 8400 },
]

const expenseData = [
  { date: '2026-10-24', category: 'Transportation', amount: 800 },
  { date: '2026-10-23', category: 'Packaging', amount: 500 },
  { date: '2026-10-22', category: 'Other', amount: 300 },
]

const paymentData = [
  { date: '2026-10-24', customer: 'Sri Lakshmi Fruits', method: 'Cash', amount: 2000 },
  { date: '2026-10-24', customer: 'Fresh Fruit Centre', method: 'UPI', amount: 3000 },
  { date: '2026-10-23', customer: 'Sai Fruit Shop', method: 'Cash', amount: 1500 },
]

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount)

const formatDate = (date: string) => {
  const [year, month, day] = date.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const getToday = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

type ReportPeriod = 'today' | '7days' | 'month' | 'all' | 'custom'

export default function ReportsPage() {
  const [period, setPeriod] = useState<ReportPeriod>('month')
  const [startDate, setStartDate] = useState('2026-10-01')
  const [endDate, setEndDate] = useState(getToday())

  // Calculate the selected date range
  const dateRange = useMemo(() => {
    const today = getToday()

    if (period === 'all') {
      return { start: '', end: today }
    }

    if (period === 'custom') {
      return { start: startDate, end: endDate }
    }

    const end = new Date()
    const start = new Date()

    if (period === 'today') {
      // Start and end are today
    } else if (period === '7days') {
      start.setDate(start.getDate() - 6)
    } else {
      start.setDate(1)
    }

    const toLocalDate = (date: Date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    return { start: toLocalDate(start), end: toLocalDate(end) }
  }, [period, startDate, endDate])

  // Filter each report using the selected date range
  const inRange = (date: string) =>
    (!dateRange.start || date >= dateRange.start) &&
    (!dateRange.end || date <= dateRange.end)

  const sales = salesData.filter((item) => inRange(item.date))
  const purchases = purchaseData.filter((item) => inRange(item.date))
  const expenses = expenseData.filter((item) => inRange(item.date))
  const payments = paymentData.filter((item) => inRange(item.date))

  const totalSales = sales.reduce((sum, item) => sum + item.amount, 0)
  const totalPurchaseCost = purchases.reduce((sum, item) => sum + item.amount, 0)
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0)
  const totalPayments = payments.reduce((sum, item) => sum + item.amount, 0)

  // This is not net profit: actual profit needs cost of goods sold and stock adjustments.
  const salesAfterPurchasesAndExpenses =
    totalSales - totalPurchaseCost - totalExpenses

  const totalBoxesSold = sales.reduce((sum, item) => sum + item.boxes, 0)
  const totalBoxesPurchased = purchases.reduce((sum, item) => sum + item.boxes, 0)

  const summaryCards = [
    {
      title: 'Total Sales',
      value: formatCurrency(totalSales),
      description: `${totalBoxesSold} boxes sold`,
      style: 'border-green-100 bg-green-50 text-green-800',
      valueStyle: 'text-[#173D2B]',
    },
    {
      title: 'Purchase Cost',
      value: formatCurrency(totalPurchaseCost),
      description: `${totalBoxesPurchased} boxes purchased`,
      style: 'border-blue-100 bg-blue-50 text-blue-800',
      valueStyle: 'text-blue-900',
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(totalExpenses),
      description: `${expenses.length} expense records`,
      style: 'border-amber-100 bg-amber-50 text-amber-800',
      valueStyle: 'text-amber-900',
    },
    {
      title: 'Payments Received',
      value: formatCurrency(totalPayments),
      description: `${payments.length} payment records`,
      style: 'border-purple-100 bg-purple-50 text-purple-800',
      valueStyle: 'text-purple-900',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <div>
        <h1 className="text-3xl font-bold text-[#173D2B]">Reports</h1>
        <p className="mt-1 text-gray-500">
          Review sales, purchases, expenses, and customer payments.
        </p>
      </div>

      {/* Sample-data notice */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <strong>Preview mode:</strong> These reports use illustrative sample
        data. They are not yet connected to your other pages or database.
      </div>

      {/* Date range filters */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-semibold text-[#173D2B]">Report Period</h2>
            <p className="mt-1 text-sm text-gray-500">
              Select the period you want to review.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {([
              ['today', 'Today'],
              ['7days', 'Last 7 Days'],
              ['month', 'This Month'],
              ['all', 'All Dates'],
              ['custom', 'Custom Range'],
            ] as [ReportPeriod, string][]).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setPeriod(value)}
                className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                  period === value
                    ? 'border-[#173D2B] bg-[#173D2B] text-white'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {period === 'custom' && (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="report-start-date"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                From Date
              </label>
              <input
                id="report-start-date"
                type="date"
                value={startDate}
                max={endDate || undefined}
                onChange={(event) => setStartDate(event.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#173D2B]"
              />
            </div>

            <div>
              <label
                htmlFor="report-end-date"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                To Date
              </label>
              <input
                id="report-end-date"
                type="date"
                value={endDate}
                min={startDate || undefined}
                max={getToday()}
                onChange={(event) => setEndDate(event.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#173D2B]"
              />
            </div>
          </div>
        )}
      </section>

      {/* Summary cards */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <div
            key={card.title}
            className={`rounded-2xl border p-6 ${card.style}`}
          >
            <p className="text-sm font-medium">{card.title}</p>
            <p className={`mt-3 text-2xl font-bold ${card.valueStyle}`}>
              {card.value}
            </p>
            <p className="mt-2 text-sm">{card.description}</p>
          </div>
        ))}
      </section>

      {/* Sales and purchase comparison */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-bold text-[#173D2B]">Sales Report</h2>
          <p className="mt-1 text-sm text-gray-500">
            Sales recorded during the selected period.
          </p>

          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-600">Total sales</span>
              <strong className="text-[#173D2B]">
                {formatCurrency(totalSales)}
              </strong>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-600">Boxes sold</span>
              <strong>{totalBoxesSold}</strong>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-600">Sales transactions</span>
              <strong>{sales.length}</strong>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-bold text-[#173D2B]">Purchase Report</h2>
          <p className="mt-1 text-sm text-gray-500">
            Stock purchases recorded during the selected period.
          </p>

          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-600">Total purchase cost</span>
              <strong className="text-[#173D2B]">
                {formatCurrency(totalPurchaseCost)}
              </strong>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-600">Boxes purchased</span>
              <strong>{totalBoxesPurchased}</strong>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-600">Purchase transactions</span>
              <strong>{purchases.length}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Expense and payment details */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 p-5">
            <h2 className="text-lg font-bold text-[#173D2B]">
              Expense Breakdown
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-sm text-gray-600">
                <tr>
                  <th className="px-5 py-4 font-semibold">Category</th>
                  <th className="px-5 py-4 font-semibold">Date</th>
                  <th className="px-5 py-4 text-right font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense, index) => (
                  <tr
                    key={`${expense.date}-${expense.category}-${index}`}
                    className="border-t border-gray-100"
                  >
                    <td className="px-5 py-4 text-gray-800">
                      {expense.category}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                      {formatDate(expense.date)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right font-medium">
                      {formatCurrency(expense.amount)}
                    </td>
                  </tr>
                ))}

                {expenses.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-5 py-8 text-center text-gray-500">
                      No expenses for this period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 p-5">
            <h2 className="text-lg font-bold text-[#173D2B]">
              Payment Breakdown
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-sm text-gray-600">
                <tr>
                  <th className="px-5 py-4 font-semibold">Method</th>
                  <th className="px-5 py-4 font-semibold">Transactions</th>
                  <th className="px-5 py-4 text-right font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {(['Cash', 'UPI'] as const).map((method) => {
                  const methodPayments = payments.filter(
                    (payment) => payment.method === method,
                  )
                  const methodTotal = methodPayments.reduce(
                    (sum, payment) => sum + payment.amount,
                    0,
                  )

                  return (
                    <tr key={method} className="border-t border-gray-100">
                      <td className="px-5 py-4 font-medium text-gray-800">
                        {method}
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {methodPayments.length}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-right font-medium text-green-700">
                        {formatCurrency(methodTotal)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Financial overview */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-bold text-[#173D2B]">
          Financial Overview
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Sales minus purchases and recorded expenses. This is not accounting
          profit because inventory costs and stock movements are not yet linked.
        </p>

        <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-medium text-gray-700">
            Sales − Purchase Cost − Expenses
          </span>
          <strong
            className={`text-2xl ${
              salesAfterPurchasesAndExpenses >= 0
                ? 'text-[#173D2B]'
                : 'text-red-600'
            }`}
          >
            {formatCurrency(salesAfterPurchasesAndExpenses)}
          </strong>
        </div>
      </section>
    </div>
  )
}
