import { useMemo, useState } from 'react'
import { HeartHandshake, UserPlus } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import DataTable, { TableToolbar } from '../../components/ui/DataTable'
import StatCard from '../../components/ui/StatCard'
import { guardians, students } from '../../data/mock'

export default function AdminParents() {
  const [query, setQuery] = useState('')

  const rows = guardians.map((p) => {
    const kids = students.filter((s) => s.parent.name === p.name)
    return {
      ...p,
      childNames: kids.map((k) => ({ name: k.name, className: k.className })),
      totalChildren: Math.max(kids.length, p.children.length),
    }
  })

  const filtered = useMemo(
    () => rows.filter((p) => (p.name + p.phone + p.email).toLowerCase().includes(query.toLowerCase())),
    [query, rows],
  )

  const columns = [
    { key: 'name', label: 'Parent / Guardian', render: (p) => (
      <div className="flex items-center gap-3">
        <Avatar initials={p.name.split(' ').map(x => x[0]).slice(0, 2).join('')} color="bg-gold-500" size="sm" />
        <div>
          <p className="font-semibold text-navy-900">{p.name}</p>
          <p className="text-xs text-slate-400">{p.relation} • {p.occupation}</p>
        </div>
      </div>
    ) },
    { key: 'phone', label: 'Phone', render: (p) => <span className="text-sm text-slate-600">{p.phone}</span> },
    { key: 'email', label: 'Email', render: (p) => <span className="text-sm text-slate-600">{p.email}</span> },
    { key: 'children', label: 'Children', render: (p) => (
      <div className="flex flex-col gap-0.5">
        {p.childNames.map((c) => <span key={c.name} className="text-sm text-navy-800">{c.name} <span className="text-xs text-slate-400">• {c.className}</span></span>)}
      </div>
    ) },
    { key: 'childrenCount', label: 'No. of Children', render: (p) => <Badge color="navy">{p.totalChildren}</Badge> },
    { key: 'status', label: 'Status', render: () => <Badge color="emerald" dot>Active</Badge> },
  ]

  return (
    <div>
      <PageHeader
        title="Parent / Guardian Management"
        subtitle="Parents linked to students across Primary and Secondary sections"
        actions={<Button tone="primary"><UserPlus size={16} /> Add Parent</Button>}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={HeartHandshake} label="Total Parents" value="980" sub="+5%" tone="gold" index={0} />
        <StatCard icon={HeartHandshake} label="With Portal Access" value="912" sub="93%" tone="emerald" index={1} />
        <StatCard icon={HeartHandshake} label="With 2+ Children" value="164" sub="multi-child" tone="navy" index={2} />
      </div>

      <Card>
        <TableToolbar title="All Parents" subtitle="Search by name, phone or email" onSearch={setQuery} placeholder="Search parent…" />
        <DataTable columns={columns} rows={filtered} rowKey="id" />
      </Card>
    </div>
  )
}