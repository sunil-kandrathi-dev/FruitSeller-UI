export type DashboardSummary = {
  todaySalesTotal: number
  todayBoxesDistributed: number
  todayPaymentCollections: number
  totalOutstandingBalance: number
  currentStockByFruit: {
    fruitId: number
    fruitName: string
    currentStock: number
  }[]
}
