/** Date values use the API-friendly YYYY-MM-DD format. */
export type PurchaseRecord = {
  id: string
  fruit: string
  supplier: string
  boxes: number
  total: number
  date: string
}

/** Purchase fields used by the page before the server assigns an ID. */
export type Purchase = Omit<PurchaseRecord, 'id'>

/** The server generates the record ID. */
export type PurchaseCreate = Purchase
