import { useState } from 'react'
import RecordPaymentForm from './RecordPaymentForm'

// Define the structure of a payment
type Payment = {
  id: number
  customer: string
  date: string
  method: 'Cash' | 'UPI'
  amount: number
}

// Sample payment history
const initialPayments: Payment[] = [
  {
    id: 1,
    customer: 'Sri Lakshmi Fruits',
    date: '2026-10-24',
    method: 'Cash',
    amount: 2000,
  },
  {
    id: 2,
    customer: 'Fresh Fruit Centre',
    date: '2026-10-24',
    method: 'UPI',
    amount: 3000,
  },
  {
    id: 3,
    customer: 'Sai Fruit Shop',
    date: '2026-10-23',
    method: 'Cash',
    amount: 1500,
  },
]

// Sample outstanding balances
const initialBalances: Record<string, number> = {
  'Sri Lakshmi Fruits': 8500,
  'Fresh Fruit Centre': 4200,
  'Sai Fruit Shop': 0,
}

// Format amounts as Indian currency
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)

// Get today's date in local time
const getToday = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

// Display dates in a readable format
const formatDate = (date: string) => {
  const [year, month, day] = date.split('-').map(Number)

  return new Date(year, month - 1, day).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const PAGE_SIZE = 5

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>(initialPayments)
  const [balances, setBalances] =
    useState<Record<string, number>>(initialBalances)

  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false)

  // Search and filter values for the table header
  const [search, setSearch] = useState('')
  const [methodFilter, setMethodFilter] = useState('All')
  const [dateFilter, setDateFilter] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  // Calculate today's collection using the actual local date
  const today = getToday()

  const receivedToday = payments
    .filter((payment) => payment.date === today)
    .reduce((total, payment) => total + payment.amount, 0)

  // Calculate the total outstanding amount
  const pendingAmount = Object.values(balances).reduce(
    (total, balance) => total + balance,
    0,
  )

  // Reset pagination when a filter changes
  const resetVisibleCount = () => setVisibleCount(PAGE_SIZE)

  // Apply customer, payment method and date filters
  const filteredPayments = payments.filter((payment) => {
    const matchesCustomer = payment.customer
      .toLowerCase()
      .includes(search.trim().toLowerCase())

    const matchesMethod =
      methodFilter === 'All' || payment.method === methodFilter

    const matchesDate =
      dateFilter === '' || payment.date === dateFilter

    return matchesCustomer && matchesMethod && matchesDate
  })

  // Display the requested number of matching payments
  const visiblePayments = filteredPayments.slice(0, visibleCount)

  // Record a payment and update the customer's balance
  const handleRecordPayment = (payment: {
    customer: string
    amount: number
    method: 'Cash' | 'UPI'
  }) => {
    const currentBalance = balances[payment.customer]

    // Validate before updating the payment history
    if (
      currentBalance === undefined ||
      !Number.isFinite(payment.amount) ||
      payment.amount <= 0 ||
      payment.amount > currentBalance
    ) {
      return
    }

    const newPayment: Payment = {
      id: Date.now(),
      customer: payment.customer,
      date: getToday(),
      method: payment.method,
      amount: payment.amount,
    }

    setPayments((currentPayments) => [
      newPayment,
      ...currentPayments,
    ])

    setBalances((currentBalances) => ({
      ...currentBalances,
      [payment.customer]:
        currentBalances[payment.customer] - payment.amount,
    }))

    setVisibleCount((count) => Math.max(count, PAGE_SIZE))
    setIsPaymentFormOpen(false)
  }

  // Clear all table filters
  const clearFilters = () => {
    setSearch('')
    setMethodFilter('All')
    setDateFilter('')
    setVisibleCount(PAGE_SIZE)
  }

  const hasActiveFilters =
    search.trim() !== '' ||
    methodFilter !== 'All' ||
    dateFilter !== ''

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#173D2B]">
            Payments
          </h1>

          <p className="mt-1 text-gray-500">
            Track customer payments and pending balances.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsPaymentFormOpen(true)}
          className="rounded-2xl bg-[#173D2B] px-6 py-4 font-semibold text-white transition hover:bg-[#24563D]"
        >
          + Record Payment
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="rounded-3xl border border-green-100 bg-green-50 p-6">
          <p className="font-medium text-green-800">
            Payments Received Today
          </p>

          <p className="mt-3 text-3xl font-bold text-[#173D2B]">
            {formatCurrency(receivedToday)}
          </p>

          <p className="mt-3 text-green-700">
            Cash and UPI collections
          </p>
        </div>

        <div className="rounded-3xl border border-amber-100 bg-amber-50 p-6">
          <p className="font-medium text-amber-800">
            Total Pending Amount
          </p>

          <p className="mt-3 text-3xl font-bold text-amber-900">
            {formatCurrency(pendingAmount)}
          </p>

          <p className="mt-3 text-amber-700">
            Amount customers still owe
          </p>
        </div>
      </div>

      {/* Recent payments table */}
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white">
        <div className="p-6">
          <h2 className="text-xl font-bold text-[#173D2B]">
            Recent Payments
          </h2>

          <p className="mt-2 text-gray-500">
            A record of money received from customers.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-500">
              Showing {visiblePayments.length} of {filteredPayments.length}{' '}
              matching payments
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-semibold text-[#173D2B] underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Filters are placed directly under their column headings */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead className="bg-gray-50">
              <tr className="text-sm text-gray-600">
                <th className="px-6 py-4 font-semibold">
                  <div className="space-y-2">
                    <span>Customer</span>

                    <input
                      type="search"
                      value={search}
                      onChange={(event) => {
                        setSearch(event.target.value)
                        resetVisibleCount()
                      }}
                      placeholder="Search customer"
                      aria-label="Search by customer"
                      className="w-full min-w-36 rounded-lg border border-gray-300 bg-white px-3 py-2 font-normal text-gray-900 outline-none focus:border-[#173D2B]"
                    />
                  </div>
                </th>

                <th className="px-6 py-4 font-semibold">
                  <div className="space-y-2">
                    <span>Date</span>

                    <input
                      type="date"
                      value={dateFilter}
                      onChange={(event) => {
                        setDateFilter(event.target.value)
                        resetVisibleCount()
                      }}
                      aria-label="Filter by payment date"
                      className="w-full min-w-36 rounded-lg border border-gray-300 bg-white px-3 py-2 font-normal text-gray-900 outline-none focus:border-[#173D2B]"
                    />
                  </div>
                </th>

                <th className="px-6 py-4 font-semibold">
                  <div className="space-y-2">
                    <span>Method</span>

                    <select
                      value={methodFilter}
                      onChange={(event) => {
                        setMethodFilter(event.target.value)
                        resetVisibleCount()
                      }}
                      aria-label="Filter by payment method"
                      className="w-full min-w-28 rounded-lg border border-gray-300 bg-white px-3 py-2 font-normal text-gray-900 outline-none focus:border-[#173D2B]"
                    >
                      <option value="All">All Methods</option>
                      <option value="Cash">Cash</option>
                      <option value="UPI">UPI</option>
                    </select>
                  </div>
                </th>

                <th className="px-6 py-4 text-right align-top font-semibold">
                  Amount Received
                </th>
              </tr>
            </thead>

            <tbody>
              {visiblePayments.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-6 py-5 font-medium text-gray-900">
                    {payment.customer}
                  </td>

                  <td className="px-6 py-5 text-gray-600">
                    {formatDate(payment.date)}
                  </td>

                  <td className="px-6 py-5">
                    <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
                      {payment.method}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-right font-semibold text-green-700">
                    {formatCurrency(payment.amount)}
                  </td>
                </tr>
              ))}

              {visiblePayments.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No payments found. Try changing your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Load more payments */}
        {visibleCount < filteredPayments.length && (
          <div className="border-t border-gray-100 p-5 text-center">
            <button
              type="button"
              onClick={() =>
                setVisibleCount((count) => count + PAGE_SIZE)
              }
              className="rounded-xl border border-[#173D2B] px-6 py-3 font-semibold text-[#173D2B] transition hover:bg-[#E8F0E8]"
            >
              Load More Payments
            </button>
          </div>
        )}

        {/* Temporary data notice */}
        <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
          <p className="text-sm text-gray-500">
            Sample data is stored temporarily and resets when the page
            is refreshed. Permanent storage will be added during backend
            integration.
          </p>
        </div>
      </div>

      {/* Record payment popup */}
      {isPaymentFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setIsPaymentFormOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-form-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <RecordPaymentForm
              balances={balances}
              onCancel={() => setIsPaymentFormOpen(false)}
              onSubmit={handleRecordPayment}
            />
          </div>
        </div>
      )}
    </div>
  )
}
