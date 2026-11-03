export type PaymentRecord = { id: string; customer: string; date: string; method: 'Cash' | 'UPI'; amount: number }
export type PaymentCreate = Omit<PaymentRecord, 'id'>
export type PaymentCreateRequest = { customer: string; date: string; method: 'Cash' | 'UPI'; amount: number }
export type Payment = PaymentRecord
export type CustomerBalances = Record<string, number>
