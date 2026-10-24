
import { useState } from 'react'
import AddSaleForm from './AddSaleForm'

// Step 1: Define the structure of a sale record
type Sale = {
  shop: string
  fruit: string
  boxes: number
  price: number
  total: number
  date: string
}

// Step 2: Keep the existing sample sales
const initialSales: Sale[] = [
  {
    shop: 'Sri Lakshmi Fruits',
    fruit: 'Pomegranate',
    boxes: 5,
    price: 600,
    total: 3000,
    date: '24 Oct 2026',
  },
  {
    shop: 'Fresh Fruit Centre',
    fruit: 'Green grapes',
    boxes: 4,
    price: 500,
    total: 2000,
    date: '24 Oct 2026',
  },
  {
    shop: 'Sai Fruit Shop',
    fruit: 'Apple',
    boxes: 3,
    price: 700,
    total: 2100,
    date: '23 Oct 2026',
  },
]

// Step 3: Convert a date to a readable format
const formatDate = (date: string) => {
  const [year, month, day] = date.split('-')

  return `${day} ${new Date(
    Number(year),
    Number(month) - 1,
  ).toLocaleString('en-IN', { month: 'short' })} ${year}`
}

// Step 4: Daily Sales page
export default function DailySalesPage() {
  // Store sales so new records appear immediately
  const [sales, setSales] = useState<Sale[]>(initialSales)

  // Control whether the Record Sale popup is visible
  const [isFormOpen, setIsFormOpen] = useState(false)

  // Get today's date in the same format used by the sale records
  const today = formatDate(new Date().toLocaleDateString('en-CA'))

  // Find today's sales
  const todaysSales = sales.filter((sale) => sale.date === today)

  // Calculate today's sales amount
  const salesToday = todaysSales.reduce(
    (sum, sale) => sum + sale.total,
    0,
  )

  // Calculate the number of boxes delivered today
  const boxesDeliveredToday = todaysSales.reduce(
    (sum, sale) => sum + sale.boxes,
    0,
  )

  // Add a new sale to the delivery history
  const handleAddSale = (newSale: {
    shop: string
    fruit: string
    boxes: number
    price: number
    total: number
    date: string
  }) => {
    const sale: Sale = {
      ...newSale,
      date: formatDate(newSale.date),
    }

    // Add the newest delivery to the top of the table
    setSales((currentSales) => [sale, ...currentSales])

    // Close the popup after saving
    setIsFormOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Step 5: Page heading */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#71806F]">
          FRUIT DISTRIBUTION
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#173D2B]">
          Daily sales
        </h2>
        <p className="mt-2 text-sm text-[#758276]">
          Record the fruit boxes delivered to each shop.
        </p>
      </section>

      {/* Step 6: Dynamic summary cards */}
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#E4E8DD] bg-white p-5">
          <p className="text-sm text-[#758276]">Sales today</p>
          <p className="mt-3 text-3xl font-bold text-[#173D2B]">
            ₹{salesToday.toLocaleString('en-IN')}
          </p>
          <p className="mt-2 text-xs text-[#899388]">
            Total value of today's deliveries
          </p>
        </div>

        <div className="rounded-2xl border border-[#E4E8DD] bg-white p-5">
          <p className="text-sm text-[#758276]">Boxes delivered</p>
          <p className="mt-3 text-3xl font-bold text-[#173D2B]">
            {boxesDeliveredToday}
          </p>
          <p className="mt-2 text-xs text-[#899388]">
            Boxes delivered today
          </p>
        </div>
      </section>

      {/* Step 7: Delivery history and Record Sale button */}
      <section className="overflow-hidden rounded-2xl border border-[#E4E8DD] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 p-5 md:p-6">
          <div>
            <h3 className="font-bold text-[#173D2B]">Recent deliveries</h3>
            <p className="mt-1 text-sm text-[#758276]">
              See which shops received fruit and how much they were charged.
            </p>
          </div>

          {/* Open the Record Sale popup */}
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="rounded-xl bg-[#173D2B] px-4 py-3 text-sm font-semibold text-white hover:bg-[#24563D]"
          >
            + Record sale
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F6F7F2] text-xs uppercase tracking-wide text-[#758276]">
              <tr>
                <th className="px-5 py-4 font-semibold">Shop name</th>
                <th className="px-5 py-4 font-semibold">Fruit</th>
                <th className="px-5 py-4 font-semibold">Boxes</th>
                <th className="px-5 py-4 font-semibold">Price / box</th>
                <th className="px-5 py-4 font-semibold">Total</th>
                <th className="px-5 py-4 font-semibold">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#EDF0E9]">
              {sales.map((sale, index) => (
                <tr
                  key={`${sale.shop}-${sale.fruit}-${sale.date}-${index}`}
                  className="hover:bg-[#FAFBF7]"
                >
                  <td className="whitespace-nowrap px-5 py-4 font-semibold text-[#27382D]">
                    {sale.shop}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-[#758276]">
                    {sale.fruit}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-[#27382D]">
                    {sale.boxes}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-[#758276]">
                    ₹{sale.price.toLocaleString('en-IN')}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 font-semibold text-[#173D2B]">
                    ₹{sale.total.toLocaleString('en-IN')}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-[#758276]">
                    {sale.date}
                  </td>
                </tr>
              ))}

              {/* Show a message if no sales exist */}
              {sales.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-8 text-center text-[#758276]"
                  >
                    No deliveries recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="border-t border-[#E4E8DD] bg-[#FAFBF7] px-5 py-3 text-xs leading-5 text-[#758276]">
          Sales are currently stored in page memory. Automatic stock deductions,
          customer balance updates, and database saving will be added later.
        </p>
      </section>

      {/* Step 8: Display the Record Sale popup */}
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
            aria-labelledby="add-sale-form-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
          >
            <AddSaleForm
              onCancel={() => setIsFormOpen(false)}
              onSubmit={handleAddSale}
            />
          </div>
        </div>
      )}
    </div>
  )
}
