import { createResource } from '../../../data/api/createResource'
import { asApiObject, readApiId, readApiNumber, readApiString, readApiValue } from '../../../data/api/normalize'
import type { FruitCreate, FruitRecord } from './types'

const normalizeFruit = (value: unknown): FruitRecord => {
  const record = asApiObject(value)
  const name = readApiString(record, ['name', 'fruitName'])
  const varietyValue = readApiValue(record, ['variety', 'fruitVariety', 'fruitType', 'grade'])

  return {
    id: readApiId(record, ['id', 'fruitId'], name),
    name,
    variety: typeof varietyValue === 'string' ? varietyValue : '',
    boxes: readApiNumber(record, ['boxes', 'currentStock', 'stockQuantity', 'quantity', 'availableBoxes']),
  }
}

export const fruitsApi = createResource<FruitRecord, FruitCreate>('/fruits', normalizeFruit)
