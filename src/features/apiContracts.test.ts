import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import type { ShopCreate } from './customers/api/types'
import type { ExpenseCreate } from './expenses/api/types'
import type { FruitCreate } from './fruit-stock/api/types'
import type { PaymentCreate } from './payments/api/types'
import type { PurchaseCreate } from './purchases/api/types'
import type { SupplierPaymentCreate } from './purchases/api/types'
import type { SaleCreate } from './daily-sales/api/types'

let shopsApi: typeof import('./customers/api/shopsApi').shopsApi
let fruitsApi: typeof import('./fruit-stock/api/fruitsApi').fruitsApi
let salesApi: typeof import('./daily-sales/api/salesApi').salesApi
let expensesApi: typeof import('./expenses/api/expensesApi').expensesApi
let paymentsApi: typeof import('./payments/api/paymentsApi').paymentsApi
let purchasesApi: typeof import('./purchases/api/purchasesApi').purchasesApi
let supplierPaymentsApi: typeof import('./purchases/api/supplierPaymentsApi').supplierPaymentsApi

beforeAll(async () => {
  vi.stubEnv('VITE_API_BASE_URL', 'http://api.test')
  ;[
    { shopsApi },
    { fruitsApi },
    { salesApi },
    { expensesApi },
    { paymentsApi },
    { purchasesApi },
    { supplierPaymentsApi },
  ] = await Promise.all([
    import('./customers/api/shopsApi'),
    import('./fruit-stock/api/fruitsApi'),
    import('./daily-sales/api/salesApi'),
    import('./expenses/api/expensesApi'),
    import('./payments/api/paymentsApi'),
    import('./purchases/api/purchasesApi'),
    import('./purchases/api/supplierPaymentsApi'),
  ])
})

afterAll(() => {
  vi.unstubAllEnvs()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

async function expectCreateRequest<T>(
  path: string,
  create: () => Promise<T>,
  request: unknown,
  response: unknown,
  normalized: unknown,
) {
  const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
    new Response(JSON.stringify(response), { status: 201 }),
  )
  vi.stubGlobal('fetch', fetchMock)

  await expect(create()).resolves.toEqual(normalized)
  expect(fetchMock).toHaveBeenCalledOnce()
  expect(fetchMock).toHaveBeenCalledWith(
    `http://api.test${path}`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify(request),
    }),
  )
}

describe('feature API request and response boundaries', () => {
  it('maps shop requests and normalizes shop responses', async () => {
    const shop: ShopCreate = { name: 'Mango Shop', owner: 'Asha', phone: '1234567890' }

    await expectCreateRequest(
      '/shops',
      () => shopsApi.create(shop),
      shop,
      {
        shopId: 'shop-1',
        shopName: shop.name,
        ownerName: shop.owner,
        phoneNumber: shop.phone,
        currentBalance: 50,
      },
      { id: 'shop-1', name: shop.name, owner: shop.owner, phone: shop.phone, balance: 50 },
    )
  })

  it('maps fruit requests and normalizes fruit responses', async () => {
    const fruit: FruitCreate = { name: 'Mango', variety: 'Alphonso', boxes: 20 }

    await expectCreateRequest(
      '/fruits',
      () => fruitsApi.create(fruit),
      fruit,
      {
        fruitId: 'fruit-1',
        fruitName: fruit.name,
        fruitVariety: fruit.variety,
        currentStock: fruit.boxes,
      },
      { id: 'fruit-1', name: fruit.name, variety: fruit.variety, boxes: fruit.boxes },
    )
  })

  it('maps sale requests and normalizes sale responses', async () => {
    const sale: SaleCreate = {
      shop: 'Mango Shop',
      fruit: 'Mango',
      boxes: 4,
      price: 250,
      total: 1000,
      date: '2026-11-03',
    }

    await expectCreateRequest(
      '/sales',
      () => salesApi.create(sale),
      sale,
      {
        saleId: 'sale-1',
        shopName: sale.shop,
        fruitName: sale.fruit,
        boxQuantity: sale.boxes,
        pricePerBox: sale.price,
        totalAmount: sale.total,
        saleDate: sale.date,
      },
      { id: 'sale-1', shop: sale.shop, fruit: sale.fruit, boxes: sale.boxes, price: sale.price, total: sale.total, date: sale.date },
    )
  })

  it('maps expense requests and normalizes expense responses', async () => {
    const expense: ExpenseCreate = {
      category: 'Transport',
      description: 'Delivery fuel',
      date: '2026-11-03',
      amount: 500,
    }

    await expectCreateRequest(
      '/expenses',
      () => expensesApi.create(expense),
      expense,
      {
        expenseId: 'expense-1',
        expenseType: expense.category,
        notes: expense.description,
        expenseDate: expense.date,
        expenseAmount: expense.amount,
      },
      { id: 'expense-1', category: expense.category, description: expense.description, date: expense.date, amount: expense.amount },
    )
  })

  it('maps payment requests and normalizes payment responses', async () => {
    const payment: PaymentCreate = {
      customer: 'Mango Shop',
      date: '2026-11-03',
      method: 'UPI',
      amount: 750,
    }

    await expectCreateRequest(
      '/payments',
      () => paymentsApi.create(payment),
      payment,
      {
        paymentId: 'payment-1',
        customerName: payment.customer,
        paymentDate: payment.date,
        paymentMethod: payment.method,
        amountReceived: payment.amount,
      },
      { id: 'payment-1', customer: payment.customer, date: payment.date, method: payment.method, amount: payment.amount },
    )
  })

  it('maps purchase requests to the backend DTO and normalizes purchase responses', async () => {
    const purchase: PurchaseCreate = {
      fruit: 'Mango',
      supplier: 'Surya',
      boxes: 203,
      total: 300019.87,
      date: '2026-11-03',
    }

    await expectCreateRequest(
      '/purchases',
      () => purchasesApi.create(purchase),
      {
        fruitName: purchase.fruit,
        supplierName: purchase.supplier,
        boxQuantity: purchase.boxes,
        totalCost: purchase.total,
        purchaseDate: purchase.date,
      },
      {
        purchaseId: 'purchase-1',
        fruitName: purchase.fruit,
        supplierName: purchase.supplier,
        boxQuantity: purchase.boxes,
        totalCost: purchase.total,
        purchaseDate: purchase.date,
        totalPaid: 125,
        outstandingBalance: purchase.total - 125,
      },
      {
        id: 'purchase-1',
        fruit: purchase.fruit,
        supplier: purchase.supplier,
        boxes: purchase.boxes,
        total: purchase.total,
        date: purchase.date,
        paid: 125,
        balance: purchase.total - 125,
      },
    )
  })

  it('maps supplier payment requests and loads purchase payment history', async () => {
    const payment: SupplierPaymentCreate = {
      amount: 125.5,
      date: '2026-11-03',
      method: 'UPI',
      referenceNumber: 'TXN-123',
      notes: 'Advance',
    }
    const response = {
      supplierPaymentId: 41,
      purchaseId: 12,
      amount: payment.amount,
      paymentDate: payment.date,
      paymentMethod: payment.method,
      referenceNumber: payment.referenceNumber,
      notes: payment.notes,
    }
    const fetchMock = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(new Response(JSON.stringify([response]), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify(response), { status: 201 }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(supplierPaymentsApi.listByPurchase('12')).resolves.toEqual([
      {
        id: '41',
        purchaseId: '12',
        amount: 125.5,
        date: '2026-11-03',
        method: 'UPI',
        referenceNumber: 'TXN-123',
        notes: 'Advance',
      },
    ])
    await expect(supplierPaymentsApi.createForPurchase('12', payment)).resolves.toBeUndefined()
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      'http://api.test/purchases/12/supplier-payments',
      expect.objectContaining({
        headers: expect.objectContaining({ Accept: 'application/json' }),
      }),
    )
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      'http://api.test/purchases/12/supplier-payments',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          amount: 125.5,
          paymentDate: '2026-11-03',
          paymentMethod: 'UPI',
          referenceNumber: 'TXN-123',
          notes: 'Advance',
        }),
      }),
    )
  })

  it('shows backend validation details instead of raw problem JSON', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({
        title: 'One or more validation errors occurred.',
        status: 400,
        errors: {
          request: ['Fruit name does not match an existing fruit record.'],
        },
      }), { status: 400 }),
    )
    vi.stubGlobal('fetch', fetchMock)

    await expect(purchasesApi.create({
      fruit: 'Unknown fruit',
      supplier: 'Surya',
      boxes: 1,
      total: 100,
      date: '2026-11-03',
    })).rejects.toThrow('Fruit name does not match an existing fruit record.')
  })
})
