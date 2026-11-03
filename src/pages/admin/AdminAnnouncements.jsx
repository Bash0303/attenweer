import { useEffect, useState } from 'react'
import { Megaphone, Plus, Bell, Pencil, Trash2 } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { admin } from '../../services/api'

const typeColor = { info: 'navy', exam: 'violet', meeting: 'gold', fees: 'amber', event: 'emerald' }
const inputCls = 'w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none transition focus:border-navy-400 focus:ring-2 focus:ring-navy-100'
const emptyForm = { title: '', message: '', audience: 'All Students', tag: 'Resumption' }

export default function AdminAnnouncements() {
  const [create, setCreate] = useState(false)
  const [editing, setEditing] = useState(null)
  const [rows, setRows] = useState([])
  const [tags, setTags] = useState([])
  const [audiences, setAudiences] = useState([])
  const [audience, setAudience] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await admin.announcements(audience ? { audience } : undefined)
      setRows(res.data || [])
      setTags(res.tags || [])
      setAudiences(res.audiences || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [audience])

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const openCreate = () => {
    setForm({ ...emptyForm, tag: tags[0] || 'Resumption', audience: audiences[0] || 'All Students' })
    setFormError(null)
    setCreate(true)
  }

  const openEdit = (row) => {
    setForm({ title: row.title, message: row.message, audience: row.audience, tag: row.tag })
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
      if (editing) await admin.updateAnnouncement(editing.id, form)
      else await admin.createAnnouncement(form)
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
      await admin.deleteAnnouncement(row.id)
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
      <PageHeader title="Announcements" subtitle="Publish news targeted to students, parents or teachers" actions={<Button tone="primary" onClick={openCreate}><Plus size={16} /> New Announcement</Button>} />

      {error && (
        <div className="mb-6 flex items-center justify-between rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
          <span>{error}</span>
          <Button tone="ghost" size="sm" onClick={load}>Retry</Button>
        </div>
      )}

      <div className="mb-5 flex flex-wrap gap-2">
        <button onClick={() => setAudience('')} className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition ${!audience ? 'bg-navy-800 text-white' : 'bg-white text-slate-500 hover:bg-navy-50'}`}>All Announcements</button>
        {audiences.map((a) => (
          <button key={a} onClick={() => setAudience(a)} className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition ${audience === a ? 'bg-navy-800 text-white' : 'bg-white text-slate-500 hover:bg-navy-50'}`}>{a}</button>
        ))}
      </div>

      <div className="space-y-4">
        {rows.map((a) => (
          <Card key={a.id} className="p-6 transition hover:shadow-lift" hover>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy-800 text-gold-400"><Megaphone size={18} /></span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge color={typeColor[a.type] || 'navy'}>{a.tag}</Badge>
                    <span className="text-xs text-slate-400">{a.date} • by {a.author}</span>
                  </div>
                  <h3 className="mt-1.5 font-bold text-navy-900">{a.title}</h3>
                  <p className="mt-1 max-w-2xl whitespace-pre-line text-sm leading-relaxed text-slate-500">{a.message}</p>
                  <div className="mt-2">
                    <Badge color="slate" dot>Audience: {a.audience}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button tone="outline" size="sm" onClick={() => openEdit(a)}><Pencil size={13} /> Edit</Button>
                <Button tone="ghost" size="sm" onClick={() => handleDelete(a)}><Trash2 size={13} /> Delete</Button>
              </div>
            </div>
          </Card>
        ))}
        {!rows.length && <Card className="p-8 text-center text-sm text-slate-400">No announcements published yet.</Card>}
      </div>

      <Modal open={create || !!editing} onClose={closeForm} title={editing ? 'Edit Announcement' : 'New Announcement'} wide>
        <div className="grid gap-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Title</span>
            <input className={inputCls} value={form.title} onChange={setField('title')} placeholder="e.g. Resumption Date" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Message</span>
            <textarea rows={4} className={inputCls} value={form.message} onChange={setField('message')} placeholder="Announcement message…" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-navy-800">Audience</span>
              <select className={inputCls} value={form.audience} onChange={setField('audience')}>
                {audiences.map((a) => <option key={a}>{a}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-navy-800">Tag</span>
              <select className={inputCls} value={form.tag} onChange={setField('tag')}>
                {tags.map((t) => <option key={t}>{t}</option>)}
              </select>
            </label>
          </div>
        </div>
        {formError && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600">{formError}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <Button tone="ghost" onClick={closeForm}>Cancel</Button>
          <Button tone="primary" disabled={saving} onClick={handleSave}>{saving ? 'Saving…' : editing ? 'Save Changes' : <><Bell size={15} /> Publish</>}</Button>
        </div>
      </Modal>
    </div>
  )
}
