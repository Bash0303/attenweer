import { useEffect, useMemo, useState } from 'react'
import { HeartHandshake, Pencil, Trash2, UserPlus, X } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import Modal from '../../components/ui/Modal'
import DataTable, { TableToolbar } from '../../components/ui/DataTable'
import StatCard from '../../components/ui/StatCard'
import { admin } from '../../services/api'

const inputCls = 'w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none transition focus:border-navy-400 focus:ring-2 focus:ring-navy-100'
const emptyForm = { name: '', phone: '', email: '', password: '', relation: 'Guardian', occupation: '', studentIds: [], createPortal: false }

export default function AdminParents() {
  const [query, setQuery] = useState('')
  const [rows, setRows] = useState([])
  const [stats, setStats] = useState(null)
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [pickerClassId, setPickerClassId] = useState('')
  const [pickerStudents, setPickerStudents] = useState([])
  const [pickerLoading, setPickerLoading] = useState(false)
  const [directory, setDirectory] = useState({})
  const [selectedIds, setSelectedIds] = useState([])

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [parentsRes, classesRes] = await Promise.all([admin.parents(), admin.classes()])
      setRows(parentsRes.data || [])
      setStats(parentsRes.stats || null)
      setClasses(classesRes.data || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    if (!modal || !pickerClassId) {
      setPickerStudents([])
      return undefined
    }

    let cancelled = false
    setPickerLoading(true)

    admin.students({ classId: pickerClassId })
      .then((res) => {
        if (cancelled) return
        const list = res.data || []
        setPickerStudents(list)
        setDirectory((current) => {
          const next = { ...current }
          list.forEach((student) => { next[student.id] = student })
          return next
        })
      })
      .catch((e) => {
        if (!cancelled) setFormError(e.message)
      })
      .finally(() => {
        if (!cancelled) setPickerLoading(false)
      })

    return () => { cancelled = true }
  }, [modal, pickerClassId])

  const filtered = useMemo(
    () => rows.filter((parent) => {
      const children = (parent.children || []).map((child) => child.name).join(' ')
      return `${parent.name} ${parent.phone} ${parent.email || ''} ${children}`.toLowerCase().includes(query.toLowerCase())
    }),
    [rows, query],
  )

  useEffect(() => {
    setSelectedIds([])
  }, [rows, query])

  const setField = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }))

  const toggleStudent = (id) => setForm((current) => ({
    ...current,
    studentIds: current.studentIds.includes(id)
      ? current.studentIds.filter((studentId) => studentId !== id)
      : [...current.studentIds, id],
  }))

  const removeStudent = (id) => setForm((current) => ({
    ...current,
    studentIds: current.studentIds.filter((studentId) => studentId !== id),
  }))

  const openCreate = () => {
    setModal({ mode: 'create' })
    setForm(emptyForm)
    setFormError(null)
    setPickerClassId('')
    setPickerStudents([])
    setDirectory({})
  }

  const openEdit = (parent) => {
    const children = parent.children || []
    const nextDirectory = {}
    children.forEach((child) => { nextDirectory[child.id] = child })

    setModal({ mode: 'edit', parent })
    setForm({
      name: parent.name || '',
      phone: parent.phone || '',
      email: parent.email || '',
      password: '',
      relation: parent.relation || 'Guardian',
      occupation: parent.occupation || '',
      studentIds: children.map((child) => child.id),
      createPortal: false,
    })
    setDirectory(nextDirectory)
    setPickerClassId(children[0]?.classId ? String(children[0].classId) : '')
    setPickerStudents([])
    setFormError(null)
  }

  const closeModal = () => {
    setModal(null)
    setForm(emptyForm)
    setFormError(null)
    setPickerClassId('')
    setPickerStudents([])
    setDirectory({})
  }

  const handleSave = async () => {
    setFormError(null)

    const portalExists = modal.mode === 'edit' && modal.parent.hasPortal
    const needsPassword = !portalExists && form.createPortal

    if (needsPassword && (!form.password || form.password.length < 6)) {
      setFormError('Set a portal password of at least 6 characters.')
      return
    }

    if (form.password && form.password.length < 6) {
      setFormError('Portal password must be at least 6 characters.')
      return
    }

    setSaving(true)

    try {
      const payload = { ...form, password: form.password || undefined }

      if (modal.mode === 'edit') {
        await admin.updateParent(modal.parent.id, payload)
      } else {
        await admin.createParent(payload)
      }
      closeModal()
      load()
    } catch (e) {
      setFormError(e.errors ? Object.values(e.errors).flat().join(' ') : e.message)
    } finally {
      setSaving(false)
    }
  }

  const removeParents = async (ids, label) => {
    if (!ids.length) return
    if (!window.confirm(`Delete ${label}? This also removes their portal accounts if they have one.`)) return

    try {
      await admin.bulkDeleteParents(ids)
      setSelectedIds([])
      load()
    } catch (e) {
      window.alert(e.message)
    }
  }

  const handleDelete = (parent) => removeParents([parent.id], parent.name)

  const toggleSelected = (parent) => setSelectedIds((ids) => (
    ids.includes(parent.id) ? ids.filter((id) => id !== parent.id) : [...ids, parent.id]
  ))

  const toggleAll = (checked, rows) => setSelectedIds(checked ? rows.map((parent) => parent.id) : [])

  const columns = [
    {
      key: 'name',
      label: 'Parent / Guardian',
      render: (parent) => (
        <div className="flex items-center gap-3">
          <Avatar initials={parent.name.split(' ').map((part) => part[0]).slice(0, 2).join('')} color="bg-gold-500" size="sm" />
          <div>
            <p className="font-semibold text-navy-900">{parent.name}</p>
            <p className="text-xs text-slate-400">{parent.relation} &middot; {parent.occupation || 'Occupation not set'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Contact',
      render: (parent) => (
        <div>
          <p className="text-sm text-slate-600">{parent.phone}</p>
          <p className="text-xs text-slate-400">{parent.email || 'No email'}</p>
        </div>
      ),
    },
    {
      key: 'children',
      label: 'Linked Students',
      render: (parent) => (
        <div className="flex flex-col gap-1">
          {(parent.children || []).map((child) => (
            <span key={child.id} className="text-sm text-navy-800">
              {child.name} <span className="text-xs text-slate-400">&middot; {child.className || 'No class'}</span>
            </span>
          ))}
          {!parent.children?.length && <span className="text-sm text-slate-400">No students linked</span>}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Portal',
      render: (parent) => (
        <Badge color={parent.status === 'Active' ? 'emerald' : parent.status === 'No Portal' ? 'slate' : 'rose'} dot>
          {parent.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: '',
      right: true,
      render: (parent) => (
        <div className="flex justify-end gap-1">
          <button onClick={(event) => { event.stopPropagation(); openEdit(parent) }} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-navy-50 hover:text-navy-700" title="Edit parent">
            <Pencil size={15} />
          </button>
          <button onClick={(event) => { event.stopPropagation(); handleDelete(parent) }} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600" title="Delete parent">
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ]

  if (loading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-navy-100 border-t-navy-700" /></div>
  }

  const editing = modal?.mode === 'edit'
  const selectedChildren = form.studentIds.map((id) => directory[id]).filter(Boolean)

  return (
    <div>
      <PageHeader
        title="Parent / Guardian Management"
        subtitle="Link parents to students so they can monitor attendance, results, fees and more"
        actions={<Button tone="primary" onClick={openCreate}><UserPlus size={16} /> Add Parent</Button>}
      />

      {error && (
        <div className="mb-6 flex items-center justify-between rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
          <span>{error}</span>
          <Button tone="ghost" size="sm" onClick={load}>Retry</Button>
        </div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={HeartHandshake} label="Total Parents" value={stats?.total ?? 0} sub="guardians" tone="gold" index={0} />
        <StatCard icon={HeartHandshake} label="With Portal Access" value={stats?.withPortal ?? 0} sub="linked accounts" tone="emerald" index={1} />
        <StatCard icon={HeartHandshake} label="With 2+ Children" value={stats?.multipleChildren ?? 0} sub="multi-child" tone="navy" index={2} />
      </div>

      <Card>
        <TableToolbar
          title="All Parents"
          subtitle="Search by parent, phone, email or student"
          onSearch={setQuery}
          placeholder="Search parent..."
          actions={(
            <div className="flex flex-wrap items-center gap-2">
              {selectedIds.length > 0 && (
                <Button
                  tone="danger"
                  size="sm"
                  onClick={() => removeParents(selectedIds, `${selectedIds.length} selected parent${selectedIds.length === 1 ? '' : 's'}`)}
                >
                  <Trash2 size={14} /> Delete Selected ({selectedIds.length})
                </Button>
              )}
              <Button
                tone="outline"
                size="sm"
                disabled={!filtered.length}
                onClick={() => removeParents(filtered.map((parent) => parent.id), `all ${filtered.length} parent${filtered.length === 1 ? '' : 's'} shown`)}
              >
                <Trash2 size={14} /> Delete All
              </Button>
            </div>
          )}
        />
        <DataTable
          columns={columns}
          rows={filtered}
          rowKey="id"
          onRowClick={openEdit}
          selectable
          selectedIds={selectedIds}
          onSelect={toggleSelected}
          onSelectAll={toggleAll}
        />
      </Card>

      <Modal open={Boolean(modal)} onClose={closeModal} title={editing ? 'Edit Parent / Guardian' : 'Add Parent / Guardian'} wide>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Full Name</span>
            <input className={inputCls} value={form.name} onChange={setField('name')} placeholder="Enter full name" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Phone Number</span>
            <input className={inputCls} value={form.phone} onChange={setField('phone')} placeholder="Enter phone number" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Email Address</span>
            <input type="email" className={inputCls} value={form.email} onChange={setField('email')} placeholder="Enter email address" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Relation</span>
            <select className={inputCls} value={form.relation} onChange={setField('relation')}>
              {['Father', 'Mother', 'Guardian', 'Sponsor'].map((relation) => <option key={relation}>{relation}</option>)}
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Occupation</span>
            <input className={inputCls} value={form.occupation} onChange={setField('occupation')} placeholder="Enter occupation" />
          </label>

          {editing && modal.parent.hasPortal ? (
            <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 sm:col-span-2">
              This parent already has a portal account ({modal.parent.status} &middot; {modal.parent.email || 'email not set'}).
            </div>
          ) : (
            <label className="flex items-center gap-2 text-sm font-medium text-navy-800 sm:col-span-2">
              <input type="checkbox" checked={form.createPortal} onChange={(event) => setForm((current) => ({ ...current, createPortal: event.target.checked }))} />
              Create parent portal account (requires email and password)
            </label>
          )}

          {(form.createPortal || (editing && modal.parent.hasPortal)) && (
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-semibold text-navy-800">
                Portal Password {editing && modal.parent.hasPortal ? '(leave blank to keep current)' : ''}
              </span>
              <input
                type="password"
                minLength={6}
                autoComplete="new-password"
                className={inputCls}
                value={form.password}
                onChange={setField('password')}
                placeholder="At least 6 characters"
              />
              <span className="mt-1 block text-xs text-slate-400">The parent signs in with their email address and this password.</span>
            </label>
          )}

          <div className="sm:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-navy-800">Link Students</span>

            {selectedChildren.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {selectedChildren.map((student) => (
                  <span key={student.id} className="inline-flex items-center gap-1.5 rounded-lg bg-navy-50 px-2.5 py-1.5 text-xs font-semibold text-navy-800">
                    {student.name} <span className="font-normal text-slate-400">{student.className}</span>
                    <button type="button" onClick={() => removeStudent(student.id)} className="text-slate-400 transition hover:text-rose-600"><X size={12} /></button>
                  </span>
                ))}
              </div>
            )}

            <div className="rounded-xl border border-navy-100 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Choose a class to filter students</span>
                <select value={pickerClassId} onChange={(event) => setPickerClassId(event.target.value)} className="rounded-lg border border-navy-100 bg-white px-3 py-1.5 text-sm font-semibold text-navy-800 outline-none focus:border-navy-400">
                  <option value="">Select class</option>
                  {classes.map((schoolClass) => <option key={schoolClass.id} value={schoolClass.id}>{schoolClass.name}</option>)}
                </select>
              </div>

              <div className="mt-3 grid max-h-48 gap-2 overflow-y-auto sm:grid-cols-2">
                {pickerLoading && <p className="text-sm text-slate-400">Loading students...</p>}
                {!pickerLoading && !pickerClassId && <p className="text-sm text-slate-400">Select a class to see its students.</p>}
                {!pickerLoading && pickerClassId && !pickerStudents.length && <p className="text-sm text-slate-400">No students in this class.</p>}
                {!pickerLoading && pickerStudents.map((student) => (
                  <label key={student.id} className="flex items-center gap-2 text-sm text-slate-600">
                    <input type="checkbox" checked={form.studentIds.includes(student.id)} onChange={() => toggleStudent(student.id)} />
                    {student.name} <span className="text-xs text-slate-400">({student.className})</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {formError && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600">{formError}</p>}

        <div className="mt-6 flex justify-end gap-2">
          <Button tone="ghost" onClick={closeModal}>Cancel</Button>
          <Button tone="primary" disabled={saving} onClick={handleSave}>{saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Parent'}</Button>
        </div>
      </Modal>
    </div>
  )
}
