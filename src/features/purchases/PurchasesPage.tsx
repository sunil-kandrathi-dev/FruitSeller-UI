import { useRef, useState } from 'react'
import AddPurchaseForm, { type PurchaseFormSubmission } from './AddPurchaseForm'
import { purchasesApi } from './api/purchasesApi'
import { supplierPaymentsApi } from './api/supplierPaymentsApi'
import type { PurchaseRecord, SupplierPaymentCreate, SupplierPaymentRecord } from './api/types'
import { fruitsApi } from '../fruit-stock/api/fruitsApi'
import { useApiCollection } from '../../data/hooks/useApiCollection'
import ApiStatus from '../../components/ApiStatus'
import { formatNumber } from '../../data/formatNumber'

type PurchasePayment = SupplierPaymentCreate

// Format API-style dates for display
const formatDate = (date: unknown) => {
  if (typeof date !== 'string' || date.length < 10) return '—'
  const [year, month, day] = date.slice(0, 10).split('-')
  if (!year || !month || !day) return '—'

  return `${day} ${new Date(
    Number(year),
    Number(month) - 1,
  ).toLocaleString('en-IN', { month: 'short' })} ${year}`
}

// Step 4: Purchases page
export default function PurchasesPage() {
  const { records: purchases, loading, error, reload, create } = useApiCollection(purchasesApi)
  const {
    records: fruits,
    loading: fruitsLoading,
    error: fruitsError,
    reload: reloadFruits,
  } = useApiCollection(fruitsApi)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [purchaseForPayment, setPurchaseForPayment] = useState<PurchaseRecord | null>(null)
  const [paymentNotice, setPaymentNotice] = useState('')
  const [paymentActionError, setPaymentActionError] = useState('')
  const [savingPayment, setSavingPayment] = useState(false)
  const [historyPurchase, setHistoryPurchase] = useState<PurchaseRecord | null>(null)
  const [paymentHistory, setPaymentHistory] = useState<SupplierPaymentRecord[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyError, setHistoryError] = useState('')
  const historyRequestVersion = useRef(0)

  // Calculate the total number of boxes purchased
  const totalBoxes = purchases.reduce(
    (sum, purchase) => sum + purchase.boxes,
    0,
  )

  // Calculate the total cost of all purchases
  const totalCost = purchases.reduce(
    (sum, purchase) => sum + purchase.total,
    0,
  )

  const totalOutstandingBalance = purchases.reduce(
    (sum, purchase) => sum + purchase.balance,
    0,
  )

  const handleAddPurchase = async ({ initialPayment, ...purchase }: PurchaseFormSubmission) => {
    setPaymentNotice('')
    try {
      const created = await create(purchase)
      if (initialPayment) {
        try {
          await supplierPaymentsApi.createForPurchase(created.id, initialPayment)
          await reload()
        } catch (requestError) {
          setPaymentNotice(
            `Purchase saved, but its initial payment could not be confirmed. ${requestError instanceof Error ? requestError.message : 'Please retry payment tracking.'}`,
          )
          await reload()
        }
      }
    } catch {
      return
    }

    setIsFormOpen(false)
  }

  const handleRecordPayment = async (payment: PurchasePayment) => {
    if (!purchaseForPayment) return
    setSavingPayment(true)
    setPaymentActionError('')
    try {
      await supplierPaymentsApi.createForPurchase(purchaseForPayment.id, payment)
      await reload()
      setPurchaseForPayment(null)
    } catch (requestError) {
      setPaymentActionError(
        requestError instanceof Error ? requestError.message : 'Could not save supplier payment.',
      )
    } finally {
      setSavingPayment(false)
    }
  }

  const handleOpenPaymentHistory = async (purchase: PurchaseRecord) => {
    const requestVersion = ++historyRequestVersion.current
    setHistoryPurchase(purchase)
    setPaymentHistory([])
    setHistoryError('')
    setHistoryLoading(true)
    try {
      const history = await supplierPaymentsApi.listByPurchase(purchase.id)
      if (historyRequestVersion.current === requestVersion) setPaymentHistory(history)
    } catch (requestError) {
      if (historyRequestVersion.current === requestVersion) {
        setHistoryError(
          requestError instanceof Error ? requestError.message : 'Could not load payment history.',
        )
      }
    } finally {
      if (historyRequestVersion.current === requestVersion) setHistoryLoading(false)
    }
  }

  const closePaymentHistory = () => {
    historyRequestVersion.current += 1
    setHistoryPurchase(null)
    setHistoryLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* Step 5: Page heading */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#71806F]">
          FRUIT BUSINESS
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#173D2B]">
          Fruit purchases
        </h2>
        <p className="mt-2 text-sm text-[#758276]">
          Record the fruit you buy from suppliers.
        </p>
      </section>

      <ApiStatus loading={loading} error={error} onRetry={() => void reload()} />

      {/* Step 6: Dynamic purchase summary cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-[#E4E8DD] bg-white p-5">
          <p className="text-sm text-[#758276]">Boxes purchased</p>
          <p className="mt-3 text-3xl font-bold text-[#173D2B]">
            {formatNumber(totalBoxes)}
          </p>
          <p className="mt-2 text-xs text-[#899388]">
            Across all recorded purchases
          </p>
        </div>

        <div className="rounded-2xl border border-[#E4E8DD] bg-white p-5">
          <p className="text-sm text-[#758276]">Total purchase cost</p>
          <p className="mt-3 text-3xl font-bold text-[#173D2B]">
            ₹{formatNumber(totalCost)}
          </p>
          <p className="mt-2 text-xs text-[#899388]">
            Across all recorded purchases
          </p>
        </div>

        <div className="rounded-2xl border border-[#E4E8DD] bg-white p-5">
          <p className="text-sm text-[#758276]">Outstanding balance</p>
          <p className="mt-3 text-3xl font-bold text-[#173D2B]">
            ₹{formatNumber(totalOutstandingBalance)}
          </p>
          <p className="mt-2 text-xs text-[#899388]">
            Across purchases with payment data
          </p>
        </div>
      </section>

      {/* Step 7: Purchase history and Add Purchase button */}
      <section className="rounded-2xl border border-[#E4E8DD] bg-white p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-[#173D2B]">Purchase history</h3>
            <p className="mt-1 text-sm text-[#758276]">
              See the fruit you have bought.
            </p>
          </div>

          {/* Open the purchase form */}
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="rounded-xl bg-[#173D2B] px-4 py-3 text-sm font-semibold text-white hover:bg-[#24563D]"
          >
            + Add purchase
          </button>
        </div>

        {paymentNotice && (
          <div role="status" className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
            <span>{paymentNotice}</span>
            <button
              type="button"
              onClick={() => setPaymentNotice('')}
              className="font-semibold underline underline-offset-2"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F6F7F2] text-xs uppercase tracking-wide text-[#758276]">
              <tr>
                <th className="px-4 py-4 font-semibold">Fruit</th>
                <th className="px-4 py-4 font-semibold">Supplier</th>
                <th className="px-4 py-4 font-semibold">Boxes</th>
                <th className="px-4 py-4 font-semibold">Total cost</th>
                <th className="px-4 py-4 font-semibold">Paid</th>
                <th className="px-4 py-4 font-semibold">Balance</th>
                <th className="px-4 py-4 font-semibold">Status</th>
                <th className="px-4 py-4 font-semibold">Actions</th>
                <th className="px-4 py-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDF0E9]">
              {purchases.map((purchase) => {
                const status = purchase.balance === 0
                  ? 'Paid'
                  : purchase.paid === 0
                    ? 'Unpaid'
                    : 'Partially paid'
                const statusClassName = status === 'Paid'
                  ? 'bg-green-100 text-green-800'
                  : status === 'Unpaid'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'

                return (
                    <tr key={purchase.id} className="hover:bg-[#FAFBF7]">
                      <td className="whitespace-nowrap px-4 py-4 font-semibold text-[#27382D]">{purchase.fruit}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-[#758276]">{purchase.supplier}</td>
                      <td className="whitespace-nowrap px-4 py-4 font-medium text-[#27382D]">{purchase.boxes}</td>
                      <td className="whitespace-nowrap px-4 py-4 font-semibold text-[#173D2B]">₹{formatNumber(purchase.total)}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-[#758276]">
                        ₹{formatNumber(purchase.paid)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-[#758276]">
                        ₹{formatNumber(purchase.balance)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        {status === 'Unpaid' ? (
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClassName}`}>
                            {status}
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => void handleOpenPaymentHistory(purchase)}
                            aria-label={`${status} — view payment history for ${purchase.fruit} from ${purchase.supplier}`}
                            className={`rounded-full px-3 py-1 text-xs font-semibold underline decoration-current/40 underline-offset-2 hover:brightness-95 ${statusClassName}`}
                          >
                            {status}
                          </button>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <div className="flex items-center gap-3">
                          {purchase.balance > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                setPaymentActionError('')
                                setPurchaseForPayment(purchase)
                              }}
                              className="font-semibold text-[#173D2B] underline underline-offset-2"
                            >
                              Record payment
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-[#758276]">{formatDate(purchase.date)}</td>
                    </tr>
                )
              })}
              {!loading && !error && purchases.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-[#758276]">
                    No purchases recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900">
          Purchase totals and balances come from the purchase API. Select a Paid or Partially paid status to view payment history.
        </p>
      </section>

      {/* Step 8: Display the Add Purchase popup */}
      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(event) => {
            // Close the popup when the backdrop itself is clicked
            if (event.target === event.currentTarget) {
              setIsFormOpen(false)
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-purchase-form-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
          >
            {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <AddPurchaseForm
              fruits={fruits}
              fruitsLoading={fruitsLoading}
              fruitsError={fruitsError}
              onRetryFruits={() => void reloadFruits()}
              onCancel={() => setIsFormOpen(false)}
              onSubmit={handleAddPurchase}
            />
          </div>
        </div>
      )}
      {purchaseForPayment && (
        <RecordPaymentDialog
          purchase={purchaseForPayment}
          balance={purchaseForPayment.balance}
          onCancel={() => setPurchaseForPayment(null)}
          onSubmit={handleRecordPayment}
          error={paymentActionError}
          submitting={savingPayment}
        />
      )}
      {historyPurchase && (
        <PaymentHistoryDialog
          purchase={historyPurchase}
          payments={paymentHistory}
          loading={historyLoading}
          error={historyError}
          onClose={closePaymentHistory}
          onRetry={() => void handleOpenPaymentHistory(historyPurchase)}
        />
      )}
    </div>
  )
}

type RecordPaymentDialogProps = {
  purchase: PurchaseRecord
  balance: number
  onCancel: () => void
  onSubmit: (payment: PurchasePayment) => Promise<void>
  error: string
  submitting: boolean
}

function RecordPaymentDialog({
  purchase,
  balance,
  onCancel,
  onSubmit,
  error,
  submitting,
}: RecordPaymentDialogProps) {
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState<PurchasePayment['method']>('Cash')
  const [date, setDate] = useState(new Date().toLocaleDateString('en-CA'))
  const [referenceNumber, setReferenceNumber] = useState('')
  const [notes, setNotes] = useState('')
  const [validationError, setValidationError] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const paymentAmount = Number(amount)
    if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
      setValidationError('Enter a payment amount greater than zero.')
      return
    }
    if (paymentAmount > balance) {
      setValidationError('Payment cannot exceed the outstanding balance.')
      return
    }
    if (!date) {
      setValidationError('Select the payment date.')
      return
    }

    setValidationError('')
    await onSubmit({ amount: paymentAmount, method, date, referenceNumber, notes })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="purchase-record-payment-title"
        onSubmit={handleSubmit}
        className="w-full max-w-lg space-y-5 rounded-2xl bg-white p-6 shadow-xl"
      >
        <div>
          <h2 id="purchase-record-payment-title" className="text-xl font-bold text-[#173D2B]">
            Record payment
          </h2>
          <p className="mt-1 text-sm text-[#758276]">
            {purchase.fruit} from {purchase.supplier} ·{' '}
            <span className="rounded-md bg-red-50 px-2 py-1 font-semibold text-red-700">
              Balance ₹{formatNumber(balance)}
            </span>
          </p>
        </div>
        <div>
          <label htmlFor="purchase-extra-payment" className="mb-2 block text-sm font-medium text-[#27382D]">
            Amount
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#758276]">₹</span>
            <input
              id="purchase-extra-payment"
              type="number"
              onWheel={(event) => event.currentTarget.blur()}
              min="0.01"
              max={balance}
              step="0.01"
              value={amount}
              onChange={(event) => {
                setAmount(event.target.value)
                setValidationError('')
              }}
              required
              className="currency-input w-full rounded-xl border border-[#D9DFD3] py-3 pl-9 pr-4 outline-none focus:border-[#173D2B]"
            />
          </div>
        </div>
        <div>
          <label htmlFor="purchase-extra-payment-method" className="mb-2 block text-sm font-medium text-[#27382D]">
            Payment method
          </label>
          <select
            id="purchase-extra-payment-method"
            value={method}
            onChange={(event) => {
              const value = event.target.value
              if (value === 'Cash' || value === 'UPI' || value === 'Bank transfer') setMethod(value)
            }}
            className="w-full rounded-xl border border-[#D9DFD3] bg-white px-4 py-3 outline-none focus:border-[#173D2B]"
          >
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Bank transfer">Bank transfer</option>
          </select>
        </div>
        <div>
          <label htmlFor="purchase-extra-payment-date" className="mb-2 block text-sm font-medium text-[#27382D]">
            Payment date
          </label>
          <input
            id="purchase-extra-payment-date"
            type="date"
            value={date}
            max={new Date().toLocaleDateString('en-CA')}
            onChange={(event) => {
              setDate(event.target.value)
              setValidationError('')
            }}
            required
            className="w-full rounded-xl border border-[#D9DFD3] px-4 py-3 outline-none focus:border-[#173D2B]"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="purchase-extra-payment-reference" className="mb-2 block text-sm font-medium text-[#27382D]">
              Reference number <span className="font-normal text-[#899388]">— optional</span>
            </label>
            <input
              id="purchase-extra-payment-reference"
              type="text"
              maxLength={100}
              value={referenceNumber}
              onChange={(event) => setReferenceNumber(event.target.value)}
              className="w-full rounded-xl border border-[#D9DFD3] px-4 py-3 outline-none focus:border-[#173D2B]"
            />
          </div>
          <div>
            <label htmlFor="purchase-extra-payment-notes" className="mb-2 block text-sm font-medium text-[#27382D]">
              Notes <span className="font-normal text-[#899388]">— optional</span>
            </label>
            <input
              id="purchase-extra-payment-notes"
              type="text"
              maxLength={500}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="w-full rounded-xl border border-[#D9DFD3] px-4 py-3 outline-none focus:border-[#173D2B]"
            />
          </div>
        </div>
        {(validationError || error) && (
          <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {validationError || error}
          </p>
        )}
        <div className="flex justify-end gap-3 border-t border-[#E4E8DD] pt-4">
          <button type="button" onClick={onCancel} disabled={submitting} className="rounded-xl border border-[#D9DFD3] px-5 py-3 font-semibold text-[#27382D] disabled:opacity-60">
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="rounded-xl bg-[#173D2B] px-5 py-3 font-semibold text-white hover:bg-[#24563D] disabled:opacity-60">
            {submitting ? 'Saving…' : 'Save payment'}
          </button>
        </div>
      </form>
    </div>
  )
}

type PaymentHistoryDialogProps = {
  purchase: PurchaseRecord
  payments: SupplierPaymentRecord[]
  loading: boolean
  error: string
  onClose: () => void
  onRetry: () => void
}

function PaymentHistoryDialog({
  purchase,
  payments,
  loading,
  error,
  onClose,
  onRetry,
}: PaymentHistoryDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="purchase-payment-history-title"
        className="w-full max-w-2xl space-y-5 rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="purchase-payment-history-title" className="text-xl font-bold text-[#173D2B]">
              Payment history
            </h2>
            <p className="mt-1 text-sm text-[#758276]">
              {purchase.fruit} from {purchase.supplier}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium uppercase tracking-wide text-[#758276]">Outstanding</p>
            <p className="mt-1 font-bold text-red-700">₹{formatNumber(purchase.balance)}</p>
          </div>
        </div>

        {loading && <p role="status" className="text-sm text-[#758276]">Loading payment history…</p>}
        {error && (
          <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            <span>Could not load payment history: {error}</span>
            <button type="button" onClick={onRetry} className="font-semibold underline">
              Retry
            </button>
          </div>
        )}
        {!loading && !error && payments.length === 0 && (
          <p className="rounded-xl bg-[#F6F7F2] p-4 text-sm text-[#758276]">
            No payments have been recorded for this purchase.
          </p>
        )}
        {payments.length > 0 && (
          <div className="max-h-80 overflow-y-auto rounded-xl border border-[#E4E8DD]">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-[#F6F7F2] text-xs uppercase tracking-wide text-[#758276]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Method</th>
                  <th className="px-4 py-3 font-semibold">Reference / notes</th>
                  <th className="px-4 py-3 text-right font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDF0E9]">
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="whitespace-nowrap px-4 py-3 text-[#536254]">{formatDate(payment.date)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-[#536254]">{payment.method}</td>
                    <td className="px-4 py-3 text-[#758276]">
                      {[payment.referenceNumber, payment.notes].filter(Boolean).join(' · ') || '—'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-[#173D2B]">
                      ₹{formatNumber(payment.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-end border-t border-[#E4E8DD] pt-4">
          <button type="button" onClick={onClose} className="rounded-xl border border-[#D9DFD3] px-5 py-3 font-semibold text-[#27382D]">
            Close
          </button>
        </div>
      </section>
    </div>
  )
}
