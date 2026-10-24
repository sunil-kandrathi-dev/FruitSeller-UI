
import { useState } from 'react'
import AddShopForm from './AddShopForm'

// Step 1: Define the structure of a shop
type Shop = {
  name: string
  owner: string
  phone: string
  balance: number
}

// Step 2: Keep the existing sample shops
const initialShops: Shop[] = [
  {
    name: 'Sri Lakshmi Fruits',
    owner: 'Ramesh',
    phone: '98765 43210',
    balance: 8500,
  },
  {
    name: 'Fresh Fruit Centre',
    owner: 'Suresh',
    phone: '98765 12340',
    balance: 4200,
  },
  {
    name: 'Sai Fruit Shop',
    owner: 'Ravi',
    phone: '98765 67890',
    balance: 0,
  },
]

// Step 3: Customers page
export default function CustomersPage() {
  // Store shops in React state so new shops appear immediately
  const [shops, setShops] = useState<Shop[]>(initialShops)

  // Control whether the Add Shop popup is visible
  const [isFormOpen, setIsFormOpen] = useState(false)

  // Calculate the combined outstanding balance
  const totalBalance = shops.reduce(
    (sum, shop) => sum + shop.balance,
    0,
  )

  // Add a new shop to the list
  const handleAddShop = (newShop: {
    name: string
    owner: string
    phone: string
  }) => {
    // Prevent duplicate shop names, ignoring letter case
    const alreadyExists = shops.some(
      (shop) => shop.name.toLowerCase() === newShop.name.toLowerCase(),
    )

    if (alreadyExists) {
      window.alert('A shop with this name already exists.')
      return
    }

    // New shops start with no outstanding balance
    const shop: Shop = {
      ...newShop,
      phone: `${newShop.phone.slice(0, 5)} ${newShop.phone.slice(5)}`,
      balance: 0,
    }

    // Add the new shop to the top of the table
    setShops((currentShops) => [shop, ...currentShops])

    // Close the popup after saving
    setIsFormOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Step 4: Page heading */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#71806F]">
          YOUR BUSINESS
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#173D2B]">
          Shops
        </h2>
        <p className="mt-2 text-sm text-[#758276]">
          Manage the shops you supply fruit to and check their pending balances.
        </p>
      </section>

      {/* Step 5: Summary cards update automatically */}
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#E4E8DD] bg-white p-5">
          <p className="text-sm text-[#758276]">Total shops</p>
          <p className="mt-3 text-3xl font-bold text-[#173D2B]">
            {shops.length}
          </p>
          <p className="mt-2 text-xs text-[#899388]">
            Shops currently listed
          </p>
        </div>

        <div className="rounded-2xl border border-[#E4E8DD] bg-white p-5">
          <p className="text-sm text-[#758276]">Money shops still owe</p>
          <p className="mt-3 text-3xl font-bold text-[#173D2B]">
            ₹{totalBalance.toLocaleString('en-IN')}
          </p>
          <p className="mt-2 text-xs text-[#899388]">
            Combined outstanding balance
          </p>
        </div>
      </section>

      {/* Step 6: Shops table and Add Shop button */}
      <section className="overflow-hidden rounded-2xl border border-[#E4E8DD] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 p-5 md:p-6">
          <div>
            <h3 className="font-bold text-[#173D2B]">Your shops</h3>
            <p className="mt-1 text-sm text-[#758276]">
              Contact details and remaining amounts.
            </p>
          </div>

          {/* Open the popup when clicked */}
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="rounded-xl bg-[#173D2B] px-4 py-3 text-sm font-semibold text-white hover:bg-[#24563D]"
          >
            + Add shop
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F6F7F2] text-xs uppercase tracking-wide text-[#758276]">
              <tr>
                <th className="px-5 py-4 font-semibold">Shop name</th>
                <th className="px-5 py-4 font-semibold">Owner</th>
                <th className="px-5 py-4 font-semibold">Phone</th>
                <th className="px-5 py-4 font-semibold">Money still owed</th>
                <th className="px-5 py-4 font-semibold">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#EDF0E9]">
              {shops.map((shop) => (
                <tr key={shop.name} className="hover:bg-[#FAFBF7]">
                  <td className="whitespace-nowrap px-5 py-4 font-semibold text-[#27382D]">
                    {shop.name}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-[#758276]">
                    {shop.owner}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-[#758276]">
                    {shop.phone}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 font-semibold text-[#173D2B]">
                    ₹{shop.balance.toLocaleString('en-IN')}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                        shop.balance > 0
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {shop.balance > 0 ? 'Payment pending' : 'All paid'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="border-t border-[#E4E8DD] bg-[#FAFBF7] px-5 py-3 text-xs leading-5 text-[#758276]">
          Shop details are currently stored in page memory and are not saved
          permanently.
        </p>
      </section>

      {/* Step 7: Render the Add Shop popup */}
      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(event) => {
            // Close the popup when the backdrop itself is clicked
            if (event.target === event.currentTarget) {
              setIsFormOpen(false)
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-shop-form-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
          >
            <AddShopForm
              onCancel={() => setIsFormOpen(false)}
              onSubmit={handleAddShop}
            />
          </div>
        </div>
      )}
    </div>
  )
}
