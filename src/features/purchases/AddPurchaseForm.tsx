
import { useState } from 'react'

// Step 1: Define the details sent back to PurchasesPage
type AddPurchaseFormProps = {
  onCancel: () => void
  onSubmit: (purchase: {
    fruit: string
    supplier: string
    boxes: number
    total: number
    date: string
  }) => void
}

export default function AddPurchaseForm({
  onCancel,
  onSubmit,
}: AddPurchaseFormProps) {
  // Step 2: Store the values entered in the form
  const [fruit, setFruit] = useState('')
  const [supplier, setSupplier] = useState('')
  const [boxes, setBoxes] = useState('')
  const [total, setTotal] = useState('')
  const [date, setDate] = useState(
    new Date().toLocaleDateString('en-CA'),
  )
  const [error, setError] = useState('')

  // Step 3: Validate the form before saving
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const boxCount = Number(boxes)
    const purchaseTotal = Number(total)

    if (!fruit.trim()) {
      setError('Please enter the fruit name.')
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

      {/* Step 5: Fruit name */}
      <div>
        <label
          htmlFor="purchase-fruit"
          className="mb-2 block text-sm font-medium text-[#27382D]"
        >
          Fruit name
        </label>
        <input
          id="purchase-fruit"
          type="text"
          value={fruit}
          onChange={(event) => {
            setFruit(event.target.value)
            setError('')
          }}
          placeholder="Example: Mango"
          maxLength={100}
          required
          className="w-full rounded-xl border border-[#D9DFD3] px-4 py-3 outline-none focus:border-[#173D2B]"
        />
      </div>

      {/* Step 6: Supplier name */}
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
          Total cost (₹)
        </label>
        <input
          id="purchase-total"
          type="number"
          min="0.01"
          step="0.01"
          value={total}
          onChange={(event) => {
            setTotal(event.target.value)
            setError('')
          }}
          placeholder="Enter total purchase cost"
          required
          className="w-full rounded-xl border border-[#D9DFD3] px-4 py-3 outline-none focus:border-[#173D2B]"
        />
      </div>

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
