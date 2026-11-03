import { useEffect, useMemo, useState } from 'react'
import { BookOpen, Plus, BookMarked, Trash2 } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import DataTable, { TableToolbar } from '../../components/ui/DataTable'
import StatCard from '../../components/ui/StatCard'
import { admin } from '../../services/api'

const levelColor = { All: 'navy', Junior: 'emerald', Senior: 'sky', Science: 'violet', Arts: 'gold', Commercial: 'amber' }
const inputCls = 'w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none transition focus:border-navy-400 focus:ring-2 focus:ring-navy-100'
const emptyForm = { name: '', code: '', category: 'Core', level: 'All', teacherId: '' }

export default function AdminSubjects() {
  const [query, setQuery] = useState('')
  const [rows, setRows] = useState([])
  const [stats, setStats] = useState(null)
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [create, setCreate] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [subjectsRes, teachersRes] = await Promise.all([admin.subjects(), admin.teachers()])
      setRows(subjectsRes.data || [])
      setStats(subjectsRes.stats || null)
      setTeachers(teachersRes.data || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(
    () => rows.filter((s) => (s.name + s.code + s.category + s.level).toLowerCase().includes(query.toLowerCase())),
    [rows, query],
  )

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSave = async () => {
    setSaving(true)
    setFormError(null)
    try {
      await admin.createSubject({ ...form, teacherId: form.teacherId ? Number(form.teacherId) : null })
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
      await admin.deleteSubject(row.id)
      load()
    } catch (e) {
      window.alert(e.message)
    }
  }

  const columns = [
    { key: 'name', label: 'Subject', render: (s) => (
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-cream-100 text-navy-700"><BookOpen size={16} /></span>
        <div>
          <p className="font-semibold text-navy-900">{s.name}</p>
          <p className="text-xs text-slate-400">{s.code}</p>
        </div>
      </div>
    ) },
    { key: 'category', label: 'Category', render: (s) => <Badge color="navy">{s.category}</Badge> },
    { key: 'level', label: 'Level', render: (s) => <Badge color={levelColor[s.level] || 'slate'} dot>{s.level}</Badge> },
    { key: 'teacherName', label: 'Assigned Teacher', render: (s) => <span className="text-sm text-slate-600">{s.teacherName || '—'}</span> },
    { key: 'actions', label: '', right: true, render: (s) => (
      <button onClick={(e) => { e.stopPropagation(); handleDelete(s) }} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"><Trash2 size={15} /></button>
    ) },
  ]

  if (loading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-navy-100 border-t-navy-700" /></div>
  }

  return (
    <div>
      <PageHeader
        title="Subject Management"
        subtitle="Core, science, arts, commercial, Islamic and Arabic subjects"
        actions={<Button tone="primary" onClick={() => setCreate(true)}><Plus size={16} /> Add Subject</Button>}
      />

      {error && (
        <div className="mb-6 flex items-center justify-between rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
          <span>{error}</span>
          <Button tone="ghost" size="sm" onClick={load}>Retry</Button>
        </div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={BookOpen} label="Total Subjects" value={stats?.total ?? rows.length} sub="secondary" tone="navy" index={0} />
        <StatCard icon={BookMarked} label="Moral Subjects" value={stats?.moral ?? '—'} sub="IRS • Arabic • CRS" tone="emerald" index={1} />
        <StatCard icon={BookOpen} label="Science Track" value={stats?.science ?? '—'} sub="Senior sciences" tone="gold" index={2} />
      </div>

      <Card>
        <TableToolbar title="Secondary Subjects" subtitle="Assign subjects to teachers and classes" onSearch={setQuery} placeholder="Search subject…" />
        <DataTable columns={columns} rows={filtered} rowKey="id" />
      </Card>

      <Modal open={create} onClose={() => setCreate(false)} title="Add Subject" wide>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Subject Name</span>
            <input className={inputCls} placeholder="e.g. Mathematics" value={form.name} onChange={setField('name')} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Subject Code</span>
            <input className={inputCls} placeholder="e.g. MTH" value={form.code} onChange={setField('code')} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Category</span>
            <select className={inputCls} value={form.category} onChange={setField('category')}>
              {['Core', 'Science', 'Arts', 'Commercial', 'Moral'].map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Level</span>
            <select className={inputCls} value={form.level} onChange={setField('level')}>
              {['All', 'Junior', 'Senior'].map((l) => <option key={l}>{l}</option>)}
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Assigned Teacher</span>
            <select className={inputCls} value={form.teacherId} onChange={setField('teacherId')}>
              <option value="">Unassigned</option>
              {teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </label>
        </div>
        {formError && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600">{formError}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <Button tone="ghost" onClick={() => { setCreate(false); setForm(emptyForm); setFormError(null) }}>Cancel</Button>
          <Button tone="primary" disabled={saving} onClick={handleSave}>{saving ? 'Saving…' : 'Add Subject'}</Button>
        </div>
      </Modal>
    </div>
  )
}
