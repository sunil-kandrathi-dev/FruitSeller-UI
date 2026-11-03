import { apiRequest } from '../../../data/api/httpClient'
import { asApiObject, readApiId, readApiNumber, readApiString, unwrapApiCollection } from '../../../data/api/normalize'
import type {
  SupplierPaymentCreate,
  SupplierPaymentCreateRequest,
  SupplierPaymentRecord,
} from './types'

function normalizePayment(value: unknown): SupplierPaymentRecord {
  const record = asApiObject(value)
  const method = readApiString(record, ['paymentMethod', 'method'])
  if (method !== 'Cash' && method !== 'UPI' && method !== 'Bank transfer') {
    throw new Error(`Unsupported supplier payment method returned by API: ${method}`)
  }

  const referenceNumber = record.referenceNumber
  const notes = record.notes

  return {
    id: readApiId(record, ['supplierPaymentId', 'id', 'paymentId'], ''),
    purchaseId: readApiId(record, ['purchaseId'], ''),
    amount: readApiNumber(record, ['amount', 'paymentAmount']),
    date: readApiString(record, ['paymentDate', 'date']),
    method,
    referenceNumber: typeof referenceNumber === 'string' ? referenceNumber : null,
    notes: typeof notes === 'string' ? notes : null,
  }
}

function paymentEndpoint(purchaseId: string) {
  return `/purchases/${encodeURIComponent(purchaseId)}/supplier-payments`
}

export const supplierPaymentsApi = {
  listByPurchase: async (purchaseId: string, signal?: AbortSignal) => {
    const payload = await apiRequest<unknown>(paymentEndpoint(purchaseId), { signal })
    return unwrapApiCollection(payload).map(normalizePayment)
  },

  createForPurchase: async (purchaseId: string, payment: SupplierPaymentCreate): Promise<void> => {
    const request: SupplierPaymentCreateRequest = {
      amount: payment.amount,
      paymentDate: payment.date,
      paymentMethod: payment.method,
      referenceNumber: payment.referenceNumber?.trim() || null,
      notes: payment.notes?.trim() || null,
    }

    await apiRequest<unknown>(paymentEndpoint(purchaseId), {
      method: 'POST',
      body: JSON.stringify(request),
    })
  },
}
