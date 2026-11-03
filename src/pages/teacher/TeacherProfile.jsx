import { useEffect, useState } from 'react'
import { Save, KeyRound } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Avatar from '../../components/ui/Avatar'
import { useAuth } from '../../context/AuthContext'
import { api, teacher } from '../../services/api'
import { ErrorBlock, LoadBlock, inputCls } from './teacherUtils'

const Field = ({ label, children }) => (
  <label className="block">
    <span className="mb-1.5 block text-sm font-semibold text-navy-800">{label}</span>{children}
  </label>
)

export function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [status, setStatus] = useState(null)
  const [saving, setSaving] = useState(false)

  const setField = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }))

  const submit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setStatus(null)

    try {
      await api('/auth/change-password', { method: 'POST', body: form })
      setStatus({ type: 'success', message: 'Password updated successfully.' })
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.errors ? Object.values(error.errors).flat().join(' ') : error.message,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="max-w-xl p-6">
      <div className="flex items-center gap-2"><KeyRound size={18} className="text-gold-500" /><h3 className="font-bold text-navy-900">Change Password</h3></div>
      <form onSubmit={submit} className="mt-5 space-y-4">
        <Field label="Current Password"><input type="password" className={inputCls} value={form.currentPassword} onChange={setField('currentPassword')} placeholder="Enter current password" autoComplete="current-password" /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="New Password"><input type="password" className={inputCls} value={form.newPassword} onChange={setField('newPassword')} placeholder="At least 6 characters" autoComplete="new-password" /></Field>
          <Field label="Confirm New Password"><input type="password" className={inputCls} value={form.confirmPassword} onChange={setField('confirmPassword')} placeholder="Repeat new password" autoComplete="new-password" /></Field>
        </div>
        {status && (
          <p className={`rounded-xl px-4 py-2.5 text-sm font-medium ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'}`}>{status.message}</p>
        )}
        <div className="flex justify-end"><Button type="submit" tone="primary" disabled={saving}>{saving ? 'Updating...' : <><Save size={15} /> Update Password</>}</Button></div>
      </form>
    </Card>
  )
}

export default function TeacherProfile() {
  const { user, refresh } = useAuth()
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({ name: '', phone: '', qualification: '', dept: '', gender: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)

    teacher.profile()
      .then((res) => {
        if (cancelled) return
        const data = res.user || null
        setProfile(data)
        setForm({
          name: data?.name || '',
          phone: data?.phone || '',
          qualification: data?.qualification || '',
          dept: data?.dept || '',
          gender: data?.gender || '',
        })
      })
      .catch((e) => {
        if (!cancelled) setError(e.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [reloadKey])

  const setField = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }))
    setStatus(null)
  }

  const save = async () => {
    setSaving(true)
    setStatus(null)

    try {
      const res = await teacher.updateProfile(form)
      setProfile(res.user)
      await refresh().catch(() => {})
      setStatus({ type: 'success', message: 'Profile updated successfully.' })
    } catch (e) {
      setStatus({ type: 'error', message: e.errors ? Object.values(e.errors).flat().join(' ') : e.message })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadBlock label="Loading your profile..." />
  if (error) return <ErrorBlock message={error} onRetry={() => setReloadKey((key) => key + 1)} />

  const person = profile || user || {}

  return (
    <div>
      <PageHeader title="My Profile" subtitle="Personal and professional details" />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 text-center">
          <div className="mx-auto w-fit"><Avatar initials={person.initials} color={person.color} size="xl" /></div>
          <h3 className="mt-4 text-lg font-extrabold text-navy-900">{person.name}</h3>
          <p className="text-sm text-slate-400">{person.email}</p>
          <p className="mt-1 text-xs font-semibold text-gold-600">Teacher{person.dept ? ` • ${person.dept} Dept.` : ''}</p>
          <div className="mt-4 rounded-xl bg-cream-100/70 p-3 text-sm">
            <p className="font-semibold text-navy-800">Staff Number</p>
            <p className="font-mono text-xs text-slate-500">{person.staffId || '—'}</p>
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {(person.subjects || []).map((subject) => <span key={subject} className="rounded-full bg-navy-50 px-2.5 py-1 text-[11px] font-semibold text-navy-700">{subject}</span>)}
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <h3 className="font-bold text-navy-900">Professional Information</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Full Name"><input className={inputCls} value={form.name} onChange={setField('name')} /></Field>
            <Field label="Email Address"><input className={inputCls} value={person.email || ''} disabled /></Field>
            <Field label="Phone"><input className={inputCls} value={form.phone} onChange={setField('phone')} placeholder="Phone number" /></Field>
            <Field label="Qualification"><input className={inputCls} value={form.qualification} onChange={setField('qualification')} placeholder="e.g. B.Ed" /></Field>
            <Field label="Department"><input className={inputCls} value={form.dept} onChange={setField('dept')} placeholder="e.g. Science" /></Field>
            <Field label="Gender">
              <select className={inputCls} value={form.gender} onChange={setField('gender')}>
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </Field>
            <div className="rounded-xl border border-navy-100 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Employment</p>
              <p className="mt-0.5 text-sm font-semibold text-navy-900">{person.employmentStatus || '—'}</p>
            </div>
            <div className="rounded-xl border border-navy-100 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Class Teacher</p>
              <p className="mt-0.5 text-sm font-semibold text-navy-900">{person.classTeacher || '—'}</p>
            </div>
            <div className="rounded-xl border border-navy-100 p-3 sm:col-span-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Classes</p>
              <p className="mt-0.5 text-sm font-semibold text-navy-900">{(person.classes || []).join(', ') || '—'}</p>
            </div>
          </div>

          {status && (
            <p className={`mt-4 rounded-xl px-4 py-2.5 text-sm font-medium ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'}`}>{status.message}</p>
          )}

          <div className="mt-6 flex justify-end"><Button tone="primary" disabled={saving || !form.name} onClick={save}><Save size={15} /> {saving ? 'Saving...' : 'Save Changes'}</Button></div>
        </Card>
      </div>
    </div>
  )
}
