import { useEffect, useState } from 'react'
import { BadgeCheck, Save } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import ProgressBar from '../../components/ui/ProgressBar'
import Avatar from '../../components/ui/Avatar'
import { useAuth } from '../../context/AuthContext'
import { student } from '../../services/api'
import { ErrorBlock, LoadBlock, inputCls, money } from './studentUtils'

const Field = ({ label, value }) => (
  <div className="rounded-xl border border-navy-100 p-3">
    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
    <p className="mt-0.5 text-sm font-semibold text-navy-900">{value || '-'}</p>
  </div>
)

const formatDate = (value) => (value ? new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-')

export default function StudentProfile() {
  const { refresh } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '' })
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState(null)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)

    student.profile()
      .then((res) => {
        if (cancelled) return
        setData(res)
        setForm({ name: res.student?.name || '', phone: res.student?.phone || '' })
      })
      .catch((e) => {
        if (!cancelled) setError(e.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [reloadKey])

  const save = async () => {
    setSaving(true)
    setStatus(null)

    try {
      const res = await student.updateProfile(form)
      setData(res)
      setEditing(false)
      setStatus({ type: 'success', message: 'Profile updated successfully.' })
      await refresh().catch(() => {})
    } catch (e) {
      setStatus({ type: 'error', message: e.errors ? Object.values(e.errors).flat().join(' ') : e.message })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadBlock label="Loading your profile..." />
  if (error) return <ErrorBlock message={error} onRetry={() => setReloadKey((key) => key + 1)} />

  const me = data?.student || {}
  const guardian = data?.guardian
  const attendance = data?.attendance || {}
  const fees = data?.fees || {}

  return (
    <div>
      <PageHeader title="My Profile" subtitle="Personal, academic and contact information" />

      {status && (
        <div className={`mb-6 rounded-xl px-4 py-3 text-sm font-medium ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'}`}>{status.message}</div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 text-center">
          <div className="mx-auto w-fit"><Avatar initials={me.initials || data?.user?.initials} color={data?.user?.color || 'bg-sky-600'} size="xl" /></div>
          <h3 className="mt-4 text-xl font-extrabold text-navy-900">{me.name}</h3>
          <p className="font-mono text-xs font-semibold text-navy-600">{me.studentId}</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <Badge color="navy">{me.className}</Badge>
            {me.house && <Badge color="gold" dot>{me.house}</Badge>}
            <Badge color="emerald" dot>{me.status || 'Active'}</Badge>
          </div>
          <div className="mt-5 rounded-xl bg-cream-100/70 p-4">
            <div className="flex justify-between text-sm"><span className="font-medium text-slate-600">Attendance</span><span className="font-bold text-emerald-600">{attendance.rate || 0}%</span></div>
            <ProgressBar value={attendance.rate || 0} color="bg-emerald-500" className="mt-2" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-left">
            <div className="rounded-xl bg-navy-50 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Fees paid</p>
              <p className="text-sm font-extrabold text-navy-900">{money(fees.paid)}</p>
            </div>
            <div className="rounded-xl bg-rose-50 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Balance</p>
              <p className="text-sm font-extrabold text-navy-900">{money(fees.balance)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-bold text-navy-900">Personal Information</h3>
            {editing ? (
              <div className="flex gap-2">
                <Button tone="ghost" size="sm" onClick={() => { setEditing(false); setForm({ name: me.name || '', phone: me.phone || '' }) }}>Cancel</Button>
                <Button tone="primary" size="sm" onClick={save} disabled={saving || !form.name}><Save size={14} /> {saving ? 'Saving...' : 'Save'}</Button>
              </div>
            ) : (
              <Button tone="primary" size="sm" onClick={() => setEditing(true)}>Edit Profile</Button>
            )}
          </div>

          {editing ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-navy-800">Full Name</span>
                <input className={inputCls} value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-navy-800">Phone</span>
                <input className={inputCls} value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} placeholder="Phone number" />
              </label>
              <Field label="Student ID" value={me.studentId} />
              <Field label="Email" value={me.email || data?.user?.email} />
              <Field label="Gender" value={me.gender} />
              <Field label="Date of Birth" value={formatDate(me.dob)} />
              <Field label="Class" value={`${me.className} • ${me.session || ''}`} />
              <Field label="Admission Type" value={me.admission} />
              <Field label="Class Teacher" value={me.classTeacher} />
            </div>
          ) : (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Full Name" value={me.name} />
              <Field label="Student ID" value={me.studentId} />
              <Field label="Gender" value={me.gender} />
              <Field label="Date of Birth" value={formatDate(me.dob)} />
              <Field label="Class" value={`${me.className} • ${me.session || ''}`} />
              <Field label="Admission Type" value={me.admission} />
              <Field label="Phone" value={me.phone || data?.user?.phone} />
              <Field label="Email" value={me.email || data?.user?.email} />
              <Field label="House" value={me.house} />
              <Field label="Class Teacher" value={me.classTeacher} />
            </div>
          )}
        </Card>
      </div>

      <Card className="mt-6 p-6">
        <div className="flex items-center gap-2">
          <BadgeCheck size={18} className="text-emerald-600" />
          <h3 className="font-bold text-navy-900">Parent / Guardian</h3>
        </div>
        {guardian ? (
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Avatar initials={guardian.name?.split(' ').map((part) => part[0]).slice(0, 2).join('')} color="bg-gold-500" size="lg" />
            <div>
              <p className="font-bold text-navy-900">{guardian.name}</p>
              <p className="text-sm text-slate-400">{guardian.phone}{guardian.relation ? ` • ${guardian.relation}` : ''}</p>
            </div>
            {guardian.email && <p className="ml-auto text-sm text-slate-500">{guardian.email}</p>}
          </div>
        ) : (
          <p className="mt-4 rounded-xl bg-cream-100/70 p-4 text-sm text-slate-500">No guardian has been linked to your profile yet.</p>
        )}
      </Card>
    </div>
  )
}
