import { useEffect, useState } from 'react'
import { BookMarked, Plus, CalendarDays, ClipboardList, Pencil, Trash2, Eye } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge, { statusColor } from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'
import Modal from '../../components/ui/Modal'
import DataTable, { TableToolbar } from '../../components/ui/DataTable'
import { admin } from '../../services/api'

const inputCls = 'w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none transition focus:border-navy-400 focus:ring-2 focus:ring-navy-100'
const emptyForm = { title: '', classId: '', termId: '', startDate: '', endDate: '', subjectsCount: 10, status: 'Scheduled' }

export default function AdminExams() {
  const [rows, setRows] = useState([])
  const [stats, setStats] = useState(null)
  const [classes, setClasses] = useState([])
  const [terms, setTerms] = useState([])
  const [classId, setClassId] = useState('')
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
      const res = await admin.exams(classId ? { classId } : undefined)
      setRows(res.data || [])
      setStats(res.stats || null)
      setClasses(res.classes || [])
      setTerms(res.terms || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [classId])

  const filtered = rows.filter((e) => (e.title + (e.className || '') + (e.term || '')).toLowerCase().includes(query.toLowerCase()))

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const openCreate = () => {
    setForm({ ...emptyForm, classId: classes[0]?.id || '', termId: terms[0]?.id || '' })
    setFormError(null)
    setCreate(true)
  }

  const openEdit = (row) => {
    const term = terms.find((t) => t.name.endsWith(row.term))
    setForm({
      title: row.title,
      classId: classes.find((c) => c.name === row.className)?.id || '',
      termId: term?.id || '',
      startDate: row.rawStartDate || '',
      endDate: row.rawEndDate || '',
      subjectsCount: row.subjectsCount,
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
      if (editing) {
        await admin.updateExam(editing.id, {
          title: form.title,
          startDate: form.startDate,
          endDate: form.endDate || null,
          subjectsCount: Number(form.subjectsCount),
          status: form.status,
        })
      } else {
        await admin.createExam({
          title: form.title,
          classId: Number(form.classId),
          termId: Number(form.termId),
          startDate: form.startDate,
          endDate: form.endDate || null,
          subjectsCount: Number(form.subjectsCount),
          status: form.status,
        })
      }
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
      await admin.deleteExam(row.id)
      setView(null)
      load()
    } catch (e) {
      window.alert(e.message)
    }
  }

  const columns = [
    { key: 'title', label: 'Examination', render: (a) => (
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-cream-100 text-navy-700"><BookMarked size={16} /></span>
        <div><p className="font-semibold text-navy-900">{a.title}</p><p className="text-xs text-slate-400">{a.term} • {a.session}</p></div>
      </div>
    ) },
    { key: 'className', label: 'Class', render: (a) => <Badge color="navy">{a.className}</Badge> },
    { key: 'startDate', label: 'Start Date', render: (a) => <span className="text-sm text-slate-600">{a.startDate}</span> },
    { key: 'subjectsCount', label: 'Subjects', render: (a) => <span className="text-sm font-semibold text-navy-800">{a.subjectsCount}</span> },
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
      <PageHeader title="Examination Management" subtitle="Create and schedule examinations for every term" actions={<Button tone="primary" onClick={openCreate}><Plus size={16} /> Create Exam</Button>} />

      {error && (
        <div className="mb-6 flex items-center justify-between rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
          <span>{error}</span>
          <Button tone="ghost" size="sm" onClick={load}>Retry</Button>
        </div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={BookMarked} label="Scheduled Exams" value={stats?.scheduled ?? '—'} sub="this session" tone="navy" index={0} />
        <StatCard icon={CalendarDays} label="Next Exam" value={stats?.nextExam ?? '—'} sub="upcoming" tone="gold" index={1} />
        <StatCard icon={ClipboardList} label="Subjects Loaded" value={stats?.subjectsLoaded ?? '—'} sub="across classes" tone="emerald" index={2} />
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <select value={classId} onChange={(e) => setClassId(e.target.value)} className="rounded-xl border border-navy-100 bg-white px-3.5 py-2 text-sm font-medium text-navy-800 outline-none">
          <option value="">All Classes</option>
          {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <Card>
        <TableToolbar title="Examinations" subtitle="Scheduled, drafted and completed exams" onSearch={setQuery} placeholder="Search exam…" />
        <DataTable columns={columns} rows={filtered} rowKey="id" onRowClick={setView} />
      </Card>

      <Modal open={!!view} onClose={() => setView(null)} title="Exam Details">
        {view && (
          <div>
            <h4 className="font-extrabold text-navy-900">{view.title}</h4>
            <p className="text-xs text-slate-400">{view.term} • {view.session}</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[['Class', view.className], ['Start', view.startDate], ['End', view.endDate || '—'], ['Subjects', view.subjectsCount]].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-navy-50/50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{k}</p>
                  <p className="mt-0.5 text-sm font-semibold text-navy-900">{v}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl border border-navy-100 p-3">
              <span className="text-sm text-slate-500">Status</span>
              <Badge color={statusColor(view.status)} dot>{view.status}</Badge>
            </div>
            <div className="mt-5 flex justify-between">
              <Button tone="danger" size="sm" onClick={() => handleDelete(view)}><Trash2 size={14} /> Delete</Button>
              <Button tone="outline" size="sm" onClick={() => { setView(null); openEdit(view) }}><Pencil size={14} /> Edit</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={create || !!editing} onClose={closeForm} title={editing ? 'Edit Exam' : 'Create Exam'} wide>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Exam Title</span>
            <input className={inputCls} value={form.title} onChange={setField('title')} placeholder="e.g. First Term Examination" />
          </label>
          {!editing && (
            <>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-navy-800">Class</span>
                <select className={inputCls} value={form.classId} onChange={setField('classId')}>
                  {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-navy-800">Term</span>
                <select className={inputCls} value={form.termId} onChange={setField('termId')}>
                  {terms.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </label>
            </>
          )}
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Start Date</span>
            <input type="date" className={inputCls} value={form.startDate} onChange={setField('startDate')} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">End Date</span>
            <input type="date" className={inputCls} value={form.endDate} onChange={setField('endDate')} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Subjects Count</span>
            <input type="number" min="0" className={inputCls} value={form.subjectsCount} onChange={setField('subjectsCount')} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Status</span>
            <select className={inputCls} value={form.status} onChange={setField('status')}>
              {['Scheduled', 'Draft', 'Completed'].map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
        </div>
        {formError && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600">{formError}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <Button tone="ghost" onClick={closeForm}>Cancel</Button>
          <Button tone="primary" disabled={saving} onClick={handleSave}>{saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Exam'}</Button>
        </div>
      </Modal>
    </div>
  )
}
