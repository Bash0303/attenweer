import { useMemo, useState } from 'react'
import { UserPlus, GraduationCap } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge, { statusColor } from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import Modal from '../../components/ui/Modal'
import DataTable, { TableToolbar } from '../../components/ui/DataTable'
import StatCard from '../../components/ui/StatCard'
import { teachers } from '../../data/mock'

export default function AdminTeachers() {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [addOpen, setAddOpen] = useState(false)

  const filtered = useMemo(
    () => teachers.filter((t) => (t.name + t.staffId + t.dept + t.subjects.join(' ')).toLowerCase().includes(query.toLowerCase())),
    [query],
  )

  const columns = [
    { key: 'name', label: 'Teacher', render: (t) => (
      <div className="flex items-center gap-3">
        <Avatar initials={t.initials} color={t.color} size="sm" />
        <div>
          <p className="font-semibold text-navy-900">{t.name}</p>
          <p className="text-xs text-slate-400">{t.qualification}</p>
        </div>
      </div>
    ) },
    { key: 'staffId', label: 'Staff ID', render: (t) => <span className="font-mono text-xs font-semibold text-navy-700">{t.staffId}</span> },
    { key: 'dept', label: 'Department', render: (t) => <Badge color="navy">{t.dept}</Badge> },
    { key: 'subjects', label: 'Subjects', render: (t) => (
      <div className="flex flex-wrap gap-1">
        {t.subjects.map((s) => <span key={s} className="rounded-full bg-cream-100 px-2 py-0.5 text-[11px] font-semibold text-navy-700">{s}</span>)}
      </div>
    ) },
    { key: 'classTeacher', label: 'Class Teacher', render: (t) => <span className="text-sm text-slate-600">{t.classTeacher}</span> },
    { key: 'status', label: 'Status', render: (t) => <Badge color={statusColor(t.status)} dot>{t.status}</Badge> },
    { key: 'phone', label: 'Phone', render: (t) => <span className="text-sm text-slate-600">{t.phone}</span> },
  ]

  return (
    <div>
      <PageHeader
        title="Teacher Management"
        subtitle="Create accounts, assign subjects and classes"
        actions={<Button tone="primary" onClick={() => setAddOpen(true)}><UserPlus size={16} /> Add Teacher</Button>}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={GraduationCap} label="Total Staff" value="98" sub="85 academic" tone="navy" index={0} />
        <StatCard icon={GraduationCap} label="Active Teachers" value="85" sub="13 on leave" tone="emerald" index={1} />
        <StatCard icon={GraduationCap} label="Class Teachers" value="42" sub="1 per arm" tone="gold" index={2} />
      </div>

      <Card>
        <TableToolbar title="All Teachers" subtitle="Search by name, subject or department" onSearch={setQuery} placeholder="Search teacher, subject…" />
        <DataTable columns={columns} rows={filtered} rowKey="id" onRowClick={(t) => setSelected(t)} />
      </Card>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Teacher Profile">
        {selected && (
          <div>
            <div className="flex items-center gap-4">
              <Avatar initials={selected.initials} color={selected.color} size="xl" />
              <div>
                <h4 className="text-lg font-extrabold text-navy-900">{selected.name}</h4>
                <p className="font-mono text-xs font-semibold text-navy-600">{selected.staffId}</p>
                <div className="mt-2"><Badge color={statusColor(selected.status)} dot>{selected.status}</Badge></div>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[['Department', selected.dept], ['Qualification', selected.qualification], ['Phone', selected.phone], ['Email', selected.email], ['Class Teacher', selected.classTeacher], ['Gender', selected.gender]].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-navy-50/50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{k}</p>
                  <p className="mt-0.5 truncate text-sm font-semibold text-navy-900">{v}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-xl border border-navy-100 p-4">
              <p className="text-sm font-bold text-navy-900">Subjects Assigned</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {selected.subjects.map((s) => <Badge key={s} color="gold">{s}</Badge>)}
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button tone="outline" size="sm">Assign Subjects</Button>
              <Button tone="primary" size="sm">Edit Profile</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add New Teacher" wide>
        <div className="grid gap-4 sm:grid-cols-2">
          {['Full Name', 'Staff ID', 'Phone Number', 'Email Address', 'Qualification', 'Department', 'Gender', 'Employment Status'].map((f) => (
            <label key={f} className="block">
              <span className="mb-1.5 block text-sm font-semibold text-navy-800">{f}</span>
              <input className="w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none transition focus:border-navy-400 focus:ring-2 focus:ring-navy-100" placeholder={`Enter ${f.toLowerCase()}`} />
            </label>
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button tone="ghost" onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button tone="primary">Create Account</Button>
        </div>
      </Modal>
    </div>
  )
}