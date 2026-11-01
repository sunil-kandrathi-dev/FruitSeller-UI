export type ExpenseRecord = { id: string; category: string; description: string; date: string; amount: number }
export type ExpenseCreate = Omit<ExpenseRecord, 'id'>
export type Expense = ExpenseRecord
