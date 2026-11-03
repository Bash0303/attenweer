import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, ClipboardList, Clock } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Badge, { statusColor } from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'
import { student } from '../../services/api'
import { EmptyBlock, ErrorBlock, LoadBlock } from './studentUtils'

const FILTERS = ['All', 'Scheduled', 'Completed']

export default function StudentExams() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)

    student.exams()
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
  }, [reloadKey])

  const rows = useMemo(() => {
    const exams = data?.data || []
    return filter === 'All' ? exams : exams.filter((exam) => exam.status === filter)
  }, [data, filter])

  if (loading && !data) return <LoadBlock label="Loading your exams..." />
  if (error) return <ErrorBlock message={error} onRetry={() => setReloadKey((key) => key + 1)} />

  const stats = data?.stats || {}

  return (
    <div>
      <PageHeader title="Examinations" subtitle={`${data?.student?.className || 'Your class'} exam schedule`} />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={ClipboardList} label="Scheduled Exams" value={stats.scheduled || 0} tone="navy" index={0} />
        <StatCard icon={Clock} label="Completed Exams" value={stats.completed || 0} tone="emerald" index={1} />
        <StatCard icon={CalendarDays} label="Next Exam" value={stats.nextExam || 'None'} tone="gold" index={2} />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <button key={item} onClick={() => setFilter(item)} className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition ${filter === item ? 'bg-navy-800 text-white' : 'bg-white text-slate-500 hover:bg-navy-50'}`}>{item}</button>
        ))}
      </div>

      {!rows.length ? (
        <div className="mt-6"><EmptyBlock title="No exams" message={filter === 'All' ? 'No exams have been scheduled for your class yet.' : `You have no ${filter.toLowerCase()} exams.`} /></div>
      ) : (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {rows.map((exam) => (
            <Card key={exam.id} className="p-5">
              <div className="flex items-start gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-cream-100 text-center text-[10px] font-extrabold leading-tight text-navy-800">{exam.startDate?.split(' ')[0]}<br />{exam.startDate?.split(' ')[1]}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h4 className="font-bold text-navy-900">{exam.title}</h4>
                    <Badge color={statusColor(exam.status)} dot>{exam.status}</Badge>
                  </div>
                  <p className="text-xs text-slate-400">{exam.term} &bull; {exam.session}</p>
                  <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
                    <span className="font-semibold text-navy-700">Starts: {exam.startDate}</span>
                    <span className="font-semibold text-navy-700">Ends: {exam.endDate || '-'}</span>
                    <span className="text-slate-400">{exam.subjectsCount || 0} subjects</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
