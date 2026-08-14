import { useState } from 'react'
import { PenSquare, Plus, Eye, FileDown, Star } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge, { statusColor } from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import DataTable, { TableToolbar } from '../../components/ui/DataTable'
import ProgressBar from '../../components/ui/ProgressBar'
import { assignments, studentAssignments, students } from '../../data/mock'

export default function TeacherAssignments() {
  const [query, setQuery] = useState('')
  const [create, setCreate] = useState(false)
  const [grade, setGrade] = useState(null)

  const filtered = assignments.filter((a) => (a.title + a.subject).toLowerCase().includes(query.toLowerCase()))

  const columns = [
    { key: 'title', label: 'Assignment', render: (a) => (
      <div><p className="font-semibold text-navy-900">{a.title}</p><p className="text-xs text-slate-400">{a.subject} • {a.className}</p></div>
    ) },
    { key: 'deadline', label: 'Deadline', render: (a) => <span className="text-sm text-slate-600">{a.deadline}</span> },
    { key: 'submissions', label: 'Submissions', render: (a) => <span className="text-sm font-semibold text-navy-800">{a.submissions}/34</span> },
    { key: 'status', label: 'Status', render: (a) => <Badge color={statusColor(a.status)} dot>{a.status}</Badge> },
    { key: 'actions', label: '', right: true, render: (a) => (
      <div className="flex justify-end gap-1">
        <button onClick={() => setGrade(a)} className="grid h-8 w-8 place-items-center rounded-lg text-navy-600 transition hover:bg-navy-50"><Star size={15} /></button>
        <button className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100"><Eye size={15} /></button>
      </div>
    ) },
  ]

  return (
    <div>
      <PageHeader title="Assignments" subtitle="Post, view submissions and grade student work" actions={<Button tone="primary" onClick={() => setCreate(true)}><Plus size={16} /> New Assignment</Button>} />

      <Card>
        <TableToolbar title="My Assignments" subtitle="Across SS 2A and SS 3A" onSearch={setQuery} placeholder="Search assignment…" />
        <DataTable columns={columns} rows={filtered} rowKey="id" onRowClick={(a) => setGrade(a)} />
      </Card>

      <Card className="mt-6">
        <div className="border-b border-navy-100 px-6 py-4"><h3 className="font-bold text-navy-900">Upcoming For Students</h3></div>
        <div className="grid gap-4 p-6 md:grid-cols-2">
          {studentAssignments.map((a) => (
            <div key={a.id} className="rounded-xl border border-navy-100 p-4">
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-cream-100 text-navy-700"><PenSquare size={16} /></span>
                <Badge color={statusColor(a.status)} dot>{a.status}</Badge>
              </div>
              <h4 className="mt-3 font-bold text-navy-900">{a.title}</h4>
              <p className="text-xs text-slate-400">{a.subject} • deadline {a.deadline}</p>
              <div className="mt-3 flex items-center gap-2">
                <ProgressBar value={a.score ? a.score / 20 * 100 : 0} color="bg-navy-600" height="h-1.5" className="flex-1" />
                <span className="text-xs font-semibold text-navy-700">{a.score ? `${a.score}/20` : 'Awaiting'}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Modal open={create} onClose={() => setCreate(false)} title="New Assignment" wide>
        <div className="grid gap-4 sm:grid-cols-2">
          {['Title', 'Class', 'Subject', 'Deadline'].map((f) => (
            <label key={f} className="block">
              <span className="mb-1.5 block text-sm font-semibold text-navy-800">{f}</span>
              <input className="w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none focus:border-navy-400" placeholder={`Enter ${f.toLowerCase()}`} />
            </label>
          ))}
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Description</span>
            <textarea rows={3} className="w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none focus:border-navy-400" placeholder="Instructions…" />
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button tone="ghost" onClick={() => setCreate(false)}>Cancel</Button>
          <Button tone="primary"><FileDown size={15} /> Publish</Button>
        </div>
      </Modal>

      <Modal open={!!grade} onClose={() => setGrade(null)} title={`Submissions — ${grade?.title || ''}`} wide>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-navy-100 text-xs uppercase tracking-wide text-slate-400">
                <th className="px-4 py-2.5 font-semibold">Student</th><th className="px-4 py-2.5 font-semibold">Submitted</th><th className="px-4 py-2.5 font-semibold">File</th><th className="px-4 py-2.5 font-semibold">Score /20</th><th className="px-4 py-2.5 font-semibold">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {students.slice(0, 5).map((s, i) => (
                <tr key={s.id}>
                  <td className="px-4 py-3 font-semibold text-navy-900">{s.name}</td>
                  <td className="px-4 py-3 text-slate-500">{i % 3 === 0 ? 'N/A' : '14 Aug'}</td>
                  <td className="px-4 py-3 text-navy-700">{i % 3 === 0 ? '—' : 'work.pdf'}</td>
                  <td className="px-4 py-3"><input className="w-16 rounded-lg border border-navy-100 px-2 py-1 text-sm" defaultValue={i % 3 === 0 ? '' : [18, 16, 15, 17, 19][i]} /></td>
                  <td className="px-4 py-3"><Badge color="navy">A</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5 flex items-center justify-between">
          <p className="text-xs text-slate-400">Grading saves automatically and notifies students.</p>
          <Button tone="primary" size="sm">Save All Grades</Button>
        </div>
      </Modal>
    </div>
  )
}