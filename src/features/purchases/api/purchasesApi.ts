import { createResource } from '../../../data/api/createResource'
import { asApiObject, readApiId, readApiNumber, readApiString } from '../../../data/api/normalize'
import type { PurchaseCreate, PurchaseRecord } from './types'

const normalizePurchase = (value: unknown): PurchaseRecord => {
  const record = asApiObject(value)
  const fruit = readApiString(record, ['fruit', 'fruitName'])
  const supplier = readApiString(record, ['supplier', 'supplierName'])
  const date = readApiString(record, ['date', 'purchaseDate', 'createdAt'])

  return {
    id: readApiId(record, ['id', 'purchaseId'], `${fruit}-${date}`),
    fruit,
    supplier,
    boxes: readApiNumber(record, ['boxes', 'quantity', 'boxQuantity', 'numberOfBoxes']),
    total: readApiNumber(record, ['total', 'totalAmount', 'totalCost', 'amount']),
    date,
  }
}

export const purchasesApi = createResource<PurchaseRecord, PurchaseCreate>('/purchases', normalizePurchase)
