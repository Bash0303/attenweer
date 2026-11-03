import { useEffect, useMemo, useState } from 'react'
import { Table2 } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { teacher } from '../../services/api'
import { EmptyBlock, ErrorBlock, LoadBlock } from './teacherUtils'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

export default function TeacherTimetable() {
  const [data, setData] = useState([])
  const [periods, setPeriods] = useState([])
  const [terms, setTerms] = useState([])
  const [classes, setClasses] = useState([])
  const [termId, setTermId] = useState('')
  const [classId, setClassId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)

    teacher.timetable({ termId, classId })
      .then((res) => {
        if (cancelled) return
        setData(res.data || [])
        setPeriods(res.periods || [])
        setTerms(res.terms || [])
        setClasses(res.classes || [])
        setTermId((current) => current || res.termId || '')
      })
      .catch((e) => {
        if (!cancelled) setError(e.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [termId, classId, reloadKey])

  const rows = useMemo(() => {
    if (periods.length) return periods

    const seen = new Map()
    data.forEach((entry) => {
      if (!seen.has(entry.start)) seen.set(entry.start, { start: entry.start, end: entry.end })
    })

    return Array.from(seen.values()).sort((a, b) => a.start.localeCompare(b.start))
  }, [periods, data])

  if (loading && !terms.length) return <LoadBlock label="Loading timetable..." />
  if (error) return <ErrorBlock message={error} onRetry={() => setReloadKey((key) => key + 1)} />

  if (!classes.length) {
    return (
      <div>
        <PageHeader title="My Timetable" subtitle="Weekly schedule across assigned classes and subjects" />
        <EmptyBlock title="No timetable yet" message="Your timetable will appear once the admin assigns you to classes and publishes their timetable." />
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="My Timetable" subtitle="Weekly schedule across assigned classes and subjects" />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <select value={termId} onChange={(e) => setTermId(e.target.value)} className="rounded-xl border border-navy-100 bg-white px-3.5 py-2 text-sm font-medium text-navy-800 outline-none">
          <option value="">Current Term</option>
          {terms.map((term) => <option key={term.id} value={term.id}>{term.label || term.name}</option>)}
        </select>
        <select value={classId} onChange={(e) => setClassId(e.target.value)} className="rounded-xl border border-navy-100 bg-white px-3.5 py-2 text-sm font-medium text-navy-800 outline-none">
          <option value="">All My Classes</option>
          {classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
        {loading && <span className="text-xs font-semibold text-slate-400">Refreshing...</span>}
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-navy-100 bg-navy-900 text-white">
              <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide">Time</th>
              {days.map((day) => <th key={day} className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide">{day}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-50">
            {rows.map((period, index) => (
              <tr key={period.start} className={index % 2 ? 'bg-cream-100/40' : 'bg-white'}>
                <td className="px-6 py-3 font-bold text-navy-800">{period.start} - {period.end}</td>
                {days.map((day) => {
                  const entries = data.filter((entry) => entry.day === day && entry.start === period.start)
                  return (
                    <td key={day} className="px-6 py-3">
                      {entries.length ? (
                        <div className="space-y-1.5">
                          {entries.map((entry) => (
                            <span key={entry.id} className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
                              <Table2 size={12} />
                              <span>{entry.subject}</span>
                              <span className="font-medium text-emerald-600">({entry.className})</span>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
            {!rows.length && <tr><td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-400">No periods on your timetable for this selection.</td></tr>}
          </tbody>
        </table>
        <div className="flex items-center gap-5 border-t border-navy-100 px-6 py-3 text-xs text-slate-500">
          <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100" /> Classes I teach</span>
          <Badge color="slate">{data.length} period{data.length === 1 ? '' : 's'}</Badge>
        </div>
      </Card>
    </div>
  )
}
