import { createResource } from '../../../data/api/createResource'
import { asApiObject, readApiId, readApiNumber, readApiString, readOptionalApiNumber } from '../../../data/api/normalize'
import type { PurchaseCreate, PurchaseCreateRequest, PurchaseRecord } from './types'

const normalizePurchase = (value: unknown): PurchaseRecord => {
  const record = asApiObject(value)
  const fruit = readApiString(record, ['fruit', 'fruitName'])
  const supplier = readApiString(record, ['supplier', 'supplierName'])
  const date = readApiString(record, ['date', 'purchaseDate', 'createdAt'])
  const total = readApiNumber(record, ['total', 'totalAmount', 'totalCost', 'amount'])
  const paid = readOptionalApiNumber(record, ['paid', 'paidAmount', 'totalPaid', 'totalPaidAmount', 'amountPaid']) ?? 0
  const balance = readOptionalApiNumber(record, ['balance', 'outstandingBalance', 'outstandingAmount', 'balanceDue', 'balanceAmount', 'remainingBalance'])
    ?? Math.max(total - paid, 0)

  return {
    id: readApiId(record, ['id', 'purchaseId'], `${fruit}-${date}`),
    fruit,
    supplier,
    boxes: readApiNumber(record, ['boxes', 'quantity', 'boxQuantity', 'numberOfBoxes']),
    total,
    date,
    paid,
    balance,
  }
}

const purchaseResource = createResource<PurchaseRecord, PurchaseCreateRequest>('/purchases', normalizePurchase)

export const purchasesApi = {
  ...purchaseResource,
  create: (purchase: PurchaseCreate) =>
    purchaseResource.create({
      fruitName: purchase.fruit,
      supplierName: purchase.supplier,
      boxQuantity: purchase.boxes,
      totalCost: purchase.total,
      purchaseDate: purchase.date,
    }),
}
