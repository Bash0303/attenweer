import { useState } from 'react'
import { Wallet, Plus, CreditCard } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import ProgressBar from '../../components/ui/ProgressBar'
import Modal from '../../components/ui/Modal'
import StatCard from '../../components/ui/StatCard'
import { classes, feeStructure, totalFees, feeCollectionTrend } from '../../data/mock'

const feeRow = [
  { className: 'SS 2A', total: totalFees, paid: 100000, balance: 85000, debtors: 1430 },
  { className: 'SS 1A', total: totalFees, paid: 148000, balance: 37000, debtors: 1250 },
  { className: 'SS 3A', total: totalFees, paid: 120000, balance: 65000, debtors: 1565 },
  { className: 'JSS 3A', total: 150000, paid: 100000, balance: 50000, debtors: 1120 },
]

export default function AdminFees() {
  const [create, setCreate] = useState(false)

  return (
    <div>
      <PageHeader title="Fee Management" subtitle="Create fee structures per class and publish for parents" actions={<Button tone="primary" onClick={() => setCreate(true)}><Plus size={16} /> Create Fee</Button>} />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={Wallet} label="Total Owed" value="₦1.58M" sub="outstanding" tone="rose" index={0} />
        <StatCard icon={CreditCard} label="Collected (Aug)" value="₦22.5M" sub="+22%" tone="emerald" index={1} />
        <StatCard icon={Wallet} label="Collection Rate" value="83%" sub="session to date" tone="gold" index={2} />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Card>
            <div className="border-b border-navy-100 px-6 py-4">
              <h3 className="font-bold text-navy-900">SS 2 School Fees — {feeStructure && '2025/2026'}</h3>
            </div>
            <div className="divide-y divide-navy-50">
              {[
                ['Tuition', feeStructure.tuition],
                ['ICT Levy', feeStructure.ict],
                ['Development Levy', feeStructure.development],
                ['Examination Fee', feeStructure.exam],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between px-6 py-3.5 text-sm">
                  <span className="text-slate-600">{k}</span>
                  <span className="font-semibold text-navy-900">₦{v.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex items-center justify-between bg-navy-900 px-6 py-4 text-white">
                <span className="font-bold">Total</span>
                <span className="text-lg font-extrabold text-gold-400">₦{totalFees.toLocaleString()}</span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between text-sm"><span className="font-semibold text-navy-800">Collection Progress</span><span className="font-bold text-emerald-600">54%</span></div>
              <ProgressBar value={54} color="bg-emerald-500" className="mt-2" />
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <div className="border-b border-navy-100 px-6 py-4"><h3 className="font-bold text-navy-900">Fee Records by Class</h3></div>
            <div className="divide-y divide-navy-50">
              {feeRow.map((r) => (
                <div key={r.className} className="px-6 py-3.5">
                  <div className="flex items-center justify-between">
                    <Badge color="navy">{r.className}</Badge>
                    <span className="text-xs text-slate-400">Balance</span>
                  </div>
                  <p className="mt-1 text-sm font-extrabold text-rose-600">₦{r.balance.toLocaleString()}</p>
                  <ProgressBar value={Math.round(r.paid / r.total * 100)} color="bg-emerald-500" className="mt-1.5" height="h-1.5" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Card className="mt-6">
        <div className="border-b border-navy-100 px-6 py-4">
          <h3 className="font-bold text-navy-900">Collections Trend</h3>
          <p className="text-xs text-slate-400">Monthly collections in millions (₦)</p>
        </div>
        <div className="flex h-44 items-end gap-2 px-6 pb-6 pt-4">
          {feeCollectionTrend.map((m) => (
            <div key={m.month} className="flex flex-1 flex-col items-center gap-1.5">
              <span className="text-xs font-bold text-navy-800">₦{m.amount}M</span>
              <div className="w-full rounded-t-xl bg-gradient-to-t from-gold-600 to-gold-400" style={{ height: `${m.amount / 22.5 * 100}%`, minHeight: 12 }} />
              <span className="text-[11px] text-slate-400">{m.month}</span>
            </div>
          ))}
        </div>
      </Card>

      <Modal open={create} onClose={() => setCreate(false)} title="Create New Fee">
        <div className="grid gap-4">
          {['Fee Title', 'Class', 'Amount (₦)'].map((f) => (
            <label key={f} className="block">
              <span className="mb-1.5 block text-sm font-semibold text-navy-800">{f}</span>
              <input className="w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none focus:border-navy-400" placeholder={`Enter ${f.toLowerCase()}`} />
            </label>
          ))}
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Publish To</span>
            <select className="w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none focus:border-navy-400">
              {classes.map((c) => <option key={c.id}>{c.name}</option>)}
            </select>
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button tone="ghost" onClick={() => setCreate(false)}>Cancel</Button>
          <Button tone="primary">Publish Fee</Button>
        </div>
      </Modal>
    </div>
  )
}