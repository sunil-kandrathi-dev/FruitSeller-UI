export type FruitRecord = { id: string; name: string; variety: string; boxes: number }
export type FruitCreate = Omit<FruitRecord, 'id'>
export type FruitCreateRequest = { name: string; variety: string; boxes: number }
export type Fruit = Omit<FruitRecord, 'id'>
