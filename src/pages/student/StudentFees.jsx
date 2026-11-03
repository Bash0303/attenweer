import { useEffect, useState } from 'react'
import { Wallet, CreditCard, CheckCircle2, Printer, FileText } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'
import ProgressBar from '../../components/ui/ProgressBar'
import Modal from '../../components/ui/Modal'
import FeeReceipt from '../../components/fees/FeeReceipt'
import { student } from '../../services/api'

const money = (value) => `\u20A6${Number(value || 0).toLocaleString()}`
const paymentColor = { Verified: 'emerald', Pending: 'amber', Failed: 'rose', Rejected: 'rose' }

export default function StudentFees() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [termId, setTermId] = useState('')
  const [receipt, setReceipt] = useState(null)
  const [showStatement, setShowStatement] = useState(false)
  const [preview, setPreview] = useState(false)

  const load = async (selectedTermId = '') => {
    setLoading(true)
    setError(null)
    try {
      const res = await student.fees(selectedTermId ? { termId: selectedTermId } : undefined)
      setData(res)
      if (res.termId && !selectedTermId) setTermId(String(res.termId))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const changeTerm = (value) => {
    setTermId(value)
    load(value)
  }

  const openReceipt = (payment) => {
    setReceipt({ ...payment, balance: data?.totals?.balance ?? 0 })
    setShowStatement(false)
    setPreview(true)
  }

  const openStatement = () => {
    setReceipt(null)
    setShowStatement(true)
    setPreview(true)
  }

  if (loading && !data) {
    return <div className="flex min-h-[60vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-navy-100 border-t-navy-700" /></div>
  }

  const fees = data?.data || []
  const payments = data?.payments || []
  const totals = data?.totals || { due: 0, paid: 0, balance: 0, rate: 0 }
  const terms = data?.terms || []
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
        title="My Fees"
        subtitle="Fee breakdown, balances and printable receipts"
        actions={data?.completed ? <Button tone="primary" onClick={openStatement}><Printer size={15} /> Print Statement</Button> : undefined}
      />

      {error && <div className="mb-6 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">{error}</div>}

      {terms.length > 0 && (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-navy-800">Term</span>
          {terms.map((term) => (
            <button
              key={term.id}
              onClick={() => changeTerm(String(term.id))}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${String(term.id) === String(termId) ? 'bg-navy-800 text-white' : 'border border-navy-100 bg-white text-slate-500 hover:bg-navy-50'}`}
            >
              {term.label}
            </button>
          ))}
        </div>
      )}

      {data?.completed && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
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

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={Wallet} label="Total Fees" value={money(totals.due)} sub={data?.session || 'current term'} tone="navy" index={0} />
        <StatCard icon={Wallet} label="Amount Paid" value={money(totals.paid)} sub="verified payments" tone="emerald" index={1} />
        <StatCard icon={Wallet} label="Balance Owed" value={money(totals.balance)} sub={data?.completed ? 'completed' : 'outstanding'} tone={data?.completed ? 'emerald' : 'rose'} index={2} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="border-b border-navy-100 px-6 py-4">
            <h3 className="font-bold text-navy-900">Fee Breakdown {data?.student?.className ? `\u2022 ${data.student.className}` : ''}</h3>
            <p className="text-xs text-slate-400">{data?.session} {data?.term}</p>
          </div>
          <div className="divide-y divide-navy-50">
            {fees.map((fee) => (
              <div key={fee.id}>
                {fee.items.map((item) => (
                  <div key={`${fee.id}-${item.label}`} className="flex items-center justify-between px-6 py-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-navy-900">{item.label}</span>
                        <span className="font-semibold text-navy-900">{money(item.amount)}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="px-6 pb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-600">Paid</span>
                    <span className="font-semibold text-navy-900">{money(fee.paid)} of {money(fee.due)}</span>
                  </div>
                  <ProgressBar value={fee.due ? Math.min(100, Math.round((fee.paid / fee.due) * 100)) : 100} color={fee.balance > 0 ? 'bg-gold-500' : 'bg-emerald-500'} height="h-1.5" className="mt-2" />
                </div>
              </div>
            ))}
            {!fees.length && <p className="px-6 py-8 text-center text-sm text-slate-400">No fee bill has been published for this term.</p>}
            <div className="flex items-center justify-between bg-navy-900 px-6 py-4 text-white">
              <span className="font-bold">Total Balance Due</span>
              <span className="text-lg font-extrabold text-gold-400">{money(totals.balance)}</span>
            </div>
          </div>
        </Card>

        <Card className="h-fit p-6">
          <h3 className="font-bold text-navy-900">Payment Summary</h3>
          <div className="mt-4 space-y-3">
            {[['Total', money(totals.due), 'navy'], ['Paid', money(totals.paid), 'emerald'], ['Balance', money(totals.balance), 'rose']].map(([label, value, tone]) => (
              <div key={label} className={`flex items-center justify-between rounded-xl p-3 text-sm ${tone === 'navy' ? 'bg-navy-50' : tone === 'emerald' ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                <span className={`font-medium ${tone === 'navy' ? 'text-navy-800' : tone === 'emerald' ? 'text-emerald-700' : 'text-rose-700'}`}>{label}</span>
                <span className="font-extrabold text-navy-900">{value}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-xl bg-cream-100/70 p-3 text-xs text-slate-500">
            <p className="flex items-center gap-1.5 font-bold text-navy-800"><CreditCard size={13} /> Payments are recorded by the bursary</p>
            <p className="mt-1">Pay at the school office. Your balance updates here once the bursary records the payment.</p>
          </div>
          {data?.completed && <Button className="mt-4 w-full" tone="emerald" onClick={openStatement}><Printer size={15} /> Print Payment Statement</Button>}
        </Card>
      </div>

      <Card className="mt-6">
        <div className="border-b border-navy-100 px-6 py-4"><h3 className="font-bold text-navy-900">Payment History</h3></div>
        <div className="divide-y divide-navy-50">
          {payments.map((payment) => (
            <div key={payment.id} className="flex flex-wrap items-center gap-3 px-6 py-3.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600"><CheckCircle2 size={16} /></span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-navy-900">{payment.purpose} &middot; {money(payment.amount)}</p>
                <p className="text-xs text-slate-400">{payment.code} &middot; {payment.method} &middot; {payment.paidOn}</p>
              </div>
              <Badge color={paymentColor[payment.status] || 'slate'}>{payment.status}</Badge>
              <Button tone="ghost" size="sm" onClick={() => openReceipt(payment)}><Printer size={14} /> Receipt</Button>
            </div>
          ))}
          {!payments.length && <p className="px-6 py-8 text-center text-sm text-slate-400">No payments have been recorded yet.</p>}
        </div>
      </Card>

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
