import { CheckCircle2, Clock, Trophy, TrendingUp } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import DataTable from '../../components/ui/DataTable'
import StatCard from '../../components/ui/StatCard'
import ChildSwitcher from './ChildSwitcher'
import { EmptyBlock, ErrorBlock, LoadBlock, useChildResource, useParentChildren } from './parentUtils'

const fmtDateTime = (iso) => {
  if (!iso) return '—'
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
}

const columns = [
  {
    key: 'title',
    label: 'CBT',
    render: (row) => (
      <div>
        <p className="font-semibold text-navy-900">{row.title}</p>
        <p className="text-xs text-slate-400">{row.assessmentType} · {row.subject} · {row.className}</p>
      </div>
    ),
  },
  {
    key: 'score',
    label: 'Score',
    render: (row) => row.resultVisible
      ? <span className="font-semibold text-navy-900">{row.score}/{row.totalMarks}</span>
      : <span className="text-xs text-slate-400">Awaiting release</span>,
  },
  {
    key: 'percentage',
    label: 'Percentage',
    render: (row) => row.resultVisible ? <span className="font-semibold text-emerald-600">{row.percentage}%</span> : <span className="text-slate-300">—</span>,
  },
  {
    key: 'correctCount',
    label: 'Correct',
    render: (row) => row.resultVisible ? <span className="text-sm text-slate-600">{row.correctCount}</span> : <span className="text-slate-300">—</span>,
  },
  {
    key: 'status',
    label: 'Status',
    render: (row) => <Badge color={row.status === 'Submitted' ? 'emerald' : 'amber'} dot>{row.status}</Badge>,
  },
  { key: 'submittedAt', label: 'Submitted', render: (row) => <span className="text-xs text-slate-400">{fmtDateTime(row.submittedAt)}</span> },
]

export default function ParentCbt() {
  const { children, child, childId, setChildId, loading, error, reload } = useParentChildren()
  const { data, loading: loadingData, error: dataError, reload: reloadData } = useChildResource('cbt', childId)

  if (loading) return <LoadBlock label="Loading CBT results..." />
  if (error) return <ErrorBlock message={error} onRetry={reload} />
  if (!children.length) {
    return (
      <div>
        <PageHeader title="CBT Results" subtitle="See each child's computer-based test scores" />
        <EmptyBlock title="No children linked yet" message="Ask the school administrator to link your parent account to your children." />
      </div>
    )
  }

  const rows = data?.data || []
  const stats = data?.stats || {}

  return (
    <div>
      <PageHeader title="CBT Results" subtitle="See each child's computer-based test scores" />

      <ChildSwitcher children={children} value={childId} onChange={setChildId} />

      {dataError && <div className="mt-4"><ErrorBlock message={dataError} onRetry={reloadData} /></div>}
      {loadingData && !data && <LoadBlock label="Loading CBT results..." />}

      {data && (
        <>
          <div className="mt-6 mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={CheckCircle2} label="Completed" value={stats.completed || 0} sub="submitted" tone="emerald" index={0} />
            <StatCard icon={Clock} label="In Progress" value={stats.inProgress || 0} sub="ongoing" tone="gold" index={1} />
            <StatCard icon={TrendingUp} label="Average" value={`${stats.averagePercentage || 0}%`} sub="released scores" tone="navy" index={2} />
            <StatCard icon={Trophy} label="Highest" value={`${stats.highest || 0}%`} sub="best result" tone="sky" index={3} />
          </div>

          <Card>
            <div className="border-b border-navy-100 px-6 py-4">
              <h3 className="font-bold text-navy-900">{child?.name} &middot; {child?.className}</h3>
              <p className="text-xs text-slate-400">Scores appear when the teacher releases them.</p>
            </div>

            {rows.length ? (
              <DataTable columns={columns} rows={rows} rowKey="attemptId" />
            ) : (
              <p className="px-6 py-12 text-center text-sm text-slate-400">This child has not attempted any CBT yet.</p>
            )}
          </Card>
        </>
      )}
    </div>
  )
}
