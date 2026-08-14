import { BookMarked, Plus, CalendarDays, ClipboardList } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge, { statusColor } from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'
import DataTable from '../../components/ui/DataTable'

const exams = [
  { id: 'EXM-01', title: 'First Term Examination', className: 'SS 2A', term: 'First Term', start: '21 Sep 2026', subjects: 12, status: 'Scheduled' },
  { id: 'EXM-02', title: 'First Term Examination', className: 'SS 3A', term: 'First Term', start: '21 Sep 2026', subjects: 11, status: 'Scheduled' },
  { id: 'EXM-03', title: 'CA Test 2', className: 'JSS 3A', term: 'First Term', start: '10 Sep 2026', subjects: 10, status: 'Scheduled' },
  { id: 'EXM-04', title: 'First Term Examination', className: 'SS 1A', term: 'First Term', start: '21 Sep 2026', subjects: 12, status: 'Draft' },
]

const columns = [
  { key: 'title', label: 'Examination', render: (a) => (
    <div className="flex items-center gap-3">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-cream-100 text-navy-700"><BookMarked size={16} /></span>
      <div><p className="font-semibold text-navy-900">{a.title}</p><p className="text-xs text-slate-400">{a.term}</p></div>
    </div>
  ) },
  { key: 'className', label: 'Class', render: (a) => <Badge color="navy">{a.className}</Badge> },
  { key: 'start', label: 'Start Date', render: (a) => <span className="text-sm text-slate-600">{a.start}</span> },
  { key: 'subjects', label: 'Subjects', render: (a) => <span className="text-sm font-semibold text-navy-800">{a.subjects}</span> },
  { key: 'status', label: 'Status', render: (a) => <Badge color={statusColor(a.status)} dot>{a.status}</Badge> },
]

export default function AdminExams() {
  return (
    <div>
      <PageHeader title="Examination Management" subtitle="Create and schedule examinations for every term" actions={<Button tone="primary"><Plus size={16} /> Create Exam</Button>} />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={BookMarked} label="Scheduled Exams" value="12" sub="this term" tone="navy" index={0} />
        <StatCard icon={CalendarDays} label="Next Exam" value="21 Sep" sub="First Term" tone="gold" index={1} />
        <StatCard icon={ClipboardList} label="Subjects Loaded" value="120" sub="across classes" tone="emerald" index={2} />
      </div>

      <Card>
        <div className="border-b border-navy-100 px-6 py-4">
          <h3 className="font-bold text-navy-900">Examinations — {new Date().getFullYear()}/{new Date().getFullYear() + 1}</h3>
        </div>
        <DataTable columns={columns} rows={exams} rowKey="id" />
      </Card>
    </div>
  )
}