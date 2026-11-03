import { BookMarked, CalendarDays } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import ChildSwitcher from './ChildSwitcher'
import { EmptyBlock, ErrorBlock, LoadBlock, useChildResource, useParentChildren } from './parentUtils'

const statusColor = { Scheduled: 'amber', Completed: 'emerald', Draft: 'slate' }

export default function ParentExams() {
  const navigate = useNavigate()
  const { children, child, childId, setChildId, loading, error, reload } = useParentChildren()
  const { data, loading: loadingData, error: dataError, reload: reloadData } = useChildResource('exams', childId)

  if (loading) return <LoadBlock label="Loading examinations..." />
  if (error) return <ErrorBlock message={error} onRetry={reload} />
  if (!children.length) {
    return (
      <div>
        <PageHeader title="Examinations" subtitle="Exam schedules and results across all children" />
        <EmptyBlock title="No children linked yet" message="Ask the school administrator to link your parent account to your children." />
      </div>
    )
  }

  const exams = data?.data || []

  const openResults = () => {
    if (childId) sessionStorage.setItem('wgs.parentChild', String(childId))
    navigate('/parent/results')
  }

  return (
    <div>
      <PageHeader
        title="Examinations"
        subtitle="Exam schedules and results across all children"
        actions={data?.stats?.nextExam ? <Badge color="amber" dot>Next: {data.stats.nextExam}</Badge> : undefined}
      />

      <ChildSwitcher children={children} value={childId} onChange={setChildId} />

      {dataError && <div className="mt-4"><ErrorBlock message={dataError} onRetry={reloadData} /></div>}
      {loadingData && !data && <LoadBlock label="Loading examinations..." />}

      {data && exams.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam) => (
            <Card key={exam.id} hover className="p-6">
              <div className="flex items-start justify-between">
                <span className={`grid h-12 w-12 place-items-center rounded-2xl ${exam.status === 'Completed' ? 'bg-emerald-600 text-white' : 'bg-navy-800 text-gold-400'}`}><BookMarked size={20} /></span>
                <Badge color={statusColor[exam.status] || 'slate'} dot>{exam.status}</Badge>
              </div>
              <h3 className="mt-4 font-bold text-navy-900">{exam.title}</h3>
              <p className="text-xs text-slate-400">{exam.startDate}{exam.endDate ? ` - ${exam.endDate}` : ''} &middot; {exam.subjectsCount || 0} subjects</p>
              <p className="mt-1 text-xs text-slate-400">{exam.session || 'Current session'} &middot; {exam.term || 'Term not set'}</p>
              <button onClick={openResults} className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-navy-800 py-2.5 text-sm font-bold text-white transition hover:bg-navy-900 active:scale-95">
                <CalendarDays size={15} /> View Results
              </button>
            </Card>
          ))}
        </div>
      )}

      {data && !exams.length && (
        <div className="mt-6">
          <EmptyBlock title="No examinations scheduled" message={`No exams have been scheduled for ${child?.className || 'this class'} yet.`} />
        </div>
      )}
    </div>
  )
}
