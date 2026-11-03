import { useEffect, useState } from 'react'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { student } from '../../services/api'
import { EmptyBlock, ErrorBlock, LoadBlock, TermSelect } from './studentUtils'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })

export default function StudentTimetable() {
  const [termId, setTermId] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)

    student.timetable(termId ? { termId } : undefined)
      .then((res) => {
        if (!cancelled) setData(res)
      })
      .catch((e) => {
        if (!cancelled) setError(e.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [termId, reloadKey])

  if (loading && !data) return <LoadBlock label="Loading your timetable..." />
  if (error) return <ErrorBlock message={error} onRetry={() => setReloadKey((key) => key + 1)} />

  const periods = data?.periods || []
  const entries = data?.entries || {}

  return (
    <div>
      <PageHeader
        title="Class Timetable"
        subtitle={`${data?.className || 'Your class'} • ${data?.session || ''}`}
        actions={<TermSelect terms={data?.terms} value={termId || data?.termId} onChange={setTermId} />}
      />

      {!periods.length ? (
        <EmptyBlock title="No timetable published" message="Your class timetable has not been published for this term." />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-sm">
              <thead>
                <tr className="bg-navy-900 text-white">
                  <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide">Period</th>
                  {DAYS.map((day) => (
                    <th key={day} className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                      {day} {day === today && <span className="ml-1 rounded-full bg-gold-500 px-1.5 py-0.5 text-[9px] text-navy-950">today</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {periods.map((period) => {
                  const rowEntries = entries[period.start] || []
                  return (
                    <tr key={`${period.start}-${period.label || ''}`} className={period.isBreak ? 'bg-cream-100/60' : 'bg-white'}>
                      <td className="px-3 py-3">
                        <p className="font-semibold text-navy-900">{period.start} - {period.end}</p>
                        <p className="text-[11px] text-slate-400">{period.label || (period.isBreak ? 'Break' : 'Lesson')}</p>
                      </td>
                      {period.isBreak ? (
                        <td colSpan={DAYS.length} className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gold-600">{period.label || 'Break'}</td>
                      ) : (
                        DAYS.map((day) => {
                          const cell = rowEntries.find((entry) => entry.day === day)
                          return (
                            <td key={day} className="px-3 py-3">
                              {cell ? (
                                <div className={`rounded-lg p-2 ${cell.isBreak ? 'bg-gold-500/10' : 'bg-navy-50'}`}>
                                  <p className="text-xs font-bold text-navy-800">{cell.subject || cell.label || '-'}</p>
                                  {cell.label && cell.subject && <p className="text-[10px] text-slate-400">{cell.label}</p>}
                                  {day === today && <Badge color="gold">Now</Badge>}
                                </div>
                              ) : (
                                <span className="text-xs text-slate-300">-</span>
                              )}
                            </td>
                          )
                        })
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
