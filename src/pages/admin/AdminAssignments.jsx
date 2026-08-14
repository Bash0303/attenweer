import { useState } from 'react'
import { PenSquare, Plus, Eye } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge, { statusColor } from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import DataTable from '../../components/ui/DataTable'
import { assignments } from '../../data/mock'

export default function AdminAssignments() {
  const [view, setView] = useState(null)
  const [create, setCreate] = useState(false)

  const columns = [
    { key: 'title', label: 'Assignment', render: (a) => (
      <div>
        <p className="font-semibold text-navy-900">{a.title}</p>
        <p className="text-xs text-slate-400">{a.subject}</p>
      </div>
    ) },
    { key: 'className', label: 'Class', render: (a) => <Badge color="navy">{a.className}</Badge> },
    { key: 'teacher', label: 'Teacher', render: (a) => <span className="text-sm text-slate-600">{a.teacher}</span> },
    { key: 'deadline', label: 'Deadline', render: (a) => <span className="text-sm text-slate-600">{a.deadline}</span> },
    { key: 'submissions', label: 'Submissions', render: (a) => <span className="text-sm font-semibold text-navy-800">{a.submissions}/34</span> },
    { key: 'status', label: 'Status', render: (a) => <Badge color={statusColor(a.status)} dot>{a.status}</Badge> },
    { key: 'actions', label: '', right: true, render: (a) => (
      <button onClick={() => setView(a)} className="grid h-8 w-8 place-items-center rounded-lg text-navy-600 transition hover:bg-navy-50"><Eye size={15} /></button>
    ) },
  ]

  return (
    <div>
      <PageHeader
        title="Assignment Management"
        subtitle="Monitor all assignments across the school"
        actions={<Button tone="primary" onClick={() => setCreate(true)}><Plus size={16} /> Create Assignment</Button>}
      />

      <Card>
        <div className="border-b border-navy-100 px-6 py-4">
          <h3 className="font-bold text-navy-900">All Assignments</h3>
          <p className="text-xs text-slate-400">Track submissions, grading and deadlines</p>
        </div>
        <DataTable columns={columns} rows={assignments} rowKey="id" onRowClick={(a) => setView(a)} />
      </Card>

      <Modal open={!!view} onClose={() => setView(null)} title="Assignment Details">
        {view && (
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy-800 text-gold-400"><PenSquare size={18} /></span>
              <div>
                <h4 className="font-extrabold text-navy-900">{view.title}</h4>
                <p className="text-xs text-slate-400">{view.subject} • {view.className}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">{view.desc}</p>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-navy-50 p-3"><p className="text-lg font-extrabold text-navy-900">{view.submissions}</p><p className="text-[11px] text-slate-400">Submitted</p></div>
              <div className="rounded-xl bg-emerald-50 p-3"><p className="text-lg font-extrabold text-emerald-600">{view.deadline.split(' ')[0]}</p><p className="text-[11px] text-slate-400">Deadline</p></div>
              <div className="rounded-xl bg-amber-50 p-3"><p className="text-lg font-extrabold text-amber-600">{Math.max(0, 34 - view.submissions)}</p><p className="text-[11px] text-slate-400">Pending</p></div>
            </div>
            <div className="mt-4 rounded-xl border border-navy-100 p-3 text-sm text-slate-500">
              <p className="font-semibold text-navy-800">Submission Summary</p>
              <p className="mt-1">14 awaiting grading • 12 graded • 8 pending submission</p>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button tone="outline" size="sm">View Submissions</Button>
              <Button tone="primary" size="sm">Grade Now</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={create} onClose={() => setCreate(false)} title="Create Assignment" wide>
        <div className="grid gap-4 sm:grid-cols-2">
          {['Title', 'Class', 'Subject', 'Deadline'].map((f) => (
            <label key={f} className="block">
              <span className="mb-1.5 block text-sm font-semibold text-navy-800">{f}</span>
              <input className="w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none focus:border-navy-400" placeholder={`Enter ${f.toLowerCase()}`} />
            </label>
          ))}
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Description</span>
            <textarea rows={3} className="w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none focus:border-navy-400" placeholder="Assignment instructions…" />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Attachment</span>
            <div className="rounded-xl border-2 border-dashed border-navy-200 bg-navy-50/40 p-3 text-center text-sm text-slate-500">Drop file or click to upload (pdf, doc, image)</div>
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button tone="ghost" onClick={() => setCreate(false)}>Cancel</Button>
          <Button tone="primary">Publish Assignment</Button>
        </div>
      </Modal>
    </div>
  )
}