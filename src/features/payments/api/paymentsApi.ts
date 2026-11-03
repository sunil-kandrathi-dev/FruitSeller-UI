import { createResource } from '../../../data/api/createResource'
import { asApiObject, readApiId, readApiNumber, readApiString } from '../../../data/api/normalize'
import type { PaymentCreate, PaymentCreateRequest, PaymentRecord } from './types'

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

const paymentResource = createResource<PaymentRecord, PaymentCreateRequest>('/payments', normalizePayment)

export const paymentsApi = {
  ...paymentResource,
  create: (payment: PaymentCreate) =>
    paymentResource.create({
      customer: payment.customer,
      date: payment.date,
      method: payment.method,
      amount: payment.amount,
    }),
}
