export type ReportSale = { date: string; shop: string; fruit: string; boxes: number; amount: number }
export type ReportPurchase = { date: string; fruit: string; boxes: number; amount: number }
export type ReportExpense = { date: string; category: string; amount: number }
export type ReportPayment = { date: string; customer: string; method: string; amount: number }
export type ReportsData = { sales: ReportSale[]; purchases: ReportPurchase[]; expenses: ReportExpense[]; payments: ReportPayment[] }
