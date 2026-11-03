import { useEffect, useMemo, useState } from 'react'
import { BookMarked, Save } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge, { statusColor } from '../../components/ui/Badge'
import DataTable from '../../components/ui/DataTable'
import Modal from '../../components/ui/Modal'
import StatCard from '../../components/ui/StatCard'
import { teacher } from '../../services/api'
import { EmptyBlock, ErrorBlock, LoadBlock } from './teacherUtils'

export default function TeacherExams() {
  const [exams, setExams] = useState([])
  const [stats, setStats] = useState({})
  const [options, setOptions] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  const [entry, setEntry] = useState(null)
  const [classId, setClassId] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [termId, setTermId] = useState('')
  const [rows, setRows] = useState([])
  const [upload, setUpload] = useState(null)
  const [entryLoading, setEntryLoading] = useState(false)
  const [entryError, setEntryError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)

    Promise.all([teacher.exams(), teacher.scoreOptions()])
      .then(([examRes, optionRes]) => {
        if (cancelled) return
        setExams(examRes.data || [])
        setStats(examRes.stats || {})
        setOptions(optionRes)
      })
      .catch((e) => {
        if (!cancelled) setError(e.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [reloadKey])

  const assignments = options?.assignments || []
  const terms = options?.terms || []

  const subjectsForClass = useMemo(() => {
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
    if (!subjectsForClass.some((subject) => String(subject.id) === String(subjectId))) {
      setSubjectId(subjectsForClass[0]?.id ?? '')
    }
  }, [subjectsForClass, subjectId])

  useEffect(() => {
    if (!entry || !classId || !subjectId || !termId) return undefined

    let cancelled = false

    setEntryLoading(true)
    setEntryError(null)
    setMessage(null)

    teacher.scores({ classId, subjectId, termId })
      .then((res) => {
        if (cancelled) return
        setRows(res.data || [])
        setUpload(res.upload || null)
      })
      .catch((e) => {
        if (!cancelled) setEntryError(e.message)
      })
      .finally(() => {
        if (!cancelled) setEntryLoading(false)
      })

    return () => { cancelled = true }
  }, [entry, classId, subjectId, termId])

  const openEntry = (exam) => {
    const firstSubject = assignments.find((item) => String(item.classId) === String(exam.classId))
    setEntry(exam)
    setClassId(exam.classId)
    setSubjectId(firstSubject?.subjectId || '')
    setTermId(exam.termId || terms.find((term) => term.isCurrent)?.id || terms[0]?.id || '')
    setRows([])
    setUpload(null)
    setEntryError(null)
    setMessage(null)
  }

  const closeEntry = () => {
    setEntry(null)
    setRows([])
    setUpload(null)
    setMessage(null)
  }

  const setExamScore = (studentId, value) => {
    const numeric = Math.max(0, Math.min(60, Number(value) || 0))
    setRows((list) => list.map((row) => (row.studentId === studentId ? { ...row, exam: numeric } : row)))
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
      setMessage({ type: 'success', text: 'Exam scores saved and sent for admin approval.' })
    } catch (e) {
      setMessage({ type: 'error', text: e.errors ? Object.values(e.errors).flat().join(' ') : e.message })
    } finally {
      setSaving(false)
    }
  }

  const columns = [
    { key: 'title', label: 'Examination', render: (a) => (
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-cream-100 text-navy-700"><BookMarked size={16} /></span>
        <div><p className="font-semibold text-navy-900">{a.title}</p><p className="text-xs text-slate-400">{a.session} • {a.term}</p></div>
      </div>
    ) },
    { key: 'className', label: 'Class', render: (a) => <Badge color="navy">{a.className}</Badge> },
    { key: 'date', label: 'Date', render: (a) => <span className="text-sm text-slate-600">{a.startDate}</span> },
    { key: 'status', label: 'Status', render: (a) => <Badge color={statusColor(a.status)} dot>{a.status}</Badge> },
    { key: 'action', label: '', right: true, render: (a) => <Button tone="outline" size="sm" onClick={() => openEntry(a)}><Save size={14} /> Enter Scores</Button> },
  ]

  if (loading) return <LoadBlock label="Loading examinations..." />
  if (error) return <ErrorBlock message={error} onRetry={() => setReloadKey((key) => key + 1)} />

  if (!exams.length) {
    return (
      <div>
        <PageHeader title="Examinations" subtitle="Enter exam scores and release examination results" />
        <EmptyBlock title="No examinations scheduled" message="Examinations for your classes will appear here once the admin schedules them." />
      </div>
    )
  }

  const approved = upload?.status === 'Approved'

  return (
    <div>
      <PageHeader title="Examinations" subtitle="Enter exam scores and release examination results" />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={BookMarked} label="Scheduled" value={stats.scheduled || 0} sub="examinations" tone="navy" index={0} />
        <StatCard icon={BookMarked} label="Next Exam" value={stats.nextExam || '—'} sub="upcoming" tone="gold" index={1} />
        <StatCard icon={BookMarked} label="Subjects Loaded" value={stats.subjectsLoaded || 0} sub="across exams" tone="emerald" index={2} />
      </div>

      <Card>
        <div className="border-b border-navy-100 px-6 py-4"><h3 className="font-bold text-navy-900">My Examinations</h3></div>
        <DataTable columns={columns} rows={exams} rowKey="id" />
      </Card>

      <Modal open={!!entry} onClose={closeEntry} title={`Enter Exam Scores — ${entry?.title || ''}`} wide>
        {entry && (
          <div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-navy-800">Subject</span>
                <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className="w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none focus:border-navy-400">
                  {subjectsForClass.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
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
              <p className="text-xs text-slate-400">{entry.className} • Exam score is out of 60</p>
              <Badge color={approved ? 'emerald' : upload ? 'amber' : 'slate'} dot>{upload ? `${upload.status} • ${upload.fileName}` : 'No scores saved yet'}</Badge>
            </div>

            {entryLoading && <p className="py-8 text-center text-sm text-slate-400">Loading students...</p>}
            {entryError && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600">{entryError}</p>}

            {!entryLoading && !entryError && (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-navy-100 bg-navy-50/50 text-xs uppercase tracking-wide text-slate-500">
                      <th className="px-4 py-2.5 font-semibold">Student</th>
                      <th className="px-4 py-2.5 font-semibold">CA 1</th>
                      <th className="px-4 py-2.5 font-semibold">CA 2</th>
                      <th className="px-4 py-2.5 font-semibold">Exam (/60)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-50">
                    {rows.map((row) => (
                      <tr key={row.studentId}>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-navy-900">{row.name}</p>
                          <p className="font-mono text-[11px] text-slate-400">{row.studentCode}</p>
                        </td>
                        <td className="px-4 py-3 text-slate-500">{row.ca1}</td>
                        <td className="px-4 py-3 text-slate-500">{row.ca2}</td>
                        <td className="px-4 py-3">
                          <input disabled={approved} type="number" min="0" max="60" value={row.exam} onChange={(e) => setExamScore(row.studentId, e.target.value)} className="w-20 rounded-lg border border-navy-100 px-2 py-1.5 text-sm disabled:bg-slate-100" />
                        </td>
                      </tr>
                    ))}
                    {!rows.length && <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-slate-400">No students in this class.</td></tr>}
                  </tbody>
                </table>
              </div>
            )}

            {message && (
              <p className={`mt-4 rounded-xl px-4 py-2.5 text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'}`}>{message.text}</p>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <Button tone="ghost" onClick={closeEntry}>Close</Button>
              <Button tone="primary" disabled={saving || approved || !rows.length} onClick={save}><Save size={15} /> {saving ? 'Saving...' : 'Save Exam Scores'}</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
