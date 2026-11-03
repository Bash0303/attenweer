import { useEffect, useMemo, useState } from 'react'
import { Users } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Badge, { statusColor } from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import DataTable, { TableToolbar } from '../../components/ui/DataTable'
import StatCard from '../../components/ui/StatCard'
import { teacher } from '../../services/api'
import { EmptyBlock, ErrorBlock, LoadBlock } from './teacherUtils'

export default function TeacherStudents() {
  const [rows, setRows] = useState([])
  const [classes, setClasses] = useState([])
  const [stats, setStats] = useState({})
  const [classId, setClassId] = useState('')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)

    teacher.students(classId ? { classId } : undefined)
      .then((res) => {
        if (cancelled) return
        setRows(res.data || [])
        setClasses(res.classes || [])
        setStats(res.stats || {})
      })
      .catch((e) => {
        if (!cancelled) setError(e.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [classId, reloadKey])

  const filtered = useMemo(
    () => rows.filter((student) => `${student.name} ${student.className} ${student.studentId}`.toLowerCase().includes(query.toLowerCase())),
    [rows, query],
  )

  const columns = [
    { key: 'name', label: 'Student', render: (s) => (
      <div className="flex items-center gap-3">
        <Avatar initials={s.initials} color={s.color} size="sm" />
        <div><p className="font-semibold text-navy-900">{s.name}</p><p className="text-xs text-slate-400">{s.email || s.studentId}</p></div>
      </div>
    ) },
    { key: 'class', label: 'Class', render: (s) => <Badge color="navy">{s.className}</Badge> },
    { key: 'parent', label: 'Parent', render: (s) => (
      <div><p className="font-medium text-navy-800">{s.parent?.name || '—'}</p><p className="text-xs text-slate-400">{s.parent?.phone || '—'}</p></div>
    ) },
    { key: 'status', label: 'Status', render: (s) => <Badge color={statusColor(s.status)} dot>{s.status}</Badge> },
    { key: 'action', label: '', right: true, render: (s) => <span className="text-xs font-semibold text-navy-700">{s.studentId}</span> },
  ]

  if (loading && !rows.length) return <LoadBlock label="Loading your students..." />
  if (error) return <ErrorBlock message={error} onRetry={() => setReloadKey((key) => key + 1)} />

  if (!rows.length && !classId) {
    return (
      <div>
        <PageHeader title="My Students" subtitle="Students across your assigned classes" />
        <EmptyBlock title="No students yet" message="Students will appear here once you are assigned to classes with enrolled students." />
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="My Students" subtitle="Students across your assigned classes" />

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <StatCard icon={Users} label="Total Students" value={stats.total || 0} sub={classId ? classes.find((c) => String(c.id) === String(classId))?.name : 'All assigned classes'} tone="navy" index={0} />
        <StatCard icon={Users} label="Girls / Boys" value={`${stats.girls || 0} / ${stats.boys || 0}`} sub="combined" tone="emerald" index={1} />
      </div>

      <div className="mb-5">
        <select value={classId} onChange={(e) => setClassId(e.target.value)} className="rounded-xl border border-navy-100 bg-white px-3.5 py-2 text-sm font-medium text-navy-800 outline-none">
          <option value="">All Classes</option>
          {classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
      </div>

      <Card>
        <TableToolbar title="My Students" subtitle="Search by name, class or student ID" onSearch={setQuery} placeholder="Search student…" />
        <DataTable columns={columns} rows={filtered} rowKey="id" />
      </Card>
    </div>
  )
}
