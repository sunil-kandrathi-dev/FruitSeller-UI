
import { useState } from 'react'

// Step 1: Define the sale details sent back to DailySalesPage
type AddSaleFormProps = {
  onCancel: () => void
  onSubmit: (sale: {
    shop: string
    fruit: string
    boxes: number
    price: number
    total: number
    date: string
  }) => void
}

export default function AddSaleForm({
  onCancel,
  onSubmit,
}: AddSaleFormProps) {
  // Step 2: Store the values entered in the form
  const [shop, setShop] = useState('')
  const [fruit, setFruit] = useState('')
  const [boxes, setBoxes] = useState('')
  const [price, setPrice] = useState('')
  const [date, setDate] = useState(
    new Date().toLocaleDateString('en-CA'),
  )
  const [error, setError] = useState('')

  // Calculate the total as the user enters quantities and price
  const boxCount = Number(boxes)
  const pricePerBox = Number(price)
  const total =
    boxes !== '' &&
    price !== '' &&
    Number.isInteger(boxCount) &&
    boxCount > 0 &&
    Number.isFinite(pricePerBox) &&
    pricePerBox > 0
      ? boxCount * pricePerBox
      : 0

  // Step 3: Validate and submit the sale
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!shop.trim()) {
      setError('Please enter the shop name.')
      return
    }

    if (!fruit.trim()) {
      setError('Please enter the fruit name.')
      return
    }

    if (!Number.isInteger(boxCount) || boxCount <= 0) {
      setError('Enter a whole number of boxes greater than zero.')
      return
    }

    if (!Number.isFinite(pricePerBox) || pricePerBox <= 0) {
      setError('Enter a price per box greater than zero.')
      return
    }

    if (!date) {
      setError('Please select the delivery date.')
      return
    }

    setError('')

    // Send the valid sale details to the parent page
    onSubmit({
      shop: shop.trim(),
      fruit: fruit.trim(),
      boxes: boxCount,
      price: pricePerBox,
      total: boxCount * pricePerBox,
      date,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Step 4: Form heading */}
      <div>
        <h2
          id="add-sale-form-title"
          className="text-xl font-bold text-[#173D2B]"
        >
          Record Daily Sale
        </h2>
        <p className="mt-1 text-sm text-[#758276]">
          Record a fruit delivery and its selling amount.
        </p>
      </div>

      {/* Step 5: Shop name */}
      <div>
        <label
          htmlFor="sale-shop"
          className="mb-2 block text-sm font-medium text-[#27382D]"
        >
          Shop name
        </label>
        <input
          id="sale-shop"
          type="text"
          value={shop}
          onChange={(event) => {
            setShop(event.target.value)
            setError('')
          }}
          placeholder="Enter shop name"
          maxLength={100}
          required
          className="w-full rounded-xl border border-[#D9DFD3] px-4 py-3 outline-none focus:border-[#173D2B]"
        />
      </div>

      {/* Step 6: Fruit name */}
      <div>
        <label
          htmlFor="sale-fruit"
          className="mb-2 block text-sm font-medium text-[#27382D]"
        >
          Fruit name
        </label>
        <input
          id="sale-fruit"
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

      {/* Step 7: Number of boxes */}
      <div>
        <label
          htmlFor="sale-boxes"
          className="mb-2 block text-sm font-medium text-[#27382D]"
        >
          Boxes delivered
        </label>
        <input
          id="sale-boxes"
          type="number"
          min="1"
          step="1"
          value={boxes}
          onChange={(event) => {
            setBoxes(event.target.value)
            setError('')
          }}
          placeholder="Enter number of boxes"
          required
          className="w-full rounded-xl border border-[#D9DFD3] px-4 py-3 outline-none focus:border-[#173D2B]"
        />
      </div>

      {/* Step 8: Price per box */}
      <div>
        <label
          htmlFor="sale-price"
          className="mb-2 block text-sm font-medium text-[#27382D]"
        >
          Price per box (₹)
        </label>
        <input
          id="sale-price"
          type="number"
          min="0.01"
          step="0.01"
          value={price}
          onChange={(event) => {
            setPrice(event.target.value)
            setError('')
          }}
          placeholder="Enter selling price"
          required
          className="w-full rounded-xl border border-[#D9DFD3] px-4 py-3 outline-none focus:border-[#173D2B]"
        />
      </div>

      {/* Step 9: Display the calculated total */}
      <div className="rounded-xl bg-[#F6F7F2] p-4">
        <p className="text-sm text-[#758276]">Total sale amount</p>
        <p className="mt-1 text-2xl font-bold text-[#173D2B]">
          ₹{total.toLocaleString('en-IN')}
        </p>
        <p className="mt-1 text-xs text-[#758276]">
          Boxes delivered × price per box
        </p>
      </div>

      {/* Step 10: Delivery date */}
      <div>
        <label
          htmlFor="sale-date"
          className="mb-2 block text-sm font-medium text-[#27382D]"
        >
          Delivery date
        </label>
        <input
          id="sale-date"
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

      {/* Step 11: Display validation errors */}
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {/* Step 12: Cancel or save */}
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
          Save Sale
        </button>
      </div>
    </form>
  )
}
