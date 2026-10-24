
import { useState } from 'react'
import AddFruitForm from './AddFruitForm'

// Step 1: Define the structure of a fruit stock record
type Fruit = {
  name: string
  variety: string
  boxes: number
}

// Step 2: Keep the existing sample fruits
const initialFruits: Fruit[] = [
  { name: 'Pomegranate', variety: 'Premium', boxes: 25 },
  { name: 'Green grapes', variety: 'Fresh harvest', boxes: 18 },
  { name: 'Apple', variety: 'Kashmir', boxes: 12 },
  { name: 'Guava', variety: 'Local harvest', boxes: 30 },
]

// Step 3: Fruit Stock page
export default function FruitStockPage() {
  // Store fruit records so newly added fruits appear immediately
  const [fruits, setFruits] = useState<Fruit[]>(initialFruits)

  // Store the text entered in the search box
  const [searchTerm, setSearchTerm] = useState('')

  // Control whether the Add Fruit popup is visible
  const [isFormOpen, setIsFormOpen] = useState(false)

  // Filter fruits by name or variety
  const filteredFruits = fruits.filter((fruit) => {
    const search = searchTerm.trim().toLowerCase()

    return (
      fruit.name.toLowerCase().includes(search) ||
      fruit.variety.toLowerCase().includes(search)
    )
  })

  // Calculate the summary values from the current fruit records
  const totalFruitTypes = fruits.length
  const totalBoxes = fruits.reduce((sum, fruit) => sum + fruit.boxes, 0)

  // Add a new fruit to the stock list
  const handleAddFruit = (newFruit: Fruit) => {
    // Prevent duplicate fruit names, ignoring letter case
    const alreadyExists = fruits.some(
      (fruit) => fruit.name.toLowerCase() === newFruit.name.toLowerCase(),
    )

    if (alreadyExists) {
      window.alert(
        'This fruit name already exists. Add its quantity through a stock update instead.',
      )
      return
    }

    // Add the new fruit to the top of the list
    setFruits((currentFruits) => [newFruit, ...currentFruits])

    // Close the popup after a successful save
    setIsFormOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Step 4: Page heading */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#71806F]">
          YOUR FRUIT BUSINESS
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#173D2B]">
          Fruit stock
        </h2>
        <p className="mt-2 text-sm text-[#758276]">
          See how many boxes of fruit you have left.
        </p>
      </section>

      {/* Step 5: Dynamic summary cards */}
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#E4E8DD] bg-white p-5">
          <p className="text-sm text-[#758276]">Different fruits</p>
          <p className="mt-3 text-3xl font-bold text-[#173D2B]">
            {totalFruitTypes}
          </p>
          <p className="mt-2 text-xs text-[#899388]">
            Fruit types currently listed
          </p>
        </div>

        <div className="rounded-2xl border border-[#E4E8DD] bg-white p-5">
          <p className="text-sm text-[#758276]">Total boxes available</p>
          <p className="mt-3 text-3xl font-bold text-[#173D2B]">
            {totalBoxes}
          </p>
          <p className="mt-2 text-xs text-[#899388]">
            Across all fruit types
          </p>
        </div>
      </section>

      {/* Step 6: Search, Add Fruit button, and stock table */}
      <section className="overflow-hidden rounded-2xl border border-[#E4E8DD] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 p-5">
          <div>
            <h3 className="font-bold text-[#173D2B]">Fruit available now</h3>
            <p className="mt-1 text-sm text-[#758276]">
              Check the remaining boxes before taking an order.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            {/* Search fruits by name or variety */}
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Find a fruit..."
              aria-label="Find a fruit by name or variety"
              className="w-full rounded-xl border border-[#E4E8DD] px-4 py-3 text-sm outline-none focus:border-[#28563A] sm:w-64"
            />

            {/* Open the Add Fruit popup */}
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="whitespace-nowrap rounded-xl bg-[#173D2B] px-4 py-3 text-sm font-semibold text-white hover:bg-[#24563D]"
            >
              + Add Fruit
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F6F7F2] text-xs uppercase tracking-wide text-[#758276]">
              <tr>
                <th className="px-5 py-4 font-semibold">Fruit name</th>
                <th className="px-5 py-4 font-semibold">Type</th>
                <th className="px-5 py-4 font-semibold">Boxes left</th>
                <th className="px-5 py-4 font-semibold">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#EDF0E9]">
              {filteredFruits.map((fruit) => (
                <tr key={fruit.name} className="hover:bg-[#FAFBF7]">
                  <td className="whitespace-nowrap px-5 py-4 font-semibold text-[#27382D]">
                    {fruit.name}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-[#758276]">
                    {fruit.variety}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 font-bold text-[#173D2B]">
                    {fruit.boxes} boxes
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                        fruit.boxes <= 12
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {fruit.boxes <= 12 ? 'Low stock' : 'Available'}
                    </span>
                  </td>
                </tr>
              ))}

              {/* Show a message when no fruits match the search */}
              {filteredFruits.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-8 text-center text-[#758276]"
                  >
                    No fruits found. Try another name or variety.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="border-t border-[#E4E8DD] bg-[#FAFBF7] px-5 py-3 text-xs leading-5 text-[#758276]">
          Example quantities only. Real stock will be calculated from
          purchases, deliveries and approved stock changes after backend
          integration.
        </p>
      </section>

      {/* Step 7: Display the Add Fruit popup */}
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
            aria-labelledby="add-fruit-form-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
          >
            <AddFruitForm
              onCancel={() => setIsFormOpen(false)}
              onSubmit={handleAddFruit}
            />
          </div>
        </div>
      )}
    </div>
  )
}
