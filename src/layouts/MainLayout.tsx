import { NavLink, Outlet } from 'react-router-dom'

const navigation = [
  { label: 'Dashboard', icon: '◫' },
  { label: 'Purchases', icon: '↓' },
  { label: 'Fruit Stock', icon: '▦' },
  { label: 'Daily Sales', icon: '↗' },
  { label: 'Customers', icon: '♧' },
  { label: 'Payments', icon: '₹' },
  { label: 'Expenses', icon: '−' },
  { label: 'Reports', icon: '▤' },
]

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[#F6F7F2] text-[#202D25] md:flex">
      <aside className="w-full shrink-0 bg-[#173D2B] p-5 text-white md:min-h-screen md:w-64">
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D7F36A] text-xl text-[#173D2B]">
            ✳
          </div>
          <div>
            <p className="text-lg font-bold tracking-tight">fruit<span className="text-[#D7F36A]">seller</span></p>
            <p className="text-xs text-white/60">Fresh business, simplified</p>
          </div>
        </div>

        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">
          Workspace
        </p>

        
        <nav className="flex gap-2 overflow-x-auto md:flex-col">
        {navigation.map((item) => {
            const path = `/${item.label.toLowerCase().replace(' ', '-')}`

            return (
            <NavLink
                key={item.label}
                to={path}
                className={({ isActive }) =>
                `flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
                    isActive
                    ? 'bg-[#D7F36A] font-semibold text-[#173D2B]'
                    : 'text-white/75 hover:bg-white/10 hover:text-white'
                }`
                }
            >
                <span className="flex h-6 w-6 items-center justify-center text-lg">
                {item.icon}
                </span>
                {item.label}
            </NavLink>
            )
        })}
        </nav>


        <div className="mt-10 hidden rounded-2xl border border-white/15 bg-white/5 p-4 md:block">
          <p className="text-sm font-semibold">Your daily operations</p>
          <p className="mt-2 text-xs leading-5 text-white/60">
            Keep stock moving and every payment accounted for.
          </p>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E4E8DD] bg-white/80 px-5 py-4 md:px-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-[#758276]">
              FruitSeller / Workspace
            </p>
            <h1 className="mt-1 text-xl font-bold tracking-tight md:text-2xl">
              Business overview
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">Owner</p>
              <p className="text-xs text-[#758276]">Business administrator</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E5EDDA] font-bold text-[#28563A]">
              O
            </div>
          </div>
        </header>

        <main className="p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
