
import { useState } from 'react'

// Step 1: Define the data and callbacks received from ExpensesPage
type AddExpenseFormProps = {
  onCancel: () => void
  onSubmit: (expense: {
    category: string
    description: string
    date: string
    amount: number
  }) => void
}

// Step 2: List the available expense categories
const expenseCategories = [
  'Transport',
  'Packaging',
  'Loading and unloading',
  'Shop rent',
  'Electricity',
  'Other expenses',
]

export default function AddExpenseForm({
  onCancel,
  onSubmit,
}: AddExpenseFormProps) {
  // Step 3: Store the values entered by the user
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(
    new Date().toLocaleDateString('en-CA'),
  )
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')

  // Step 4: Validate the form and submit the expense
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const expenseAmount = Number(amount)

    if (!category) {
      setError('Please select an expense category.')
      return
    }

    if (!Number.isFinite(expenseAmount) || expenseAmount <= 0) {
      setError('Enter an amount greater than zero.')
      return
    }

    if (!date) {
      setError('Please select the expense date.')
      return
    }

    // Send valid expense details to the parent page
    setError('')

    onSubmit({
      category,
      description: description.trim(),
      date,
      amount: expenseAmount,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Step 5: Form heading */}
      <div>
        <h2
          id="expense-form-title"
          className="text-xl font-bold text-[#173D2B]"
        >
          Add Expense
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Record a business expense.
        </p>
      </div>

      {/* Step 6: Select the expense category */}
      <div>
        <label
          htmlFor="expense-category"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Expense Category
        </label>

        <select
          id="expense-category"
          value={category}
          onChange={(event) => {
            setCategory(event.target.value)
            setError('')
          }}
          required
          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#173D2B]"
        >
          <option value="">Choose a category</option>

          {expenseCategories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* Step 7: Enter the expense amount */}
      <div>
        <label
          htmlFor="expense-amount"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Amount (₹)
        </label>

        <input
          id="expense-amount"
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(event) => {
            setAmount(event.target.value)
            setError('')
          }}
          placeholder="Enter amount"
          required
          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#173D2B]"
        />
      </div>

      {/* Step 8: Select the date of the expense */}
      <div>
        <label
          htmlFor="expense-date"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Expense Date
        </label>

        <input
          id="expense-date"
          type="date"
          value={date}
          max={new Date().toLocaleDateString('en-CA')}
          onChange={(event) => {
            setDate(event.target.value)
            setError('')
          }}
          required
          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#173D2B]"
        />
      </div>

      {/* Step 9: Enter an optional description */}
      <div>
        <label
          htmlFor="expense-description"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Description (Optional)
        </label>

        <textarea
          id="expense-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Example: Vehicle fuel or fruit boxes"
          rows={3}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#173D2B]"
        />
      </div>

      {/* Step 10: Display validation errors */}
      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {/* Step 11: Cancel or submit the form */}
      <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="rounded-xl bg-[#173D2B] px-5 py-3 font-semibold text-white hover:bg-[#24563D]"
        >
          Save Expense
        </button>
      </div>
    </form>
  )
}
