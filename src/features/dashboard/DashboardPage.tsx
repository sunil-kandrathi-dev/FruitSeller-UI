
const summaryCards = [
  {
    label: "Today's sales",
    value: '₹0',
    description: 'Sales recorded today',
    symbol: '↗',
    accent: 'bg-[#E6F3D7]',
  },
  {
    label: 'Boxes distributed',
    value: '0',
    description: 'Across all customer shops',
    symbol: '▦',
    accent: 'bg-[#FCE8D5]',
  },
  {
    label: 'Collections',
    value: '₹0',
    description: 'Payments received today',
    symbol: '₹',
    accent: 'bg-[#DCEBE8]',
  },
  {
    label: 'Outstanding',
    value: '₹0',
    description: 'Pending customer balances',
    symbol: '◷',
    accent: 'bg-[#F5E2E0]',
  },
]

const fruitStock = [
  { name: 'Pomegranate', variety: 'Premium grade', boxes: 24, color: 'bg-red-100', symbol: '●' },
  { name: 'Green grapes', variety: 'Fresh harvest', boxes: 18, color: 'bg-lime-100', symbol: '●' },
  { name: 'Apple', variety: 'Kashmir', boxes: 32, color: 'bg-rose-100', symbol: '●' },
  { name: 'Guava', variety: 'Local harvest', boxes: 12, color: 'bg-emerald-100', symbol: '●' },
]

const quickActions = [
  { title: 'Record a sale', description: 'Distribute fruit to a shop', symbol: '↗' },
  { title: 'Add a purchase', description: 'Record incoming stock', symbol: '+' },
  { title: 'Receive payment', description: 'Update customer balance', symbol: '₹' },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-[#173D2B] p-6 text-white md:p-8">
        <div className="relative z-10 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D7F36A]">
            YOUR BUSINESS AT A GLANCE
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            Every box counts.<br />
            Every rupee matters.
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-6 text-white/70">
            Keep track of your fresh stock, shop deliveries and collections
            from one simple workspace.
          </p>
          <button className="mt-6 rounded-xl bg-[#D7F36A] px-5 py-3 text-sm font-bold text-[#173D2B] transition hover:bg-[#e5ff88]">
            + Record daily sale
          </button>
        </div>
        <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full border-[32px] border-white/5" />
        <div className="pointer-events-none absolute -bottom-28 right-16 h-56 w-56 rounded-full bg-[#D7F36A]/10" />
        <div className="absolute right-8 top-8 hidden text-7xl opacity-80 lg:block" aria-hidden="true">
          🍎
        </div>
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-[#173D2B]">Today's numbers</h2>
            <p className="mt-1 text-sm text-[#758276]">
              A quick look at your daily operations
            </p>
          </div>
          <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#758276] ring-1 ring-[#E4E8DD]">
            Sample data
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <article
              key={card.label}
              className="rounded-2xl border border-[#E4E8DD] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-[#758276]">{card.label}</p>
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg text-[#173D2B] ${card.accent}`}>
                  {card.symbol}
                </span>
              </div>
              <p className="mt-5 text-3xl font-bold tracking-tight text-[#173D2B]">
                {card.value}
              </p>
              <p className="mt-2 text-xs text-[#899388]">{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-2xl border border-[#E4E8DD] bg-white p-5 md:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-bold text-[#173D2B]">Stock at a glance</h2>
              <p className="mt-1 text-sm text-[#758276]">
                Your current fruit inventory
              </p>
            </div>
            <span className="rounded-lg bg-[#EAF2E3] px-3 py-2 text-xs font-semibold text-[#28563A]">
              4 fruits
            </span>
          </div>

          <div className="mt-5 divide-y divide-[#EDF0E9]">
            {fruitStock.map((fruit) => (
              <div key={fruit.name} className="flex items-center gap-3 py-4">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${fruit.color}`}>
                  <span className="text-xl text-[#28563A]">{fruit.symbol}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#27382D]">
                    {fruit.name}
                  </p>
                  <p className="mt-1 text-xs text-[#899388]">{fruit.variety}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#173D2B]">{fruit.boxes}</p>
                  <p className="text-xs text-[#899388]">boxes</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-3 rounded-xl bg-[#F6F7F2] p-3 text-xs leading-5 text-[#758276]">
            Illustrative inventory only. Actual stock will come from purchase
            and distribution records when we connect the backend.
          </p>
        </div>

        <div className="rounded-2xl border border-[#E4E8DD] bg-white p-5 md:p-6">
          <h2 className="font-bold text-[#173D2B]">Quick actions</h2>
          <p className="mt-1 text-sm text-[#758276]">
            Common tasks, one click away
          </p>

          <div className="mt-5 space-y-3">
            {quickActions.map((action) => (
              <button
                key={action.title}
                type="button"
                disabled
                title="We'll connect this action in a later step."
                className="flex w-full cursor-not-allowed items-center gap-3 rounded-xl border border-[#E4E8DD] p-4 text-left opacity-80"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF2E3] text-lg font-semibold text-[#28563A]">
                  {action.symbol}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-[#27382D]">
                    {action.title}
                  </span>
                  <span className="mt-1 block text-xs text-[#899388]">
                    {action.description}
                  </span>
                </span>
                <span className="text-[#899388]" aria-hidden="true">→</span>
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-xl bg-[#173D2B] p-4 text-white">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#D7F36A]">
              Business tip
            </p>
            <p className="mt-2 text-sm leading-6 text-white/80">
              Record every purchase and delivery to keep stock and customer
              balances accurate.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
