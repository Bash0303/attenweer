import { useMemo, useState } from 'react'
import { BookOpen, Plus, BookMarked } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import DataTable, { TableToolbar } from '../../components/ui/DataTable'
import StatCard from '../../components/ui/StatCard'
import { subjects, teachers } from '../../data/mock'

const levelColor = { All: 'navy', Junior: 'emerald', Senior: 'sky', Science: 'violet', Arts: 'gold', Commercial: 'amber' }

export default function AdminSubjects() {
  const [query, setQuery] = useState('')

  const rows = subjects.map((s) => ({
    ...s,
    teacher: teachers.find((t) => t.id === s.teacherId)?.name || '—',
  }))

  const filtered = useMemo(
    () => rows.filter((s) => (s.name + s.code + s.category + s.level).toLowerCase().includes(query.toLowerCase())),
    [query, rows],
  )

  const columns = [
    { key: 'name', label: 'Subject', render: (s) => (
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-cream-100 text-navy-700"><BookOpen size={16} /></span>
        <div>
          <p className="font-semibold text-navy-900">{s.name}</p>
          <p className="text-xs text-slate-400">{s.code}</p>
        </div>
      </div>
    ) },
    { key: 'category', label: 'Category', render: (s) => <Badge color="navy">{s.category}</Badge> },
    { key: 'level', label: 'Level', render: (s) => <Badge color={levelColor[s.level]} dot>{s.level}</Badge> },
    { key: 'teacher', label: 'Assigned Teacher', render: (s) => <span className="text-sm text-slate-600">{s.teacher}</span> },
  ]

  return (
    <div>
      <PageHeader
        title="Subject Management"
        subtitle="Core, science, arts, commercial, Islamic and Arabic subjects"
        actions={<Button tone="primary"><Plus size={16} /> Add Subject</Button>}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={BookOpen} label="Total Subjects" value={subjects.length} sub="secondary" tone="navy" index={0} />
        <StatCard icon={BookMarked} label="Islamic & Arabic" value="3" sub="IRS • Arabic • CRS" tone="emerald" index={1} />
        <StatCard icon={BookOpen} label="Science Track" value="6" sub="Phy • Chem • Bio • FMath" tone="gold" index={2} />
      </div>

      <Card>
        <TableToolbar title="Secondary Subjects" subtitle="Assign subjects to teachers and classes" onSearch={setQuery} placeholder="Search subject…" />
        <DataTable columns={columns} rows={filtered} rowKey="id" />
      </Card>
    </div>
  )
}