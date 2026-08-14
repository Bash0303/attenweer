import { motion } from 'framer-motion'
import { ClipboardCheck, FileText, PenSquare, Wallet, Sparkles, CalendarDays, TrendingUp, Clock } from 'lucide-react'
import StatCard from '../../components/ui/StatCard'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import ProgressBar from '../../components/ui/ProgressBar'
import { BarsChart, DonutChart } from '../../components/ui/Charts'
import { useAuth } from '../../context/AuthContext'
import { students, attendanceRate, attendanceData, balanceOwed, totalFees, resultData, resultSummary, studentAssignments, announcementsForStudent, notifications, timetable, school } from '../../data/mock'

const hour = new Date().getHours()
const greeting = hour < 12 ? 'Good Morning' : hour < 16 ? 'Good Afternoon' : 'Good Evening'

const attendanceChart = [
  { name: 'Present', value: attendanceData.present, color: '#10b981' },
  { name: 'Late', value: attendanceData.late, color: '#d9a62e' },
  { name: 'Absent', value: attendanceData.absent, color: '#ef4444' },
]

export default function StudentDashboard() {
  const { user } = useAuth()
  const me = students[0]
  const sum = resultSummary(resultData['SS 2A'])
  const pending = studentAssignments.filter((a) => a.status === 'Pending').length

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-navy-900 via-navy-800 to-navy-950 p-6 text-white shadow-lift sm:p-8">
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle at 85% 20%, #d9a62e 0%, transparent 40%)' }} />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gold-500 text-lg font-extrabold text-navy-950">JD</span>
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-gold-400"><Sparkles size={14} /> Student Portal</p>
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{greeting}, {user?.name?.split(' ')[0]} 👋</h1>
              <p className="mt-1 text-sm text-cream-100/70">{me.className} • {me.studentId} • {school.session}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
            {[['Attendance', `${attendanceRate}%`], ['Average', `${sum.average}%`], ['Pending Tasks', pending], ['Fees Owed', `₦${balanceOwed.toLocaleString()}`]].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-white/10 px-3 py-3 backdrop-blur"><p className="text-lg font-extrabold text-gold-400">{v}</p><p className="text-[11px] text-cream-100/70">{k}</p></div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={ClipboardCheck} label="Attendance Rate" value={`${attendanceRate}%`} sub="this term" tone="emerald" index={0} />
        <StatCard icon={FileText} label="Class Average" value={`${sum.average}%`} sub="position 4th" tone="navy" index={1} />
        <StatCard icon={PenSquare} label="Pending Assignments" value={pending} sub="3 due this week" tone="amber" index={2} />
        <StatCard icon={Wallet} label="Outstanding Fees" value={`₦${balanceOwed.toLocaleString()}`} sub="deadline 30 Sep" tone="rose" index={3} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div><h3 className="font-bold text-navy-900">My Performance</h3><p className="text-xs text-slate-400">Class average per subject — {school.term}</p></div>
            <Badge color="emerald" dot>Published</Badge>
          </div>
          <BarsChart data={resultData['SS 2A'].slice(0, 8).map((r) => ({ name: r.subject.split(' ')[0], average: r.total }))} dataKey="average" xKey="name" color="#2a478e" height={280} suffix="" />
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-navy-900">This Term Attendance</h3>
          <p className="text-xs text-slate-400">August attendance summary</p>
          <DonutChart data={attendanceChart} height={230} centerValue={`${attendanceRate}%`} centerLabel="Rate" />
          <div className="space-y-2">
            {[['Present', attendanceData.present], ['Late', attendanceData.late], ['Absent', attendanceData.absent]].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-600">{k}</span>
                <span className="font-bold text-navy-900">{v} days</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-navy-100 px-6 py-4">
            <h3 className="font-bold text-navy-900">Today's Timetable</h3>
            <button className="text-sm font-semibold text-navy-700 hover:text-navy-900">Full timetable →</button>
          </div>
          <div className="grid gap-3 p-6 sm:grid-cols-2 lg:grid-cols-4">
            {timetable.slice(0, 4).map((row) => (
              <div key={row.time} className="rounded-xl border border-navy-100 p-3">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-gold-600"><Clock size={12} /> {row.time}</p>
                {['mon', 'tue', 'wed', 'thu'].map((d) => row[d] !== 'Break' && (
                  <p key={d} className="mt-1.5 text-sm font-semibold text-navy-800">{row[d]} <span className="text-[10px] font-medium uppercase text-slate-400">{d}</span></p>
                ))}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2"><CalendarDays size={18} className="text-gold-500" /><h3 className="font-bold text-navy-900">Upcoming</h3></div>
          <div className="mt-4 space-y-3">
            {[
              ['20 Aug', 'Assignment due', 'Mathematics'],
              ['21 Sep', 'First Term Exam', 'All subjects'],
              ['8 Sep', 'Second Term', 'Resumption'],
            ].map(([d, t, s]) => (
              <div key={d} className="flex items-center gap-3 rounded-xl border border-navy-100 p-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cream-100 text-xs font-extrabold text-navy-800">{d.split(' ')[0]}<br />{d.split(' ')[1]}</span>
                <div><p className="text-sm font-bold text-navy-900">{t}</p><p className="text-xs text-slate-400">{s}</p></div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-cream-100/70 p-4">
            <p className="flex items-center gap-2 text-sm font-bold text-navy-800"><TrendingUp size={15} className="text-emerald-600" /> Best Subject</p>
            <p className="mt-1 text-sm text-slate-500">{sum.best} — {resultData['SS 2A'].find((r) => r.subject === sum.best)?.grade} grade</p>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-navy-100 px-6 py-4">
            <h3 className="font-bold text-navy-900">Recent Announcements</h3>
            <button className="text-sm font-semibold text-navy-700 hover:text-navy-900">View all →</button>
          </div>
          <div className="divide-y divide-navy-50">
            {announcementsForStudent.map((a) => (
              <div key={a.id} className="flex items-center gap-3 px-6 py-3.5">
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${a.read ? 'bg-slate-100 text-slate-400' : 'bg-navy-50 text-navy-700'}`}><CalendarDays size={16} /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy-900">{a.title}</p>
                  <p className="text-xs text-slate-400">{a.date}</p>
                </div>
                {!a.read && <span className="h-2 w-2 rounded-full bg-navy-600" />}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-navy-900">Fees Balance</h3>
            <Badge color="rose" dot>₦{balanceOwed.toLocaleString()} owed</Badge>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-navy-900">₦{balanceOwed.toLocaleString()}</p>
          <p className="text-xs text-slate-400">of ₦{totalFees.toLocaleString()} • paid ₦100,000</p>
          <ProgressBar value={Math.round(100000 / totalFees * 100)} color="bg-gold-500" className="mt-3" />
          <div className="mt-4 flex justify-end"><button className="rounded-xl bg-navy-800 px-4 py-2 text-sm font-bold text-white transition hover:bg-navy-900 active:scale-95">Pay Now →</button></div>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {notifications.slice(0, 4).map((n) => (
          <Card key={n.id} className="p-4">
            <div className="flex items-start gap-3">
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${n.read ? 'bg-slate-100 text-slate-400' : 'bg-navy-50 text-navy-700'}`}><Sparkles size={15} /></span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-navy-900">{n.title}</p>
                <p className="text-xs text-slate-400">{n.time}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}