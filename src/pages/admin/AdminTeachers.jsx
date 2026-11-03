import { useEffect, useMemo, useState } from 'react'
import { UserPlus, GraduationCap, Pencil, Trash2, Plus, X } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge, { statusColor } from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import Modal from '../../components/ui/Modal'
import DataTable, { TableToolbar } from '../../components/ui/DataTable'
import StatCard from '../../components/ui/StatCard'
import { admin } from '../../services/api'

const inputCls = 'w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none transition focus:border-navy-400 focus:ring-2 focus:ring-navy-100'

const emptyForm = { name: '', phone: '', email: '', password: '', qualification: '', dept: '', gender: '', status: '' }
const emptyAssignment = { subjectId: '', classId: '' }

export default function AdminTeachers() {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editTeacher, setEditTeacher] = useState(null)
  const [editForm, setEditForm] = useState(emptyForm)
  const [editError, setEditError] = useState(null)
  const [editSaving, setEditSaving] = useState(false)
  const [assignOpen, setAssignOpen] = useState(false)
  const [assignTeacher, setAssignTeacher] = useState(null)
  const [assignRows, setAssignRows] = useState([])
  const [assignError, setAssignError] = useState(null)
  const [assignSaving, setAssignSaving] = useState(false)
const [assignLoading, setAssignLoading] = useState(false)
  const [editAssignRows, setEditAssignRows] = useState([])
  const [editAssignLoading, setEditAssignLoading] = useState(false)
  const [subjectOptions, setSubjectOptions] = useState([])
  const [classOptions, setClassOptions] = useState([])
  const [rows, setRows] = useState([])
  const [stats, setStats] = useState(null)
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await admin.teachers()
      setRows(res.data || [])
      setStats(res.stats || null)
      setDepartments(res.departments || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  useEffect(() => { setSelectedIds([]) }, [query, rows])

  const filtered = useMemo(
    () => rows.filter((t) => (t.name + t.staffId + t.email + t.dept + (t.subjects || []).join(' ')).toLowerCase().includes(query.toLowerCase())),
    [rows, query],
  )

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const setEditField = (key) => (e) => setEditForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSave = async () => {
    setFormError(null)

    if (!form.name.trim()) {
      setFormError('Teacher name is required.')
      return
    }

    if (!form.email.trim()) {
      setFormError('Email address is required.')
      return
    }

    if (form.password.length < 6) {
      setFormError('Password must be at least 6 characters.')
      return
    }

    setSaving(true)
    try {
      await admin.createTeacher(form)
      setAddOpen(false)
      setForm(emptyForm)
      load()
    } catch (e) {
      setFormError(e.errors ? Object.values(e.errors).flat().join(' ') : e.message)
    } finally {
      setSaving(false)
    }
  }

  const openEdit = async (teacher) => {
    setSelected(null)
    setEditTeacher(teacher)
    setEditForm({
      name: teacher.name || '',
      phone: teacher.phone || '',
      email: teacher.email || '',
      password: '',
      qualification: teacher.qualification || '',
      dept: teacher.dept || '',
      gender: teacher.gender || '',
      status: teacher.status || '',
    })
    setEditError(null)
    setEditOpen(true)
    setEditAssignLoading(true)
    try {
      const [subjectsRes, classesRes] = await Promise.all([admin.subjects(), admin.classes()])
      setSubjectOptions(subjectsRes.data || [])
      setClassOptions(classesRes.data || [])

      const existing = teacher.assignments?.length
        ? teacher.assignments.map((assignment) => ({
            subjectId: String(assignment.subjectId),
            classId: String(assignment.classId),
          }))
        : [{ subjectId: '', classId: '' }]
      setEditAssignRows(existing)
    } catch (e) {
      setEditError(e.message)
    } finally {
      setEditAssignLoading(false)
    }
  }

  const closeEdit = () => {
    setEditOpen(false)
    setEditTeacher(null)
    setEditForm(emptyForm)
    setEditAssignRows([])
    setEditError(null)
  }

  const handleEditSave = async () => {
    setEditError(null)

    if (!editForm.name.trim()) {
      setEditError('Teacher name is required.')
      return
    }

    if (!editForm.email.trim()) {
      setEditError('Email address is required.')
      return
    }

    if (editForm.password && editForm.password.length < 6) {
      setEditError('Password must be at least 6 characters.')
      return
    }

    if (editAssignRows.some((row) => (row.subjectId && !row.classId) || (!row.subjectId && row.classId))) {
      setEditError('Select both a subject and a class for every assignment row.')
      return
    }

    setEditSaving(true)
    try {
      const payload = {
        name: editForm.name,
        phone: editForm.phone,
        email: editForm.email,
        qualification: editForm.qualification,
        dept: editForm.dept,
        gender: editForm.gender,
      }

      if (editForm.status) payload.status = editForm.status
      if (editForm.password) payload.password = editForm.password

      await admin.updateTeacher(editTeacher.id, payload)

      const assignments = editAssignRows
        .filter((row) => row.subjectId && row.classId)
        .map((row) => ({ subjectId: Number(row.subjectId), classId: Number(row.classId) }))

      await admin.assignSubjects(editTeacher.id, assignments)

      closeEdit()
      load()
    } catch (e) {
      setEditError(e.errors ? Object.values(e.errors).flat().join(' ') : e.message)
    } finally {
      setEditSaving(false)
    }
  }

  const openAssign = async (teacher) => {
    setSelected(null)
    setAssignTeacher(teacher)
    setAssignError(null)
    setAssignOpen(true)
    const existing = teacher.assignments?.length
      ? teacher.assignments.map((assignment) => ({ subjectId: String(assignment.subjectId), classId: String(assignment.classId) }))
      : (teacher.subjectIds || []).map((subjectId) => ({ subjectId: String(subjectId), classId: '' }))

    setAssignRows(existing.length ? existing : [{ ...emptyAssignment }])
    setAssignLoading(true)

    try {
      const [subjectsRes, classesRes] = await Promise.all([admin.subjects(), admin.classes()])
      setSubjectOptions(subjectsRes.data || [])
      setClassOptions(classesRes.data || [])
    } catch (e) {
      setAssignError(e.message)
    } finally {
      setAssignLoading(false)
    }
  }

  const closeAssign = () => {
    setAssignOpen(false)
    setAssignTeacher(null)
    setAssignRows([])
    setAssignError(null)
  }

  const updateAssignRow = (index, key, value) => {
    setAssignRows((current) => current.map((row, i) => (i === index ? { ...row, [key]: value } : row)))
  }

  const addAssignRow = () => setAssignRows((current) => [...current, { ...emptyAssignment }])

  const removeAssignRow = (index) => setAssignRows((current) => current.filter((_, i) => i !== index))

  const updateEditAssignRow = (index, key, value) => {
    setEditAssignRows((current) => current.map((row, i) => (i === index ? { ...row, [key]: value } : row)))
  }

  const addEditAssignRow = () => setEditAssignRows((current) => [...current, { subjectId: '', classId: '' }])

  const removeEditAssignRow = (index) => setEditAssignRows((current) => current.filter((_, i) => i !== index))

  const handleAssignSave = async () => {
    setAssignError(null)

    if (assignRows.some((row) => (row.subjectId && !row.classId) || (!row.subjectId && row.classId))) {
      setAssignError('Select both a subject and a class for every row.')
      return
    }

    const assignments = assignRows
      .filter((row) => row.subjectId && row.classId)
      .map((row) => ({ subjectId: Number(row.subjectId), classId: Number(row.classId) }))

    setAssignSaving(true)
    try {
      await admin.assignSubjects(assignTeacher.id, assignments)
      closeAssign()
      load()
    } catch (e) {
      setAssignError(e.errors ? Object.values(e.errors).flat().join(' ') : e.message)
    } finally {
      setAssignSaving(false)
    }
  }

  const toggleSelected = (teacher) => {
    setSelectedIds((current) => (current.includes(teacher.id) ? current.filter((id) => id !== teacher.id) : [...current, teacher.id]))
  }

  const toggleAll = (checked, list) => {
    setSelectedIds(checked ? list.map((teacher) => teacher.id) : [])
  }

  const removeTeachers = async (teachers) => {
    const list = teachers.filter(Boolean)

    if (!list.length) return

    const label = list.length === 1 ? `"${list[0].name}"` : `${list.length} teachers`

    if (!window.confirm(`Delete ${label}? This cannot be undone.`)) return

    try {
      await admin.bulkDeleteTeachers(list.map((teacher) => teacher.id))
      setSelected(null)
      setSelectedIds((current) => current.filter((id) => !list.some((teacher) => teacher.id === id)))
      load()
    } catch (e) {
      setError(e.message)
    }
  }

  const columns = [
    { key: 'name', label: 'Teacher', render: (t) => (
      <div className="flex items-center gap-3">
        <Avatar initials={t.initials} color={t.color} size="sm" />
        <div>
          <p className="font-semibold text-navy-900">{t.name}</p>
          <p className="text-xs text-slate-400">{t.qualification}</p>
        </div>
      </div>
    ) },
    { key: 'staffId', label: 'Staff No.', render: (t) => <span className="font-mono text-xs font-semibold text-navy-700">{t.staffId}</span> },
    { key: 'dept', label: 'Department', render: (t) => <Badge color="navy">{t.dept}</Badge> },
    { key: 'subjects', label: 'Subjects', render: (t) => (
      <div className="flex flex-wrap gap-1">
        {(t.subjects || []).map((s) => <span key={s} className="rounded-full bg-cream-100 px-2 py-0.5 text-[11px] font-semibold text-navy-700">{s}</span>)}
      </div>
    ) },
    { key: 'classTeacher', label: 'Class Teacher', render: (t) => <span className="text-sm text-slate-600">{t.classTeacher || '—'}</span> },
    { key: 'status', label: 'Status', render: (t) => <Badge color={statusColor(t.status)} dot>{t.status}</Badge> },
    { key: 'phone', label: 'Phone', render: (t) => <span className="text-sm text-slate-600">{t.phone}</span> },
    { key: 'actions', label: '', right: true, render: (t) => (
      <div className="flex justify-end gap-1">
        <button onClick={(e) => { e.stopPropagation(); openEdit(t) }} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-navy-50 hover:text-navy-700" aria-label={`Edit ${t.name}`}><Pencil size={15} /></button>
        <button onClick={(e) => { e.stopPropagation(); removeTeachers([t]) }} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600" aria-label={`Delete ${t.name}`}><Trash2 size={15} /></button>
      </div>
    ) },
  ]

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-navy-100 border-t-navy-700" />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Teacher Management"
        subtitle={`${stats?.total ?? rows.length} teachers on record`}
        actions={<Button tone="primary" onClick={() => setAddOpen(true)}><UserPlus size={16} /> Add Teacher</Button>}
      />

      {error && (
        <div className="mb-6 flex items-center justify-between rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
          <span>{error}</span>
          <Button tone="ghost" size="sm" onClick={load}>Retry</Button>
        </div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={GraduationCap} label="Total Staff" value={stats?.total ?? '—'} sub={stats ? `${stats.active} active` : ''} tone="navy" index={0} />
        <StatCard icon={GraduationCap} label="Active Teachers" value={stats?.active ?? '—'} sub={stats ? `${stats.total - stats.active} inactive` : ''} tone="emerald" index={1} />
        <StatCard icon={GraduationCap} label="Class Teachers" value={stats?.classTeachers ?? '—'} sub="1 per arm" tone="gold" index={2} />
      </div>

      <Card>
        <TableToolbar
          title="All Teachers"
          subtitle="Search by name, staff number, email, subject or department"
          onSearch={setQuery}
          placeholder="Search teacher, staff no…"
          actions={(
            <>
              <Button tone="outline" size="sm" disabled={!selectedIds.length} onClick={() => removeTeachers(filtered.filter((teacher) => selectedIds.includes(teacher.id)))}>
                <Trash2 size={15} /> Delete Selected ({selectedIds.length})
              </Button>
              <Button tone="outline" size="sm" disabled={!filtered.length} onClick={() => removeTeachers(filtered)}>
                <Trash2 size={15} /> Delete All
              </Button>
            </>
          )}
        />
        <DataTable
          columns={columns}
          rows={filtered}
          rowKey="id"
          onRowClick={(t) => setSelected(t)}
          selectable
          selectedIds={selectedIds}
          onSelect={toggleSelected}
          onSelectAll={toggleAll}
        />
      </Card>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Teacher Profile">
        {selected && (
          <div>
            <div className="flex items-center gap-4">
              <Avatar initials={selected.initials} color={selected.color} size="xl" />
              <div>
                <h4 className="text-lg font-extrabold text-navy-900">{selected.name}</h4>
                <p className="font-mono text-xs font-semibold text-navy-600">{selected.staffId}</p>
                <div className="mt-2"><Badge color={statusColor(selected.status)} dot>{selected.status}</Badge></div>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[['Department', selected.dept], ['Qualification', selected.qualification], ['Phone', selected.phone], ['Email', selected.email], ['Class Teacher', selected.classTeacher], ['Gender', selected.gender]].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-navy-50/50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{k}</p>
                  <p className="mt-0.5 truncate text-sm font-semibold text-navy-900">{v}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-xl border border-navy-100 p-4">
              <p className="text-sm font-bold text-navy-900">Teaching Assignments</p>
              {selected.assignments?.length ? (
                <div className="mt-2 space-y-2">
                  {selected.assignments.map((assignment) => (
                    <div key={`${assignment.subjectId}-${assignment.classId}`} className="flex items-center justify-between rounded-lg bg-navy-50/50 px-3 py-2 text-sm">
                      <span className="font-semibold text-navy-800">{assignment.subjectName}</span>
                      <Badge color="gold">{assignment.className}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-2 flex flex-wrap gap-2">
                  {(selected.subjects || []).map((s) => <Badge key={s} color="gold">{s}</Badge>)}
                  {!selected.subjects?.length && <span className="text-sm text-slate-400">No subjects assigned.</span>}
                </div>
              )}
            </div>
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <Button tone="outline" size="sm" onClick={() => openAssign(selected)}>Assign Subjects</Button>
              <Button tone="outline" size="sm" onClick={() => openEdit(selected)}>Edit Profile</Button>
              <Button tone="danger" size="sm" onClick={() => removeTeachers([selected])}><Trash2 size={14} /> Delete</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={addOpen} onClose={() => { setAddOpen(false); setForm(emptyForm); setFormError(null) }} title="Add New Teacher" wide>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Full Name</span>
            <input className={inputCls} placeholder="Enter full name" value={form.name} onChange={setField('name')} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Phone Number</span>
            <input className={inputCls} placeholder="Enter phone number" value={form.phone} onChange={setField('phone')} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Email Address <span className="text-rose-500">*</span></span>
            <input type="email" required className={inputCls} placeholder="Enter email address" value={form.email} onChange={setField('email')} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Login Password <span className="text-rose-500">*</span></span>
            <input type="password" required minLength={6} className={inputCls} placeholder="At least 6 characters" value={form.password} onChange={setField('password')} autoComplete="new-password" />
            <span className="mt-1 block text-xs text-slate-400">The teacher signs in with their staff number or email and this password.</span>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Qualification</span>
            <input className={inputCls} placeholder="Enter qualification" value={form.qualification} onChange={setField('qualification')} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Department</span>
            <select className={inputCls} value={form.dept} onChange={setField('dept')}>
              <option value="">Select department</option>
              {departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Gender</span>
            <select className={inputCls} value={form.gender} onChange={setField('gender')}>
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Employment Status</span>
            <select className={inputCls} value={form.status} onChange={setField('status')}>
              <option value="">Select status</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>
        </div>
        <p className="mt-4 rounded-xl bg-navy-50/60 px-4 py-2.5 text-xs text-slate-500">
          Staff number is generated automatically when the account is created and appears in the teachers table.
        </p>
        {formError && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600">{formError}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <Button tone="ghost" onClick={() => { setAddOpen(false); setFormError(null); setForm(emptyForm) }}>Cancel</Button>
          <Button tone="primary" disabled={saving} onClick={handleSave}>{saving ? 'Creating…' : 'Create Account'}</Button>
        </div>
      </Modal>

      <Modal open={editOpen} onClose={closeEdit} title="Edit Teacher" wide>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Full Name</span>
            <input className={inputCls} placeholder="Enter full name" value={editForm.name} onChange={setEditField('name')} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Phone Number</span>
            <input className={inputCls} placeholder="Enter phone number" value={editForm.phone} onChange={setEditField('phone')} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Email Address</span>
            <input type="email" className={inputCls} placeholder="Enter email address" value={editForm.email} onChange={setEditField('email')} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">New Password</span>
            <input type="password" minLength={6} className={inputCls} placeholder="Leave blank to keep current" value={editForm.password} onChange={setEditField('password')} autoComplete="new-password" />
            <span className="mt-1 block text-xs text-slate-400">Leave blank to keep the current password.</span>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Qualification</span>
            <input className={inputCls} placeholder="Enter qualification" value={editForm.qualification} onChange={setEditField('qualification')} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Department</span>
            <select className={inputCls} value={editForm.dept} onChange={setEditField('dept')}>
              <option value="">Select department</option>
              {departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Gender</span>
            <select className={inputCls} value={editForm.gender} onChange={setEditField('gender')}>
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Employment Status</span>
            <select className={inputCls} value={editForm.status} onChange={setEditField('status')}>
              <option value="">Select status</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>
        </div>

        <div className="mt-6 border-t border-navy-100 pt-4">
          <p className="text-sm font-bold text-navy-900">Teaching Assignments</p>
          <p className="text-xs text-slate-500">Pick the class and the subject the teacher handles for it. Saving replaces previous subject assignments.</p>
          {editAssignLoading ? (
            <div className="mt-4 flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-navy-100 border-t-navy-700" />
            </div>
          ) : (
            <>
              <div className="mt-4 space-y-3">
                {editAssignRows.map((row, index) => (
                  <div key={index} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                    <select className={inputCls} value={row.classId} onChange={(event) => updateEditAssignRow(index, 'classId', event.target.value)}>
                      <option value="">Select class</option>
                      {classOptions.map((schoolClass) => (
                        <option key={schoolClass.id} value={schoolClass.id}>{schoolClass.name}</option>
                      ))}
                    </select>
                    <select className={inputCls} value={row.subjectId} onChange={(event) => updateEditAssignRow(index, 'subjectId', event.target.value)}>
                      <option value="">Select subject</option>
                      {subjectOptions.map((subject) => (
                        <option key={subject.id} value={subject.id}>{subject.name}</option>
                      ))}
                    </select>
                    <button type="button" onClick={() => removeEditAssignRow(index)} className="grid h-10 w-10 place-items-center rounded-xl text-slate-400 transition hover:bg-rose-50 hover:text-rose-600" aria-label="Remove assignment">
                      <X size={16} />
                    </button>
                  </div>
                ))}
                {!editAssignRows.length && (
                  <p className="rounded-xl border border-dashed border-navy-100 px-4 py-3 text-sm text-slate-400">No assignments yet.</p>
                )}
              </div>
              <Button tone="outline" size="sm" className="mt-3" onClick={addEditAssignRow}><Plus size={15} /> Add Subject & Class</Button>
            </>
          )}
        </div>
        {editError && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600">{editError}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <Button tone="ghost" onClick={closeEdit}>Cancel</Button>
          <Button tone="primary" disabled={editSaving} onClick={handleEditSave}>{editSaving ? 'Saving…' : 'Save Changes'}</Button>
        </div>
      </Modal>

      <Modal open={assignOpen} onClose={closeAssign} title={`Assign Subjects${assignTeacher ? ` — ${assignTeacher.name}` : ''}`} wide>
        <p className="text-sm text-slate-500">
          Add one row per class. Pick the class and the subject the teacher handles for it (e.g. one subject for JSS1, another for JSS2).
        </p>
        {assignLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-navy-100 border-t-navy-700" />
          </div>
        ) : (
          <>
            <div className="mt-4 space-y-3">
              {assignRows.map((row, index) => (
                <div key={index} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                  <select className={inputCls} value={row.classId} onChange={(e) => updateAssignRow(index, 'classId', e.target.value)}>
                    <option value="">Select class</option>
                    {classOptions.map((schoolClass) => <option key={schoolClass.id} value={schoolClass.id}>{schoolClass.name}</option>)}
                  </select>
                  <select className={inputCls} value={row.subjectId} onChange={(e) => updateAssignRow(index, 'subjectId', e.target.value)}>
                    <option value="">Select subject</option>
                    {subjectOptions.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
                  </select>
                  <button type="button" onClick={() => removeAssignRow(index)} className="grid h-10 w-10 place-items-center rounded-xl text-slate-400 transition hover:bg-rose-50 hover:text-rose-600" aria-label="Remove assignment">
                    <X size={16} />
                  </button>
                </div>
              ))}
              {!assignRows.length && (
                <p className="rounded-xl border border-dashed border-navy-100 px-4 py-3 text-sm text-slate-400">No assignments yet.</p>
              )}
            </div>
            <Button tone="outline" size="sm" className="mt-3" onClick={addAssignRow}><Plus size={15} /> Add Subject & Class</Button>
            {assignError && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600">{assignError}</p>}
            <div className="mt-6 flex justify-end gap-2">
              <Button tone="ghost" onClick={closeAssign}>Cancel</Button>
              <Button tone="primary" disabled={assignSaving} onClick={handleAssignSave}>{assignSaving ? 'Saving…' : 'Save Assignments'}</Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}
