export type ShopRecord = { id: string; name: string; owner: string; phone: string; balance: number | null }
export type ShopCreate = Omit<ShopRecord, 'id' | 'balance'>
export type Shop = Omit<ShopRecord, 'id'>
