import { useEffect, useState } from 'react'
import { ClipboardCheck } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import StatCard from '../../components/ui/StatCard'
import ProgressBar from '../../components/ui/ProgressBar'
import ChildSwitcher from './ChildSwitcher'
import { EmptyBlock, ErrorBlock, LoadBlock, TermSelect, useChildResource, useParentChildren } from './parentUtils'

const statusClass = {
  Present: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  Late: 'bg-amber-50 text-amber-600 border-amber-100',
  Absent: 'bg-rose-50 text-rose-500 border-rose-100',
}

const statusLetter = { Present: 'P', Late: 'L', Absent: 'A' }

export default function ParentAttendance() {
  const { children, child, childId, setChildId, loading, error, reload } = useParentChildren()
  const [termId, setTermId] = useState('')
  const { data, loading: loadingData, error: dataError, reload: reloadData } = useChildResource('attendance', childId, { termId })

  useEffect(() => {
    setTermId('')
  }, [childId])

  useEffect(() => {
    if (data?.termId && !termId) setTermId(String(data.termId))
  }, [data, termId])

  if (loading) return <LoadBlock label="Loading attendance..." />
  if (error) return <ErrorBlock message={error} onRetry={reload} />
  if (!children.length) {
    return (
      <div>
        <PageHeader title="Attendance Monitoring" subtitle="Track your child's daily attendance in real time" />
        <EmptyBlock title="No children linked yet" message="Ask the school administrator to link your parent account to your children." />
      </div>
    )
  }

  const stats = data?.stats || { rate: 0, present: 0, late: 0, absent: 0, total: 0 }
  const records = data?.data || []
  const latestAlert = records.find((record) => record.status !== 'Present')

  return (
    <div>
      <PageHeader title="Attendance Monitoring" subtitle="Track your child's daily attendance in real time" />

      <ChildSwitcher children={children} value={childId} onChange={setChildId} />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <TermSelect terms={data?.terms} value={termId || data?.termId || ''} onChange={(value) => setTermId(value)} />
        <p className="text-xs text-slate-400">{child?.name} &middot; {child?.className}</p>
      </div>

      {dataError && <div className="mt-4"><ErrorBlock message={dataError} onRetry={reloadData} /></div>}
      {loadingData && !data && <LoadBlock label="Loading attendance records..." />}

      {data && (
        <>
          <div className="mt-6 mb-6 grid gap-4 sm:grid-cols-3">
            <StatCard icon={ClipboardCheck} label="Attendance Rate" value={`${stats.rate}%`} sub={`${stats.total} school days`} tone="emerald" index={0} />
            <StatCard icon={ClipboardCheck} label="Present" value={stats.present} sub="days" tone="navy" index={1} />
            <StatCard icon={ClipboardCheck} label="Late / Absent" value={`${stats.late} / ${stats.absent}`} sub="days" tone="amber" index={2} />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="p-6 lg:col-span-2">
              <h3 className="font-bold text-navy-900">Daily Attendance</h3>
              <p className="text-xs text-slate-400">P = Present &middot; L = Late &middot; A = Absent</p>
              {records.length ? (
                <div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-8 lg:grid-cols-10">
                  {records.map((record) => {
                    const date = new Date(`${record.date}T00:00:00`)
                    const label = date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' })
                    return (
                      <div key={record.id} title={`${record.formattedDate} - ${record.status}`} className={`rounded-xl border p-2 text-center ${statusClass[record.status] || 'border-navy-100 bg-navy-50 text-navy-600'}`}>
                        <p className="text-[10px] leading-tight text-slate-400">{label}</p>
                        <p className="text-sm font-extrabold">{statusLetter[record.status] || record.status?.[0]}</p>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="mt-4 rounded-xl bg-cream-100/70 p-4 text-sm text-slate-500">No attendance has been recorded for this term yet.</p>
              )}
              <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Present</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Late</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Absent</span>
              </div>
            </Card>

            <Card className="h-fit p-6">
              <h3 className="font-bold text-navy-900">Term Overview</h3>
              <div className="mt-4 space-y-4">
                {[
                  ['Present', `${stats.present} days`, stats.total ? Math.round((stats.present / stats.total) * 100) : 0, 'bg-emerald-500'],
                  ['Late', `${stats.late} days`, stats.total ? Math.round((stats.late / stats.total) * 100) : 0, 'bg-amber-400'],
                  ['Absent', `${stats.absent} days`, stats.total ? Math.round((stats.absent / stats.total) * 100) : 0, 'bg-rose-500'],
                ].map(([key, value, percent, color]) => (
                  <div key={key}>
                    <div className="mb-1 flex justify-between text-sm"><span className="font-medium text-slate-600">{key}</span><span className="font-bold text-navy-900">{value}</span></div>
                    <ProgressBar value={percent} color={color} />
                  </div>
                ))}
              </div>
              {latestAlert ? (
                <div className="mt-6 rounded-xl bg-rose-50 p-4">
                  <p className="text-sm font-bold text-rose-700">Attendance Alert</p>
                  <p className="mt-1 text-xs text-rose-600/80">{child?.name} was marked {latestAlert.status.toLowerCase()} on {latestAlert.formattedDate}.</p>
                </div>
              ) : (
                <div className="mt-6 rounded-xl bg-emerald-50 p-4">
                  <p className="text-sm font-bold text-emerald-700">Excellent attendance</p>
                  <p className="mt-1 text-xs text-emerald-600/80">No late or absent records for this term.</p>
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
