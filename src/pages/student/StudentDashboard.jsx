import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, CalendarDays, ClipboardCheck, Clock, FileText, PenSquare, Sparkles, TrendingUp, Wallet } from 'lucide-react'
import { Link } from 'react-router-dom'
import StatCard from '../../components/ui/StatCard'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import ProgressBar from '../../components/ui/ProgressBar'
import { BarsChart, DonutChart } from '../../components/ui/Charts'
import { useAuth } from '../../context/AuthContext'
import { student } from '../../services/api'
import { ErrorBlock, LoadBlock, money } from './studentUtils'

const hour = new Date().getHours()
const greeting = hour < 12 ? 'Good Morning' : hour < 16 ? 'Good Afternoon' : 'Good Evening'

export default function StudentDashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)

    student.dashboard()
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

  const me = data?.student || {}
  const stats = data?.stats || {}
  const attendance = stats.attendance || {}
  const academic = stats.academic || {}
  const fees = stats.fees || {}
  const assignments = stats.assignments || {}
  const subjects = data?.subjects || []

  const attendanceChart = [
    { name: 'Present', value: attendance.present || 0, color: '#10b981' },
    { name: 'Late', value: attendance.late || 0, color: '#d9a62e' },
    { name: 'Absent', value: attendance.absent || 0, color: '#ef4444' },
  ]

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-navy-900 via-navy-800 to-navy-950 p-6 text-white shadow-lift sm:p-8">
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle at 85% 20%, #d9a62e 0%, transparent 40%)' }} />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gold-500 text-lg font-extrabold text-navy-950">{user?.initials || me.initials || 'ST'}</span>
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-gold-400"><Sparkles size={14} /> Student Portal</p>
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{greeting}, {user?.name?.split(' ')[0] || me.name?.split(' ')[0] || 'Student'}</h1>
              <p className="mt-1 text-sm text-cream-100/70">{me.className || user?.className || '-'} &bull; {me.studentId || user?.studentId || '-'} &bull; {data?.session || me.session || '-'}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
            {[
              ['Attendance', `${attendance.rate || 0}%`],
              ['Average', academic.average === null || academic.average === undefined ? 'N/A' : `${academic.average}%`],
              ['Pending Tasks', assignments.pending || 0],
              ['Fees Owed', money(fees.balance)],
            ].map(([key, value]) => (
              <div key={key} className="rounded-xl bg-white/10 px-3 py-3 backdrop-blur"><p className="text-lg font-extrabold text-gold-400">{value}</p><p className="text-[11px] text-cream-100/70">{key}</p></div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={ClipboardCheck} label="Attendance Rate" value={`${attendance.rate || 0}%`} sub={`${attendance.total || 0} school days`} tone="emerald" index={0} />
        <StatCard icon={FileText} label="Class Average" value={academic.average === null || academic.average === undefined ? 'N/A' : `${academic.average}%`} sub={academic.grade ? `grade ${academic.grade}` : 'no published result yet'} tone="navy" index={1} />
        <StatCard icon={PenSquare} label="Pending Assignments" value={assignments.pending || 0} sub={`${assignments.total || 0} total`} tone="amber" index={2} />
        <StatCard icon={Wallet} label="Outstanding Fees" value={money(fees.balance)} sub={fees.completed ? 'fees completed' : `${fees.rate || 0}% paid`} tone={Number(fees.balance) > 0 ? 'rose' : 'emerald'} index={3} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div><h3 className="font-bold text-navy-900">My Performance</h3><p className="text-xs text-slate-400">Published subject scores &mdash; {data?.term || 'current term'}</p></div>
            <Badge color={subjects.length ? 'emerald' : 'slate'} dot>{subjects.length ? 'Published' : 'Not published'}</Badge>
          </div>
          {subjects.length ? (
            <BarsChart data={subjects.map((subject) => ({ name: subject.subject?.split(' ')[0] || '-', average: subject.total }))} dataKey="average" xKey="name" color="#2a478e" height={280} suffix="" />
          ) : (
            <p className="rounded-xl bg-cream-100/70 px-4 py-10 text-center text-sm text-slate-500">Your approved result will appear here after the school publishes it for your class.</p>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-navy-900">This Term Attendance</h3>
          <p className="text-xs text-slate-400">Present, late and absent records</p>
          {attendance.total ? (
            <>
              <DonutChart data={attendanceChart} height={230} centerValue={`${attendance.rate || 0}%`} centerLabel="Rate" />
              <div className="space-y-2">
                {[['Present', attendance.present], ['Late', attendance.late], ['Absent', attendance.absent]].map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-600">{key}</span>
                    <span className="font-bold text-navy-900">{value || 0} days</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="mt-6 rounded-xl bg-cream-100/70 p-4 text-sm text-slate-500">Attendance has not been recorded yet.</p>
          )}
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-navy-100 px-6 py-4">
            <h3 className="font-bold text-navy-900">Today&apos;s Timetable</h3>
            <Link to="/student/timetable" className="text-sm font-semibold text-navy-700 hover:text-navy-900">Full timetable &rarr;</Link>
          </div>
          <div className="grid gap-3 p-6 sm:grid-cols-2">
            {(data?.timetable || []).map((entry) => (
              <div key={entry.id} className="rounded-xl border border-navy-100 p-3">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-gold-600"><Clock size={12} /> {entry.start} - {entry.end}</p>
                <p className="mt-1.5 text-sm font-semibold text-navy-800">{entry.subject}</p>
              </div>
            ))}
            {!(data?.timetable || []).length && <p className="text-sm text-slate-400">No classes have been scheduled for today.</p>}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><CalendarDays size={18} className="text-gold-500" /><h3 className="font-bold text-navy-900">Upcoming Exams</h3></div>
            <Link to="/student/exams" className="text-xs font-bold text-navy-700">View all</Link>
          </div>
          <div className="mt-4 space-y-3">
            {(data?.exams || []).map((exam) => (
              <div key={exam.id} className="flex items-center gap-3 rounded-xl border border-navy-100 p-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cream-100 text-center text-[10px] font-extrabold text-navy-800">{exam.startDate?.split(' ')[0]}<br />{exam.startDate?.split(' ')[1]}</span>
                <div><p className="text-sm font-bold text-navy-900">{exam.title}</p><p className="text-xs text-slate-400">{exam.term} &bull; {exam.status}</p></div>
              </div>
            ))}
            {!(data?.exams || []).length && <p className="text-sm text-slate-400">No upcoming exams have been scheduled.</p>}
          </div>
          <div className="mt-4 rounded-xl bg-cream-100/70 p-4">
            <p className="flex items-center gap-2 text-sm font-bold text-navy-800"><TrendingUp size={15} className="text-emerald-600" /> Fees Balance</p>
            <p className="mt-1 text-sm text-slate-500">{money(fees.balance)} outstanding of {money(fees.due)}</p>
            <ProgressBar value={fees.rate || 0} color={Number(fees.balance) > 0 ? 'bg-gold-500' : 'bg-emerald-500'} className="mt-2" />
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-navy-100 px-6 py-4">
            <h3 className="font-bold text-navy-900">Recent Announcements</h3>
            <Link to="/student/announcements" className="text-sm font-semibold text-navy-700 hover:text-navy-900">View all &rarr;</Link>
          </div>
          <div className="divide-y divide-navy-50">
            {(data?.announcements || []).map((announcement) => (
              <div key={announcement.id} className="flex items-center gap-3 px-6 py-3.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-navy-50 text-navy-700"><Bell size={16} /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy-900">{announcement.title}</p>
                  <p className="text-xs text-slate-400">{announcement.date} &bull; {announcement.author || 'School office'}</p>
                </div>
                <Badge color="slate">{announcement.tag}</Badge>
              </div>
            ))}
            {!(data?.announcements || []).length && <p className="px-6 py-8 text-center text-sm text-slate-400">No announcements have been published for students yet.</p>}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-navy-900">Recent Assignments</h3>
          <div className="mt-4 space-y-3">
            {(data?.assignments || []).map((assignment) => (
              <Link key={assignment.id} to="/student/assignments" className="block rounded-xl border border-navy-100 p-3 transition hover:bg-navy-50/60">
                <p className="text-sm font-bold text-navy-900">{assignment.title}</p>
                <p className="text-xs text-slate-400">{assignment.subject} &bull; due {assignment.deadline}</p>
              </Link>
            ))}
            {!(data?.assignments || []).length && <p className="text-sm text-slate-400">No assignments have been posted for your class.</p>}
          </div>
        </Card>
      </div>
    </div>
  )
}
