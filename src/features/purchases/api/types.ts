/** Date values use the API-friendly YYYY-MM-DD format. */
export type PurchaseRecord = {
  id: string
  fruit: string
  supplier: string
  boxes: number
  total: number
  date: string
  paid: number
  balance: number
}

/** Purchase fields used by the page before the server assigns an ID. */
export type Purchase = Omit<PurchaseRecord, 'id' | 'paid' | 'balance'>

/** The server generates the record ID. */
export type PurchaseCreate = Purchase

export type PurchaseCreateRequest = {
  fruitName: string
  supplierName: string
  boxQuantity: number
  totalCost: number
  purchaseDate: string
}

export type SupplierPaymentMethod = 'Cash' | 'UPI' | 'Bank transfer'

export type SupplierPaymentRecord = {
  id: string
  purchaseId: string
  amount: number
  date: string
  method: SupplierPaymentMethod
  referenceNumber: string | null
  notes: string | null
}

export type SupplierPaymentCreate = {
  amount: number
  date: string
  method: SupplierPaymentMethod
  referenceNumber?: string
  notes?: string
}

export type SupplierPaymentCreateRequest = {
  amount: number
  paymentDate: string
  paymentMethod: SupplierPaymentMethod
  referenceNumber: string | null
  notes: string | null
}
