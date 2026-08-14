import { useMemo, useState } from 'react'
import { School, Plus, Eye } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import ProgressBar from '../../components/ui/ProgressBar'
import DataTable, { TableToolbar } from '../../components/ui/DataTable'
import StatCard from '../../components/ui/StatCard'
import { classes, students } from '../../data/mock'

export default function AdminClasses() {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(
    () => classes.filter((c) => (c.name + c.level + (c.classTeacher || '')).toLowerCase().includes(query.toLowerCase())),
    [query],
  )

  const columns = [
    { key: 'name', label: 'Class', render: (c) => (
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-navy-800 text-xs font-extrabold text-gold-400">{c.name.split(' ')[0]}</span>
        <div>
          <p className="font-semibold text-navy-900">{c.name}</p>
          <p className="text-xs text-slate-400">{c.level}</p>
        </div>
      </div>
    ) },
    { key: 'classTeacher', label: 'Class Teacher', render: (c) => <span className="text-sm text-slate-600">{c.classTeacher || '—'}</span> },
    { key: 'students', label: 'Enrollment', render: (c) => (
      <div className="max-w-[140px]">
        <div className="flex justify-between text-xs"><span className="font-semibold text-navy-900">{c.studentCount} / {c.capacity}</span><span className="text-slate-400">{Math.round(c.studentCount / c.capacity * 100)}%</span></div>
        <ProgressBar value={c.studentCount / c.capacity * 100} color="bg-emerald-500" className="mt-1" height="h-1.5" />
      </div>
    ) },
    { key: 'subjects', label: 'Subjects', render: (c) => <span className="text-sm text-slate-600">{c.subjects ? `${c.subjects.length} assigned` : '8 core'}</span> },
    { key: 'actions', label: '', right: true, render: (c) => (
      <button onClick={(e) => { e.stopPropagation(); setSelected(c) }} className="grid h-8 w-8 place-items-center rounded-lg text-navy-600 transition hover:bg-navy-50"><Eye size={15} /></button>
    ) },
  ]

  return (
    <div>
      <PageHeader
        title="Class Management"
        subtitle="JSS and SS arms — class teachers, subjects, timetable and more"
        actions={<Button tone="primary"><Plus size={16} /> Create Class</Button>}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={School} label="Total Classes" value="42" sub="incl. Primary" tone="navy" index={0} />
        <StatCard icon={School} label="Secondary Arms" value="12" sub="JSS 1 – SS 3" tone="emerald" index={1} />
        <StatCard icon={School} label="Avg Enrollment" value="33" sub="per arm" tone="gold" index={2} />
      </div>

      <Card>
        <TableToolbar title="Secondary Classes" subtitle="12 arms across 6 levels" onSearch={setQuery} placeholder="Search class…" />
        <DataTable columns={columns} rows={filtered} rowKey="id" onRowClick={(c) => setSelected(c)} />
      </Card>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Class ${selected?.name}`}>
        {selected && (
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge color="navy">{selected.level}</Badge>
              <Badge color="emerald" dot>{selected.studentCount} students</Badge>
              <Badge color="gold">Teacher: {selected.classTeacher}</Badge>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[['Subjects', selected.subjects ? selected.subjects.length : 8], ['Timetable', 'Loaded'], ['Attendance', 'Recorded daily'], ['Results', 'First term ready']].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-navy-50/50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{k}</p>
                  <p className="mt-0.5 text-sm font-semibold text-navy-900">{v}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-xl border border-navy-100 p-4">
              <p className="text-sm font-bold text-navy-900">Subjects</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(selected.subjects || ['Mathematics', 'English', 'Basic Science', 'Basic Technology', 'Computer', 'Civic', 'Social Studies', 'Business', 'Islamic Studies', 'Arabic']).map((s) => (
                  <Badge key={s} color="navy">{s}</Badge>
                ))}
              </div>
            </div>
            <div className="mt-5 rounded-xl border border-navy-100 p-4">
              <p className="text-sm font-bold text-navy-900">Sample Students</p>
              <div className="mt-2 space-y-2">
                {students.filter((s) => s.className === selected.name).map((s) => (
                  <div key={s.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium text-navy-800">{s.name}</span>
                    <span className="font-mono text-xs text-slate-400">{s.studentId}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}