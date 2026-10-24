
import { useState } from 'react'
import AddExpenseForm from './AddExpenseForm'

// Step 1: Define the structure of an expense record
type Expense = {
  id: number
  category: string
  description: string
  date: string
  amount: number
}

// Step 2: Sample expenses for UI development
const initialExpenses: Expense[] = [
  {
    id: 1,
    category: 'Transport',
    description: 'Fruit delivery vehicle',
    date: '24 Oct 2026',
    amount: 500,
  },
  {
    id: 2,
    category: 'Packaging',
    description: 'Fruit boxes and bags',
    date: '24 Oct 2026',
    amount: 350,
  },
  {
    id: 3,
    category: 'Loading and unloading',
    description: 'Market labour charges',
    date: '23 Oct 2026',
    amount: 600,
  },
]

// Step 3: Format amounts as Indian currency
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)

// Step 4: Convert a date to a readable format
const formatDate = (date: string) => {
  if (!date) return ''

  const [year, month, day] = date.split('-')
  return `${day} ${new Date(Number(year), Number(month) - 1).toLocaleString(
    'en-IN',
    { month: 'short' },
  )} ${year}`
}

// Step 5: Main Expenses page
export default function ExpensesPage() {
  // Store expenses and allow new expenses to be added
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses)

  // Control whether the Add Expense popup is visible
  const [isFormOpen, setIsFormOpen] = useState(false)

  // Today's date in YYYY-MM-DD format
  const today = new Date().toLocaleDateString('en-CA')

  // Calculate today's expenses using the actual current date
  const expensesToday = expenses
    .filter((expense) => {
      // Support both the sample date and newly entered dates
      return expense.date === formatDate(today) || expense.date === today
    })
    .reduce((total, expense) => total + expense.amount, 0)

  // Calculate the total of all expenses currently displayed
  const totalExpenses = expenses.reduce(
    (total, expense) => total + expense.amount,
    0,
  )

  // Add the new expense to the top of the list
  const handleAddExpense = (newExpense: {
    category: string
    description: string
    date: string
    amount: number
  }) => {
    const expense: Expense = {
      id: Date.now(),
      category: newExpense.category,
      description: newExpense.description || '-',
      date: formatDate(newExpense.date),
      amount: newExpense.amount,
    }

    setExpenses((currentExpenses) => [expense, ...currentExpenses])
    setIsFormOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Step 6: Page heading and Add Expense button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#173D2B]">Expenses</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your daily business expenses.
          </p>
        </div>

        {/* Open the popup when the button is clicked */}
        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="rounded-xl bg-[#173D2B] px-5 py-3 font-semibold text-white hover:bg-[#24563D]"
        >
          + Add Expense
        </button>
      </div>

      {/* Step 7: Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Today's Expenses</p>
          <p className="mt-2 text-2xl font-bold text-[#173D2B]">
            {formatCurrency(expensesToday)}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Expenses</p>
          <p className="mt-2 text-2xl font-bold text-[#173D2B]">
            {formatCurrency(totalExpenses)}
          </p>
        </div>
      </div>

      {/* Step 8: Recent expenses list */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-5">
          <h2 className="text-lg font-bold text-[#173D2B]">
            Recent Expenses
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Your latest recorded business expenses.
          </p>
        </div>

        {expenses.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No expenses recorded yet. Click + Add Expense to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Description</th>
                  <th className="px-5 py-3 text-right font-medium">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                      {expense.date}
                    </td>
                    <td className="px-5 py-4 font-medium text-gray-800">
                      {expense.category}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {expense.description}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right font-semibold text-[#173D2B]">
                      {formatCurrency(expense.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Step 9: Show the popup only when the button is clicked */}
      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(event) => {
            // Close the popup when the user clicks the backdrop
            if (event.target === event.currentTarget) {
              setIsFormOpen(false)
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="expense-form-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
          >
            <AddExpenseForm
              onCancel={() => setIsFormOpen(false)}
              onSubmit={handleAddExpense}
            />
          </div>
        </div>
      )}

      {/* Step 10: Explain that data is not saved permanently yet */}
      <p className="text-xs text-gray-500">
        Sample data only. New expenses are held in memory and will reset when
        the page is refreshed. Database saving will be added later.
      </p>
    </div>
  )
}
