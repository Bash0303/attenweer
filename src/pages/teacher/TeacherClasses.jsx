import { useEffect, useState } from 'react'
import { School, Users } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import ProgressBar from '../../components/ui/ProgressBar'
import StatCard from '../../components/ui/StatCard'
import { teacher } from '../../services/api'
import { EmptyBlock, ErrorBlock, LoadBlock } from './teacherUtils'

export default function TeacherClasses() {
  const [data, setData] = useState(null)
  const [activeId, setActiveId] = useState(null)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [studentsLoading, setStudentsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [studentsError, setStudentsError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)

    teacher.classes()
      .then((res) => {
        if (cancelled) return
        const list = res.data || []
        setData(res)
        setActiveId((current) => (list.some((item) => item.id === current) ? current : (list[0]?.id ?? null)))
      })
      .catch((e) => {
        if (!cancelled) setError(e.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [reloadKey])

  useEffect(() => {
    if (!activeId) {
      setStudents([])
      return undefined
    }

    let cancelled = false

    setStudentsLoading(true)
    setStudentsError(null)

    teacher.students({ classId: activeId })
      .then((res) => {
        if (!cancelled) setStudents(res.data || [])
      })
      .catch((e) => {
        if (!cancelled) setStudentsError(e.message)
      })
      .finally(() => {
        if (!cancelled) setStudentsLoading(false)
      })

    return () => { cancelled = true }
  }, [activeId])

  if (loading) return <LoadBlock label="Loading your classes..." />
  if (error) return <ErrorBlock message={error} onRetry={() => setReloadKey((key) => key + 1)} />

  const classes = data?.data || []
  const subjects = data?.subjects || []
  const stats = data?.stats || {}
  const active = classes.find((item) => item.id === activeId)

  if (!classes.length) {
    return (
      <div>
        <PageHeader title="My Classes" subtitle="Classes you teach as assigned by admin" />
        <EmptyBlock title="No classes assigned" message="Your classes and subjects will appear here after the admin assigns them to you." />
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="My Classes" subtitle="Classes you teach as assigned by admin" />

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <StatCard icon={School} label="Classes Taught" value={stats.classes || 0} sub={classes.map((c) => c.name).join(' • ')} tone="navy" index={0} />
        <StatCard icon={Users} label="Total Students" value={stats.students || 0} sub="combined" tone="emerald" index={1} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          {classes.map((item) => {
            const fill = item.capacity ? Math.round((item.studentCount / item.capacity) * 100) : 0
            return (
              <Card key={item.id} hover className={`cursor-pointer p-5 ${activeId === item.id ? 'ring-2 ring-navy-600 ring-offset-2' : ''}`} onClick={() => setActiveId(item.id)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy-800 text-gold-400"><School size={20} /></span>
                    <div><p className="font-extrabold text-navy-900">{item.name}</p><p className="text-xs text-slate-400">{item.studentCount} students</p></div>
                  </div>
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-600">{fill}%</span>
                </div>
                <ProgressBar value={fill} color="bg-emerald-500" className="mt-3" height="h-1.5" />
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {item.subjects.map((subject) => <Badge key={subject.id} color="gold">{subject.code || subject.name}</Badge>)}
                </div>
              </Card>
            )
          })}
          <Card className="p-5">
            <p className="text-sm font-bold text-navy-900">Subjects I Teach</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {subjects.map((subject) => <Badge key={subject.id} color="gold">{subject.name}</Badge>)}
              {!subjects.length && <p className="text-sm text-slate-400">No subjects assigned yet.</p>}
            </div>
          </Card>
        </div>

        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-navy-100 px-6 py-4">
            <div>
              <h3 className="font-bold text-navy-900">{active?.name} Students</h3>
              <p className="text-xs text-slate-400">{active?.studentCount || 0} enrolled • {active?.attendanceRate || 0}% attendance this term</p>
            </div>
            <Badge color={active?.isClassTeacher ? 'emerald' : 'slate'} dot>{active?.isClassTeacher ? 'Class teacher' : 'Subject teacher'}</Badge>
          </div>
          <div className="divide-y divide-navy-50">
            {studentsLoading && <p className="px-6 py-8 text-center text-sm text-slate-400">Loading students...</p>}
            {studentsError && <p className="px-6 py-8 text-center text-sm text-rose-600">{studentsError}</p>}
            {!studentsLoading && !studentsError && students.map((student) => (
              <div key={student.id} className="flex items-center gap-3 px-6 py-3">
                <Avatar initials={student.initials} color={student.color} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy-900">{student.name}</p>
                  <p className="font-mono text-[11px] text-slate-400">{student.studentId}</p>
                </div>
                <Badge color="slate">{student.gender}</Badge>
                <Badge color={student.status === 'Active' ? 'emerald' : 'rose'} dot>{student.status}</Badge>
              </div>
            ))}
            {!studentsLoading && !studentsError && !students.length && <p className="px-6 py-8 text-center text-sm text-slate-400">No students in this class yet.</p>}
          </div>
        </Card>
      </div>
    </div>
  )
}
