import { useEffect, useState } from 'react'
import { CalendarRange, CheckCircle2, Lock, Plus } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { admin } from '../../services/api'

const inputCls = 'w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none transition focus:border-navy-400 focus:ring-2 focus:ring-navy-100'
const emptyForm = { name: '', startsOn: '', endsOn: '' }

export default function AdminSessions() {
  const [sessions, setSessions] = useState([])
  const [current, setCurrent] = useState(null)
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
      const res = await admin.sessions()
      setSessions(res.data || [])
      setCurrent(res.current || null)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSave = async () => {
    setSaving(true)
    setFormError(null)
    try {
      await admin.createSession(form)
      setCreate(false)
      setForm(emptyForm)
      load()
    } catch (e) {
      setFormError(e.errors ? Object.values(e.errors).flat().join(' ') : e.message)
    } finally {
      setSaving(false)
    }
  }

  const openTerm = async (session, term) => {
    try {
      await admin.updateTerm(session.id, term.id, 'Open')
      load()
    } catch (e) {
      window.alert(e.message)
    }
  }

  const lockResults = async (session, term) => {
    if (!window.confirm(`Lock results for ${term.name}?`)) return
    try {
      await admin.lockResults(session.id, term.id)
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
      <PageHeader
        title="Academic Sessions & Terms"
        subtitle="Create sessions and manage term states safely"
        actions={<Button tone="primary" onClick={() => setCreate(true)}><Plus size={16} /> New Session</Button>}
      />

      {error && (
        <div className="mb-6 flex items-center justify-between rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
          <span>{error}</span>
          <Button tone="ghost" size="sm" onClick={load}>Retry</Button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {sessions.map((s) => (
          <Card key={s.id} className="p-6" hover>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy-800 text-gold-400"><CalendarRange size={20} /></span>
                <div>
                  <h3 className="text-lg font-extrabold text-navy-900">{s.name}</h3>
                  <p className="text-xs text-slate-400">{s.startsOn} — {s.endsOn}</p>
                </div>
              </div>
              <Badge color={s.status === 'Active' ? 'emerald' : s.status === 'Completed' ? 'navy' : 'slate'} dot>{s.status}</Badge>
            </div>
            <div className="mt-5 space-y-3">
              {(s.terms || []).map((t) => (
                <div key={t.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-navy-100 p-3">
                  <div>
                    <span className="text-sm font-semibold text-navy-800">{t.name}</span>
                    <p className="text-[11px] text-slate-400">{t.startsOn} — {t.endsOn}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {t.status === 'Locked' && <Badge color="slate"><Lock size={11} /> Locked</Badge>}
                    {t.status === 'Open' && <Badge color="emerald" dot>Open</Badge>}
                    {t.status === 'Upcoming' && <Badge color="amber" dot>Upcoming</Badge>}
                    {t.status === 'Completed' && <Badge color="navy" dot>Completed</Badge>}
                    {t.status !== 'Open' && t.status !== 'Locked' && (
                      <Button tone="outline" size="sm" onClick={() => openTerm(s, t)}><CheckCircle2 size={14} /> Set Open</Button>
                    )}
                    {t.status === 'Open' && (
                      <Button tone="ghost" size="sm" onClick={() => lockResults(s, t)}><Lock size={14} /> Lock Results</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
        {!sessions.length && <Card className="p-8 text-center text-sm text-slate-400">No academic sessions created yet.</Card>}
      </div>

      <Card className="mt-6 p-5">
        <p className="text-sm text-slate-500">
          <strong className="text-navy-800">Current:</strong> {current?.session || '—'} • {current?.term || 'No open term'}.
          Open terms become the active term for attendance, results and fees.
        </p>
      </Card>

      <Modal open={create} onClose={() => setCreate(false)} title="Create Academic Session">
        <div className="grid gap-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Session Name</span>
            <input className={inputCls} placeholder="e.g. 2026/2027" value={form.name} onChange={setField('name')} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Start Date</span>
            <input type="date" className={inputCls} value={form.startsOn} onChange={setField('startsOn')} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">End Date</span>
            <input type="date" className={inputCls} value={form.endsOn} onChange={setField('endsOn')} />
          </label>
        </div>
        {formError && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600">{formError}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <Button tone="ghost" onClick={() => { setCreate(false); setForm(emptyForm); setFormError(null) }}>Cancel</Button>
          <Button tone="primary" disabled={saving} onClick={handleSave}>{saving ? 'Saving…' : 'Create Session'}</Button>
        </div>
      </Modal>
    </div>
  )
}
