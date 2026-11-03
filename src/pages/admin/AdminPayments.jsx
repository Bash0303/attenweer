import { useEffect, useState } from 'react'
import { CreditCard, Plus, CheckCircle2, XCircle, Search, UserRound } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Badge, { statusColor } from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import StatCard from '../../components/ui/StatCard'
import Modal from '../../components/ui/Modal'
import DataTable, { TableToolbar } from '../../components/ui/DataTable'
import { admin } from '../../services/api'

const inputCls = 'w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none transition focus:border-navy-400 focus:ring-2 focus:ring-navy-100'
const money = (value) => `\u20A6${Number(value || 0).toLocaleString()}`
const today = () => new Date().toISOString().slice(0, 10)
const blankForm = () => ({
  classId: '',
  termId: '',
  studentId: '',
  mode: 'full',
  amount: '',
  method: 'Bank Transfer',
  reference: '',
  paidOn: today(),
})
const statusTabs = ['', 'Pending', 'Verified', 'Failed']

export default function AdminPayments() {
  const [rows, setRows] = useState([])
  const [meta, setMeta] = useState(null)
  const [stats, setStats] = useState(null)
  const [methods, setMethods] = useState([])
  const [classes, setClasses] = useState([])
  const [terms, setTerms] = useState([])
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [classFilter, setClassFilter] = useState('')
  const [termFilter, setTermFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState('')
  const [create, setCreate] = useState(false)
  const [form, setForm] = useState(blankForm)
  const [formError, setFormError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [studentSearch, setStudentSearch] = useState('')
  const [studentRows, setStudentRows] = useState([])
  const [studentMessage, setStudentMessage] = useState('')
  const [studentsLoading, setStudentsLoading] = useState(false)
  const [selected, setSelected] = useState(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await admin.payments({
        status: status || undefined,
        search: query || undefined,
        classId: classFilter || undefined,
        termId: termFilter || undefined,
        perPage: 100,
      })
      setRows(res.data || [])
      setMeta(res.meta || null)
      setStats(res.stats || null)
      setMethods(res.methods || [])
      setClasses(res.classes || [])
      setTerms(res.terms || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(load, query ? 300 : 0)
    return () => clearTimeout(timer)
  }, [status, query, classFilter, termFilter])

  useEffect(() => {
    if (!create || !form.classId || !form.termId) return undefined

    let cancelled = false
    setStudentsLoading(true)
    setStudentMessage('')

    const timer = setTimeout(() => {
      admin.feeStudents({
        classId: Number(form.classId),
        termId: Number(form.termId),
        search: studentSearch || undefined,
      })
        .then((res) => {
          if (cancelled) return
          setStudentRows(res.data || [])
          setStudentMessage(res.message || '')
        })
        .catch((e) => {
          if (!cancelled) {
            setStudentRows([])
            setStudentMessage(e.message)
          }
        })
        .finally(() => {
          if (!cancelled) setStudentsLoading(false)
        })
    }, 250)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [create, form.classId, form.termId, studentSearch])

  const setField = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }))

  const openCreate = () => {
    const defaultClass = classes[0]?.id ? String(classes[0].id) : ''
    const defaultTerm = terms.find((term) => term.isCurrent)?.id || terms[0]?.id
    setForm({
      ...blankForm(),
      classId: defaultClass,
      termId: defaultTerm ? String(defaultTerm) : '',
      method: methods[0] || 'Bank Transfer',
    })
    setSelected(null)
    setStudentRows([])
    setStudentSearch('')
    setStudentMessage('')
    setFormError(null)
    setNotice('')
    setCreate(true)
  }

  const chooseStudent = (student) => {
    if (student.completed) return
    setSelected(student)
    setForm((current) => ({
      ...current,
      studentId: String(student.studentId),
      amount: current.mode === 'full' ? String(student.balance) : '',
    }))
  }

  const changeMode = (mode) => {
    setForm((current) => ({
      ...current,
      mode,
      amount: mode === 'full' && selected ? String(selected.balance) : '',
    }))
  }

  const handleSave = async () => {
    if (!selected) {
      setFormError('Select a student from the class list.')
      return
    }

    const balance = Number(selected.balance || 0)
    const amount = form.mode === 'full' ? balance : Number(form.amount || 0)

    if (amount <= 0) {
      setFormError('Enter the exact amount paid by the student.')
      return
    }

    if (amount > balance) {
      setFormError('The amount cannot be more than the outstanding balance.')
      return
    }

    setSaving(true)
    setFormError(null)
    try {
      const res = await admin.createPayment({
        classId: Number(form.classId),
        studentId: Number(selected.studentId),
        termId: Number(form.termId),
        mode: form.mode,
        amount: form.mode === 'partial' ? amount : undefined,
        method: form.method,
        reference: form.reference.trim() || null,
        paidOn: form.paidOn,
        status: 'Verified',
      })
      setCreate(false)
      setSelected(null)
      setNotice(res.message || 'Payment recorded successfully.')
      await load()
    } catch (e) {
      setFormError(e.errors ? Object.values(e.errors).flat().join(' ') : e.message)
    } finally {
      setSaving(false)
    }
  }

  const verify = async (row) => {
    try {
      await admin.verifyPayment(row.id)
      await load()
    } catch (e) {
      window.alert(e.message)
    }
  }

  const reject = async (row) => {
    if (!window.confirm(`Reject ${row.paymentCode}?`)) return
    try {
      await admin.rejectPayment(row.id)
      await load()
    } catch (e) {
      window.alert(e.message)
    }
  }

  const columns = [
    { key: 'paymentCode', label: 'Receipt', render: (row) => <span className="font-mono text-xs font-semibold text-navy-700">{row.receiptNo}</span> },
    { key: 'student', label: 'Student', render: (row) => (
      <div>
        <p className="font-semibold text-navy-900">{row.student}</p>
        <p className="font-mono text-xs text-slate-400">{row.studentId} • {row.className}</p>
      </div>
    ) },
    { key: 'term', label: 'Term', render: (row) => (
      <div>
        <p className="text-sm font-semibold text-navy-800">{row.term || '—'}</p>
        <p className="text-xs text-slate-400">{row.session || ''}</p>
      </div>
    ) },
    { key: 'amount', label: 'Amount', render: (row) => <span className="font-bold text-navy-900">{money(row.amount)}</span> },
    { key: 'method', label: 'Method', render: (row) => <span className="text-sm text-slate-600">{row.method}</span> },
    { key: 'date', label: 'Date', render: (row) => <span className="text-sm text-slate-600">{row.date}</span> },
    { key: 'status', label: 'Status', render: (row) => <Badge color={statusColor(row.status)} dot>{row.status}</Badge> },
    { key: 'actions', label: '', right: true, render: (row) => (
      <div className="flex items-center justify-end gap-1">
        {row.status !== 'Verified' && (
          <button title="Verify" onClick={(event) => { event.stopPropagation(); verify(row) }} className="grid h-8 w-8 place-items-center rounded-lg text-emerald-600 transition hover:bg-emerald-50"><CheckCircle2 size={15} /></button>
        )}
        {row.status !== 'Failed' && (
          <button title="Reject" onClick={(event) => { event.stopPropagation(); reject(row) }} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"><XCircle size={15} /></button>
        )}
      </div>
    ) },
  ]

  if (loading && !rows.length) {
    return <div className="flex min-h-[60vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-navy-100 border-t-navy-700" /></div>
  }

  return (
    <div>
      <PageHeader title="Payments" subtitle="Record class fee payments, search students and track receipts" actions={<Button tone="primary" onClick={openCreate}><Plus size={16} /> Record Payment</Button>} />

      {error && (
        <div className="mb-6 flex items-center justify-between rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
          <span>{error}</span>
          <Button tone="ghost" size="sm" onClick={load}>Retry</Button>
        </div>
      )}

      {notice && <div className="mb-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{notice}</div>}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={CreditCard} label="Today's Collections" value={stats ? money(stats.todayTotal) : '—'} sub={`${stats?.todayCount ?? 0} payments`} tone="emerald" index={0} />
        <StatCard icon={CreditCard} label="Pending Verification" value={stats?.pending ?? '—'} sub="needs review" tone="amber" index={1} />
        <StatCard icon={CreditCard} label="Failed Transactions" value={stats?.failed ?? '—'} sub="refund/retry" tone="rose" index={2} />
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        {statusTabs.map((item) => (
          <button key={item || 'all'} onClick={() => setStatus(item)} className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition ${status === item ? 'bg-navy-800 text-white' : 'bg-white text-slate-500 hover:bg-navy-50'}`}>{item || 'All Payments'}</button>
        ))}
        <select value={classFilter} onChange={(event) => setClassFilter(event.target.value)} className="rounded-xl border border-navy-100 bg-white px-3 py-2 text-sm font-medium text-navy-700 outline-none">
          <option value="">All Classes</option>
          {classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
        <select value={termFilter} onChange={(event) => setTermFilter(event.target.value)} className="rounded-xl border border-navy-100 bg-white px-3 py-2 text-sm font-medium text-navy-700 outline-none">
          <option value="">All Terms</option>
          {terms.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
        </select>
      </div>

      <Card>
        <TableToolbar title="Payment History" subtitle={`${meta?.total ?? rows.length} payments recorded`} onSearch={setQuery} placeholder="Search student, receipt..." />
        <DataTable columns={columns} rows={rows} rowKey="id" />
      </Card>

      <Modal open={create} onClose={() => setCreate(false)} title="Record Fee Payment" wide>
        <div className="grid gap-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-navy-800">Class</span>
              <select className={inputCls} value={form.classId} onChange={(event) => { setSelected(null); setField('classId')(event) }}>
                {classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-navy-800">Term</span>
              <select className={inputCls} value={form.termId} onChange={(event) => { setSelected(null); setField('termId')(event) }}>
                {terms.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
              </select>
            </label>
          </div>

          <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-semibold text-navy-800">Select Student</span>
              <div className="relative">
                <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={studentSearch} onChange={(event) => setStudentSearch(event.target.value)} placeholder="Search name or ID..." className="w-56 rounded-xl border border-navy-100 py-2 pl-9 pr-3 text-sm outline-none focus:border-navy-300" />
              </div>
            </div>

            {studentMessage && <p className="mb-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">{studentMessage}</p>}

            <div className="max-h-56 divide-y divide-navy-50 overflow-y-auto rounded-xl border border-navy-100">
              {studentsLoading && <p className="px-4 py-6 text-center text-sm text-slate-400">Loading students...</p>}
              {!studentsLoading && !studentRows.length && !studentMessage && <p className="px-4 py-6 text-center text-sm text-slate-400">No students found in this class.</p>}
              {studentRows.map((student) => {
                const active = selected?.studentId === student.studentId
                return (
                  <button
                    key={student.studentId}
                    type="button"
                    disabled={student.completed}
                    onClick={() => chooseStudent(student)}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${active ? 'bg-navy-50' : 'hover:bg-navy-50/50'} ${student.completed ? 'cursor-not-allowed opacity-60' : ''}`}
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy-100 text-navy-700"><UserRound size={16} /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-navy-900">{student.name}</span>
                      <span className="block text-xs text-slate-400">{student.studentCode} • {student.className}</span>
                    </span>
                    <span className="text-right">
                      <span className="block text-sm font-bold text-navy-900">{money(student.balance)}</span>
                      <span className="block text-[10px] text-slate-400">{student.completed ? 'Completed' : 'Balance'}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {selected && (
            <div className="rounded-xl bg-navy-50/70 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-bold text-navy-900">{selected.name}</p>
                  <p className="text-xs text-slate-500">{selected.studentCode} • {selected.className}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Outstanding balance</p>
                  <p className="text-lg font-extrabold text-rose-600">{money(selected.balance)}</p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="flex gap-2">
                  <button type="button" onClick={() => changeMode('full')} className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${form.mode === 'full' ? 'border-navy-700 bg-navy-700 text-white' : 'border-navy-200 bg-white text-navy-700'}`}>Complete Payment</button>
                  <button type="button" onClick={() => changeMode('partial')} className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${form.mode === 'partial' ? 'border-navy-700 bg-navy-700 text-white' : 'border-navy-200 bg-white text-navy-700'}`}>Part Payment</button>
                </div>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-navy-800">Amount Paid</span>
                  <input
                    type="number"
                    min="1"
                    max={selected.balance}
                    className={inputCls}
                    value={form.mode === 'full' ? selected.balance : form.amount}
                    onChange={setField('amount')}
                    disabled={form.mode === 'full'}
                  />
                </label>
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-navy-800">Payment Method</span>
              <select className={inputCls} value={form.method} onChange={setField('method')}>
                {(methods.length ? methods : ['Bank Transfer', 'Card', 'POS', 'Cash']).map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-navy-800">Payment Date</span>
              <input type="date" className={inputCls} value={form.paidOn} onChange={setField('paidOn')} />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-semibold text-navy-800">Bank Reference (optional)</span>
              <input className={inputCls} value={form.reference} onChange={setField('reference')} placeholder="e.g. bank transaction reference" />
            </label>
          </div>
        </div>

        {formError && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600">{formError}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <Button tone="ghost" onClick={() => setCreate(false)}>Cancel</Button>
          <Button tone="primary" disabled={saving || !selected} onClick={handleSave}>{saving ? 'Recording...' : 'Record Payment'}</Button>
        </div>
      </Modal>
    </div>
  )
}
