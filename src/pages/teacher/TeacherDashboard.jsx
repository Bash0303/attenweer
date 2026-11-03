import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { School, Users, ClipboardCheck, PenSquare, BookMarked, FileText, Clock, Sparkles, TrendingUp } from 'lucide-react'
import StatCard from '../../components/ui/StatCard'
import Card from '../../components/ui/Card'
import Badge, { statusColor } from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import ProgressBar from '../../components/ui/ProgressBar'
import { BarsChart } from '../../components/ui/Charts'
import { useAuth } from '../../context/AuthContext'
import { teacher } from '../../services/api'
import { ErrorBlock, LoadBlock } from './teacherUtils'

const hour = new Date().getHours()
const greeting = hour < 12 ? 'Good Morning' : hour < 16 ? 'Good Afternoon' : 'Good Evening'

export default function TeacherDashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)

    teacher.dashboard()
      .then((res) => {
        if (!cancelled) setData(res)
      })
      .catch((e) => {
        if (!cancelled) setError(e.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [reloadKey])

  if (loading) return <LoadBlock label="Loading your dashboard..." />
  if (error) return <ErrorBlock message={error} onRetry={() => setReloadKey((key) => key + 1)} />

  const stats = data?.stats || {}
  const classNames = data?.classNames || []
  const schedule = data?.schedule || []
  const recentAssignments = data?.recentAssignments || []
  const classAttendance = data?.classAttendance || []
  const classAverages = data?.classAverages || []
  const recentStudents = data?.students || []
  const nextPeriod = schedule[0]

  const cards = [
    { icon: School, label: 'My Classes', value: stats.classes || 0, sub: classNames.join(' • ') || 'No classes assigned', tone: 'navy' },
    { icon: Users, label: 'My Students', value: stats.students || 0, sub: `across ${stats.classes || 0} classes`, tone: 'emerald' },
    { icon: ClipboardCheck, label: "Today's Attendance", value: `${stats.attendanceRate || 0}%`, sub: `${stats.attendancePresent || 0} present`, tone: 'gold' },
    { icon: PenSquare, label: 'Pending Marking', value: stats.pendingMarking || 0, sub: 'open assignments', tone: 'amber' },
    { icon: BookMarked, label: 'Exams to Enter', value: stats.examsToEnter || 0, sub: 'scheduled exams', tone: 'violet' },
    { icon: FileText, label: 'Results to Submit', value: stats.resultsToSubmit || 0, sub: 'pending approval', tone: 'rose' },
  ]

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-900 p-6 text-white shadow-lift sm:p-8">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 85% 20%, #d9a62e 0%, transparent 40%)' }} />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-emerald-300"><Sparkles size={15} /> Teacher Portal</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">{greeting}, {user?.name} 👋</h1>
            <p className="mt-1.5 text-sm text-emerald-50/80">{classNames.join(' & ') || 'No classes assigned'} • {data?.session || '—'} • {data?.term || '—'}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-3">
            {[
              ['Next Period', nextPeriod ? `${nextPeriod.subject} ${nextPeriod.start}` : '—'],
              ['Today', `${schedule.length} period${schedule.length === 1 ? '' : 's'}`],
              ['Pending Marking', stats.pendingMarking || 0],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur"><p className="text-lg font-extrabold text-emerald-200">{v}</p><p className="text-[11px] text-emerald-50/70">{k}</p></div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((s, i) => <StatCard key={s.label} {...s} index={i} />)}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-navy-900">Class Attendance</h3>
              <p className="text-xs text-slate-400">Attendance rate by class this term</p>
            </div>
            <Badge color="emerald" dot>Live</Badge>
          </div>
          {classAttendance.length ? (
            <BarsChart data={classAttendance} dataKey="present" xKey="name" color="#10b981" height={260} suffix="%" />
          ) : (
            <p className="py-12 text-center text-sm text-slate-400">Attendance will appear once you mark a class.</p>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2"><Clock size={18} className="text-gold-500" /><h3 className="font-bold text-navy-900">Today's Schedule</h3></div>
          <div className="mt-4 space-y-3">
            {schedule.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-xl border border-navy-100 p-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy-700 text-[10px] font-bold text-white">{item.start}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-navy-900">{item.subject}</p>
                  <p className="text-xs text-slate-400">{item.className}</p>
                </div>
                <Badge color="slate">{item.label || 'Class'}</Badge>
              </div>
            ))}
            {!schedule.length && <p className="rounded-xl bg-cream-100/60 p-4 text-sm text-slate-500">No classes scheduled for today.</p>}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-navy-100 px-6 py-4">
            <h3 className="font-bold text-navy-900">Recent Assignments</h3>
            <span className="text-sm font-semibold text-navy-700">{recentAssignments.length} shown</span>
          </div>
          <div className="divide-y divide-navy-50">
            {recentAssignments.map((assignment) => (
              <div key={assignment.id} className="flex items-center gap-3 px-6 py-3.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-cream-100 text-navy-700"><PenSquare size={16} /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy-900">{assignment.title}</p>
                  <p className="text-xs text-slate-400">{assignment.className} • {assignment.subject} • deadline {assignment.deadline}</p>
                </div>
                <Badge color={statusColor(assignment.status)} dot>{assignment.status}</Badge>
                <span className="text-xs font-semibold text-navy-700">{assignment.submissions}/{assignment.totalStudents}</span>
              </div>
            ))}
            {!recentAssignments.length && <p className="px-6 py-8 text-center text-sm text-slate-400">No assignments yet. Create one from the Assignments page.</p>}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-navy-900">My Class Average</h3>
          <p className="text-xs text-slate-400">Approved results this term</p>
          <div className="mt-4 space-y-4">
            {classAverages.map((item) => (
              <div key={item.cls}>
                <div className="mb-1 flex justify-between text-sm"><span className="font-semibold text-navy-800">{item.cls}</span><span className="font-bold text-emerald-600">{item.avg}%</span></div>
                <ProgressBar value={item.avg} color="bg-emerald-500" />
              </div>
            ))}
            {!classAverages.length && <p className="text-sm text-slate-400">No approved results yet.</p>}
          </div>
          {data?.topStudent && (
            <div className="mt-5 rounded-xl bg-cream-100/70 p-4">
              <p className="flex items-center gap-2 text-sm font-bold text-navy-800"><TrendingUp size={16} className="text-emerald-600" /> Top Student</p>
              <div className="mt-2 flex items-center gap-3">
                <Avatar initials={data.topStudent.initials} color={data.topStudent.color} size="sm" />
                <div><p className="text-sm font-semibold text-navy-900">{data.topStudent.name}</p><p className="text-xs text-slate-400">{data.topStudent.className} • {data.topStudent.average}% average</p></div>
              </div>
            </div>
          )}
        </Card>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {recentStudents.map((student) => (
          <Card key={student.id} hover className="p-4">
            <div className="flex items-center gap-3">
              <Avatar initials={student.initials} color={student.color} size="sm" />
              <div className="min-w-0"><p className="truncate text-sm font-bold text-navy-900">{student.name}</p><p className="text-xs text-slate-400">{student.className}</p></div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <Badge color={statusColor(student.status)} dot>{student.status}</Badge>
              <span className="text-xs font-semibold text-navy-700">{student.studentId}</span>
            </div>
          </Card>
        ))}
        {!recentStudents.length && <p className="text-sm text-slate-400">Students will appear once you are assigned to a class.</p>}
      </div>
    </div>
  )
}
