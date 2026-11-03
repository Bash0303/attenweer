import { useEffect, useState } from 'react'
import { CreditCard, Wallet, CheckCircle2, Printer, FileText } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import ProgressBar from '../../components/ui/ProgressBar'
import Modal from '../../components/ui/Modal'
import FeeReceipt from '../../components/fees/FeeReceipt'
import ChildSwitcher from './ChildSwitcher'
import { EmptyBlock, ErrorBlock, LoadBlock, TermSelect, money, useChildResource, useParentChildren } from './parentUtils'

const paymentColor = { Verified: 'emerald', Pending: 'amber', Failed: 'rose', Rejected: 'rose' }

export default function ParentFees() {
  const { children, child, childId, setChildId, loading, error, reload } = useParentChildren()
  const [termId, setTermId] = useState('')
  const { data, loading: loadingData, error: dataError, reload: reloadData } = useChildResource('fees', childId, { termId })
  const [receipt, setReceipt] = useState(null)
  const [showStatement, setShowStatement] = useState(false)
  const [preview, setPreview] = useState(false)

  useEffect(() => {
    setTermId('')
  }, [childId])

  useEffect(() => {
    if (data?.termId && !termId) setTermId(String(data.termId))
  }, [data, termId])

  if (loading) return <LoadBlock label="Loading fees..." />
  if (error) return <ErrorBlock message={error} onRetry={reload} />
  if (!children.length) {
    return (
      <div>
        <PageHeader title="Fees & Payments" subtitle="View bills, payments and receipts" />
        <EmptyBlock title="No children linked yet" message="Ask the school administrator to link your parent account to your children." />
      </div>
    )
  }

  const fees = data?.data || []
  const payments = data?.payments || []
  const totals = data?.totals || { due: 0, paid: 0, balance: 0, rate: 0 }
  const latestPayment = payments[0]

  const openReceipt = (payment) => {
    setReceipt({ ...payment, balance: totals.balance })
    setShowStatement(false)
    setPreview(true)
  }

  const openStatement = () => {
    setReceipt(null)
    setShowStatement(true)
    setPreview(true)
  }

  const statement = showStatement
    ? {
        fees,
        payments,
        totals,
        completed: data?.completed,
        term: data?.term,
        session: data?.session,
      }
    : null

  return (
    <div>
      <PageHeader
        title="Fees & Payments"
        subtitle="View bills, payments and printable receipts"
        actions={data?.completed ? <Button tone="primary" onClick={openStatement}><Printer size={15} /> Print Statement</Button> : undefined}
      />

      <ChildSwitcher children={children} value={childId} onChange={setChildId} />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <TermSelect terms={data?.terms} value={termId || data?.termId || ''} onChange={setTermId} />
        <p className="text-xs text-slate-400">{child?.name} &middot; {child?.className}</p>
      </div>

      {dataError && <div className="mt-4"><ErrorBlock message={dataError} onRetry={reloadData} /></div>}
      {loadingData && !data && <LoadBlock label="Loading fee records..." />}

      {data && (
        <>
          {data.completed && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-600 text-white"><CheckCircle2 size={20} /></span>
                <div>
                  <p className="font-bold text-emerald-800">Fees completed for {data.term}</p>
                  <p className="text-xs text-emerald-700">{data.session} &middot; {data.completedAt ? new Date(data.completedAt).toLocaleDateString('en-GB') : 'Payment completed'}</p>
                </div>
              </div>
              <Button tone="emerald" size="sm" onClick={openStatement}><FileText size={15} /> View Statement</Button>
            </div>
          )}

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Total Billed</p>
              <p className="mt-1 text-2xl font-extrabold text-navy-900">{money(totals.due)}</p>
            </div>
            <div className="rounded-2xl border border-navy-100 bg-emerald-50/60 p-5 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Total Paid</p>
              <p className="mt-1 text-2xl font-extrabold text-navy-900">{money(totals.paid)}</p>
            </div>
            <div className={`rounded-2xl border border-navy-100 p-5 shadow-card ${totals.balance > 0 ? 'bg-rose-50/60' : 'bg-emerald-50/60'}`}>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Remaining Balance</p>
              <p className={`mt-1 text-2xl font-extrabold ${totals.balance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{money(totals.balance)}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="space-y-5 lg:col-span-2">
              {fees.map((fee) => (
                <Card key={fee.id}>
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-navy-100 px-6 py-4">
                    <div>
                      <h3 className="font-bold text-navy-900">{fee.title || 'School Fees'}</h3>
                      <p className="text-xs text-slate-400">{fee.className || child?.className} &middot; {fee.session} {fee.term}</p>
                    </div>
                    <Badge color={fee.status === 'Paid' ? 'emerald' : fee.balance > 0 ? 'amber' : 'emerald'} dot>{fee.status || (fee.balance > 0 ? 'Part payment' : 'Paid')}</Badge>
                  </div>
                  <div className="divide-y divide-navy-50">
                    {fee.items.map((item) => (
                      <div key={item.label} className="flex items-center justify-between px-6 py-3">
                        <span className="font-medium text-navy-900">{item.label}</span>
                        <span className="font-semibold text-navy-900">{money(item.amount)}</span>
                      </div>
                    ))}
                    <div className="px-6 py-4">
                      <div className="flex justify-between text-sm"><span className="font-medium text-slate-600">Payment progress</span><span className="font-bold text-navy-900">{money(fee.paid)} of {money(fee.due)}</span></div>
                      <ProgressBar value={fee.due ? Math.min(100, Math.round((fee.paid / fee.due) * 100)) : 100} color={fee.balance > 0 ? 'bg-gold-500' : 'bg-emerald-500'} className="mt-2" />
                    </div>
                    <div className="flex items-center justify-between bg-navy-900 px-6 py-4 text-white">
                      <span className="font-bold">Balance Due</span>
                      <span className="text-lg font-extrabold text-gold-400">{money(fee.balance)}</span>
                    </div>
                  </div>
                </Card>
              ))}
              {!fees.length && <EmptyBlock title="No fee bill yet" message="The school has not published a fee structure for this student and term yet." />}
            </div>

            <Card className="h-fit p-6">
              <h3 className="font-bold text-navy-900">Payment Options</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-500">
                {['Bank transfer to the school account', 'Card payment at the bursary', 'POS or cash at the bursar\'s office', 'Instalment plans available on request'].map((item) => (
                  <li key={item} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />{item}</li>
                ))}
              </ul>
              <div className="mt-5 rounded-xl bg-cream-100/70 p-3 text-xs text-slate-500">
                <p className="flex items-center gap-1.5 font-bold text-navy-800"><CreditCard size={13} /> Payments are recorded by the bursary</p>
                <p className="mt-1">Contact the school office to make a payment, then the bursary will update your record.</p>
              </div>
              {latestPayment && (
                <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-700">
                  <p className="font-bold">Latest payment</p>
                  <p className="mt-1">{latestPayment.code} &middot; {latestPayment.purpose} &middot; {money(latestPayment.amount)}</p>
                  <p className="mt-0.5">{latestPayment.paidOn} &middot; {latestPayment.status}</p>
                  <button onClick={() => openReceipt(latestPayment)} className="mt-2 font-bold underline">View receipt</button>
                </div>
              )}
            </Card>
          </div>

          <Card className="mt-6">
            <div className="border-b border-navy-100 px-6 py-4"><h3 className="font-bold text-navy-900">Payment History</h3></div>
            <div className="divide-y divide-navy-50">
              {payments.map((payment) => (
                <div key={payment.id} className="flex flex-wrap items-center gap-3 px-6 py-3.5">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600"><Wallet size={15} /></span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-navy-900">{payment.purpose} &middot; {money(payment.amount)}</p>
                    <p className="text-xs text-slate-400">{payment.code} &middot; {payment.method || 'Payment'} &middot; {payment.paidOn}</p>
                  </div>
                  <Badge color={paymentColor[payment.status] || 'slate'}>{payment.status}</Badge>
                  <Button tone="ghost" size="sm" onClick={() => openReceipt(payment)}><Printer size={14} /> Receipt</Button>
                </div>
              ))}
              {!payments.length && <p className="px-6 py-8 text-center text-sm text-slate-400">No payments have been recorded for this student yet.</p>}
            </div>
          </Card>
        </>
      )}

      <Modal open={preview} onClose={() => setPreview(false)} title={showStatement ? 'Fee Payment Statement' : 'Payment Receipt'} wide>
        <FeeReceipt
          student={data?.student}
          school={data?.school}
          term={data?.term}
          session={data?.session}
          receipt={receipt}
          statement={statement}
        />
        <div className="mt-5 flex justify-end gap-2">
          <Button tone="ghost" onClick={() => setPreview(false)}>Close</Button>
          <Button tone="primary" onClick={() => window.print()}><Printer size={15} /> Print / Save PDF</Button>
        </div>
      </Modal>
    </div>
  )
}
