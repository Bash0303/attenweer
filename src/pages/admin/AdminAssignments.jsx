import { useEffect, useState } from 'react'
import { PenSquare, Plus, Eye, Pencil, Trash2 } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge, { statusColor } from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import DataTable, { TableToolbar } from '../../components/ui/DataTable'
import { admin } from '../../services/api'

const inputCls = 'w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none transition focus:border-navy-400 focus:ring-2 focus:ring-navy-100'
const emptyForm = { title: '', classId: '', subjectId: '', deadline: '', description: '', type: 'Open-ended', status: 'Open' }
const statuses = ['', 'Open', 'Graded', 'Closed']

export default function AdminAssignments() {
  const [rows, setRows] = useState([])
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [classId, setClassId] = useState('')
  const [status, setStatus] = useState('')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [view, setView] = useState(null)
  const [create, setCreate] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = {}
      if (classId) params.classId = classId
      if (status) params.status = status
      const res = await admin.assignments(params)
      setRows(res.data || [])
      setClasses(res.classes || [])
      setSubjects(res.subjects || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [classId, status])

  const filtered = rows.filter((a) => (a.title + (a.subject || '') + (a.className || '')).toLowerCase().includes(query.toLowerCase()))

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const openCreate = () => {
    setForm({ ...emptyForm, classId: classes[0]?.id || '', subjectId: subjects[0]?.id || '' })
    setFormError(null)
    setCreate(true)
  }

  const openEdit = (row) => {
    setForm({
      title: row.title,
      classId: classes.find((c) => c.name === row.className)?.id || '',
      subjectId: subjects.find((s) => s.name === row.subject)?.id || '',
      deadline: row.rawDeadline || '',
      description: row.description || '',
      type: row.type || 'Open-ended',
      status: row.status,
    })
    setFormError(null)
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
      if (editing) await admin.updateAssignment(editing.id, { ...payload, status: form.status })
      else await admin.createAssignment(payload)
      closeForm()
      load()
    } catch (e) {
      setFormError(e.errors ? Object.values(e.errors).flat().join(' ') : e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete "${row.title}"?`)) return
    try {
      await admin.deleteAssignment(row.id)
      setView(null)
      load()
    } catch (e) {
      window.alert(e.message)
    }
  }

  const columns = [
    { key: 'title', label: 'Assignment', render: (a) => (
      <div>
        <p className="font-semibold text-navy-900">{a.title}</p>
        <p className="text-xs text-slate-400">{a.subject}</p>
      </div>
    ) },
    { key: 'className', label: 'Class', render: (a) => <Badge color="navy">{a.className}</Badge> },
    { key: 'teacher', label: 'Teacher', render: (a) => <span className="text-sm text-slate-600">{a.teacher || '—'}</span> },
    { key: 'deadline', label: 'Deadline', render: (a) => <span className="text-sm text-slate-600">{a.deadline}</span> },
    { key: 'submissions', label: 'Submissions', render: (a) => <span className="text-sm font-semibold text-navy-800">{a.submissions}/{a.totalStudents}</span> },
    { key: 'status', label: 'Status', render: (a) => <Badge color={statusColor(a.status)} dot>{a.status}</Badge> },
    { key: 'actions', label: '', right: true, render: (a) => (
      <button onClick={(e) => { e.stopPropagation(); setView(a) }} className="grid h-8 w-8 place-items-center rounded-lg text-navy-600 transition hover:bg-navy-50"><Eye size={15} /></button>
    ) },
  ]

  if (loading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-navy-100 border-t-navy-700" /></div>
  }

  return (
    <div>
      <PageHeader
        title="Assignment Management"
        subtitle="Monitor all assignments across the school"
        actions={<Button tone="primary" onClick={openCreate}><Plus size={16} /> Create Assignment</Button>}
      />

      {error && (
        <div className="mb-6 flex items-center justify-between rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
          <span>{error}</span>
          <Button tone="ghost" size="sm" onClick={load}>Retry</Button>
        </div>
      )}

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <select value={classId} onChange={(e) => setClassId(e.target.value)} className="rounded-xl border border-navy-100 bg-white px-3.5 py-2 text-sm font-medium text-navy-800 outline-none">
          <option value="">All Classes</option>
          {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div className="flex flex-wrap gap-2">
          {statuses.map((s) => (
            <button key={s || 'all'} onClick={() => setStatus(s)} className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition ${status === s ? 'bg-navy-800 text-white' : 'bg-white text-slate-500 hover:bg-navy-50'}`}>{s || 'All'}</button>
          ))}
        </div>
      </div>

      <Card>
        <TableToolbar title="All Assignments" subtitle="Track submissions, grading and deadlines" onSearch={setQuery} placeholder="Search assignment…" />
        <DataTable columns={columns} rows={filtered} rowKey="id" onRowClick={setView} />
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
              <span className="text-slate-500">Teacher: <strong className="text-navy-800">{view.teacher || '—'}</strong></span>
              <Badge color={statusColor(view.status)} dot>{view.status}</Badge>
            </div>
            <div className="mt-5 flex justify-between gap-2">
              <Button tone="danger" size="sm" onClick={() => handleDelete(view)}><Trash2 size={14} /> Delete</Button>
              <div className="flex gap-2">
                <Button tone="outline" size="sm" onClick={() => { setView(null); openEdit(view) }}><Pencil size={14} /> Edit</Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={create || !!editing} onClose={closeForm} title={editing ? 'Edit Assignment' : 'Create Assignment'} wide>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Title</span>
            <input className={inputCls} value={form.title} onChange={setField('title')} placeholder="Assignment title" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Class</span>
            <select className={inputCls} value={form.classId} onChange={setField('classId')}>
              {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Subject</span>
            <select className={inputCls} value={form.subjectId} onChange={setField('subjectId')}>
              {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
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
                {['Open', 'Graded', 'Closed'].map((s) => <option key={s}>{s}</option>)}
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
          <Button tone="primary" disabled={saving} onClick={handleSave}>{saving ? 'Saving…' : editing ? 'Save Changes' : 'Publish Assignment'}</Button>
        </div>
      </Modal>
    </div>
  )
}
