import { useEffect, useMemo, useState } from 'react'
import { FileSpreadsheet, Save } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'
import { teacher } from '../../services/api'
import { EmptyBlock, ErrorBlock, LoadBlock } from './teacherUtils'

export default function TeacherScores() {
  const [options, setOptions] = useState(null)
  const [classId, setClassId] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [termId, setTermId] = useState('')
  const [rows, setRows] = useState([])
  const [upload, setUpload] = useState(null)
  const [stats, setStats] = useState({})
  const [optionsLoading, setOptionsLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [scoresError, setScoresError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    setOptionsLoading(true)
    setError(null)

    teacher.scoreOptions()
      .then((res) => {
        if (cancelled) return
        const assignments = res.assignments || []
        const first = assignments[0]
        const firstTerm = (res.terms || []).find((term) => term.isCurrent) || (res.terms || [])[0]

        setOptions(res)
        setClassId((current) => (assignments.some((item) => String(item.classId) === String(current)) ? current : (first?.classId ?? '')))
        setSubjectId((current) => (assignments.some((item) => String(item.subjectId) === String(current)) ? current : (first?.subjectId ?? '')))
        setTermId((current) => (res.terms || []).some((term) => String(term.id) === String(current)) ? current : (firstTerm?.id ?? ''))
      })
      .catch((e) => {
        if (!cancelled) setError(e.message)
      })
      .finally(() => {
        if (!cancelled) setOptionsLoading(false)
      })

    return () => { cancelled = true }
  }, [reloadKey])

  const assignments = options?.assignments || []
  const terms = options?.terms || []
  const classes = useMemo(() => {
    const seen = new Set()
    return assignments
      .filter((item) => {
        if (seen.has(item.classId)) return false
        seen.add(item.classId)
        return true
      })
      .map((item) => ({ id: item.classId, name: item.className }))
  }, [assignments])

  const subjects = useMemo(() => {
    const seen = new Set()
    return assignments
      .filter((item) => String(item.classId) === String(classId))
      .filter((item) => {
        if (seen.has(item.subjectId)) return false
        seen.add(item.subjectId)
        return true
      })
      .map((item) => ({ id: item.subjectId, name: item.subjectName }))
  }, [assignments, classId])

  useEffect(() => {
    if (!subjects.some((subject) => String(subject.id) === String(subjectId))) {
      setSubjectId(subjects[0]?.id ?? '')
    }
  }, [subjects, subjectId])

  useEffect(() => {
    if (!classId || !subjectId || !termId) {
      setRows([])
      return undefined
    }

    let cancelled = false

    setLoading(true)
    setScoresError(null)
    setMessage(null)

    teacher.scores({ classId, subjectId, termId })
      .then((res) => {
        if (cancelled) return
        setRows(res.data || [])
        setUpload(res.upload || null)
        setStats(res.stats || {})
      })
      .catch((e) => {
        if (!cancelled) setScoresError(e.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [classId, subjectId, termId])

  const setScore = (studentId, field, value) => {
    const numeric = Math.max(0, Math.min(field === 'exam' ? 60 : 20, Number(value) || 0))
    setRows((list) => list.map((row) => (row.studentId === studentId ? { ...row, [field]: numeric } : row)))
    setMessage(null)
  }

  const save = async () => {
    if (!classId || !subjectId || !termId || !rows.length) return

    setSaving(true)
    setMessage(null)

    try {
      await teacher.saveScores({
        classId: Number(classId),
        subjectId: Number(subjectId),
        termId: Number(termId),
        scores: rows.map((row) => ({
          studentId: row.studentId,
          ca1: Number(row.ca1) || 0,
          ca2: Number(row.ca2) || 0,
          exam: Number(row.exam) || 0,
        })),
      })
      const res = await teacher.scores({ classId, subjectId, termId })
      setRows(res.data || [])
      setUpload(res.upload || null)
      setStats(res.stats || {})
      setMessage({ type: 'success', text: 'CA scores saved and sent for admin approval.' })
    } catch (e) {
      setMessage({ type: 'error', text: e.errors ? Object.values(e.errors).flat().join(' ') : e.message })
    } finally {
      setSaving(false)
    }
  }

  if (optionsLoading) return <LoadBlock label="Loading score options..." />
  if (error) return <ErrorBlock message={error} onRetry={() => setReloadKey((key) => key + 1)} />

  if (!assignments.length) {
    return (
      <div>
        <PageHeader title="CA Scores" subtitle="Record continuous assessment scores (CA1 & CA2 out of 20 each)" />
        <EmptyBlock title="No subjects assigned" message="CA score entry will be available once the admin assigns you to a class and subject." />
      </div>
    )
  }

  const subjectName = subjects.find((subject) => String(subject.id) === String(subjectId))?.name || 'Subject'
  const className = classes.find((item) => String(item.id) === String(classId))?.name || 'Class'
  const approved = upload?.status === 'Approved'

  return (
    <div>
      <PageHeader title="CA Scores" subtitle="Record continuous assessment scores (CA1 & CA2 out of 20 each)" />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={FileSpreadsheet} label="Subject" value={subjectName} sub={className} tone="navy" index={0} />
        <StatCard icon={FileSpreadsheet} label="Avg CA Score" value={`${stats.caAverage || 0}%`} sub="class average" tone="emerald" index={1} />
        <StatCard icon={FileSpreadsheet} label="Saved Records" value={stats.recorded || 0} sub={`${stats.students || 0} students`} tone="gold" index={2} />
      </div>

      <Card className="p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Class</span>
            <select value={classId} onChange={(e) => setClassId(e.target.value)} className="w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none focus:border-navy-400">
              {classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Subject</span>
            <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className="w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none focus:border-navy-400">
              {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Term</span>
            <select value={termId} onChange={(e) => setTermId(e.target.value)} className="w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none focus:border-navy-400">
              {terms.map((term) => <option key={term.id} value={term.id}>{term.label || term.name}</option>)}
            </select>
          </label>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-slate-400">CA scores combine with exam scores to compute term totals.</p>
          <Badge color={approved ? 'emerald' : upload ? 'amber' : 'slate'} dot>{upload ? `${upload.status} • ${upload.fileName}` : 'No scores saved yet'}</Badge>
        </div>
      </Card>

      <Card className="mt-6 overflow-x-auto">
        {loading ? (
          <p className="px-6 py-10 text-center text-sm text-slate-400">Loading scores...</p>
        ) : scoresError ? (
          <p className="px-6 py-10 text-center text-sm text-rose-600">{scoresError}</p>
        ) : (
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-navy-100 bg-navy-50/50 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-6 py-3.5 font-semibold">Student</th>
                <th className="px-6 py-3.5 font-semibold">CA 1 (/20)</th>
                <th className="px-6 py-3.5 font-semibold">CA 2 (/20)</th>
                <th className="px-6 py-3.5 font-semibold">Total (/40)</th>
                <th className="px-6 py-3.5 font-semibold">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {rows.map((row) => {
                const total = Number(row.ca1) + Number(row.ca2)
                const pct = Math.round((total / 40) * 100)
                return (
                  <tr key={row.studentId}>
                    <td className="px-6 py-3">
                      <p className="font-semibold text-navy-900">{row.name}</p>
                      <p className="font-mono text-[11px] text-slate-400">{row.studentCode}</p>
                    </td>
                    <td className="px-6 py-3"><input disabled={approved} type="number" min="0" max="20" className="w-16 rounded-lg border border-navy-100 bg-white px-2 py-1.5 text-center text-sm font-semibold focus:border-navy-400 disabled:bg-slate-100" value={row.ca1} onChange={(e) => setScore(row.studentId, 'ca1', e.target.value)} /></td>
                    <td className="px-6 py-3"><input disabled={approved} type="number" min="0" max="20" className="w-16 rounded-lg border border-navy-100 bg-white px-2 py-1.5 text-center text-sm font-semibold focus:border-navy-400 disabled:bg-slate-100" value={row.ca2} onChange={(e) => setScore(row.studentId, 'ca2', e.target.value)} /></td>
                    <td className="px-6 py-3 font-bold text-navy-900">{total}</td>
                    <td className="px-6 py-3">
                      <Badge color={pct >= 75 ? 'emerald' : pct >= 60 ? 'navy' : pct >= 45 ? 'amber' : 'rose'}>{pct}%</Badge>
                    </td>
                  </tr>
                )
              })}
              {!rows.length && <tr><td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-400">No students in this class.</td></tr>}
            </tbody>
          </table>
        )}

        {message && (
          <div className={`mx-6 mt-4 rounded-xl px-4 py-2.5 text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'}`}>{message.text}</div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-navy-100 px-6 py-4">
          <p className="text-xs text-slate-400">{approved ? 'Approved results are locked. Ask the admin to correct them.' : 'Saving sends the scores to the admin for approval.'}</p>
          <Button tone="primary" disabled={saving || approved || !rows.length} onClick={save}><Save size={16} /> {saving ? 'Saving...' : 'Save CA Scores'}</Button>
        </div>
      </Card>
    </div>
  )
}
