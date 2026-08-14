import { useState } from 'react'
import { Wallet, CreditCard } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import ProgressBar from '../../components/ui/ProgressBar'
import ChildSwitcher from './ChildSwitcher'
import { feeBreakdownForStudent, balanceOwed, payments } from '../../data/mock'

export default function ParentFees() {
  const [child, setChild] = useState('cjk')

  return (
    <div>
      <PageHeader title="Fees & Payments" subtitle="View bills, pay online and download receipts" />

      <ChildSwitcher value={child} onChange={setChild} />

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="border-b border-navy-100 px-6 py-4"><h3 className="font-bold text-navy-900">Fee Breakdown — {child === 'cjk' ? 'SS 2A' : child === 'cpa' ? 'JSS 3B' : 'Primary 5'}</h3></div>
          <div className="divide-y divide-navy-50">
            {feeBreakdownForStudent.map((f) => (
              <div key={f.label} className="flex items-center justify-between px-6 py-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-navy-900">{f.label}</span>
                    <span className="font-semibold text-navy-900">₦{f.amount.toLocaleString()}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <ProgressBar value={f.paid / f.amount * 100} color="bg-emerald-500" height="h-1.5" className="flex-1" />
                    <span className="text-xs text-slate-400">{f.paid > 0 ? `₦${f.paid.toLocaleString()} paid` : 'unpaid'}</span>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between bg-navy-900 px-6 py-4 text-white">
              <span className="font-bold">Total Balance Due</span>
              <span className="text-lg font-extrabold text-gold-400">₦{balanceOwed.toLocaleString()}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 h-fit">
          <h3 className="font-bold text-navy-900">Payment Options</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-500">
            {['Bank Transfer to the school account', 'Card payment online via this portal', 'POS or cash at the bursar\'s office', 'Instalment plans available on request'].map((t) => (
              <li key={t} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />{t}</li>
            ))}
          </ul>
          <Button className="mt-5 w-full" tone="gold"><CreditCard size={15} /> Pay Now</Button>
          <div className="mt-4 rounded-xl bg-cream-100/70 p-3 text-xs text-slate-500">
            <p className="font-bold text-navy-800">Recent Receipt</p>
            <p className="mt-1">PAY-1045 • Tuition ₦100,000 • 12 Aug 2026</p>
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <div className="border-b border-navy-100 px-6 py-4"><h3 className="font-bold text-navy-900">Payment History</h3></div>
        <div className="divide-y divide-navy-50">
          {payments.filter((p) => p.status !== 'Failed').slice(0, 4).map((p) => (
            <div key={p.id} className="flex items-center gap-3 px-6 py-3.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600"><Wallet size={15} /></span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-navy-900">{p.purpose} — ₦{p.amount.toLocaleString()}</p>
                <p className="text-xs text-slate-400">{p.student} • {p.id} • {p.method} • {p.date}</p>
              </div>
              <Badge color="emerald">Verified</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}