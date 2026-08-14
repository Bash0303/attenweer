import { useState } from 'react'
import { BookMarked, Save } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge, { statusColor } from '../../components/ui/Badge'
import DataTable from '../../components/ui/DataTable'

const exams = [
  { title: 'First Term Examination', className: 'SS 2A', date: '21 Sep 2026', status: 'Scheduled', type: 'Term Exam' },
  { title: 'CA Test 2', className: 'SS 2A', date: '10 Sep 2026', status: 'Scheduled', type: 'Continuous Test' },
  { title: 'First Term Examination', className: 'SS 3A', date: '21 Sep 2026', status: 'Scheduled', type: 'Term Exam' },
]

const columns = [
  { key: 'title', label: 'Examination', render: (a) => (
    <div className="flex items-center gap-3">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-cream-100 text-navy-700"><BookMarked size={16} /></span>
      <div><p className="font-semibold text-navy-900">{a.title}</p><p className="text-xs text-slate-400">{a.type}</p></div>
    </div>
  ) },
  { key: 'className', label: 'Class', render: (a) => <Badge color="navy">{a.className}</Badge> },
  { key: 'date', label: 'Date', render: (a) => <span className="text-sm text-slate-600">{a.date}</span> },
  { key: 'status', label: 'Status', render: (a) => <Badge color={statusColor(a.status)} dot>{a.status}</Badge> },
]

export default function TeacherExams() {
  const [subject, setSubject] = useState('Mathematics')

  return (
    <div>
      <PageHeader title="Examinations" subtitle="Enter exam scores and release examination results" />

      <Card className="mb-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Subject</span>
            <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none focus:border-navy-400">
              <option>Mathematics</option><option>English Language</option><option>Literature in English</option>
            </select>
          </label>
          <div className="flex items-end gap-2">
            <Button tone="emerald" size="md"><Save size={15} /> Enter Exam Scores (60)</Button>
          </div>
        </div>
      </Card>

      <Card>
        <div className="border-b border-navy-100 px-6 py-4"><h3 className="font-bold text-navy-900">My Examinations</h3></div>
        <DataTable columns={columns} rows={exams} rowKey="title" />
      </Card>
    </div>
  )
}