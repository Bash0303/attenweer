import { useState } from 'react'
import { CreditCard, Filter } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Badge, { statusColor } from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import StatCard from '../../components/ui/StatCard'
import DataTable, { TableToolbar } from '../../components/ui/DataTable'
import { payments } from '../../data/mock'

export default function AdminPayments() {
  const [query, setQuery] = useState('')

  const filtered = payments.filter((p) => (p.student + p.id + p.ref).toLowerCase().includes(query.toLowerCase()))

  const columns = [
    { key: 'id', label: 'Payment ID', render: (p) => <span className="font-mono text-xs font-semibold text-navy-700">{p.id}</span> },
    { key: 'student', label: 'Student', render: (p) => (
      <div><p className="font-semibold text-navy-900">{p.student}</p><p className="font-mono text-xs text-slate-400">{p.studentId}</p></div>
    ) },
    { key: 'amount', label: 'Amount', render: (p) => <span className="font-bold text-navy-900">₦{p.amount.toLocaleString()}</span> },
    { key: 'purpose', label: 'Purpose', render: (p) => <Badge color="gold">{p.purpose}</Badge> },
    { key: 'method', label: 'Method', render: (p) => <span className="text-sm text-slate-600">{p.method}</span> },
    { key: 'date', label: 'Date', render: (p) => <span className="text-sm text-slate-600">{p.date}</span> },
    { key: 'status', label: 'Status', render: (p) => <Badge color={statusColor(p.status)} dot>{p.status}</Badge> },
  ]

  return (
    <div>
      <PageHeader title="Payments" subtitle="Verify, reconcile and track all fee payments" actions={<Button tone="outline"><Filter size={15} /> Filter</Button>} />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={CreditCard} label="Today's Collections" value="₦1,240,000" sub="12 payments" tone="emerald" index={0} />
        <StatCard icon={CreditCard} label="Pending Verification" value="3" sub="needs review" tone="amber" index={1} />
        <StatCard icon={CreditCard} label="Failed Transactions" value="1" sub="refund/retry" tone="rose" index={2} />
      </div>

      <Card>
        <TableToolbar title="Payment History" subtitle="All payments across the session" onSearch={setQuery} placeholder="Search student, ref…" />
        <DataTable columns={columns} rows={filtered} rowKey="id" />
      </Card>
    </div>
  )
}