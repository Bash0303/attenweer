import { useMemo, useState } from 'react'
import { Users } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Badge, { statusColor } from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import DataTable, { TableToolbar } from '../../components/ui/DataTable'
import StatCard from '../../components/ui/StatCard'
import { students } from '../../data/mock'

export default function TeacherStudents() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(
    () => students.filter((s) => (s.name + s.className).toLowerCase().includes(query.toLowerCase())),
    [query],
  )

  const columns = [
    { key: 'name', label: 'Student', render: (s) => (
      <div className="flex items-center gap-3">
        <Avatar initials={s.initials} color={s.color} size="sm" />
        <div><p className="font-semibold text-navy-900">{s.name}</p><p className="text-xs text-slate-400">{s.email}</p></div>
      </div>
    ) },
    { key: 'class', label: 'Class', render: (s) => <Badge color="navy">{s.className}</Badge> },
    { key: 'parent', label: 'Parent', render: (s) => (
      <div><p className="font-medium text-navy-800">{s.parent.name}</p><p className="text-xs text-slate-400">{s.parent.phone}</p></div>
    ) },
    { key: 'status', label: 'Status', render: (s) => <Badge color={statusColor(s.status)} dot>{s.status}</Badge> },
    { key: 'action', label: '', right: true, render: () => <span className="text-xs font-semibold text-navy-700">View Profile →</span> },
  ]

  return (
    <div>
      <PageHeader title="My Students" subtitle="Students across your assigned classes" />

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <StatCard icon={Users} label="Total Students" value="72" sub="SS 2A + SS 3A" tone="navy" index={0} />
        <StatCard icon={Users} label="Girls / Boys" value="38 / 34" sub="combined" tone="emerald" index={1} />
      </div>

      <Card>
        <TableToolbar title="SS 2A & SS 3A Students" subtitle="Click to open full student profile" onSearch={setQuery} placeholder="Search student…" />
        <DataTable columns={columns} rows={filtered} rowKey="id" />
      </Card>
    </div>
  )
}