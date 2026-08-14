import { useMemo, useState } from 'react'
import { UserPlus, Mail, Phone, Pencil, Trash2, Eye, Users } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Modal from '../../components/ui/Modal'
import Badge, { statusColor } from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import ProgressBar from '../../components/ui/ProgressBar'
import DataTable, { TableToolbar } from '../../components/ui/DataTable'
import StatCard from '../../components/ui/StatCard'
import { students, attendanceRate, totalFees, balanceOwed } from '../../data/mock'

export default function AdminStudents() {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [addOpen, setAddOpen] = useState(false)

  const filtered = useMemo(
    () => students.filter((s) => (s.name + s.studentId + s.className).toLowerCase().includes(query.toLowerCase())),
    [query],
  )

  const columns = [
    { key: 'name', label: 'Student', render: (s) => (
      <div className="flex items-center gap-3">
        <Avatar initials={s.initials} color={s.color} size="sm" />
        <div>
          <p className="font-semibold text-navy-900">{s.name}</p>
          <p className="text-xs text-slate-400">{s.email}</p>
        </div>
      </div>
    ) },
    { key: 'studentId', label: 'Student ID', render: (s) => <span className="font-mono text-xs font-semibold text-navy-700">{s.studentId}</span> },
    { key: 'class', label: 'Class', render: (s) => <Badge color="navy">{s.className}</Badge> },
    { key: 'gender', label: 'Gender' },
    { key: 'parent', label: 'Parent / Guardian', render: (s) => (
      <div>
        <p className="font-medium text-navy-800">{s.parent.name}</p>
        <p className="text-xs text-slate-400">{s.parent.phone}</p>
      </div>
    ) },
    { key: 'house', label: 'House', render: (s) => <Badge color="gold" dot>{s.house}</Badge> },
    { key: 'status', label: 'Status', render: (s) => <Badge color={statusColor(s.status)} dot>{s.status}</Badge> },
    { key: 'actions', label: '', right: true, render: (s) => (
      <div className="flex justify-end gap-1">
        <button onClick={(e) => { e.stopPropagation(); setSelected(s) }} className="grid h-8 w-8 place-items-center rounded-lg text-navy-600 transition hover:bg-navy-50"><Eye size={15} /></button>
        <button className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-amber-50 hover:text-gold-600"><Pencil size={15} /></button>
        <button className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"><Trash2 size={15} /></button>
      </div>
    ) },
  ]

  return (
    <div>
      <PageHeader
        title="Student Management"
        subtitle={`${students.length} of 1,250 students displayed (demo data)`}
        actions={<Button tone="primary" onClick={() => setAddOpen(true)}><UserPlus size={16} /> Add Student</Button>}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={Users} label="Active Students" value="1,217" sub="+8%" tone="navy" index={0} />
        <StatCard icon={Users} label="Male / Female" value="645 / 605" sub="51% / 49%" tone="sky" index={1} />
        <StatCard icon={Users} label="Suspended" value="6" sub="review" tone="rose" index={2} />
      </div>

      <Card>
        <TableToolbar title="All Students" subtitle="Search, edit, promote, transfer or manage records" onSearch={setQuery} placeholder="Search student, ID, class…" />
        <DataTable columns={columns} rows={filtered} rowKey="id" onRowClick={(s) => setSelected(s)} />
      </Card>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Student Profile" wide>
        {selected && (
          <div>
            <div className="flex flex-wrap items-center gap-5">
              <Avatar initials={selected.initials} color={selected.color} size="xl" />
              <div className="min-w-0 flex-1">
                <h4 className="text-xl font-extrabold text-navy-900">{selected.name}</h4>
                <p className="font-mono text-xs font-semibold text-navy-600">{selected.studentId}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge color="navy">{selected.className}</Badge>
                  <Badge color="gold" dot>{selected.house}</Badge>
                  <Badge color={statusColor(selected.status)} dot>{selected.status}</Badge>
                </div>
              </div>
              <Button tone="outline" size="sm"><Pencil size={14} /> Edit</Button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[['Gender', selected.gender], ['Date of Birth', selected.dob], ['Session', selected.session], ['Admission Type', selected.admission], ['Phone', selected.phone], ['Email', selected.email]].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-navy-50/50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{k}</p>
                  <p className="mt-0.5 truncate text-sm font-semibold text-navy-900">{v}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-navy-100 p-4">
              <div className="flex items-center gap-3">
                <Avatar initials={selected.parent.name.split(' ').map(x => x[0]).slice(0, 2).join('')} color="bg-gold-500" />
                <div>
                  <p className="text-sm font-bold text-navy-900">{selected.parent.name}</p>
                  <p className="text-xs text-slate-400">Parent / Guardian • {selected.parent.phone}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-navy-100 p-4">
                <p className="text-sm font-bold text-navy-900">Attendance (Term)</p>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-slate-500">Attendance rate</span>
                  <span className="font-bold text-emerald-600">{attendanceRate}%</span>
                </div>
                <ProgressBar value={attendanceRate} color="bg-emerald-500" className="mt-2" />
              </div>
              <div className="rounded-xl border border-navy-100 p-4">
                <p className="text-sm font-bold text-navy-900">Fees Balance</p>
                <p className="mt-2 text-2xl font-extrabold text-rose-600">₦{balanceOwed.toLocaleString()}</p>
                <p className="text-xs text-slate-400">of ₦{totalFees.toLocaleString()} total • paid ₦{(100000).toLocaleString()}</p>
                <ProgressBar value={Math.round(100000 / totalFees * 100)} color="bg-gold-500" className="mt-2" />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <Button tone="outline" size="sm"><Pencil size={14} /> Promote</Button>
              <Button tone="outline" size="sm"><Phone size={14} /> Transfer</Button>
              <Button tone="gold" size="sm"><Mail size={14} /> Notify Parent</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add New Student" wide>
        <div className="grid gap-4 sm:grid-cols-2">
          {['Full Name', 'Date of Birth', 'Phone Number', 'Email Address', 'Class', 'House', 'Parent Name', 'Parent Phone'].map((f) => (
            <label key={f} className="block">
              <span className="mb-1.5 block text-sm font-semibold text-navy-800">{f}</span>
              <input className="w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none transition focus:border-navy-400 focus:ring-2 focus:ring-navy-100" placeholder={`Enter ${f.toLowerCase()}`} />
            </label>
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button tone="ghost" onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button tone="primary">Save Student</Button>
        </div>
      </Modal>
    </div>
  )
}