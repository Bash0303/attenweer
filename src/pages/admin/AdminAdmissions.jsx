import { useEffect, useState } from 'react'
import { CheckCircle2, Clock, Eye, XCircle, Inbox, GraduationCap, Mail, Phone, UserRound } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import StatCard from '../../components/ui/StatCard'
import Card from '../../components/ui/Card'
import Badge, { statusColor } from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import DataTable, { TableToolbar } from '../../components/ui/DataTable'
import { admin } from '../../services/api'

const filterOptions = [
  { value: '', label: 'All Applications' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Rejected', label: 'Rejected' },
]

function Detail({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-navy-50 py-2 last:border-0">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
      <span className="text-sm font-medium text-navy-900">{value || '—'}</span>
    </div>
  )
}

export default function AdminAdmissions() {
  const [rows, setRows] = useState([])
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 })
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)
  const [deciding, setDeciding] = useState(null)
  const [actionError, setActionError] = useState(null)
  const [actionMessage, setActionMessage] = useState(null)

  const load = async (silent = false) => {
    if (!silent) setLoading(true)
    setError(null)
    try {
      const params = {}
      if (status) params.status = status
      if (appliedSearch) params.search = appliedSearch
      const res = await admin.admissions(params)
      setRows(res.data || [])
      setStats(res.stats || { pending: 0, approved: 0, rejected: 0, total: 0 })
    } catch (e) {
      setError(e.message)
    } finally {
      if (!silent) setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => setAppliedSearch(search.trim()), 350)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    load()
  }, [status, appliedSearch])

  const openApplication = (row) => {
    setSelected(row)
    setActionError(null)
    setActionMessage(null)
  }

  const decide = async (nextStatus) => {
    if (!selected) return
    const verb = nextStatus === 'Approved' ? 'approve' : 'reject'
    if (!window.confirm(`Are you sure you want to ${verb} application ${selected.code}?`)) return

    setDeciding(nextStatus)
    setActionError(null)
    setActionMessage(null)
    try {
      const res = await admin.decideAdmission(selected.id, nextStatus)
      const updated = res.data || null
      if (updated) {
        setRows((list) => list.map((row) => (row.id === updated.id ? updated : row)))
        setSelected(updated)
      }
      setActionMessage(
        nextStatus === 'Approved'
          ? 'Application approved. The student account was created and login credentials have been emailed to the applicant.'
          : 'Application rejected. A notification email has been sent to the applicant.',
      )
      load(true)
    } catch (e) {
      setActionError(e.errors ? Object.values(e.errors).flat().join(' ') : e.message)
    } finally {
      setDeciding(null)
    }
  }

  const columns = [
    {
      key: 'name',
      label: 'Applicant',
      render: (row) => (
        <div>
          <p className="font-semibold text-navy-900">{row.name}</p>
          <p className="text-xs text-slate-400">{row.email}</p>
        </div>
      ),
    },
    { key: 'code', label: 'Application', render: (row) => <span className="font-mono text-xs font-semibold text-navy-700">{row.code}</span> },
    { key: 'className', label: 'Class' },
    { key: 'admissionType', label: 'Type', render: (row) => row.admissionType || '—' },
    { key: 'date', label: 'Applied' },
    { key: 'status', label: 'Status', render: (row) => <Badge color={statusColor(row.status)} dot>{row.status}</Badge> },
    {
      key: 'actions',
      label: '',
      right: true,
      render: (row) => (
        <Button
          tone="outline"
          size="sm"
          onClick={(event) => {
            event.stopPropagation()
            openApplication(row)
          }}
        >
          <Eye size={14} /> Review
        </Button>
      ),
    },
  ]

  if (loading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-navy-100 border-t-navy-700" /></div>
  }

  return (
    <div>
      <PageHeader
        title="Admissions"
        subtitle="Review student applications, inspect passports and approve or reject admissions"
        actions={
          <Button tone="outline" onClick={() => load()}>
            Refresh
          </Button>
        }
      />

      {error && (
        <div className="mb-6 flex items-center justify-between rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
          <span>{error}</span>
          <Button tone="ghost" size="sm" onClick={() => load()}>Retry</Button>
        </div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Clock} label="Pending Review" value={stats.pending} tone="gold" index={0} />
        <StatCard icon={CheckCircle2} label="Approved" value={stats.approved} tone="emerald" index={1} />
        <StatCard icon={XCircle} label="Rejected" value={stats.rejected} tone="rose" index={2} />
        <StatCard icon={Inbox} label="Total Applications" value={stats.total} tone="navy" index={3} />
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setStatus(option.value)}
            className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition ${status === option.value ? 'bg-navy-800 text-white' : 'bg-white text-slate-500 hover:bg-navy-50'}`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <Card>
        <TableToolbar
          title="Admission Applications"
          subtitle="Search by applicant name, email or application code"
          onSearch={setSearch}
          placeholder="Search applications…"
        />
        <DataTable columns={columns} rows={rows} rowKey="id" onRowClick={openApplication} />
      </Card>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected ? `Application ${selected.code}` : 'Application'} wide>
        {selected && (
          <div>
            <div className="flex flex-wrap items-start gap-5">
              <div className="grid h-28 w-24 shrink-0 place-items-center overflow-hidden rounded-xl border border-navy-100 bg-navy-50">
                {selected.passportUrl ? (
                  <img src={selected.passportUrl} alt={`${selected.name} passport`} className="h-full w-full object-cover" />
                ) : (
                  <UserRound size={34} className="text-navy-300" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-bold text-navy-900">{selected.name}</h3>
                  <Badge color={statusColor(selected.status)} dot>{selected.status}</Badge>
                  {selected.studentId && <Badge color="emerald">{selected.studentId}</Badge>}
                </div>
                <p className="mt-1 text-sm text-slate-500">{selected.className} • {selected.admissionType || 'Admission'} • {selected.session || 'Session not set'}</p>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1.5"><Mail size={14} className="text-slate-400" /> {selected.email}</span>
                  <span className="inline-flex items-center gap-1.5"><Phone size={14} className="text-slate-400" /> {selected.phone}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-x-8 sm:grid-cols-2">
              <div className="space-y-0">
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-navy-700">Student Details</p>
                <Detail label="Date of Birth" value={selected.dob} />
                <Detail label="Gender" value={selected.gender} />
                <Detail label="State of Origin" value={selected.state} />
                <Detail label="Previous School" value={selected.previousSchool} />
                <Detail label="House" value={selected.house} />
                <Detail label="Blood Group" value={selected.bloodGroup} />
                <Detail label="Allergies / Conditions" value={selected.allergy} />
                <Detail label="Home Address" value={selected.address} />
              </div>
              <div className="space-y-0">
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-navy-700">Parent / Guardian</p>
                <Detail label="Name" value={selected.parentName} />
                <Detail label="Relationship" value={selected.parentRelation} />
                <Detail label="Phone" value={selected.parentPhone} />
                <Detail label="Email" value={selected.parentEmail} />
                <Detail label="Emergency Contact" value={selected.emergencyContact} />
                <Detail label="Applied On" value={selected.date} />
              </div>
            </div>

            {actionError && <p className="mt-5 rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600">{actionError}</p>}
            {actionMessage && <p className="mt-5 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700">{actionMessage}</p>}

            <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-navy-100 pt-4">
              <Button tone="ghost" onClick={() => setSelected(null)}>Close</Button>
              {!selected.studentId && (
                <Button
                  tone="danger"
                  disabled={!!deciding || selected.status === 'Rejected'}
                  onClick={() => decide('Rejected')}
                >
                  {deciding === 'Rejected' ? 'Rejecting…' : <><XCircle size={15} /> Reject</>}
                </Button>
              )}
              <Button
                tone="emerald"
                disabled={!!deciding || selected.status === 'Approved'}
                onClick={() => decide('Approved')}
              >
                {deciding === 'Approved' ? 'Approving…' : <><GraduationCap size={15} /> Approve</>}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
