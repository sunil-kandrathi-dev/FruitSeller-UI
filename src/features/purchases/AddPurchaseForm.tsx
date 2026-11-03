
import { useState } from 'react'
import type { FruitRecord } from '../fruit-stock/api/types'
import type { SupplierPaymentMethod } from './api/types'

export type { SupplierPaymentMethod } from './api/types'

export type PurchaseFormSubmission = {
  fruit: string
  supplier: string
  boxes: number
  total: number
  date: string
  initialPayment: {
    amount: number
    method: SupplierPaymentMethod
    date: string
    referenceNumber: string
    notes: string
  } | null
}

// Step 1: Define the details sent back to PurchasesPage
type AddPurchaseFormProps = {
  fruits: FruitRecord[]
  fruitsLoading: boolean
  fruitsError: string
  onRetryFruits: () => void
  onCancel: () => void
  onSubmit: (purchase: PurchaseFormSubmission) => void
}

const today = () => new Date().toLocaleDateString('en-CA')

export default function AddPurchaseForm({
  fruits,
  fruitsLoading,
  fruitsError,
  onRetryFruits,
  onCancel,
  onSubmit,
}: AddPurchaseFormProps) {
  // Step 2: Store the values entered in the form
  const [fruit, setFruit] = useState('')
  const [supplier, setSupplier] = useState('')
  const [boxes, setBoxes] = useState('')
  const [total, setTotal] = useState('')
  const [paidNow, setPaidNow] = useState('0')
  const [paymentMethod, setPaymentMethod] = useState<SupplierPaymentMethod>('Cash')
  const [paymentDate, setPaymentDate] = useState(today())
  const [paymentReference, setPaymentReference] = useState('')
  const [paymentNotes, setPaymentNotes] = useState('')
  const [date, setDate] = useState(today())
  const [error, setError] = useState('')
  const fruitNames = [...new Set(fruits.map((item) => item.name.trim()).filter(Boolean))]
  const purchaseTotal = Number(total)
  const paymentAmount = Number(paidNow)
  const canPreviewPayment =
    total !== '' &&
    paidNow !== '' &&
    Number.isFinite(purchaseTotal) &&
    purchaseTotal > 0 &&
    Number.isFinite(paymentAmount) &&
    paymentAmount >= 0 &&
    paymentAmount <= purchaseTotal
  const remainingBalance = canPreviewPayment ? purchaseTotal - paymentAmount : 0
  const paymentStatus =
    paymentAmount === 0
      ? 'Unpaid'
      : paymentAmount === purchaseTotal
        ? 'Paid'
        : 'Partially paid'

  // Step 3: Validate the form before saving
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const boxCount = Number(boxes)

    if (!fruitNames.includes(fruit)) {
      setError('Select a fruit from the fruit list. If it is missing, add it in Fruit Stock first.')
      return
    }

    if (!supplier.trim()) {
      setError('Please enter the supplier name.')
      return
    }

    if (!Number.isInteger(boxCount) || boxCount <= 0) {
      setError('Enter a whole number of boxes greater than zero.')
      return
    }

    if (!Number.isFinite(purchaseTotal) || purchaseTotal <= 0) {
      setError('Enter a purchase cost greater than zero.')
      return
    }

    if (
      !Number.isFinite(paymentAmount) ||
      paymentAmount < 0 ||
      paymentAmount > purchaseTotal
    ) {
      setError('Amount paid now must be between zero and the total purchase cost.')
      return
    }

    if (!date) {
      setError('Please select the purchase date.')
      return
    }

    setError('')

    // Send valid purchase details to the parent page
    onSubmit({
      fruit: fruit.trim(),
      supplier: supplier.trim(),
      boxes: boxCount,
      total: purchaseTotal,
      date,
      initialPayment: paymentAmount > 0
        ? {
            amount: paymentAmount,
            method: paymentMethod,
            date: paymentDate,
            referenceNumber: paymentReference,
            notes: paymentNotes,
          }
        : null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Step 4: Form heading */}
      <div>
        <h2
          id="add-purchase-form-title"
          className="text-xl font-bold text-[#173D2B]"
        >
          Add Purchase
        </h2>
        <p className="mt-1 text-sm text-[#758276]">
          Record a fruit purchase from your supplier.
        </p>
      </div>

      {/* Step 5: Supplier name */}
      <div>
        <label
          htmlFor="purchase-supplier"
          className="mb-2 block text-sm font-medium text-[#27382D]"
        >
          Supplier name
        </label>
        <input
          id="purchase-supplier"
          type="text"
          value={supplier}
          onChange={(event) => {
            setSupplier(event.target.value)
            setError('')
          }}
          placeholder="Enter supplier name"
          maxLength={100}
          required
          className="w-full rounded-xl border border-[#D9DFD3] px-4 py-3 outline-none focus:border-[#173D2B]"
        />
      </div>

      {/* Step 6: Select a fruit already in stock */}
      <div>
        <label
          htmlFor="purchase-fruit"
          className="mb-2 block text-sm font-medium text-[#27382D]"
        >
          Fruit
        </label>
        <select
          id="purchase-fruit"
          value={fruit}
          onChange={(event) => {
            setFruit(event.target.value)
            setError('')
          }}
          required
          disabled={fruitsLoading || Boolean(fruitsError) || fruitNames.length === 0}
          className="w-full rounded-xl border border-[#D9DFD3] bg-white px-4 py-3 outline-none focus:border-[#173D2B] disabled:bg-[#F6F7F2]"
        >
          <option value="">
            {fruitsLoading
              ? 'Loading fruit list…'
              : fruitNames.length > 0
                ? 'Select a fruit'
                : 'No fruits available'}
          </option>
          {fruitNames.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        {fruitsError ? (
          <div className="mt-2 flex items-center justify-between gap-2 text-sm text-red-700">
            <span>Could not load fruit list: {fruitsError}</span>
            <button type="button" onClick={onRetryFruits} className="shrink-0 font-semibold underline">
              Retry
            </button>
          </div>
        ) : !fruitsLoading && fruitNames.length === 0 ? (
          <p className="mt-2 text-sm text-[#758276]">
            Add a fruit in Fruit Stock before recording a purchase.
          </p>
        ) : null}
      </div>

      {/* Step 7: Number of boxes */}
      <div>
        <label
          htmlFor="purchase-boxes"
          className="mb-2 block text-sm font-medium text-[#27382D]"
        >
          Number of boxes
        </label>
        <input
          id="purchase-boxes"
          type="number"
          onWheel={(event) => event.currentTarget.blur()}
          min="1"
          step="1"
          value={boxes}
          onChange={(event) => {
            setBoxes(event.target.value)
            setError('')
          }}
          placeholder="Enter box quantity"
          required
          className="w-full rounded-xl border border-[#D9DFD3] px-4 py-3 outline-none focus:border-[#173D2B]"
        />
      </div>

      {/* Step 8: Total purchase cost */}
      <div>
        <label
          htmlFor="purchase-total"
          className="mb-2 block text-sm font-medium text-[#27382D]"
        >
          Total cost
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#758276]">₹</span>
          <input
            id="purchase-total"
            type="number"
            onWheel={(event) => event.currentTarget.blur()}
            min="0.01"
            step="0.01"
            value={total}
            onChange={(event) => {
              setTotal(event.target.value)
              setError('')
            }}
            placeholder="Enter total purchase cost"
            required
            className="currency-input w-full rounded-xl border border-[#D9DFD3] py-3 pl-9 pr-4 outline-none focus:border-[#173D2B]"
          />
        </div>
      </div>

      <section className="space-y-4 rounded-xl border border-[#E4E8DD] bg-[#FAFBF7] p-4">
        <div>
          <h3 className="font-semibold text-[#173D2B]">Distributor payment</h3>
          <p className="mt-1 text-xs leading-5 text-[#758276]">
            You can pay none, part, or all of the purchase cost.
          </p>
        </div>

        <div>
          <label
            htmlFor="purchase-paid-now"
            className="mb-2 block text-sm font-medium text-[#27382D]"
          >
            Paid now
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#758276]">₹</span>
            <input
              id="purchase-paid-now"
              type="number"
              onWheel={(event) => event.currentTarget.blur()}
              min="0"
              max={purchaseTotal > 0 ? purchaseTotal : undefined}
              step="0.01"
              value={paidNow}
              onChange={(event) => {
                setPaidNow(event.target.value)
                setError('')
              }}
              placeholder="0.00"
              className="currency-input w-full rounded-xl border border-[#D9DFD3] py-3 pl-9 pr-4 outline-none focus:border-[#173D2B]"
            />
          </div>
        </div>

        {paymentAmount > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="purchase-payment-method"
                className="mb-2 block text-sm font-medium text-[#27382D]"
              >
                Payment method
              </label>
              <select
                id="purchase-payment-method"
                value={paymentMethod}
                onChange={(event) => {
                  const value = event.target.value
                  if (value === 'Cash' || value === 'UPI' || value === 'Bank transfer') {
                    setPaymentMethod(value)
                  }
                }}
                className="w-full rounded-xl border border-[#D9DFD3] bg-white px-4 py-3 outline-none focus:border-[#173D2B]"
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Bank transfer">Bank transfer</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="purchase-payment-date"
                className="mb-2 block text-sm font-medium text-[#27382D]"
              >
                Payment date
              </label>
              <input
                id="purchase-payment-date"
                type="date"
                value={paymentDate}
                max={today()}
                onChange={(event) => {
                  setPaymentDate(event.target.value)
                  setError('')
                }}
                required
                className="w-full rounded-xl border border-[#D9DFD3] px-4 py-3 outline-none focus:border-[#173D2B]"
              />
            </div>
          </div>
        )}

        {paymentAmount > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="purchase-payment-reference" className="mb-2 block text-sm font-medium text-[#27382D]">
                Reference number <span className="font-normal text-[#899388]">— optional</span>
              </label>
              <input
                id="purchase-payment-reference"
                type="text"
                maxLength={100}
                value={paymentReference}
                onChange={(event) => setPaymentReference(event.target.value)}
                className="w-full rounded-xl border border-[#D9DFD3] px-4 py-3 outline-none focus:border-[#173D2B]"
              />
            </div>
            <div>
              <label htmlFor="purchase-payment-notes" className="mb-2 block text-sm font-medium text-[#27382D]">
                Notes <span className="font-normal text-[#899388]">— optional</span>
              </label>
              <input
                id="purchase-payment-notes"
                type="text"
                maxLength={500}
                value={paymentNotes}
                onChange={(event) => setPaymentNotes(event.target.value)}
                className="w-full rounded-xl border border-[#D9DFD3] px-4 py-3 outline-none focus:border-[#173D2B]"
              />
            </div>
          </div>
        )}

        {canPreviewPayment && (
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-[#758276]">Remaining balance</dt>
              <dd className="mt-1 font-semibold text-[#173D2B]">
                ₹{remainingBalance.toFixed(2)}
              </dd>
            </div>
            <div>
              <dt className="text-[#758276]">Payment status</dt>
              <dd className="mt-1 font-semibold text-[#173D2B]">{paymentStatus}</dd>
            </div>
          </dl>
        )}

        <p className="rounded-lg bg-[#F6F7F2] p-3 text-xs leading-5 text-[#758276]">
          The initial payment will be recorded against this purchase.
        </p>
      </section>

      {/* Step 9: Purchase date */}
      <div>
        <label
          htmlFor="purchase-date"
          className="mb-2 block text-sm font-medium text-[#27382D]"
        >
          Purchase date
        </label>
        <input
          id="purchase-date"
          type="date"
          value={date}
          max={new Date().toLocaleDateString('en-CA')}
          onChange={(event) => {
            setDate(event.target.value)
            setError('')
          }}
          required
          className="w-full rounded-xl border border-[#D9DFD3] px-4 py-3 outline-none focus:border-[#173D2B]"
        />
      </div>

      {/* Step 10: Display validation errors */}
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {/* Step 11: Cancel or save */}
      <div className="flex justify-end gap-3 border-t border-[#E4E8DD] pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-[#D9DFD3] px-5 py-3 font-semibold text-[#27382D] hover:bg-[#F6F7F2]"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-xl bg-[#173D2B] px-5 py-3 font-semibold text-white hover:bg-[#24563D]"
        >
          Save Purchase
        </button>
      </div>
    </form>
  )
}
