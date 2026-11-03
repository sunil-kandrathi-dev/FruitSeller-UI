export type SaleRecord = { id: string; shop: string; fruit: string; boxes: number; price: number; total: number; date: string }
export type SaleCreate = Omit<SaleRecord, 'id'>
export type SaleCreateRequest = { shop: string; fruit: string; boxes: number; price: number; total: number; date: string }
export type Sale = Omit<SaleRecord, 'id'>
