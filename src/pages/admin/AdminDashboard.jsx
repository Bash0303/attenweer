import { motion } from 'framer-motion'
import { Users, GraduationCap, HeartHandshake, School, ClipboardCheck, Wallet, TrendingUp, ArrowUpRight, Sparkles } from 'lucide-react'
import StatCard from '../../components/ui/StatCard'
import Card from '../../components/ui/Card'
import Badge, { statusColor } from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import ProgressBar from '../../components/ui/ProgressBar'
import { BarsChart, DonutChart, LinesChart } from '../../components/ui/Charts'
import { useAuth } from '../../context/AuthContext'
import {
  adminStats, students, payments, recentApplications, announcements,
  studentPopulationTrend, feeCollectionTrend, classPopulation, maleFemale, attendanceRate, performanceTrend,
} from '../../data/mock'

const hour = new Date().getHours()
const greeting = hour < 12 ? 'Good Morning' : hour < 16 ? 'Good Afternoon' : 'Good Evening'

const feeLabel = (n) => `₦${(n / 1e6).toFixed(1)}M`

export default function AdminDashboard() {
  const { user } = useAuth()

  const stats = [
    { icon: Users, label: 'Total Students', value: adminStats.totalStudents.toLocaleString(), sub: '+8%', tone: 'navy' },
    { icon: GraduationCap, label: 'Total Teachers', value: adminStats.totalTeachers, sub: '+3%', tone: 'emerald' },
    { icon: HeartHandshake, label: 'Total Parents', value: adminStats.totalParents.toLocaleString(), sub: '+5%', tone: 'gold' },
    { icon: School, label: 'Total Classes', value: adminStats.totalClasses, sub: '42 arms', tone: 'sky' },
    { icon: ClipboardCheck, label: "Today's Attendance", value: `${adminStats.attendanceToday}%`, sub: '1120 present', tone: 'emerald' },
    { icon: Wallet, label: 'Outstanding Fees', value: feeLabel(adminStats.outstandingFees), sub: '183 debtors', tone: 'rose' },
  ]

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-navy-900 via-navy-800 to-navy-950 p-6 text-white shadow-lift sm:p-8"
      >
        <div className="absolute inset-0 opacity-15"
          style={{ backgroundImage: 'radial-gradient(circle at 90% 20%, #d9a62e 0%, transparent 40%)' }}
        />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-gold-400">
              <Sparkles size={15} /> {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">{greeting}, {user?.name?.split(' ')[1] || 'Administrator'} 👋</h1>
            <p className="mt-1.5 text-sm text-cream-100/70">Here is what is happening across Witty Secondary School today.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-3">
            {[['Approved Results', '100%'], ['Classes Today', '42'], ['Pending Apps', '2']].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur">
                <p className="text-lg font-extrabold text-gold-400">{v}</p>
                <p className="text-[11px] text-cream-100/70">{k}</p>
              </div>
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
              <h3 className="font-bold text-navy-900">Student Population</h3>
              <p className="text-xs text-slate-400">Growth across academic sessions</p>
            </div>
            <Badge color="emerald"><ArrowUpRight size={12} /> +22% YoY</Badge>
          </div>
          <LinesChart data={studentPopulationTrend} series={[{ key: 'students', label: 'Students' }]} height={280} />
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-navy-900">Male vs Female</h3>
          <p className="text-xs text-slate-400">Current session distribution</p>
          <DonutChart data={maleFemale} height={240} centerValue={adminStats.totalStudents.toLocaleString()} centerLabel="Students" />
          <div className="mt-2 space-y-2">
            {maleFemale.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-medium text-slate-600">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} /> {d.name}
                </span>
                <span className="font-bold text-navy-900">{d.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="p-6">
          <h3 className="font-bold text-navy-900">Fee Collection</h3>
          <p className="text-xs text-slate-400">Monthly collections (₦ millions)</p>
          <BarsChart data={feeCollectionTrend} dataKey="amount" xKey="month" color="#d9a62e" height={240} suffix="M" />
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-navy-900">Academic Performance</h3>
          <p className="text-xs text-slate-400">Class average by term</p>
          <BarsChart data={performanceTrend.map((t) => ({ name: `${t.term} Term`, average: t.average }))} dataKey="average" xKey="name" color="#10b981" height={240} suffix="%" />
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-navy-900">Attendance Overview</h3>
              <p className="text-xs text-slate-400">Today across the school</p>
            </div>
            <Badge color="emerald" dot>{attendanceRate}%</Badge>
          </div>
          <div className="space-y-4">
            {[['Present', 94, 'bg-emerald-500'], ['Late', 4, 'bg-amber-400'], ['Absent', 2, 'bg-rose-500']].map(([k, v, c]) => (
              <div key={k}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium text-slate-600">{k}</span>
                  <span className="font-bold text-navy-900">{v}%</span>
                </div>
                <ProgressBar value={v} color={c} />
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl bg-cream-100/70 p-4">
            <p className="flex items-center gap-2 text-sm font-bold text-navy-800">
              <TrendingUp size={16} className="text-emerald-600" /> Best Performing Class
            </p>
            <p className="mt-1 text-sm text-slate-500">SS 3A — {classPopulation.find(c => c.name === 'SS 3A')?.students} students, 98% attendance</p>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-navy-100 px-6 py-4">
            <h3 className="font-bold text-navy-900">Recent Applications</h3>
            <button className="text-sm font-semibold text-navy-700 hover:text-navy-900">View all →</button>
          </div>
          <div className="divide-y divide-navy-50">
            {recentApplications.map((a) => (
              <div key={a.id} className="flex items-center gap-3 px-6 py-3.5">
                <Avatar initials={a.name.split(' ').map(x => x[0]).slice(0, 2).join('')} size="sm" color="bg-navy-600" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy-900">{a.name}</p>
                  <p className="text-xs text-slate-400">{a.id} • {a.className} • {a.date}</p>
                </div>
                <Badge color={statusColor(a.status)} dot>{a.status}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between border-b border-navy-100 px-6 py-4">
            <h3 className="font-bold text-navy-900">Latest Payments</h3>
            <button className="text-sm font-semibold text-navy-700 hover:text-navy-900">All →</button>
          </div>
          <div className="divide-y divide-navy-50">
            {payments.slice(0, 4).map((p) => (
              <div key={p.id} className="px-6 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-navy-900">{p.student}</p>
                  <p className="text-sm font-bold text-navy-900">₦{p.amount.toLocaleString()}</p>
                </div>
                <div className="mt-0.5 flex items-center justify-between">
                  <p className="text-xs text-slate-400">{p.purpose} • {p.date}</p>
                  <Badge color={statusColor(p.status)}>{p.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <div className="flex items-center justify-between border-b border-navy-100 px-6 py-4">
          <h3 className="font-bold text-navy-900">Recent Announcements</h3>
          <button className="text-sm font-semibold text-navy-700 hover:text-navy-900">Manage →</button>
        </div>
        <div className="grid gap-4 p-6 md:grid-cols-2">
          {announcements.slice(0, 2).map((a) => (
            <div key={a.id} className="rounded-xl border border-navy-100 p-4">
              <div className="flex items-center gap-2 text-xs text-gold-600">
                <Badge color="gold">{a.tag}</Badge> {a.date} • {a.author}
              </div>
              <h4 className="mt-2 font-bold text-navy-900">{a.title}</h4>
              <p className="mt-1 text-sm text-slate-500">{a.message}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {students.slice(0, 4).map((s) => (
          <Card key={s.id} hover className="p-4">
            <div className="flex items-center gap-3">
              <Avatar initials={s.initials} color={s.color} />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-navy-900">{s.name}</p>
                <p className="text-xs text-slate-400">{s.className} • {s.studentId}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <Badge color="emerald" dot>Active</Badge>
              <span className="text-xs font-semibold text-navy-700">View →</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}