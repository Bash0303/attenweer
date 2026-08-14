import { useState } from 'react'
import { FileSpreadsheet, Download, Printer } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import ChildSwitcher from './ChildSwitcher'

const reportItems = [
  { title: 'First Term Report Card', child: 'Abdullahi Jimoh', date: '2025/2026', size: 'PDF', done: true },
  { title: 'Attendance Report — August', child: 'Abdullahi Jimoh', date: 'Aug 2026', size: 'PDF', done: true },
  { title: 'Fee Payment Receipt', child: 'Abdullahi Jimoh', date: '12 Aug 2026', size: 'PDF', done: true },
  { title: 'First Term Report Card', child: 'Abdulrahman Adeleke', date: '2025/2026', size: 'PDF', done: false },
  { title: 'First Term Report Card', child: 'Musa Mohammed', date: '2025/2026', size: 'PDF', done: false },
]

export default function ParentReports() {
  const [child, setChild] = useState('cjk')

  return (
    <div>
      <PageHeader title="Download Reports" subtitle="Termly report cards, receipts and records" />

      <ChildSwitcher value={child} onChange={setChild} />

      <Card className="mt-6">
        <div className="border-b border-navy-100 px-6 py-4"><h3 className="font-bold text-navy-900">Available Downloads</h3></div>
        <div className="divide-y divide-navy-50">
          {reportItems.map((r) => (
            <div key={r.title + r.child} className="flex items-center gap-3 px-6 py-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cream-100 text-navy-700"><FileSpreadsheet size={17} /></span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-navy-900">{r.title}</p>
                <p className="text-xs text-slate-400">{r.child} • {r.date} • {r.size}</p>
              </div>
              <Badge color={r.done ? 'emerald' : 'slate'}>{r.done ? 'Ready' : 'Pending'}</Badge>
              <div className="flex gap-2">
                {r.done ? (
                  <>
                    <Button tone="outline" size="sm" onClick={() => window.print()}><Printer size={14} /> Print</Button>
                    <Button tone="primary" size="sm"><Download size={14} /> Download</Button>
                  </>
                ) : (
                  <Button tone="ghost" size="sm" disabled>Generating…</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}