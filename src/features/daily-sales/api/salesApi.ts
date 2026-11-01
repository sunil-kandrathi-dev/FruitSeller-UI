import { createResource } from '../../../data/api/createResource'
import { asApiObject, readApiId, readApiNumber, readApiString } from '../../../data/api/normalize'
import type { SaleCreate, SaleRecord } from './types'

const normalizeSale = (value: unknown): SaleRecord => {
  const record = asApiObject(value)
  const shop = readApiString(record, ['shop', 'shopName', 'customerName'])
  const fruit = readApiString(record, ['fruit', 'fruitName'])
  const date = readApiString(record, ['date', 'saleDate', 'deliveryDate', 'createdAt'])

  return {
    id: readApiId(record, ['id', 'saleId'], `${shop}-${fruit}-${date}`),
    shop,
    fruit,
    boxes: readApiNumber(record, ['boxes', 'quantity', 'boxQuantity', 'numberOfBoxes']),
    price: readApiNumber(record, ['price', 'pricePerBox', 'unitPrice']),
    total: readApiNumber(record, ['total', 'totalAmount', 'amount']),
    date,
  }
}

export const salesApi = createResource<SaleRecord, SaleCreate>('/sales', normalizeSale)
