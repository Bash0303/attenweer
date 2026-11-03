import { useEffect, useMemo, useState } from 'react'
import { PenSquare, Plus, Eye, Pencil, Star, Trash2 } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge, { statusColor } from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import DataTable, { TableToolbar } from '../../components/ui/DataTable'
import ProgressBar from '../../components/ui/ProgressBar'
import { teacher } from '../../services/api'
import { EmptyBlock, ErrorBlock, LoadBlock, inputCls } from './teacherUtils'

const emptyForm = { title: '', classId: '', subjectId: '', deadline: '', description: '', type: 'Open-ended', status: 'Open' }
const statuses = ['', 'Open', 'Graded', 'Closed']

export default function TeacherAssignments() {
  const [rows, setRows] = useState([])
  const [classes, setClasses] = useState([])
  const [pairs, setPairs] = useState([])
  const [stats, setStats] = useState({})
  const [status, setStatus] = useState('')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  const [view, setView] = useState(null)
  const [create, setCreate] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState(null)
  const [saving, setSaving] = useState(false)

  const [grade, setGrade] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [submissionsStats, setSubmissionsStats] = useState({})
  const [submissionsLoading, setSubmissionsLoading] = useState(false)
  const [submissionsError, setSubmissionsError] = useState(null)
  const [gradeRows, setGradeRows] = useState({})
  const [gradingSaving, setGradingSaving] = useState(false)
  const [gradeMessage, setGradeMessage] = useState(null)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)

    teacher.assignments(status ? { status } : undefined)
      .then((res) => {
        if (cancelled) return
        setRows(res.data || [])
        setClasses(res.classes || [])
        setPairs(res.pairs || [])
        setStats(res.stats || {})
      })
      .catch((e) => {
        if (!cancelled) setError(e.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [status, reloadKey])

  const filtered = useMemo(
    () => rows.filter((assignment) => `${assignment.title} ${assignment.subject || ''} ${assignment.className || ''}`.toLowerCase().includes(query.toLowerCase())),
    [rows, query],
  )

  const subjectsForClass = (classId) => {
    const seen = new Set()
    return pairs
      .filter((pair) => String(pair.classId) === String(classId))
      .filter((pair) => {
        if (seen.has(pair.subjectId)) return false
        seen.add(pair.subjectId)
        return true
      })
  }

  const setField = (key) => (event) => {
    const value = event.target.value

    if (key === 'classId') {
      const nextSubjects = subjectsForClass(value)
      setForm((current) => ({ ...current, classId: value, subjectId: nextSubjects[0]?.subjectId || '' }))
      return
    }

    setForm((current) => ({ ...current, [key]: value }))
  }

  const openCreate = () => {
    const firstClass = classes[0]
    const firstSubjects = firstClass ? subjectsForClass(firstClass.id) : []
    setForm({ ...emptyForm, classId: firstClass?.id || '', subjectId: firstSubjects[0]?.subjectId || '' })
    setFormError(null)
    setCreate(true)
  }

  const openEdit = (row) => {
    setForm({
      title: row.title,
      classId: row.classId,
      subjectId: row.subjectId,
      deadline: row.rawDeadline || '',
      description: row.description || '',
      type: row.type || 'Open-ended',
      status: row.status,
    })
    setFormError(null)
    setView(null)
    setEditing(row)
  }

  const closeForm = () => {
    setCreate(false)
    setEditing(null)
    setForm(emptyForm)
    setFormError(null)
  }

  const handleSave = async () => {
    setSaving(true)
    setFormError(null)

    try {
      const payload = {
        title: form.title,
        classId: Number(form.classId),
        subjectId: Number(form.subjectId),
        deadline: form.deadline,
        description: form.description,
        type: form.type,
      }

      if (editing) await teacher.updateAssignment(editing.id, { ...payload, status: form.status })
      else await teacher.createAssignment(payload)

      closeForm()
      setReloadKey((key) => key + 1)
    } catch (e) {
      setFormError(e.errors ? Object.values(e.errors).flat().join(' ') : e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete "${row.title}"?`)) return

    try {
      await teacher.deleteAssignment(row.id)
      setView(null)
      setReloadKey((key) => key + 1)
    } catch (e) {
      window.alert(e.message)
    }
  }

  const openGrade = async (row) => {
    setView(null)
    setGrade(row)
    setSubmissions([])
    setGradeRows({})
    setSubmissionsStats({})
    setSubmissionsError(null)
    setGradeMessage(null)
    setSubmissionsLoading(true)

    try {
      const res = await teacher.assignmentSubmissions(row.id)
      const list = res.data || []
      setSubmissions(list)
      setSubmissionsStats(res.stats || {})
      setGradeRows(Object.fromEntries(list.map((item) => [item.studentId, item.score ?? ''])))
    } catch (e) {
      setSubmissionsError(e.message)
    } finally {
      setSubmissionsLoading(false)
    }
  }

  const saveGrades = async () => {
    if (!grade) return

    setGradingSaving(true)
    setGradeMessage(null)

    try {
      const records = submissions.map((item) => ({
        studentId: item.studentId,
        score: gradeRows[item.studentId] === '' || gradeRows[item.studentId] === undefined ? null : Number(gradeRows[item.studentId]),
      }))
      const res = await teacher.gradeAssignment(grade.id, { records })
      setSubmissions(res.data || [])
      setSubmissionsStats(res.stats || {})
      setGradeRows(Object.fromEntries((res.data || []).map((item) => [item.studentId, item.score ?? ''])))
      setGradeMessage({ type: 'success', text: 'Grades saved successfully.' })
      setReloadKey((key) => key + 1)
    } catch (e) {
      setGradeMessage({ type: 'error', text: e.errors ? Object.values(e.errors).flat().join(' ') : e.message })
    } finally {
      setGradingSaving(false)
    }
  }

  const columns = [
    { key: 'title', label: 'Assignment', render: (a) => (
      <div><p className="font-semibold text-navy-900">{a.title}</p><p className="text-xs text-slate-400">{a.subject} • {a.className}</p></div>
    ) },
    { key: 'deadline', label: 'Deadline', render: (a) => <span className="text-sm text-slate-600">{a.deadline}</span> },
    { key: 'submissions', label: 'Submissions', render: (a) => <span className="text-sm font-semibold text-navy-800">{a.submissions}/{a.totalStudents}</span> },
    { key: 'status', label: 'Status', render: (a) => <Badge color={statusColor(a.status)} dot>{a.status}</Badge> },
    { key: 'actions', label: '', right: true, render: (a) => (
      <div className="flex justify-end gap-1">
        <button onClick={(event) => { event.stopPropagation(); openGrade(a) }} className="grid h-8 w-8 place-items-center rounded-lg text-navy-600 transition hover:bg-navy-50"><Star size={15} /></button>
        <button onClick={(event) => { event.stopPropagation(); setView(a) }} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100"><Eye size={15} /></button>
      </div>
    ) },
  ]

  if (loading && !rows.length) return <LoadBlock label="Loading assignments..." />
  if (error) return <ErrorBlock message={error} onRetry={() => setReloadKey((key) => key + 1)} />

  if (!classes.length) {
    return (
      <div>
        <PageHeader title="Assignments" subtitle="Post, view submissions and grade student work" />
        <EmptyBlock title="No classes assigned" message="Assignments can be created once the admin assigns you to a class and subject." />
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Assignments" subtitle="Post, view submissions and grade student work" actions={<Button tone="primary" onClick={openCreate} disabled={!pairs.length}><Plus size={16} /> New Assignment</Button>} />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {statuses.map((value) => (
            <button key={value || 'all'} onClick={() => setStatus(value)} className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition ${status === value ? 'bg-navy-800 text-white' : 'bg-white text-slate-500 hover:bg-navy-50'}`}>{value || 'All'}</button>
          ))}
        </div>
        <div className="ml-auto flex gap-2 text-xs font-semibold">
          <Badge color="amber" dot>{stats.open || 0} open</Badge>
          <Badge color="emerald" dot>{stats.graded || 0} graded</Badge>
          <Badge color="slate" dot>{stats.closed || 0} closed</Badge>
        </div>
      </div>

      <Card>
        <TableToolbar title="My Assignments" subtitle="Across your assigned classes and subjects" onSearch={setQuery} placeholder="Search assignment…" />
        <DataTable columns={columns} rows={filtered} rowKey="id" onRowClick={setView} />
      </Card>

      <Card className="mt-6">
        <div className="border-b border-navy-100 px-6 py-4"><h3 className="font-bold text-navy-900">Submission Progress</h3></div>
        <div className="grid gap-4 p-6 md:grid-cols-2">
          {rows.slice(0, 6).map((assignment) => {
            const progress = assignment.totalStudents ? Math.round((assignment.submissions / assignment.totalStudents) * 100) : 0
            return (
              <div key={assignment.id} className="rounded-xl border border-navy-100 p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-cream-100 text-navy-700"><PenSquare size={16} /></span>
                  <Badge color={statusColor(assignment.status)} dot>{assignment.status}</Badge>
                </div>
                <h4 className="mt-3 font-bold text-navy-900">{assignment.title}</h4>
                <p className="text-xs text-slate-400">{assignment.subject} • deadline {assignment.deadline}</p>
                <div className="mt-3 flex items-center gap-2">
                  <ProgressBar value={progress} color="bg-navy-600" height="h-1.5" className="flex-1" />
                  <span className="text-xs font-semibold text-navy-700">{assignment.submissions}/{assignment.totalStudents}</span>
                </div>
              </div>
            )
          })}
          {!rows.length && <p className="text-sm text-slate-400">No assignments yet.</p>}
        </div>
      </Card>

      <Modal open={!!view} onClose={() => setView(null)} title="Assignment Details">
        {view && (
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy-800 text-gold-400"><PenSquare size={18} /></span>
              <div>
                <h4 className="font-extrabold text-navy-900">{view.title}</h4>
                <p className="text-xs text-slate-400">{view.subject} • {view.className}</p>
              </div>
            </div>
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-600">{view.description || 'No description provided.'}</p>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-navy-50 p-3"><p className="text-lg font-extrabold text-navy-900">{view.submissions}</p><p className="text-[11px] text-slate-400">Submitted</p></div>
              <div className="rounded-xl bg-emerald-50 p-3"><p className="text-sm font-extrabold text-emerald-600">{view.deadline}</p><p className="text-[11px] text-slate-400">Deadline</p></div>
              <div className="rounded-xl bg-amber-50 p-3"><p className="text-lg font-extrabold text-amber-600">{Math.max(0, view.totalStudents - view.submissions)}</p><p className="text-[11px] text-slate-400">Pending</p></div>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl border border-navy-100 p-3 text-sm">
              <span className="text-slate-500">Type: <strong className="text-navy-800">{view.type}</strong></span>
              <Badge color={statusColor(view.status)} dot>{view.status}</Badge>
            </div>
            <div className="mt-5 flex justify-between gap-2">
              <Button tone="danger" size="sm" onClick={() => handleDelete(view)}><Trash2 size={14} /> Delete</Button>
              <div className="flex gap-2">
                <Button tone="outline" size="sm" onClick={() => openGrade(view)}><Star size={14} /> Grade</Button>
                <Button tone="outline" size="sm" onClick={() => openEdit(view)}><Pencil size={14} /> Edit</Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={create || !!editing} onClose={closeForm} title={editing ? 'Edit Assignment' : 'New Assignment'} wide>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Title</span>
            <input className={inputCls} value={form.title} onChange={setField('title')} placeholder="Assignment title" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Class</span>
            <select className={inputCls} value={form.classId} onChange={setField('classId')}>
              {classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Subject</span>
            <select className={inputCls} value={form.subjectId} onChange={setField('subjectId')}>
              {subjectsForClass(form.classId).map((pair) => <option key={pair.subjectId} value={pair.subjectId}>{pair.subjectName}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Deadline</span>
            <input type="date" className={inputCls} value={form.deadline} onChange={setField('deadline')} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Type</span>
            <input className={inputCls} value={form.type} onChange={setField('type')} placeholder="Open-ended" />
          </label>
          {editing && (
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-navy-800">Status</span>
              <select className={inputCls} value={form.status} onChange={setField('status')}>
                {['Open', 'Graded', 'Closed'].map((value) => <option key={value}>{value}</option>)}
              </select>
            </label>
          )}
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Description</span>
            <textarea rows={3} className={inputCls} value={form.description} onChange={setField('description')} placeholder="Assignment instructions…" />
          </label>
        </div>
        {formError && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600">{formError}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <Button tone="ghost" onClick={closeForm}>Cancel</Button>
          <Button tone="primary" disabled={saving || !form.title || !form.classId || !form.subjectId || !form.deadline} onClick={handleSave}>{saving ? 'Saving…' : editing ? 'Save Changes' : 'Publish Assignment'}</Button>
        </div>
      </Modal>

      <Modal open={!!grade} onClose={() => setGrade(null)} title={`Submissions — ${grade?.title || ''}`} wide>
        {grade && (
          <div>
            <div className="mb-4 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-navy-50 p-3"><p className="text-lg font-extrabold text-navy-900">{submissionsStats.total || 0}</p><p className="text-[11px] text-slate-400">Students</p></div>
              <div className="rounded-xl bg-emerald-50 p-3"><p className="text-lg font-extrabold text-emerald-600">{submissionsStats.graded || 0}</p><p className="text-[11px] text-slate-400">Graded</p></div>
              <div className="rounded-xl bg-amber-50 p-3"><p className="text-lg font-extrabold text-amber-600">{submissionsStats.pending || 0}</p><p className="text-[11px] text-slate-400">Not submitted</p></div>
            </div>

            {submissionsLoading && <p className="py-6 text-center text-sm text-slate-400">Loading submissions...</p>}
            {submissionsError && <p className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600">{submissionsError}</p>}

            {!submissionsLoading && !submissionsError && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-navy-100 text-xs uppercase tracking-wide text-slate-400">
                      <th className="px-4 py-2.5 font-semibold">Student</th><th className="px-4 py-2.5 font-semibold">Submitted</th><th className="px-4 py-2.5 font-semibold">File</th><th className="px-4 py-2.5 font-semibold">Score /20</th><th className="px-4 py-2.5 font-semibold">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-50">
                    {submissions.map((item) => (
                      <tr key={item.studentId}>
                        <td className="px-4 py-3 font-semibold text-navy-900">{item.name}</td>
                        <td className="px-4 py-3 text-slate-500">{item.submittedAt || '—'}</td>
                        <td className="px-4 py-3 text-navy-700">{item.file || '—'}</td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="0"
                            max="20"
                            value={gradeRows[item.studentId] ?? ''}
                            onChange={(e) => setGradeRows((current) => ({ ...current, [item.studentId]: e.target.value }))}
                            className="w-20 rounded-lg border border-navy-100 px-2 py-1 text-sm"
                          />
                        </td>
                        <td className="px-4 py-3"><Badge color={item.grade ? 'navy' : 'slate'}>{item.grade || '—'}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!submissions.length && <p className="py-8 text-center text-sm text-slate-400">No students in this class.</p>}
              </div>
            )}

            {gradeMessage && (
              <p className={`mt-4 rounded-xl px-4 py-2.5 text-sm font-medium ${gradeMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'}`}>{gradeMessage.text}</p>
            )}

            <div className="mt-5 flex items-center justify-between">
              <p className="text-xs text-slate-400">Scores save as grades and update the assignment submission count.</p>
              <Button tone="primary" size="sm" disabled={gradingSaving || !submissions.length} onClick={saveGrades}>{gradingSaving ? 'Saving...' : 'Save All Grades'}</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
