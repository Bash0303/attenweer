import { useEffect, useState } from 'react'
import { Save, School, Palette, Bell } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { admin } from '../../services/api'

const inputCls = 'w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none transition focus:border-navy-400 focus:ring-2 focus:ring-navy-100'
const Field = ({ label, children, hint }) => (
  <label className="block">
    <span className="mb-1.5 block text-sm font-semibold text-navy-800">{label}</span>
    {children}
    {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
  </label>
)

const emptySchool = {
  name: '', shortName: '', address: '', email: '', phones: ['', ''],
  motto: '', mottoArabic: '', mission: '', vision: '',
  uniformShirt: '', uniformTrouser: '', primaryColor: '#1a2c55', accentColor: '#d9a62e',
}

const notificationLabels = {
  attendance: 'Attendance alerts to parents',
  fees: 'Fee payment reminders',
  results: 'Result published notifications',
  assignments: 'Assignment deadlines',
}

export default function AdminSettings() {
  const [school, setSchool] = useState(emptySchool)
  const [notifications, setNotifications] = useState({ attendance: true, fees: true, results: true, assignments: true })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [note, setNote] = useState('')

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await admin.settings()
      const data = res.data || {}
      setSchool({
        ...emptySchool,
        ...data,
        phones: Array.isArray(data.phones) && data.phones.length ? [...data.phones, '', ''].slice(0, 2) : ['', ''],
      })
      setNotifications(res.notifications || notifications)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const setField = (key) => (e) => setSchool((s) => ({ ...s, [key]: e.target.value }))

  const handleSave = async () => {
    setSaving(true)
    setNote('')
    setError(null)
    try {
      await admin.updateSchool({
        ...school,
        phones: school.phones.filter(Boolean),
      })
      setNote('School settings saved successfully.')
      load()
    } catch (e) {
      setError(e.errors ? Object.values(e.errors).flat().join(' ') : e.message)
    } finally {
      setSaving(false)
    }
  }

  const toggleNotification = async (key) => {
    const next = { ...notifications, [key]: !notifications[key] }
    setNotifications(next)
    try {
      await admin.updateNotifications(next)
    } catch (e) {
      window.alert(e.message)
      setNotifications(notifications)
    }
  }

  if (loading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-navy-100 border-t-navy-700" /></div>
  }

  return (
    <div>
      <PageHeader
        title="School Settings"
        subtitle="Manage institution profile and preferences"
        actions={<Button tone="primary" disabled={saving} onClick={handleSave}><Save size={15} /> {saving ? 'Saving…' : 'Save Changes'}</Button>}
      />

      {error && <div className="mb-6 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">{error}</div>}
      {note && <div className="mb-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600">{note}</div>}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center gap-2">
            <School size={18} className="text-gold-500" />
            <h3 className="font-bold text-navy-900">School Profile</h3>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="School Name"><input className={inputCls} value={school.name || ''} onChange={setField('name')} /></Field>
            <Field label="Short Name"><input className={inputCls} value={school.shortName || ''} onChange={setField('shortName')} /></Field>
            <Field label="Address" hint="As printed on letters and report cards"><input className={inputCls} value={school.address || ''} onChange={setField('address')} /></Field>
            <Field label="Email Address"><input type="email" className={inputCls} value={school.email || ''} onChange={setField('email')} /></Field>
            <Field label="Phone 1"><input className={inputCls} value={school.phones[0] || ''} onChange={(e) => setSchool((s) => ({ ...s, phones: [e.target.value, s.phones[1] || ''] }))} /></Field>
            <Field label="Phone 2"><input className={inputCls} value={school.phones[1] || ''} onChange={(e) => setSchool((s) => ({ ...s, phones: [s.phones[0] || '', e.target.value] }))} /></Field>
            <Field label="Motto"><input className={inputCls} value={school.motto || ''} onChange={setField('motto')} /></Field>
            <Field label="Motto (Arabic)"><input className={inputCls} value={school.mottoArabic || ''} onChange={setField('mottoArabic')} /></Field>
            <Field label="Mission"><textarea rows={3} className={inputCls} value={school.mission || ''} onChange={setField('mission')} /></Field>
            <Field label="Vision"><textarea rows={3} className={inputCls} value={school.vision || ''} onChange={setField('vision')} /></Field>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2">
              <Palette size={18} className="text-gold-500" />
              <h3 className="font-bold text-navy-900">Brand & Uniform</h3>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <p className="mb-1.5 text-sm font-semibold text-navy-800">Primary Colour</p>
                <div className="flex items-center gap-3">
                  <input type="color" value={school.primaryColor || '#1a2c55'} onChange={setField('primaryColor')} className="h-9 w-9 cursor-pointer rounded-xl border-0 bg-transparent p-0" />
                  <span className="text-sm font-semibold text-slate-600">{school.primaryColor || '#1a2c55'}</span>
                </div>
              </div>
              <div>
                <p className="mb-1.5 text-sm font-semibold text-navy-800">Accent Colour</p>
                <div className="flex items-center gap-3">
                  <input type="color" value={school.accentColor || '#d9a62e'} onChange={setField('accentColor')} className="h-9 w-9 cursor-pointer rounded-xl border-0 bg-transparent p-0" />
                  <span className="text-sm font-semibold text-slate-600">{school.accentColor || '#d9a62e'}</span>
                </div>
              </div>
              <Field label="Uniform — Shirt"><input className={inputCls} value={school.uniformShirt || ''} onChange={setField('uniformShirt')} /></Field>
              <Field label="Uniform — Trouser"><input className={inputCls} value={school.uniformTrouser || ''} onChange={setField('uniformTrouser')} /></Field>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-gold-500" />
              <h3 className="font-bold text-navy-900">Notifications</h3>
            </div>
            <div className="mt-4 space-y-3">
              {Object.entries(notificationLabels).map(([key, label]) => (
                <button key={key} type="button" onClick={() => toggleNotification(key)} className="flex w-full items-center justify-between rounded-xl border border-navy-100 p-3 text-left text-sm font-medium text-navy-800">
                  {label}
                  <span className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${notifications[key] ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                    <span className={`h-5 w-5 rounded-full bg-white shadow transition ${notifications[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </span>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
