import { PenSquare } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import ChildSwitcher from './ChildSwitcher'
import { EmptyBlock, ErrorBlock, LoadBlock, useChildResource, useParentChildren } from './parentUtils'

const statusBadge = { Open: 'amber', Graded: 'navy', Closed: 'slate' }

export default function ParentAssignments() {
  const { children, child, childId, setChildId, loading, error, reload } = useParentChildren()
  const { data, loading: loadingData, error: dataError, reload: reloadData } = useChildResource('assignments', childId)

  if (loading) return <LoadBlock label="Loading assignments..." />
  if (error) return <ErrorBlock message={error} onRetry={reload} />
  if (!children.length) {
    return (
      <div>
        <PageHeader title="Assignments" subtitle="Monitor your child's assignments and submissions" />
        <EmptyBlock title="No children linked yet" message="Ask the school administrator to link your parent account to your children." />
      </div>
    )
  }

  const assignments = data?.data || []
  const stats = data?.stats || { total: 0, open: 0, graded: 0, closed: 0 }

  return (
    <div>
      <PageHeader title="Assignments" subtitle="Monitor your child's assignments and submissions" />

      <ChildSwitcher children={children} value={childId} onChange={setChildId} />

      {dataError && <div className="mt-4"><ErrorBlock message={dataError} onRetry={reloadData} /></div>}
      {loadingData && !data && <LoadBlock label="Loading assignments..." />}

      {data && (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
              <p className="text-2xl font-extrabold text-navy-900">{stats.total}</p>
              <p className="text-sm font-medium text-slate-500">Assigned</p>
            </div>
            <div className="rounded-2xl border border-navy-100 bg-amber-50/60 p-5 shadow-card">
              <p className="text-2xl font-extrabold text-navy-900">{stats.open}</p>
              <p className="text-sm font-medium text-slate-500">Open</p>
            </div>
            <div className="rounded-2xl border border-navy-100 bg-emerald-50/60 p-5 shadow-card">
              <p className="text-2xl font-extrabold text-navy-900">{stats.graded}</p>
              <p className="text-sm font-medium text-slate-500">Graded</p>
            </div>
            <div className="rounded-2xl border border-navy-100 bg-navy-50/60 p-5 shadow-card">
              <p className="text-2xl font-extrabold text-navy-900">{stats.closed}</p>
              <p className="text-sm font-medium text-slate-500">Closed</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {assignments.map((assignment) => (
              <Card key={assignment.id} hover className="p-5">
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-navy-800 text-gold-400"><PenSquare size={16} /></span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-bold text-navy-900">{assignment.title}</h4>
                      <Badge color={statusBadge[assignment.status] || 'slate'} dot>{assignment.status}</Badge>
                    </div>
                    <p className="text-xs text-slate-400">{assignment.subject || 'General'} &middot; {assignment.teacher || 'Unassigned'}</p>
                    {assignment.description && <p className="mt-2 text-sm leading-relaxed text-slate-500">{assignment.description}</p>}
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-semibold text-navy-700">Deadline: {assignment.deadline || 'Not set'}</span>
                      <span className="text-slate-400">{assignment.type || 'Assignment'} &middot; {assignment.submissions ?? 0}/{assignment.totalStudents ?? 0} submitted</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {!assignments.length && (
            <div className="mt-6">
              <EmptyBlock title="No assignments yet" message={`${child?.name || 'Your child'} has no assignments for ${child?.className || 'this class'} at the moment.`} />
            </div>
          )}
        </>
      )}
    </div>
  )
}
