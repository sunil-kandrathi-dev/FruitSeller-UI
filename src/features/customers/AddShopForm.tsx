
import { useState } from 'react'

// Step 1: Define the data that the parent page receives
type AddShopFormProps = {
  onCancel: () => void
  onSubmit: (shop: {
    name: string
    owner: string
    phone: string
  }) => void
}

export default function AddShopForm({
  onCancel,
  onSubmit,
}: AddShopFormProps) {
  // Step 2: Store the values entered in the form
  const [name, setName] = useState('')
  const [owner, setOwner] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')

  // Step 3: Validate and submit the shop details
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const shopName = name.trim()
    const ownerName = owner.trim()
    const phoneNumber = phone.replace(/\s/g, '')

    if (!shopName) {
      setError('Please enter the shop name.')
      return
    }

    if (!ownerName) {
      setError('Please enter the owner name.')
      return
    }

    // Validate a 10-digit Indian mobile number
    if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
      setError('Enter a valid 10-digit Indian mobile number.')
      return
    }

    setError('')

    // Send the valid details to CustomersPage
    onSubmit({
      name: shopName,
      owner: ownerName,
      phone: phoneNumber,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Step 4: Form heading */}
      <div>
        <h2
          id="add-shop-form-title"
          className="text-xl font-bold text-[#173D2B]"
        >
          Add Shop
        </h2>
        <p className="mt-1 text-sm text-[#758276]">
          Enter the details of the shop you supply.
        </p>
      </div>

      {/* Step 5: Shop name */}
      <div>
        <label
          htmlFor="shop-name"
          className="mb-2 block text-sm font-medium text-[#27382D]"
        >
          Shop name
        </label>
        <input
          id="shop-name"
          type="text"
          value={name}
          onChange={(event) => {
            setName(event.target.value)
            setError('')
          }}
          placeholder="Example: Sri Krishna Fruits"
          maxLength={100}
          required
          className="w-full rounded-xl border border-[#D9DFD3] px-4 py-3 outline-none focus:border-[#173D2B]"
        />
      </div>

      {/* Step 6: Owner name */}
      <div>
        <label
          htmlFor="shop-owner"
          className="mb-2 block text-sm font-medium text-[#27382D]"
        >
          Owner name
        </label>
        <input
          id="shop-owner"
          type="text"
          value={owner}
          onChange={(event) => {
            setOwner(event.target.value)
            setError('')
          }}
          placeholder="Enter owner name"
          maxLength={100}
          required
          className="w-full rounded-xl border border-[#D9DFD3] px-4 py-3 outline-none focus:border-[#173D2B]"
        />
      </div>

      {/* Step 7: Contact number */}
      <div>
        <label
          htmlFor="shop-phone"
          className="mb-2 block text-sm font-medium text-[#27382D]"
        >
          Mobile number
        </label>
        <input
          id="shop-phone"
          type="tel"
          inputMode="numeric"
          value={phone}
          onChange={(event) => {
            // Allow digits and spaces while entering the number
            setPhone(event.target.value.replace(/[^\d\s]/g, ''))
            setError('')
          }}
          placeholder="98765 43210"
          maxLength={12}
          required
          className="w-full rounded-xl border border-[#D9DFD3] px-4 py-3 outline-none focus:border-[#173D2B]"
        />
      </div>

      {/* Step 8: Display validation errors */}
      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
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
          Save Shop
        </button>
      </div>
    </form>
  )
}
