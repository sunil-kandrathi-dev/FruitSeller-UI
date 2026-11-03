import { createResource } from '../../../data/api/createResource'
import { asApiObject, readApiId, readApiString, readOptionalApiNumber } from '../../../data/api/normalize'
import type { ShopCreate, ShopCreateRequest, ShopRecord } from './types'

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

const shopResource = createResource<ShopRecord, ShopCreateRequest>('/shops', normalizeShop)

export const shopsApi = {
  ...shopResource,
  create: (shop: ShopCreate) =>
    shopResource.create({
      name: shop.name,
      owner: shop.owner,
      phone: shop.phone,
    }),
}
