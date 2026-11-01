import { createResource } from '../../../data/api/createResource'
import { asApiObject, readApiId, readApiNumber, readApiString } from '../../../data/api/normalize'
import type { PaymentCreate, PaymentRecord } from './types'

const normalizePayment = (value: unknown): PaymentRecord => {
  const record = asApiObject(value)
  const customer = readApiString(record, ['customer', 'customerName', 'shopName', 'shop'])
  const date = readApiString(record, ['date', 'paymentDate', 'receivedAt', 'createdAt'])
  const method = readApiString(record, ['method', 'paymentMethod', 'paymentType'])

  return {
    id: readApiId(record, ['id', 'paymentId'], `${customer}-${date}`),
    customer,
    date,
    method: method as PaymentRecord['method'],
    amount: readApiNumber(record, ['amount', 'amountReceived', 'paymentAmount', 'totalAmount']),
  }
}

export const paymentsApi = createResource<PaymentRecord, PaymentCreate>('/payments', normalizePayment)
