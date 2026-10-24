
import { useState } from 'react'

// Step 1: Define the details sent back to FruitStockPage
type AddFruitFormProps = {
  onCancel: () => void
  onSubmit: (fruit: {
    name: string
    variety: string
    boxes: number
  }) => void
}

export default function AddFruitForm({
  onCancel,
  onSubmit,
}: AddFruitFormProps) {
  // Step 2: Store the values entered in the form
  const [name, setName] = useState('')
  const [variety, setVariety] = useState('')
  const [boxes, setBoxes] = useState('')
  const [error, setError] = useState('')

  // Step 3: Validate and submit the fruit details
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const fruitName = name.trim()
    const fruitVariety = variety.trim()
    const boxCount = Number(boxes)

    if (!fruitName) {
      setError('Please enter the fruit name.')
      return
    }

    if (!fruitVariety) {
      setError('Please enter the fruit variety.')
      return
    }

    if (!Number.isInteger(boxCount) || boxCount <= 0) {
      setError('Enter a whole number of boxes greater than zero.')
      return
    }

    setError('')

    // Send valid details to the parent page
    onSubmit({
      name: fruitName,
      variety: fruitVariety,
      boxes: boxCount,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Step 4: Form heading */}
      <div>
        <h2
          id="add-fruit-form-title"
          className="text-xl font-bold text-[#173D2B]"
        >
          Add Fruit
        </h2>
        <p className="mt-1 text-sm text-[#758276]">
          Add a fruit variety and its available box quantity.
        </p>
      </div>

      {/* Step 5: Enter the fruit name */}
      <div>
        <label
          htmlFor="fruit-name"
          className="mb-2 block text-sm font-medium text-[#27382D]"
        >
          Fruit name
        </label>
        <input
          id="fruit-name"
          type="text"
          value={name}
          onChange={(event) => {
            setName(event.target.value)
            setError('')
          }}
          placeholder="Example: Mango"
          maxLength={100}
          required
          className="w-full rounded-xl border border-[#D9DFD3] px-4 py-3 outline-none focus:border-[#173D2B]"
        />
      </div>

      {/* Step 6: Enter the fruit variety */}
      <div>
        <label
          htmlFor="fruit-variety"
          className="mb-2 block text-sm font-medium text-[#27382D]"
        >
          Variety
        </label>
        <input
          id="fruit-variety"
          type="text"
          value={variety}
          onChange={(event) => {
            setVariety(event.target.value)
            setError('')
          }}
          placeholder="Example: Alphonso"
          maxLength={100}
          required
          className="w-full rounded-xl border border-[#D9DFD3] px-4 py-3 outline-none focus:border-[#173D2B]"
        />
      </div>

      {/* Step 7: Enter the available box quantity */}
      <div>
        <label
          htmlFor="fruit-boxes"
          className="mb-2 block text-sm font-medium text-[#27382D]"
        >
          Number of boxes
        </label>
        <input
          id="fruit-boxes"
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

      {/* Step 8: Display validation errors */}
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {/* Step 9: Cancel or save */}
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
          Save Fruit
        </button>
      </div>
    </form>
  )
}
