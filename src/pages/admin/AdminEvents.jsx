import { useEffect, useState } from 'react'
import { CalendarDays, Plus, Pencil, Trash2, MapPin } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { admin } from '../../services/api'

const eventTone = {
  exam: 'bg-navy-600', meeting: 'bg-gold-500', sports: 'bg-emerald-600', islamic: 'bg-teal-700', resumption: 'bg-sky-600',
}
const eventLabel = {
  exam: 'Examination', meeting: 'Meeting', sports: 'Sports', islamic: 'Islamic', resumption: 'Resumption',
}
const inputCls = 'w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none transition focus:border-navy-400 focus:ring-2 focus:ring-navy-100'
const emptyForm = { title: '', eventDate: '', type: 'exam', description: '', location: '' }

export default function AdminEvents() {
  const [rows, setRows] = useState([])
  const [type, setType] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [create, setCreate] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await admin.events(type ? { type } : undefined)
      setRows(res.data || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [type])

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const openCreate = () => {
    setForm({ ...emptyForm, eventDate: new Date().toISOString().slice(0, 10) })
    setFormError(null)
    setCreate(true)
  }

  const openEdit = (row) => {
    setForm({ title: row.title, eventDate: row.rawDate, type: row.type, description: row.description || '', location: row.location || '' })
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
      if (editing) await admin.updateEvent(editing.id, form)
      else await admin.createEvent(form)
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
      await admin.deleteEvent(row.id)
      load()
    } catch (e) {
      window.alert(e.message)
    }
  }

  if (loading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-navy-100 border-t-navy-700" /></div>
  }

  return (
    <div>
      <PageHeader title="School Events" subtitle="Manage calendar of activities and competitions" actions={<Button tone="primary" onClick={openCreate}><Plus size={16} /> Add Event</Button>} />

      {error && (
        <div className="mb-6 flex items-center justify-between rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
          <span>{error}</span>
          <Button tone="ghost" size="sm" onClick={load}>Retry</Button>
        </div>
      )}

      <div className="mb-5 flex flex-wrap gap-2">
        <button onClick={() => setType('')} className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition ${!type ? 'bg-navy-800 text-white' : 'bg-white text-slate-500 hover:bg-navy-50'}`}>All Events</button>
        {Object.keys(eventLabel).map((t) => (
          <button key={t} onClick={() => setType(t)} className={`rounded-xl px-3.5 py-2 text-sm font-semibold capitalize transition ${type === t ? 'bg-navy-800 text-white' : 'bg-white text-slate-500 hover:bg-navy-50'}`}>{eventLabel[t]}</button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((e) => (
          <Card key={e.id} className="p-6" hover>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <span className={`grid h-14 w-14 place-items-center rounded-2xl ${eventTone[e.type] || 'bg-navy-600'} text-white`}>
                  <CalendarDays size={24} />
                </span>
                <div>
                  <h3 className="font-bold text-navy-900">{e.title}</h3>
                  <p className="text-xs font-semibold text-gold-600">{e.date}</p>
                </div>
              </div>
              <Badge color="navy">{eventLabel[e.type] || e.type}</Badge>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-500">{e.description || 'No description provided.'}</p>
            {e.location && <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400"><MapPin size={12} /> {e.location}</p>}
            <div className="mt-4 flex justify-end gap-2">
              <Button tone="ghost" size="sm" onClick={() => openEdit(e)}><Pencil size={13} /> Edit</Button>
              <Button tone="outline" size="sm" onClick={() => handleDelete(e)}><Trash2 size={13} /> Delete</Button>
            </div>
          </Card>
        ))}
        {!rows.length && <Card className="p-8 text-center text-sm text-slate-400 sm:col-span-2 lg:col-span-3">No events scheduled.</Card>}
      </div>

      <Modal open={create || !!editing} onClose={closeForm} title={editing ? 'Edit Event' : 'Add Event'} wide>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Event Title</span>
            <input className={inputCls} value={form.title} onChange={setField('title')} placeholder="e.g. Inter-House Sports" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Date</span>
            <input type="date" className={inputCls} value={form.eventDate} onChange={setField('eventDate')} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Type</span>
            <select className={inputCls} value={form.type} onChange={setField('type')}>
              {Object.entries(eventLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Location</span>
            <input className={inputCls} value={form.location} onChange={setField('location')} placeholder="e.g. School Main Field" />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Description</span>
            <textarea rows={3} className={inputCls} value={form.description} onChange={setField('description')} />
          </label>
        </div>
        {formError && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600">{formError}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <Button tone="ghost" onClick={closeForm}>Cancel</Button>
          <Button tone="primary" disabled={saving} onClick={handleSave}>{saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Event'}</Button>
        </div>
      </Modal>
    </div>
  )
}
