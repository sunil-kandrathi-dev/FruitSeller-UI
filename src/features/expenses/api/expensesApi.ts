import { createResource } from '../../../data/api/createResource'
import { asApiObject, readApiId, readApiNumber, readApiString, readApiValue } from '../../../data/api/normalize'
import type { ExpenseCreate, ExpenseCreateRequest, ExpenseRecord } from './types'

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

const expenseResource = createResource<ExpenseRecord, ExpenseCreateRequest>('/expenses', normalizeExpense)

export const expensesApi = {
  ...expenseResource,
  create: (expense: ExpenseCreate) =>
    expenseResource.create({
      category: expense.category,
      description: expense.description,
      date: expense.date,
      amount: expense.amount,
    }),
}
