import { useEffect, useMemo, useState } from 'react'
import { School, Plus, Eye, Trash2 } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import ProgressBar from '../../components/ui/ProgressBar'
import DataTable, { TableToolbar } from '../../components/ui/DataTable'
import StatCard from '../../components/ui/StatCard'
import { admin } from '../../services/api'

const inputCls = 'w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none transition focus:border-navy-400 focus:ring-2 focus:ring-navy-100'
const emptyForm = { name: '', level: '', arm: 'A', capacity: 40, classTeacherId: '', subjectIds: [] }

export default function AdminClasses() {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [create, setCreate] = useState(false)
  const [rows, setRows] = useState([])
  const [stats, setStats] = useState(null)
  const [teachers, setTeachers] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [classesRes, teachersRes, subjectsRes] = await Promise.all([
        admin.classes(),
        admin.teachers(),
        admin.subjects(),
      ])
      setRows(classesRes.data || [])
      setStats(classesRes.stats || null)
      setTeachers(teachersRes.data || [])
      setSubjects(subjectsRes.data || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const openClass = async (row) => {
    setSelected(row)
    try {
      const res = await admin.showClass(row.id)
      setSelected(res.data)
    } catch (e) {
      window.alert(e.message)
    }
  }

  const filtered = useMemo(
    () => rows.filter((c) => (c.name + c.level + (c.classTeacher || '')).toLowerCase().includes(query.toLowerCase())),
    [rows, query],
  )

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const toggleSubject = (id) => setForm((f) => ({
    ...f,
    subjectIds: f.subjectIds.includes(id) ? f.subjectIds.filter((s) => s !== id) : [...f.subjectIds, id],
  }))

  const handleSave = async () => {
    setSaving(true)
    setFormError(null)
    try {
      await admin.createClass({
        ...form,
        capacity: Number(form.capacity) || 40,
        classTeacherId: form.classTeacherId ? Number(form.classTeacherId) : null,
      })
      setCreate(false)
      setForm(emptyForm)
      load()
    } catch (e) {
      setFormError(e.errors ? Object.values(e.errors).flat().join(' ') : e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete ${row.name}?`)) return
    try {
      await admin.deleteClass(row.id)
      setSelected(null)
      load()
    } catch (e) {
      window.alert(e.message)
    }
  }

  const columns = [
    { key: 'name', label: 'Class', render: (c) => (
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-navy-800 text-xs font-extrabold text-gold-400">{c.name.split(' ')[0]}</span>
        <div>
          <p className="font-semibold text-navy-900">{c.name}</p>
          <p className="text-xs text-slate-400">{c.level}</p>
        </div>
      </div>
    ) },
    { key: 'classTeacher', label: 'Class Teacher', render: (c) => <span className="text-sm text-slate-600">{c.classTeacher || '—'}</span> },
    { key: 'students', label: 'Enrollment', render: (c) => (
      <div className="max-w-[140px]">
        <div className="flex justify-between text-xs"><span className="font-semibold text-navy-900">{c.studentCount} / {c.capacity}</span><span className="text-slate-400">{Math.round(c.studentCount / c.capacity * 100)}%</span></div>
        <ProgressBar value={c.studentCount / c.capacity * 100} color="bg-emerald-500" className="mt-1" height="h-1.5" />
      </div>
    ) },
    { key: 'subjects', label: 'Subjects', render: (c) => <span className="text-sm text-slate-600">{c.subjectCount ?? c.subjects?.length ?? 0} assigned</span> },
    { key: 'actions', label: '', right: true, render: (c) => (
      <button onClick={(e) => { e.stopPropagation(); openClass(c) }} className="grid h-8 w-8 place-items-center rounded-lg text-navy-600 transition hover:bg-navy-50"><Eye size={15} /></button>
    ) },
  ]

  if (loading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-navy-100 border-t-navy-700" /></div>
  }

  return (
    <div>
      <PageHeader
        title="Class Management"
        subtitle="JSS and SS arms — class teachers, subjects, timetable and more"
        actions={<Button tone="primary" onClick={() => setCreate(true)}><Plus size={16} /> Create Class</Button>}
      />

      {error && (
        <div className="mb-6 flex items-center justify-between rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
          <span>{error}</span>
          <Button tone="ghost" size="sm" onClick={load}>Retry</Button>
        </div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={School} label="Total Classes" value={stats?.total ?? '—'} sub="active arms" tone="navy" index={0} />
        <StatCard icon={School} label="Secondary Classes" value={stats?.secondary ?? '—'} sub="JSS 1 – SS 3" tone="emerald" index={1} />
        <StatCard icon={School} label="Avg Enrollment" value={stats?.averageEnrollment ?? '—'} sub="per arm" tone="gold" index={2} />
      </div>

      <Card>
        <TableToolbar title="Secondary Classes" subtitle="Search by class or teacher" onSearch={setQuery} placeholder="Search class…" />
        <DataTable columns={columns} rows={filtered} rowKey="id" onRowClick={openClass} />
      </Card>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Class ${selected?.name || ''}`}>
        {selected && (
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge color="navy">{selected.level}</Badge>
              <Badge color="emerald" dot>{selected.studentCount} students</Badge>
              <Badge color="gold">Teacher: {selected.classTeacher || '—'}</Badge>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[['Subjects', selected.subjects?.length ?? selected.subjectCount ?? 0], ['Capacity', selected.capacity], ['Arm', selected.arm], ['Class ID', selected.id]].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-navy-50/50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{k}</p>
                  <p className="mt-0.5 text-sm font-semibold text-navy-900">{v}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-xl border border-navy-100 p-4">
              <p className="text-sm font-bold text-navy-900">Subjects</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(selected.subjects || []).map((s) => <Badge key={s.id || s} color="navy">{s.name || s}</Badge>)}
                {!selected.subjects?.length && <span className="text-sm text-slate-400">No subjects assigned.</span>}
              </div>
            </div>
            <div className="mt-5 rounded-xl border border-navy-100 p-4">
              <p className="text-sm font-bold text-navy-900">Students</p>
              <div className="mt-2 space-y-2">
                {(selected.students || []).map((s) => (
                  <div key={s.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium text-navy-800">{s.name}</span>
                    <span className="font-mono text-xs text-slate-400">{s.studentId}</span>
                  </div>
                ))}
                {!selected.students?.length && <span className="text-sm text-slate-400">No students recorded.</span>}
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button tone="danger" size="sm" onClick={() => handleDelete(selected)}><Trash2 size={14} /> Delete Class</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={create} onClose={() => setCreate(false)} title="Create Class" wide>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Class Name</span>
            <input className={inputCls} placeholder="e.g. JSS 1C" value={form.name} onChange={setField('name')} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Level</span>
            <input className={inputCls} placeholder="e.g. JSS 1" value={form.level} onChange={setField('level')} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Arm</span>
            <input className={inputCls} placeholder="e.g. A" value={form.arm} onChange={setField('arm')} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Capacity</span>
            <input type="number" min="1" className={inputCls} value={form.capacity} onChange={setField('capacity')} />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Class Teacher</span>
            <select className={inputCls} value={form.classTeacherId} onChange={setField('classTeacherId')}>
              <option value="">Unassigned</option>
              {teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </label>
          <div className="block sm:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-navy-800">Subjects</span>
            <div className="grid max-h-48 gap-2 overflow-y-auto rounded-xl border border-navy-100 p-3 sm:grid-cols-2">
              {subjects.map((s) => (
                <label key={s.id} className="flex items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" checked={form.subjectIds.includes(s.id)} onChange={() => toggleSubject(s.id)} />
                  {s.name}
                </label>
              ))}
            </div>
          </div>
        </div>
        {formError && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600">{formError}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <Button tone="ghost" onClick={() => { setCreate(false); setForm(emptyForm); setFormError(null) }}>Cancel</Button>
          <Button tone="primary" disabled={saving} onClick={handleSave}>{saving ? 'Saving…' : 'Create Class'}</Button>
        </div>
      </Modal>
    </div>
  )
}
