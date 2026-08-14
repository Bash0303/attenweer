import { motion } from 'framer-motion'
import { School, Users, ClipboardCheck, PenSquare, BookMarked, FileText, Clock, Sparkles, TrendingUp } from 'lucide-react'
import StatCard from '../../components/ui/StatCard'
import Card from '../../components/ui/Card'
import Badge, { statusColor } from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import ProgressBar from '../../components/ui/ProgressBar'
import { BarsChart } from '../../components/ui/Charts'
import { useAuth } from '../../context/AuthContext'
import { students, teacherClasses, assignments, staffAttendance, school } from '../../data/mock'

const hour = new Date().getHours()
const greeting = hour < 12 ? 'Good Morning' : hour < 16 ? 'Good Afternoon' : 'Good Evening'

export default function TeacherDashboard() {
  const { user } = useAuth()

  const stats = [
    { icon: School, label: 'My Classes', value: teacherClasses.length, sub: 'SS 2A • SS 3A', tone: 'navy' },
    { icon: Users, label: 'My Students', value: 72, sub: 'across 2 classes', tone: 'emerald' },
    { icon: ClipboardCheck, label: "Today's Attendance", value: '93%', sub: '67 present', tone: 'gold' },
    { icon: PenSquare, label: 'Pending Marking', value: 14, sub: 'assignments', tone: 'amber' },
    { icon: BookMarked, label: 'Exams to Enter', value: 12, sub: 'scores', tone: 'violet' },
    { icon: FileText, label: 'Results to Submit', value: 2, sub: 'classes', tone: 'rose' },
  ]

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-900 p-6 text-white shadow-lift sm:p-8">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 85% 20%, #d9a62e 0%, transparent 40%)' }} />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-emerald-300"><Sparkles size={15} /> Teacher Portal</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">{greeting}, {user?.name} 👋</h1>
            <p className="mt-1.5 text-sm text-emerald-50/80">SS 2A & SS 3A • {school.session} • {school.term}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-3">
            {[['Next Period', 'English 8:40'], ['Today', '5 periods'], ['Pending Marking', '14']].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur"><p className="text-lg font-extrabold text-emerald-200">{v}</p><p className="text-[11px] text-emerald-50/70">{k}</p></div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((s, i) => <StatCard key={s.label} {...s} index={i} />)}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-navy-900">My Class Attitude & Performance</h3>
              <p className="text-xs text-slate-400">Attendance rate by class (this term)</p>
            </div>
            <Badge color="emerald" dot>Improving</Badge>
          </div>
          <BarsChart data={staffAttendance.map(s => ({ name: s.className, present: s.present }))} dataKey="present" xKey="name" color="#10b981" height={260} suffix="" />
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2"><Clock size={18} className="text-gold-500" /><h3 className="font-bold text-navy-900">Today's Schedule</h3></div>
          <div className="mt-4 space-y-3">
            {[
              ['8:40 – 9:20', 'English Language', 'SS 2A', 'bg-emerald-600'],
              ['9:50 – 10:30', 'English Language', 'SS 3A', 'bg-navy-700'],
              ['11:10 – 11:50', 'Literature', 'SS 2A', 'bg-gold-500'],
            ].map(([t, sub, cls, c]) => (
              <div key={sub} className="flex items-center gap-3 rounded-xl border border-navy-100 p-3">
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-xs font-bold text-white ${c}`}>{t.split('–')[0].trim()}</span>
                <div>
                  <p className="text-sm font-bold text-navy-900">{sub}</p>
                  <p className="text-xs text-slate-400">{cls}</p>
                </div>
                <Badge color="slate" dot>Room 12</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-navy-100 px-6 py-4">
            <h3 className="font-bold text-navy-900">Recent Assignments</h3>
            <button className="text-sm font-semibold text-navy-700 hover:text-navy-900">Manage →</button>
          </div>
          <div className="divide-y divide-navy-50">
            {assignments.slice(0, 4).map((a) => (
              <div key={a.id} className="flex items-center gap-3 px-6 py-3.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-cream-100 text-navy-700"><PenSquare size={16} /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy-900">{a.title}</p>
                  <p className="text-xs text-slate-400">{a.className} • {a.subject} • deadline {a.deadline}</p>
                </div>
                <Badge color={statusColor(a.status)} dot>{a.status}</Badge>
                <span className="text-xs font-semibold text-navy-700">{a.submissions}/34</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-navy-900">My Class Average</h3>
          <p className="text-xs text-slate-400">Term-to-date student performance</p>
          <div className="mt-4 space-y-4">
            {[{ cls: 'SS 2A', avg: 71 }, { cls: 'SS 3A', avg: 74 }].map((c) => (
              <div key={c.cls}>
                <div className="mb-1 flex justify-between text-sm"><span className="font-semibold text-navy-800">{c.cls}</span><span className="font-bold text-emerald-600">{c.avg}%</span></div>
                <ProgressBar value={c.avg} color="bg-emerald-500" />
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-xl bg-cream-100/70 p-4">
            <p className="flex items-center gap-2 text-sm font-bold text-navy-800"><TrendingUp size={16} className="text-emerald-600" /> Top Student</p>
            <div className="mt-2 flex items-center gap-3">
              <Avatar initials="AM" color="bg-violet-600" size="sm" />
              <div><p className="text-sm font-semibold text-navy-900">Aisha Mohammed</p><p className="text-xs text-slate-400">SS 2A • 87% average</p></div>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {students.slice(0, 4).map((s) => (
          <Card key={s.id} hover className="p-4">
            <div className="flex items-center gap-3">
              <Avatar initials={s.initials} color={s.color} size="sm" />
              <div className="min-w-0"><p className="truncate text-sm font-bold text-navy-900">{s.name}</p><p className="text-xs text-slate-400">{s.className}</p></div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <Badge color={statusColor(s.status)} dot>{s.status}</Badge>
              <span className="text-xs font-semibold text-navy-700">View →</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}