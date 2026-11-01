import { createResource } from '../../../data/api/createResource'
import { asApiObject, readApiId, readApiNumber, readApiString, readApiValue } from '../../../data/api/normalize'
import type { ExpenseCreate, ExpenseRecord } from './types'

const normalizeExpense = (value: unknown): ExpenseRecord => {
  const record = asApiObject(value)
  const date = readApiString(record, ['date', 'expenseDate', 'createdAt'])
  const category = readApiString(record, ['category', 'expenseCategory', 'expenseType'])
  const descriptionValue = readApiValue(record, ['description', 'notes', 'details'])

  return {
    id: readApiId(record, ['id', 'expenseId'], `${category}-${date}`),
    category,
    description: typeof descriptionValue === 'string' ? descriptionValue : '',
    date,
    amount: readApiNumber(record, ['amount', 'totalAmount', 'expenseAmount']),
  }
}

export const expensesApi = createResource<ExpenseRecord, ExpenseCreate>('/expenses', normalizeExpense)
