import { useEffect, useMemo, useState } from 'react'
import { CalendarCheck } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Badge, { statusColor } from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'
import ProgressBar from '../../components/ui/ProgressBar'
import { DonutChart } from '../../components/ui/Charts'
import { student } from '../../services/api'
import { EmptyBlock, ErrorBlock, LoadBlock, TermSelect } from './studentUtils'

export default function StudentAttendance() {
  const [termId, setTermId] = useState('')
  const [filter, setFilter] = useState('All')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)

    student.attendance(termId ? { termId } : undefined)
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

  const rows = useMemo(() => {
    const records = data?.data || []
    return filter === 'All' ? records : records.filter((record) => record.status === filter)
  }, [data, filter])

  if (loading && !data) return <LoadBlock label="Loading your attendance..." />
  if (error) return <ErrorBlock message={error} onRetry={() => setReloadKey((key) => key + 1)} />

  const stats = data?.stats || {}
  const chart = [
    { name: 'Present', value: stats.present || 0, color: '#10b981' },
    { name: 'Late', value: stats.late || 0, color: '#d9a62e' },
    { name: 'Absent', value: stats.absent || 0, color: '#ef4444' },
  ]

  return (
    <div>
      <PageHeader
        title="Attendance"
        subtitle={`${data?.term || 'Current term'} • ${data?.session || ''}`}
        actions={<TermSelect terms={data?.terms} value={termId || data?.termId} onChange={setTermId} />}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={CalendarCheck} label="Attendance Rate" value={`${stats.rate || 0}%`} sub={`${stats.total || 0} days`} tone="emerald" index={0} />
        <StatCard icon={CalendarCheck} label="Present" value={stats.present || 0} tone="emerald" index={1} />
        <StatCard icon={CalendarCheck} label="Late" value={stats.late || 0} tone="gold" index={2} />
        <StatCard icon={CalendarCheck} label="Absent" value={stats.absent || 0} tone="rose" index={3} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="p-6">
          <h3 className="font-bold text-navy-900">Term Breakdown</h3>
          <p className="text-xs text-slate-400">Present, late and absent days</p>
          {stats.total ? <DonutChart data={chart} height={230} centerValue={`${stats.rate || 0}%`} centerLabel="Rate" /> : <p className="mt-6 rounded-xl bg-cream-100/70 p-4 text-sm text-slate-500">No attendance records for this term.</p>}
          <div className="mt-4 space-y-3">
            {[['Present', stats.present, 'bg-emerald-500'], ['Late', stats.late, 'bg-gold-500'], ['Absent', stats.absent, 'bg-rose-500']].map(([label, value, color]) => (
              <div key={label}>
                <div className="mb-1 flex justify-between text-xs"><span className="font-semibold text-slate-600">{label}</span><span className="font-bold text-navy-900">{value || 0}</span></div>
                <ProgressBar value={stats.total ? ((value || 0) / stats.total) * 100 : 0} color={color} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy-100 px-6 py-4">
            <div><h3 className="font-bold text-navy-900">Daily Records</h3><p className="text-xs text-slate-400">School attendance register</p></div>
            <div className="flex flex-wrap gap-1.5">
              {['All', 'Present', 'Late', 'Absent'].map((status) => (
                <button key={status} onClick={() => setFilter(status)} className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${filter === status ? 'bg-navy-800 text-white' : 'bg-navy-50 text-slate-500 hover:bg-navy-100'}`}>{status}</button>
              ))}
            </div>
          </div>
          {!rows.length ? (
            <div className="p-6"><EmptyBlock title="No records" message={filter === 'All' ? 'No attendance records are available for this term.' : `No ${filter.toLowerCase()} records for this term.`} /></div>
          ) : (
            <div className="divide-y divide-navy-50">
              {rows.map((record) => (
                <div key={record.id} className="flex items-center justify-between gap-3 px-6 py-3">
                  <div>
                    <p className="text-sm font-semibold text-navy-900">{record.formattedDate}</p>
                    <p className="text-xs text-slate-400">{record.date}</p>
                  </div>
                  <Badge color={statusColor(record.status)} dot>{record.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
