import { useEffect, useState } from 'react'
import { Award, Download, FileText } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import StatCard from '../../components/ui/StatCard'
import ChildSwitcher from './ChildSwitcher'
import ReportCard from '../../components/report/ReportCard'
import { EmptyBlock, ErrorBlock, LoadBlock, TermSelect, useChildResource, useParentChildren } from './parentUtils'

export default function ParentResults() {
  const { children, child, childId, setChildId, loading, error, reload } = useParentChildren()
  const [termId, setTermId] = useState('')
  const { data, loading: loadingData, error: dataError, reload: reloadData } = useChildResource('results', childId, { termId })

  useEffect(() => {
    setTermId('')
  }, [childId])

  useEffect(() => {
    if (data?.termId && !termId) setTermId(String(data.termId))
  }, [data, termId])

  if (loading) return <LoadBlock label="Loading results..." />
  if (error) return <ErrorBlock message={error} onRetry={reload} />
  if (!children.length) {
    return (
      <div>
        <PageHeader title="Results & Report Cards" subtitle="View and download each child's termly report" />
        <EmptyBlock title="No children linked yet" message="Ask the school administrator to link your parent account to your children." />
      </div>
    )
  }

  const summary = data?.summary
  const rows = data?.data || []
  const resultsPublished = Boolean(data?.results_published)
  const resultsChecked = Boolean(data?.results_checked)
  const published = Boolean(data?.published && rows.length)

  return (
    <div>
      <PageHeader
        title="Results & Report Cards"
        subtitle="View and download each child's termly report"
        actions={published ? <Button tone="primary" onClick={() => window.print()}><Download size={15} /> Download PDF</Button> : undefined}
      />

      <ChildSwitcher children={children} value={childId} onChange={setChildId} />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <TermSelect terms={data?.terms} value={termId || data?.termId || ''} onChange={(value) => setTermId(value)} />
        <p className="text-xs text-slate-400">{child?.name} &middot; {child?.className}</p>
      </div>

      {dataError && <div className="mt-4"><ErrorBlock message={dataError} onRetry={reloadData} /></div>}
      {loadingData && !data && <LoadBlock label="Loading report card..." />}

      {data && published && (
        <>
          <div className="mt-6 mb-6 grid gap-4 sm:grid-cols-3">
            <StatCard icon={FileText} label="Total Score" value={summary.totalScore} sub={`/ ${summary.count * 100}`} tone="navy" index={0} />
            <StatCard icon={Award} label="Average" value={`${summary.average}%`} sub={summary.grade ? `Grade ${summary.grade}` : 'no grade'} tone="emerald" index={1} />
            <StatCard icon={Award} label="Position" value={summary.position ? `${summary.position}${summary.position === 1 ? 'st' : summary.position === 2 ? 'nd' : summary.position === 3 ? 'rd' : 'th'}` : 'N/A'} sub={`of ${summary.classSize} students`} tone="gold" index={2} />
          </div>

          <ReportCard
            student={data.student}
            rows={rows}
            term={data.term}
            session={data.session}
            summary={summary}
            schoolInfo={data.school}
            showActions={false}
          />
        </>
      )}

      {data && !published && (
        <div className="mt-6">
          {resultsPublished && !resultsChecked ? (
            <EmptyBlock title="Results released but not checked yet" message="The school published this term's results. Your child must check them with a scratch card first; the report card will appear here after the first check." />
          ) : (
            <EmptyBlock title="Results not published yet" message="Once the school approves and publishes this term's results, the report card will appear here." />
          )}
        </div>
      )}
    </div>
  )
}
