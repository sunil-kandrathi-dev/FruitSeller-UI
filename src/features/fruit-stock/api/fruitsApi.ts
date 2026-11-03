import { createResource } from '../../../data/api/createResource'
import { asApiObject, readApiId, readApiNumber, readApiString, readApiValue } from '../../../data/api/normalize'
import type { FruitCreate, FruitCreateRequest, FruitRecord } from './types'

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

const fruitResource = createResource<FruitRecord, FruitCreateRequest>('/fruits', normalizeFruit)

export const fruitsApi = {
  ...fruitResource,
  create: (fruit: FruitCreate) =>
    fruitResource.create({
      name: fruit.name,
      variety: fruit.variety,
      boxes: fruit.boxes,
    }),
}
