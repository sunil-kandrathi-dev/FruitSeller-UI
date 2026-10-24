
import { useState } from 'react'

// Step 1: Define the data and functions received from PaymentsPage
type RecordPaymentFormProps = {
  balances: Record<string, number>
  onCancel: () => void
  onSubmit: (payment: {
    customer: string
    amount: number
    method: 'Cash' | 'UPI'
  }) => void
}

// Step 2: Format amounts as Indian currency
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount)

export default function RecordPaymentForm({
  balances,
  onCancel,
  onSubmit,
}: RecordPaymentFormProps) {
  // Step 3: Store the values entered in the form
  const [customer, setCustomer] = useState('')
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState<'Cash' | 'UPI'>('Cash')
  const [error, setError] = useState('')

  // Step 4: Build the customer list from the current balances
  const customers = Object.entries(balances).map(([name, balance]) => ({
    name,
    balance,
  }))

  // Get the currently selected customer's balance
  const selectedCustomer = customers.find(
    (item) => item.name === customer,
  )

  // Step 5: Validate the form before submitting
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const paymentAmount = Number(amount)

    if (!selectedCustomer) {
      setError('Please select a customer.')
      return
    }

    if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
      setError('Enter an amount greater than zero.')
      return
    }

    if (paymentAmount > selectedCustomer.balance) {
      setError('Payment cannot exceed the outstanding balance.')
      return
    }

    // Send the valid payment to PaymentsPage
    setError('')

    onSubmit({
      customer,
      amount: paymentAmount,
      method,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Step 6: Form heading */}
      <div>
        <h2
          id="payment-form-title"
          className="text-xl font-bold text-[#173D2B]"
        >
          Record Payment
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Record money received from a customer.
        </p>
      </div>

      {/* Step 7: Customer selection */}
      <div>
        <label
          htmlFor="payment-customer"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Select Customer
        </label>

        <select
          id="payment-customer"
          value={customer}
          onChange={(event) => {
            setCustomer(event.target.value)
            setAmount('')
            setError('')
          }}
          required
          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#173D2B]"
        >
          <option value="">Choose a customer</option>

          {customers.map((item) => (
            <option
              key={item.name}
              value={item.name}
              disabled={item.balance <= 0}
            >
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {/* Step 8: Show the selected customer's current balance */}
      {selectedCustomer && (
        <div className="rounded-xl bg-amber-50 p-4">
          <p className="text-sm text-amber-800">
            Outstanding balance
          </p>
          <p className="mt-1 text-2xl font-bold text-amber-900">
            {formatCurrency(selectedCustomer.balance)}
          </p>
        </div>
      )}

      {/* Step 9: Enter the amount received */}
      <div>
        <label
          htmlFor="payment-amount"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Amount Received (₹)
        </label>

        <input
          id="payment-amount"
          type="number"
          min="0.01"
          max={selectedCustomer?.balance}
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

        <p className="mt-1 text-xs text-gray-500">
          Partial payments are allowed.
        </p>
      </div>

      {/* Step 10: Choose Cash or UPI */}
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-gray-700">
          Payment Method
        </legend>

        <div className="grid grid-cols-2 gap-3">
          {(['Cash', 'UPI'] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setMethod(option)}
              aria-pressed={method === option}
              className={`rounded-xl border px-4 py-3 font-semibold ${
                method === option
                  ? 'border-[#173D2B] bg-[#E8F0E8] text-[#173D2B]'
                  : 'border-gray-300 text-gray-600'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Step 11: Display validation errors */}
      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {/* Step 12: Cancel or submit the form */}
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
          Save Payment
        </button>
      </div>
    </form>
  )
}
