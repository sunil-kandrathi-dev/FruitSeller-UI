import { createResource } from '../../../data/api/createResource'
import { asApiObject, readApiId, readApiString, readOptionalApiNumber } from '../../../data/api/normalize'
import type { ShopCreate, ShopRecord } from './types'

const normalizeShop = (value: unknown): ShopRecord => {
  const record = asApiObject(value)
  const name = readApiString(record, ['name', 'shopName', 'customerName'])

  return {
    id: readApiId(record, ['id', 'shopId', 'customerId'], name),
    name,
    owner: readApiString(record, ['owner', 'ownerName', 'contactPerson']),
    phone: readApiString(record, ['phone', 'phoneNumber', 'phoneNo', 'mobile', 'mobileNumber', 'contactNumber']),
    balance: readOptionalApiNumber(record, [
      'balance', 'outstandingBalance', 'currentBalance', 'amountOwed',
      'pendingBalance', 'balanceDue', 'dueAmount', 'amountDue', 'outstandingAmount',
    ]),
  }
}

export const shopsApi = createResource<ShopRecord, ShopCreate>('/shops', normalizeShop)
