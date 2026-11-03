import { useEffect, useState } from 'react'
import { ClipboardCheck, Save } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'
import { teacher } from '../../services/api'
import { EmptyBlock, ErrorBlock, LoadBlock } from './teacherUtils'

const today = new Date().toISOString().slice(0, 10)

export default function TeacherAttendance() {
  const [classes, setClasses] = useState([])
  const [classId, setClassId] = useState('')
  const [date, setDate] = useState(today)
  const [rows, setRows] = useState([])
  const [stats, setStats] = useState({})
  const [termId, setTermId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    teacher.classes()
      .then((res) => {
        if (cancelled) return
        const list = res.data || []
        setClasses(list)
        setClassId((current) => (list.some((item) => String(item.id) === String(current)) ? current : (list[0]?.id ?? '')))
      })
      .catch((e) => {
        if (!cancelled) setError(e.message)
      })

    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!classId) {
      setRows([])
      setStats({})
      setLoading(false)
      return undefined
    }

    let cancelled = false

    setLoading(true)
    setError(null)
    setMessage(null)

    teacher.attendance({ classId, date })
      .then((res) => {
        if (cancelled) return
        setRows(res.data || [])
        setStats(res.stats || {})
        setTermId(res.termId || null)
      })
      .catch((e) => {
        if (!cancelled) setError(e.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [classId, date, reloadKey])

  const setStatus = (studentId, status) => {
    setRows((list) => list.map((row) => (row.id === studentId ? { ...row, status } : row)))
    setMessage(null)
  }

  const markAllPresent = () => {
    setRows((list) => list.map((row) => ({ ...row, status: 'present' })))
    setMessage(null)
  }

  const marked = rows.filter((row) => row.status !== 'unmarked')

  const save = async () => {
    if (!classId || !marked.length) {
      setMessage({ type: 'error', text: 'Mark at least one student before saving.' })
      return
    }

    setSaving(true)
    setMessage(null)

    try {
      await teacher.saveAttendance({
        classId: Number(classId),
        termId,
        date,
        records: marked.map((row) => ({ studentId: row.id, status: row.status })),
      })
      setMessage({ type: 'success', text: 'Attendance saved successfully.' })
      setReloadKey((key) => key + 1)
    } catch (e) {
      setMessage({ type: 'error', text: e.errors ? Object.values(e.errors).flat().join(' ') : e.message })
    } finally {
      setSaving(false)
    }
  }

  if (loading && !classes.length) return <LoadBlock label="Loading attendance..." />
  if (error && !classes.length) return <ErrorBlock message={error} onRetry={() => setReloadKey((key) => key + 1)} />

  if (!classes.length) {
    return (
      <div>
        <PageHeader title="Mark Attendance" subtitle="Select class and date, mark each student, then save" />
        <EmptyBlock title="No classes assigned" message="You can mark attendance once the admin assigns you to a class." />
      </div>
    )
  }

  const markedCount = stats.total ? stats.total - (stats.unmarked || 0) : 0

  return (
    <div>
      <PageHeader title="Mark Attendance" subtitle="Select class and date, mark each student, then save" />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={ClipboardCheck} label="Marked" value={`${markedCount}/${stats.total || 0}`} sub={date} tone="emerald" index={0} />
        <StatCard icon={ClipboardCheck} label="Present" value={stats.present || 0} sub={`${stats.late || 0} late`} tone="gold" index={1} />
        <StatCard icon={ClipboardCheck} label="Absent" value={stats.absent || 0} sub={`${stats.unmarked || 0} unmarked`} tone="amber" index={2} />
      </div>

      <Card className="p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Class</span>
            <select value={classId} onChange={(e) => setClassId(e.target.value)} className="w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none focus:border-navy-400">
              {classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Date</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none focus:border-navy-400" />
          </label>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-slate-400">Unmarked students are left unchanged when you save.</p>
          <Button tone="outline" size="sm" onClick={markAllPresent}>Mark all present</Button>
        </div>
      </Card>

      <Card className="mt-6">
        <div className="flex items-center justify-between border-b border-navy-100 px-6 py-4">
          <div>
            <h3 className="font-bold text-navy-900">{classes.find((item) => String(item.id) === String(classId))?.name} — Roll Call</h3>
            <p className="text-xs text-slate-400">{date}</p>
          </div>
          <Badge color={stats.unmarked ? 'amber' : 'emerald'} dot>{stats.unmarked ? `${stats.unmarked} unmarked` : 'All marked'}</Badge>
        </div>

        {loading ? (
          <p className="px-6 py-10 text-center text-sm text-slate-400">Loading students...</p>
        ) : error ? (
          <div className="px-6 py-8 text-center">
            <p className="text-sm text-rose-600">{error}</p>
            <Button tone="ghost" size="sm" className="mt-3" onClick={() => setReloadKey((key) => key + 1)}>Retry</Button>
          </div>
        ) : (
          <div className="divide-y divide-navy-50">
            {rows.map((student) => (
              <div key={student.id} className="flex flex-wrap items-center gap-3 px-6 py-3">
                <span className={`h-2.5 w-2.5 rounded-full ${student.status === 'absent' ? 'bg-rose-500' : student.status === 'late' ? 'bg-amber-500' : student.status === 'present' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                <p className="min-w-0 flex-1 truncate text-sm font-medium text-navy-900">{student.name}</p>
                <span className="hidden font-mono text-xs text-slate-400 sm:block">{student.studentId}</span>
                <div className="flex gap-1.5">
                  {['present', 'late', 'absent'].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setStatus(student.id, value)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition active:scale-95 ${
                        student.status === value
                          ? value === 'present'
                            ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200'
                            : value === 'late'
                              ? 'bg-amber-50 text-amber-600 ring-1 ring-amber-200'
                              : 'bg-rose-50 text-rose-600 ring-1 ring-rose-200'
                          : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {!rows.length && <p className="px-6 py-10 text-center text-sm text-slate-400">No students in this class.</p>}
          </div>
        )}

        {message && (
          <div className={`mx-6 mt-4 rounded-xl px-4 py-2.5 text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'}`}>{message.text}</div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-navy-100 px-6 py-4">
          <p className="text-xs text-slate-400">Saved attendance updates the student and parent dashboards immediately.</p>
          <Button tone="primary" disabled={saving || !marked.length} onClick={save}><Save size={16} /> {saving ? 'Saving...' : 'Save Attendance'}</Button>
        </div>
      </Card>
    </div>
  )
}
