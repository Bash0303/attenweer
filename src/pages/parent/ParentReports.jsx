import { ChevronRight, FileSpreadsheet } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { EmptyBlock, ErrorBlock, LoadBlock, money, useParentChildren } from './parentUtils'

export default function ParentReports() {
  const navigate = useNavigate()
  const { children, loading, error, reload } = useParentChildren()

  if (loading) return <LoadBlock label="Loading reports..." />
  if (error) return <ErrorBlock message={error} onRetry={reload} />
  if (!children.length) {
    return (
      <div>
        <PageHeader title="Download Reports" subtitle="Termly report cards, receipts and records" />
        <EmptyBlock title="No children linked yet" message="Ask the school administrator to link your parent account to your children." />
      </div>
    )
  }

  const items = children.flatMap((child) => [
    {
      key: `results-${child.id}`,
      title: 'Termly Report Card',
      child,
      type: 'Results',
      status: child.average !== null ? 'Ready' : 'Pending',
      note: child.average !== null ? `Average ${child.average}%${child.grade ? ` - Grade ${child.grade}` : ''}` : 'Awaiting approved results',
      path: '/parent/results',
    },
    {
      key: `fees-${child.id}`,
      title: 'Fee Statement',
      child,
      type: 'Fees',
      status: child.fees.due ? 'Ready' : 'Pending',
      note: child.fees.due ? `${money(child.fees.balance)} balance` : 'No fee bill published',
      path: '/parent/fees',
    },
    {
      key: `attendance-${child.id}`,
      title: 'Attendance Record',
      child,
      type: 'Attendance',
      status: child.attendance.total ? 'Ready' : 'Pending',
      note: child.attendance.total ? `${child.attendance.rate}% attendance rate` : 'No attendance recorded',
      path: '/parent/attendance',
    },
  ])

  const openItem = (item) => {
    sessionStorage.setItem('wgs.parentChild', String(item.child.id))
    navigate(item.path)
  }

  return (
    <div>
      <PageHeader title="Download Reports" subtitle="Termly report cards, receipts and records" />

      <Card>
        <div className="border-b border-navy-100 px-6 py-4"><h3 className="font-bold text-navy-900">Available Reports</h3></div>
        <div className="divide-y divide-navy-50">
          {items.map((item) => (
            <div key={item.key} className="flex flex-wrap items-center gap-3 px-6 py-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cream-100 text-navy-700"><FileSpreadsheet size={17} /></span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-navy-900">{item.title}</p>
                <p className="text-xs text-slate-400">{item.child.name} &middot; {item.child.className} &middot; {item.note}</p>
              </div>
              <Badge color={item.status === 'Ready' ? 'emerald' : 'slate'}>{item.status}</Badge>
              <button
                onClick={() => openItem(item)}
                disabled={item.status !== 'Ready'}
                className="inline-flex items-center gap-1 rounded-lg bg-navy-800 px-3 py-2 text-xs font-bold text-white transition hover:bg-navy-900 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
              >
                Open <ChevronRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
