import { useState } from 'react'
import AddPurchaseForm from './AddPurchaseForm'

// Step 1: Define the structure of a purchase record
type Purchase = {
  fruit: string
  supplier: string
  boxes: number
  total: number
  date: string
}

// Step 2: Keep the existing sample purchases
const initialPurchases: Purchase[] = [
  {
    fruit: 'Pomegranate',
    supplier: 'Sample Supplier A',
    boxes: 25,
    total: 12500,
    date: '24 Oct 2026',
  },
  {
    fruit: 'Green grapes',
    supplier: 'Sample Supplier B',
    boxes: 18,
    total: 9000,
    date: '23 Oct 2026',
  },
  {
    fruit: 'Apple',
    supplier: 'Sample Supplier A',
    boxes: 12,
    total: 8400,
    date: '23 Oct 2026',
  },
]

// Step 3: Format a date for display
const formatDate = (date: string) => {
  const [year, month, day] = date.split('-')

  return `${day} ${new Date(
    Number(year),
    Number(month) - 1,
  ).toLocaleString('en-IN', { month: 'short' })} ${year}`
}

// Step 4: Purchases page
export default function PurchasesPage() {
  // Store purchases so new records appear immediately
  const [purchases, setPurchases] =
    useState<Purchase[]>(initialPurchases)

  // Control whether the Add Purchase popup is visible
  const [isFormOpen, setIsFormOpen] = useState(false)

  // Calculate the total number of boxes purchased
  const totalBoxes = purchases.reduce(
    (sum, purchase) => sum + purchase.boxes,
    0,
  )

  // Calculate the total cost of all purchases
  const totalCost = purchases.reduce(
    (sum, purchase) => sum + purchase.total,
    0,
  )

  // Add a new purchase to the top of the history
  const handleAddPurchase = (newPurchase: {
    fruit: string
    supplier: string
    boxes: number
    total: number
    date: string
  }) => {
    const purchase: Purchase = {
      ...newPurchase,
      date: formatDate(newPurchase.date),
    }

    setPurchases((currentPurchases) => [
      purchase,
      ...currentPurchases,
    ])

    // Close the popup after saving
    setIsFormOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Step 5: Page heading */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#71806F]">
          FRUIT BUSINESS
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#173D2B]">
          Fruit purchases
        </h2>
        <p className="mt-2 text-sm text-[#758276]">
          Record the fruit you buy from suppliers.
        </p>
      </section>

      {/* Step 6: Dynamic purchase summary cards */}
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#E4E8DD] bg-white p-5">
          <p className="text-sm text-[#758276]">Boxes purchased</p>
          <p className="mt-3 text-3xl font-bold text-[#173D2B]">
            {totalBoxes.toLocaleString('en-IN')}
          </p>
          <p className="mt-2 text-xs text-[#899388]">
            Across all recorded purchases
          </p>
        </div>

        <div className="rounded-2xl border border-[#E4E8DD] bg-white p-5">
          <p className="text-sm text-[#758276]">Total purchase cost</p>
          <p className="mt-3 text-3xl font-bold text-[#173D2B]">
            ₹{totalCost.toLocaleString('en-IN')}
          </p>
          <p className="mt-2 text-xs text-[#899388]">
            Across all recorded purchases
          </p>
        </div>
      </section>

      {/* Step 7: Purchase history and Add Purchase button */}
      <section className="rounded-2xl border border-[#E4E8DD] bg-white p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-[#173D2B]">Purchase history</h3>
            <p className="mt-1 text-sm text-[#758276]">
              See the fruit you have bought.
            </p>
          </div>

          {/* Open the purchase form */}
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="rounded-xl bg-[#173D2B] px-4 py-3 text-sm font-semibold text-white hover:bg-[#24563D]"
          >
            + Add purchase
          </button>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F6F7F2] text-xs uppercase tracking-wide text-[#758276]">
              <tr>
                <th className="px-4 py-4 font-semibold">Fruit</th>
                <th className="px-4 py-4 font-semibold">Supplier</th>
                <th className="px-4 py-4 font-semibold">Boxes</th>
                <th className="px-4 py-4 font-semibold">Total cost</th>
                <th className="px-4 py-4 font-semibold">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#EDF0E9]">
              {purchases.map((purchase, index) => (
                <tr
                  key={`${purchase.fruit}-${purchase.supplier}-${purchase.date}-${index}`}
                  className="hover:bg-[#FAFBF7]"
                >
                  <td className="whitespace-nowrap px-4 py-4 font-semibold text-[#27382D]">
                    {purchase.fruit}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-[#758276]">
                    {purchase.supplier}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 font-medium text-[#27382D]">
                    {purchase.boxes}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 font-semibold text-[#173D2B]">
                    ₹{purchase.total.toLocaleString('en-IN')}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-[#758276]">
                    {purchase.date}
                  </td>
                </tr>
              ))}

              {/* Show a message if there are no purchases */}
              {purchases.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-[#758276]"
                  >
                    No purchases recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-4 rounded-xl bg-[#F6F7F2] p-3 text-xs leading-5 text-[#758276]">
          Purchase records are currently held in page memory. Database
          saving and automatic stock updates will be implemented later.
        </p>
      </section>

      {/* Step 8: Display the Add Purchase popup */}
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
            aria-labelledby="add-purchase-form-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
          >
            <AddPurchaseForm
              onCancel={() => setIsFormOpen(false)}
              onSubmit={handleAddPurchase}
            />
          </div>
        </div>
      )}
    </div>
  )
}
