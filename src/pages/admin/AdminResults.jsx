import { useState } from 'react'
import { Lock, Eye, CheckCircle2 } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Modal from '../../components/ui/Modal'
import Badge, { statusColor } from '../../components/ui/Badge'
import DataTable from '../../components/ui/DataTable'
import ReportCard from '../../components/report/ReportCard'
import { resultData, students } from '../../data/mock'

const resultStatuses = [
  { className: 'SS 2A', status: 'Approved', submitted: 'Mrs. Ramat Ibrahim' },
  { className: 'SS 3A', status: 'Under Review', submitted: 'Mr. Ismail Bello' },
  { className: 'SS 1A', status: 'Submitted', submitted: 'Mrs. Amina Suleiman' },
  { className: 'SS 2B', status: 'Pending', submitted: 'Mr. Femi Ajayi' },
  { className: 'SS 3B', status: 'Pending', submitted: 'Mrs. Zainab Yusuf' },
]

export default function AdminResults() {
  const [preview, setPreview] = useState(null)

  const columns = [
    { key: 'className', label: 'Class', render: (r) => (
      <span className="font-semibold text-navy-900">{r.className}</span>
    ) },
    { key: 'teacher', label: 'Class Teacher', render: (r) => <span className="text-sm text-slate-600">{r.submitted}</span> },
    { key: 'status', label: 'Status', render: (r) => <Badge color={statusColor(r.status)} dot>{r.status}</Badge> },
    { key: 'actions', label: '', right: true, render: (r) => (
      <div className="flex justify-end gap-1">
        <button onClick={() => setPreview(r)} className="grid h-8 w-8 place-items-center rounded-lg text-navy-600 transition hover:bg-navy-50"><Eye size={15} /></button>
        {r.status === 'Submitted' && <button className="grid h-8 w-8 place-items-center rounded-lg text-emerald-600 transition hover:bg-emerald-50"><CheckCircle2 size={15} /></button>}
        <button className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100"><Lock size={15} /></button>
      </div>
    ) },
  ]

  const student = students[0]

  return (
    <div>
      <PageHeader title="Result Processing" subtitle="Review, verify, approve and publish results per class" />

      <Card className="mb-6 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            <strong className="text-navy-800">Workflow:</strong> Teacher submits → HOD reviews → Admin verifies → Approved → Published
          </p>
          <Badge color="emerald" dot>Lock after approval enabled</Badge>
        </div>
      </Card>

      <Card>
        <div className="border-b border-navy-100 px-6 py-4">
          <h3 className="font-bold text-navy-900">First Term Results — 2025/2026</h3>
          <p className="text-xs text-slate-400">All secondary classes</p>
        </div>
        <DataTable columns={columns} rows={resultStatuses} rowKey="className" />
      </Card>

      <Modal open={!!preview} onClose={() => setPreview(null)} title={`${preview?.className} Result Preview`} wide>
        <ReportCard student={{ ...student, className: preview?.className }} rows={resultData['SS 2A'] || resultData['SS 1A']} showActions={false} />
      </Modal>
    </div>
  )
}