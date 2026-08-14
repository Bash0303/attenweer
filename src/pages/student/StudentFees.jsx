import { Wallet, CreditCard, CheckCircle2 } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'
import ProgressBar from '../../components/ui/ProgressBar'
import { feeBreakdownForStudent, totalFees, paidSoFar, balanceOwed, payments } from '../../data/mock'

export default function StudentFees() {
  const myPayments = payments.filter((p) => p.student === 'Abdullahi Jimoh')

  return (
    <div>
      <PageHeader title="My Fees" subtitle="Fee breakdown and payment history" actions={<Button tone="gold"><CreditCard size={15} /> Pay Now</Button>} />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={Wallet} label="Total Fees" value={`₦${totalFees.toLocaleString()}`} sub="session 2025/2026" tone="navy" index={0} />
        <StatCard icon={Wallet} label="Amount Paid" value={`₦${paidSoFar.toLocaleString()}`} sub="verified" tone="emerald" index={1} />
        <StatCard icon={Wallet} label="Balance Owed" value={`₦${balanceOwed.toLocaleString()}`} sub="due 30 Sep" tone="rose" index={2} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="border-b border-navy-100 px-6 py-4"><h3 className="font-bold text-navy-900">Fee Breakdown — SS 2A</h3></div>
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
          <h3 className="font-bold text-navy-900">Payment Summary</h3>
          <div className="mt-4 space-y-3">
            {[['Total', `₦${totalFees.toLocaleString()}`, 'navy'], ['Paid', `₦${paidSoFar.toLocaleString()}`, 'emerald'], ['Balance', `₦${balanceOwed.toLocaleString()}`, 'rose']].map(([k, v, c]) => (
              <div key={k} className={`flex items-center justify-between rounded-xl p-3 text-sm ${c === 'navy' ? 'bg-navy-50' : c === 'emerald' ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                <span className={`font-medium ${c === 'navy' ? 'text-navy-800' : c === 'emerald' ? 'text-emerald-700' : 'text-rose-700'}`}>{k}</span>
                <span className="font-extrabold text-navy-900">{v}</span>
              </div>
            ))}
          </div>
          <Button className="mt-5 w-full" tone="gold"><CreditCard size={15} /> Pay Now Online</Button>
          <p className="mt-2 text-center text-[11px] text-slate-400">Bank transfer, card, POS or cash at the bursar's office</p>
        </Card>
      </div>

      <Card className="mt-6">
        <div className="border-b border-navy-100 px-6 py-4"><h3 className="font-bold text-navy-900">Payment History</h3></div>
        <div className="divide-y divide-navy-50">
          {myPayments.length === 0 ? (
            <div className="flex items-center gap-3 px-6 py-6 text-sm text-slate-400">
              <CheckCircle2 size={18} className="text-emerald-500" /> No direct payments yet — demo account shows school-level records.
            </div>
          ) : myPayments.map((p) => (
            <div key={p.id} className="flex items-center gap-3 px-6 py-3.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600"><CheckCircle2 size={16} /></span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-navy-900">{p.purpose} — ₦{p.amount.toLocaleString()}</p>
                <p className="text-xs text-slate-400">{p.id} • {p.method} • {p.date}</p>
              </div>
              <Badge color="emerald">Verified</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}