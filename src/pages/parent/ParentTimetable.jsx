import { Table2 } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import ChildSwitcher from './ChildSwitcher'
import { EmptyBlock, ErrorBlock, LoadBlock, useChildResource, useParentChildren } from './parentUtils'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

export default function ParentTimetable() {
  const { children, child, childId, setChildId, loading, error, reload } = useParentChildren()
  const { data, loading: loadingData, error: dataError, reload: reloadData } = useChildResource('timetable', childId)

  if (loading) return <LoadBlock label="Loading timetable..." />
  if (error) return <ErrorBlock message={error} onRetry={reload} />
  if (!children.length) {
    return (
      <div>
        <PageHeader title="Timetable" subtitle="Weekly class schedule for your child" />
        <EmptyBlock title="No children linked yet" message="Ask the school administrator to link your parent account to your children." />
      </div>
    )
  }

  const periods = data?.periods || []
  const entries = data?.entries || {}

  return (
    <div>
      <PageHeader title="Timetable" subtitle="Weekly class schedule for your child" />

      <ChildSwitcher children={children} value={childId} onChange={setChildId} />

      {dataError && <div className="mt-4"><ErrorBlock message={dataError} onRetry={reloadData} /></div>}
      {loadingData && !data && <LoadBlock label="Loading timetable..." />}

      {data && periods.length > 0 && (
        <Card className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-navy-100 bg-navy-900 text-white">
                <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide">Time</th>
                {days.map((day) => <th key={day} className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide">{day}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {periods.map((period, index) => (
                <tr key={period.start} className={index % 2 ? 'bg-cream-100/40' : 'bg-white'}>
                  <td className="px-6 py-3 font-bold text-navy-800">{period.start} - {period.end}</td>
                  {days.map((day) => {
                    const entry = (entries[period.start] || []).find((item) => item.day === day)
                    if (period.isBreak || entry?.isBreak) {
                      return <td key={day} className="px-6 py-3 text-center"><Badge color="slate">{entry?.label || period.label || 'Break'}</Badge></td>
                    }
                    const subject = entry?.subject || entry?.label
                    if (!subject) return <td key={day} className="px-6 py-3 text-center text-xs text-slate-300">-</td>
                    const special = ['Islamic Studies', 'Arabic', 'Arabic Language'].includes(subject)
                    return (
                      <td key={day} className="px-6 py-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold ${special ? 'bg-teal-50 text-teal-700 ring-1 ring-teal-100' : 'bg-navy-50 text-navy-800'}`}>
                          {special && <Table2 size={12} />}{subject}
                        </span>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {data && !periods.length && (
        <div className="mt-6">
          <EmptyBlock title="No timetable published" message={`The timetable for ${child?.className || 'this class'} has not been published yet.`} />
        </div>
      )}
    </div>
  )
}
