import { useEffect, useState } from 'react'
import { ClipboardCheck, Save, CheckCheck, CheckCircle2, Clock, XCircle, X } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import StatCard from '../../components/ui/StatCard'
import { admin } from '../../services/api'

const today = new Date().toISOString().slice(0, 10)
const statuses = [
  { key: 'present', label: 'Present', active: 'bg-emerald-600 text-white', idle: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' },
  { key: 'late', label: 'Late', active: 'bg-amber-500 text-white', idle: 'bg-amber-50 text-amber-600 hover:bg-amber-100' },
  { key: 'absent', label: 'Absent', active: 'bg-rose-600 text-white', idle: 'bg-rose-50 text-rose-600 hover:bg-rose-100' },
]

export default function AdminAttendance() {
  const [classes, setClasses] = useState([])
  const [classId, setClassId] = useState('')
  const [terms, setTerms] = useState([])
  const [termId, setTermId] = useState('')
  const [date, setDate] = useState(today)
  const [rows, setRows] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    if (!feedback) return
    const timer = setTimeout(() => setFeedback(null), 3500)
    return () => clearTimeout(timer)
  }, [feedback])

  useEffect(() => {
    Promise.all([admin.classes(), admin.attendanceTerms()])
      .then(([classRes, termRes]) => {
        const classData = classRes.data || []
        const termData = termRes.data || []
        setClasses(classData)
        setTerms(termData)
        setClassId((current) => current || classData[0]?.id || '')
        setTermId((current) => {
          if (current) return current
          const preferred = termData.find((t) => t.isCurrent) || termData.find((t) => t.isActive) || termData[0]
          return preferred?.id ? String(preferred.id) : ''
        })
      })
      .catch((e) => setError(e.message))
  }, [])

  useEffect(() => {
    if (!classId) return
    let cancelled = false
    setLoading(true)
    setError(null)
    admin.attendance({ classId, date, termId })
      .then((res) => {
        if (cancelled) return
        setRows(res.data || [])
        setStats(res.stats || null)
      })
      .catch((e) => { if (!cancelled) setError(e.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [classId, date, termId])

  const setStatus = (student, status) => {
    const studentId = student.id
    setRows((list) => list.map((s) => s.id === studentId ? { ...s, status } : s))
    setStats((s) => {
      if (!s) return s
      const current = rows.find((r) => r.id === studentId)?.status
      const unmarked = s.unmarked + (current === 'unmarked' ? -1 : 0) + (status === 'unmarked' ? 1 : 0)
      const next = { ...s, unmarked }
      statuses.forEach((st) => {
        next[st.key] = rows.filter((r) => (r.id === studentId ? status : r.status) === st.key).length
      })
      return next
    })
    const messages = {
      present: { type: 'success', message: `${student.name} marked present successfully.` },
      late: { type: 'warning', message: `${student.name} is late but marked present.` },
      absent: { type: 'error', message: `${student.name} marked absent.` },
    }
    setFeedback(messages[status])
  }

  const markAllPresent = () => {
    const next = rows.map((s) => ({ ...s, status: 'present' }))
    setRows(next)
    setStats((s) => s ? { ...s, present: next.length, late: 0, absent: 0, unmarked: 0 } : s)
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      const saved = await admin.saveAttendance({
        classId: Number(classId),
        termId: termId ? Number(termId) : null,
        date,
        records: rows.map((s) => ({ studentId: s.id, status: s.status === 'unmarked' ? 'absent' : s.status })),
      })
      setRows((list) => list.map((s) => s.status === 'unmarked' ? { ...s, status: 'absent' } : s))
      setFeedback({ type: 'success', message: 'Attendance saved successfully.' })
      const nextTermId = saved?.termId ? String(saved.termId) : termId
      if (nextTermId !== termId) setTermId(nextTermId)
      const res = await admin.attendance({ classId, date, termId: nextTermId })
      setRows(res.data || [])
      setStats(res.stats || null)
    } catch (e) {
      setError(e.errors ? Object.values(e.errors).flat().join(' ') : e.message)
    } finally {
      setSaving(false)
    }
  }

  const className = classes.find((c) => c.id === Number(classId))?.name || ''
  const term = terms.find((t) => t.id === Number(termId))
  const FeedbackIcon = feedback?.type === 'success' ? CheckCircle2 : feedback?.type === 'warning' ? Clock : XCircle

  return (
    <div>
      <PageHeader title="Attendance Management" subtitle="Monitor and administer daily attendance across classes" />

      {error && <div className="mb-6 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">{error}</div>}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={ClipboardCheck} label="Present" value={stats?.present ?? '—'} sub={`${stats?.total ?? 0} students`} tone="emerald" index={0} />
        <StatCard icon={ClipboardCheck} label="Late Comers" value={stats?.late ?? '—'} sub="today" tone="amber" index={1} />
        <StatCard icon={ClipboardCheck} label="Absent" value={stats?.absent ?? '—'} sub={stats?.unmarked ? `${stats.unmarked} unmarked` : 'all marked'} tone="rose" index={2} />
      </div>

      <Card className="p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Class</span>
            <select value={classId} onChange={(e) => setClassId(e.target.value)} className="w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none focus:border-navy-400">
              {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Term</span>
            <select value={termId} onChange={(e) => {
              const nextTermId = e.target.value
              setTermId(nextTermId)
              const nextTerm = terms.find((t) => String(t.id) === nextTermId)
              if (nextTerm && (date < nextTerm.startsOn || date > nextTerm.endsOn)) setDate(nextTerm.startsOn)
            }} disabled={!terms.length} className="w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none focus:border-navy-400 disabled:bg-navy-50 disabled:text-slate-400">
              {!terms.length && <option value="">No terms available</option>}
              {terms.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}{t.session ? ` — ${t.session}` : ''}{t.isCurrent ? ' (Current)' : ''}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Date</span>
            <input type="date" value={date} min={term?.startsOn} max={term?.endsOn} onChange={(e) => setDate(e.target.value)} className="w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none focus:border-navy-400" />
          </label>
          <div className="flex items-end">
            <Button tone="outline" onClick={markAllPresent} disabled={!rows.length}><CheckCheck size={15} /> Mark All Present</Button>
          </div>
        </div>
      </Card>

      <Card className="mt-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-navy-100 px-6 py-4">
          <div>
            <h3 className="font-bold text-navy-900">{className} Attendance</h3>
            <p className="text-xs text-slate-400">{date}{term ? ` • ${term.name}${term.session ? ` (${term.session})` : ''}` : ''} • {rows.length} students</p>
          </div>
          <Badge color={stats?.unmarked ? 'amber' : 'emerald'} dot>{stats?.unmarked ? `${stats.unmarked} unmarked` : 'Complete'}</Badge>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-4 border-navy-100 border-t-navy-700" /></div>
        ) : (
          <div className="divide-y divide-navy-50">
            {rows.map((s) => (
              <div key={s.id} className="flex flex-wrap items-center gap-3 px-6 py-3">
                <Avatar initials={s.initials} color={s.color} size="sm" />
                <p className="min-w-0 flex-1 truncate text-sm font-medium text-navy-900">{s.name}</p>
                <span className="hidden font-mono text-xs text-slate-400 sm:block">{s.studentId}</span>
                <div className="hidden sm:block">
                  <Badge color={s.status === 'present' ? 'emerald' : s.status === 'late' ? 'amber' : s.status === 'absent' ? 'rose' : 'slate'} dot>
                    {s.status === 'unmarked' ? 'Not marked' : `Already marked ${s.status}`}
                  </Badge>
                </div>
                <div className="flex gap-1.5">
                  {statuses.map((st) => (
                    <button key={st.key} onClick={() => setStatus(s, st.key)} className={`rounded-lg px-3 py-1.5 text-xs font-bold transition active:scale-95 ${s.status === st.key ? st.active : st.idle}`}>
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {!rows.length && <p className="px-6 py-10 text-center text-sm text-slate-400">No students in this class.</p>}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-navy-100 px-6 py-4">
          <p className="text-xs text-slate-400">Unmarked students are saved as absent.</p>
          <Button tone="primary" disabled={saving || !rows.length} onClick={handleSave}><Save size={16} /> {saving ? 'Saving…' : 'Save Attendance'}</Button>
        </div>
      </Card>

      {feedback && (
        <div
          role="status"
          className={`fixed bottom-6 right-6 z-50 flex max-w-sm items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-xl ${feedback.type === 'success' ? 'bg-emerald-600' : feedback.type === 'warning' ? 'bg-amber-500' : 'bg-rose-600'}`}
        >
          <FeedbackIcon size={18} className="shrink-0" />
          <span className="flex-1">{feedback.message}</span>
          <button type="button" onClick={() => setFeedback(null)} aria-label="Dismiss" className="rounded-md p-0.5 opacity-80 transition hover:opacity-100">
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  )
}
