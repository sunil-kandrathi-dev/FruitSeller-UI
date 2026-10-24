
import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import DashboardPage from '../features/dashboard/DashboardPage'
import FruitStockPage from '../features/fruit-stock/FruitStockPage'
import PurchasesPage from '../features/purchases/PurchasesPage'
import DailySalesPage from '../features/daily-sales/DailySalesPage'
import CustomersPage from '../features/customers/CustomersPage'
import PaymentsPage from '../features/payments/PaymentsPage'
import ExpensesPage from '../features/expenses/ExpensesPage'
import ReportsPage from '../features/reports/ReportsPage'


export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/fruit-stock" element={<FruitStockPage />} />
        <Route path="/purchases" element={<PurchasesPage />} />
        <Route path="/daily-sales" element={<DailySalesPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Route>
    </Routes>
  )
}
