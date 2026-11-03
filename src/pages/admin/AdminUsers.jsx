import { useEffect, useMemo, useState } from 'react'
import { ShieldCheck, UserPlus, KeyRound, Trash2, Ban, CheckCircle2 } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import Modal from '../../components/ui/Modal'
import DataTable, { TableToolbar } from '../../components/ui/DataTable'
import { admin } from '../../services/api'

const roleColor = { Admin: 'navy', Teacher: 'emerald', Student: 'gold', Parent: 'sky' }
const inputCls = 'w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none transition focus:border-navy-400 focus:ring-2 focus:ring-navy-100'
const emptyForm = { name: '', email: '', password: '', role: 'teacher', phone: '' }
const tabs = ['All', 'Admin', 'Teacher', 'Student', 'Parent']

export default function AdminUsers() {
  const [rows, setRows] = useState([])
  const [stats, setStats] = useState(null)
  const [role, setRole] = useState('All')
  const [query, setQuery] = useState('')
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
      const res = await admin.users()
      setRows(res.data || [])
      setStats(res.stats || null)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(
    () => rows.filter((u) => {
      const matchesRole = role === 'All' || u.role === role
      const matchesQuery = (u.name + u.email + u.role).toLowerCase().includes(query.toLowerCase())
      return matchesRole && matchesQuery
    }),
    [rows, role, query],
  )

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSave = async () => {
    setSaving(true)
    setFormError(null)
    try {
      await admin.createUser(form)
      setCreate(false)
      setForm(emptyForm)
      load()
    } catch (e) {
      setFormError(e.errors ? Object.values(e.errors).flat().join(' ') : e.message)
    } finally {
      setSaving(false)
    }
  }

  const resetPassword = async (user) => {
    const password = window.prompt(`New password for ${user.name}:`)
    if (!password) return
    try {
      await admin.resetUserPassword(user.id, password)
      window.alert('Password reset. Existing sessions revoked.')
    } catch (e) {
      window.alert(e.message)
    }
  }

  const toggleStatus = async (user) => {
    try {
      await admin.updateUser(user.id, { status: user.status === 'active' ? 'suspended' : 'active' })
      load()
    } catch (e) {
      window.alert(e.message)
    }
  }

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete ${user.name}?`)) return
    try {
      await admin.deleteUser(user.id)
      load()
    } catch (e) {
      window.alert(e.message)
    }
  }

  const columns = [
    { key: 'name', label: 'User', render: (u) => (
      <div className="flex items-center gap-3">
        <Avatar initials={u.initials} color={u.color} size="sm" />
        <div><p className="font-semibold text-navy-900">{u.name}</p><p className="text-xs text-slate-400">{u.email}</p></div>
      </div>
    ) },
    { key: 'role', label: 'Role', render: (u) => <Badge color={roleColor[u.role] || 'slate'}>{u.role}</Badge> },
    { key: 'phone', label: 'Phone', render: (u) => <span className="text-sm text-slate-600">{u.phone || '—'}</span> },
    { key: 'status', label: 'Status', render: (u) => <Badge color={u.status === 'active' ? 'emerald' : 'rose'} dot>{(u.status || '').replace(/^\w/, (c) => c.toUpperCase())}</Badge> },
    { key: 'lastLogin', label: 'Last Login', render: (u) => <span className="text-sm text-slate-600">{u.lastLogin}</span> },
    { key: 'actions', label: '', right: true, render: (u) => (
      <div className="flex items-center justify-end gap-1">
        <button title="Reset password" onClick={(e) => { e.stopPropagation(); resetPassword(u) }} className="grid h-8 w-8 place-items-center rounded-lg text-navy-600 transition hover:bg-navy-50"><KeyRound size={14} /></button>
        <button title={u.status === 'active' ? 'Suspend' : 'Activate'} onClick={(e) => { e.stopPropagation(); toggleStatus(u) }} className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition hover:bg-cream-100">
          {u.status === 'active' ? <Ban size={14} /> : <CheckCircle2 size={14} />}
        </button>
        <button title="Delete" onClick={(e) => { e.stopPropagation(); handleDelete(u) }} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"><Trash2 size={14} /></button>
      </div>
    ) },
  ]

  if (loading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-navy-100 border-t-navy-700" /></div>
  }

  return (
    <div>
      <PageHeader title="System Users" subtitle="Manage admin, teacher, student and parent accounts" actions={<Button tone="primary" onClick={() => setCreate(true)}><UserPlus size={16} /> Add User</Button>} />

      {error && (
        <div className="mb-6 flex items-center justify-between rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
          <span>{error}</span>
          <Button tone="ghost" size="sm" onClick={load}>Retry</Button>
        </div>
      )}

      <Card className="mb-6 p-5">
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <ShieldCheck size={18} className="text-emerald-600" />
          <span><strong className="text-navy-800">Role-based access control</strong> is enforced — students can never access admin routes even by typing the URL manually.</span>
        </div>
      </Card>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button key={t} onClick={() => setRole(t)} className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition ${role === t ? 'bg-navy-800 text-white' : 'bg-white text-slate-500 hover:bg-navy-50'}`}>
              {t}{stats && t !== 'All' && <span className="ml-1.5 text-xs opacity-70">{stats[t.toLowerCase()]}</span>}
            </button>
          ))}
        </div>
        <span className="text-sm text-slate-400">{stats?.total ?? rows.length} accounts</span>
      </div>

      <Card>
        <TableToolbar title="All Portal Accounts" subtitle="Passwords are hashed; sessions use secure tokens" onSearch={setQuery} placeholder="Search user…" />
        <DataTable columns={columns} rows={filtered} rowKey="id" />
      </Card>

      <Modal open={create} onClose={() => setCreate(false)} title="Add Portal User" wide>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Full Name</span>
            <input className={inputCls} value={form.name} onChange={setField('name')} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Email</span>
            <input type="email" className={inputCls} value={form.email} onChange={setField('email')} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Temporary Password</span>
            <input type="password" className={inputCls} value={form.password} onChange={setField('password')} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Role</span>
            <select className={inputCls} value={form.role} onChange={setField('role')}>
              {['admin', 'teacher', 'student', 'parent'].map((r) => <option key={r} value={r}>{r[0].toUpperCase() + r.slice(1)}</option>)}
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Phone</span>
            <input className={inputCls} value={form.phone} onChange={setField('phone')} />
          </label>
        </div>
        {formError && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600">{formError}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <Button tone="ghost" onClick={() => { setCreate(false); setForm(emptyForm); setFormError(null) }}>Cancel</Button>
          <Button tone="primary" disabled={saving} onClick={handleSave}>{saving ? 'Saving…' : 'Create User'}</Button>
        </div>
      </Modal>
    </div>
  )
}
