import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, GraduationCap, HeartHandshake, School, ClipboardCheck, Wallet, TrendingUp, ArrowUpRight, Sparkles } from 'lucide-react'
import StatCard from '../../components/ui/StatCard'
import Card from '../../components/ui/Card'
import Badge, { statusColor } from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import ProgressBar from '../../components/ui/ProgressBar'
import { BarsChart, DonutChart, LinesChart } from '../../components/ui/Charts'
import { useAuth } from '../../context/AuthContext'
import { admin } from '../../services/api'

const hour = new Date().getHours()
const greeting = hour < 12 ? 'Good Morning' : hour < 16 ? 'Good Afternoon' : 'Good Evening'

const money = (n) => `₦${Number(n || 0).toLocaleString()}`
const compactMoney = (n) => {
  const value = Number(n || 0)
  return value >= 1e6 ? `₦${(value / 1e6).toFixed(1)}M` : money(value)
}

const fallback = { stats: {}, populationTrend: [], genderSplit: [], feeCollectionTrend: [], performanceTrend: [], attendanceOverview: [], classPopulation: [], recentApplications: [], latestPayments: [], recentAnnouncements: [], latestStudents: [], school: {} }

export default function AdminDashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(fallback)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      setData((await admin.dashboard()) || fallback)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-navy-100 border-t-navy-700" /></div>
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <p className="text-sm font-medium text-rose-600">{error}</p>
        <button onClick={load} className="rounded-xl bg-navy-700 px-4 py-2 text-sm font-semibold text-white">Retry</button>
      </div>
    )
  }

  const { stats, school } = data
  const attendanceRows = data.attendanceOverview || []
  const attendanceTotal = attendanceRows.reduce((sum, row) => sum + Number(row.value || 0), 0)
  const genderSplit = (data.genderSplit || []).map((row, i) => ({
    name: row.label,
    value: Number(row.value || 0),
    color: i === 0 ? '#2a478e' : '#d9a62e',
  }))

  const cards = [
    { icon: Users, label: 'Total Students', value: Number(stats.totalStudents || 0).toLocaleString(), sub: 'enrolled', tone: 'navy' },
    { icon: GraduationCap, label: 'Total Teachers', value: stats.totalTeachers ?? 0, sub: 'staff', tone: 'emerald' },
    { icon: HeartHandshake, label: 'Total Parents', value: Number(stats.totalParents || 0).toLocaleString(), sub: 'guardians', tone: 'gold' },
    { icon: School, label: 'Total Classes', value: stats.totalClasses ?? 0, sub: 'arms', tone: 'sky' },
    { icon: ClipboardCheck, label: "Today's Attendance", value: `${stats.attendanceToday ?? 0}%`, sub: 'present & late', tone: 'emerald' },
    { icon: Wallet, label: 'Outstanding Fees', value: compactMoney(stats.outstandingFees), sub: 'unpaid', tone: 'rose' },
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
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">{greeting}, {user?.name?.split(' ')[1] || 'Administrator'}</h1>
            <p className="mt-1.5 text-sm text-cream-100/70">Here is what is happening across {school.name || 'your school'} today.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-3">
            {[['Session', school.session || '—'], ['Current Term', school.term || '—'], ['Pending Apps', stats.pendingApplications ?? 0]].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur">
                <p className="text-lg font-extrabold text-gold-400">{v}</p>
                <p className="text-[11px] text-cream-100/70">{k}</p>
              </div>
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
              <h3 className="font-bold text-navy-900">Student Population</h3>
              <p className="text-xs text-slate-400">Growth across academic sessions</p>
            </div>
            <Badge color="emerald"><ArrowUpRight size={12} /> Live data</Badge>
          </div>
          <LinesChart data={data.populationTrend || []} series={[{ key: 'students', label: 'Students' }]} height={280} />
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-navy-900">Male vs Female</h3>
          <p className="text-xs text-slate-400">Current session distribution</p>
          <DonutChart data={genderSplit} height={240} centerValue={Number(stats.totalStudents || 0).toLocaleString()} centerLabel="Students" />
          <div className="mt-2 space-y-2">
            {genderSplit.map((d) => (
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
          <BarsChart
            data={(data.feeCollectionTrend || []).map((row) => ({ month: row.month, amount: Number(((row.amount || 0) / 1e6).toFixed(2)) }))}
            dataKey="amount"
            xKey="month"
            color="#d9a62e"
            height={240}
            suffix="M"
          />
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-navy-900">Academic Performance</h3>
          <p className="text-xs text-slate-400">Class average this term</p>
          <BarsChart
            data={(data.performanceTrend || []).map((row) => ({ name: row.class, average: row.average }))}
            dataKey="average"
            xKey="name"
            color="#10b981"
            height={240}
            suffix="%"
          />
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-navy-900">Attendance Overview</h3>
              <p className="text-xs text-slate-400">Today across the school</p>
            </div>
            <Badge color="emerald" dot>{stats.attendanceToday ?? 0}%</Badge>
          </div>
          <div className="space-y-4">
            {attendanceRows.map((row, i) => {
              const pct = attendanceTotal ? Math.round((Number(row.value || 0) / attendanceTotal) * 100) : 0
              return (
                <div key={row.label}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium text-slate-600">{row.label}</span>
                    <span className="font-bold text-navy-900">{pct}%</span>
                  </div>
                  <ProgressBar value={pct} color={['bg-emerald-500', 'bg-amber-400', 'bg-rose-500'][i] || 'bg-navy-600'} />
                </div>
              )
            })}
            {!attendanceRows.length && <p className="text-sm text-slate-400">No attendance recorded today.</p>}
          </div>
          <div className="mt-6 rounded-xl bg-cream-100/70 p-4">
            <p className="flex items-center gap-2 text-sm font-bold text-navy-800">
              <TrendingUp size={16} className="text-emerald-600" /> Largest Class
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {(() => {
                const largest = [...(data.classPopulation || [])].sort((a, b) => b.students - a.students)[0]
                return largest ? `${largest.name} — ${largest.students} students` : 'No class data yet'
              })()}
            </p>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-navy-100 px-6 py-4">
            <h3 className="font-bold text-navy-900">Recent Applications</h3>
          </div>
          <div className="divide-y divide-navy-50">
            {(data.recentApplications || []).map((a) => (
              <div key={a.code} className="flex items-center gap-3 px-6 py-3.5">
                <Avatar initials={(a.name || '').split(' ').map((x) => x[0]).slice(0, 2).join('')} size="sm" color="bg-navy-600" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy-900">{a.name}</p>
                  <p className="text-xs text-slate-400">{a.code} • {a.className || '—'} • {a.date}</p>
                </div>
                <Badge color={statusColor(a.status)} dot>{a.status}</Badge>
              </div>
            ))}
            {!data.recentApplications?.length && <p className="px-6 py-8 text-center text-sm text-slate-400">No applications yet.</p>}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between border-b border-navy-100 px-6 py-4">
            <h3 className="font-bold text-navy-900">Latest Payments</h3>
          </div>
          <div className="divide-y divide-navy-50">
            {(data.latestPayments || []).map((p) => (
              <div key={p.code} className="px-6 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-navy-900">{p.student}</p>
                  <p className="text-sm font-bold text-navy-900">{money(p.amount)}</p>
                </div>
                <div className="mt-0.5 flex items-center justify-between">
                  <p className="text-xs text-slate-400">{p.purpose} • {p.date}</p>
                  <Badge color={statusColor(p.status)}>{p.status}</Badge>
                </div>
              </div>
            ))}
            {!data.latestPayments?.length && <p className="px-6 py-8 text-center text-sm text-slate-400">No payments yet.</p>}
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <div className="flex items-center justify-between border-b border-navy-100 px-6 py-4">
          <h3 className="font-bold text-navy-900">Recent Announcements</h3>
        </div>
        <div className="grid gap-4 p-6 md:grid-cols-2">
          {(data.recentAnnouncements || []).map((a) => (
            <div key={a.title} className="rounded-xl border border-navy-100 p-4">
              <div className="flex items-center gap-2 text-xs text-gold-600">
                <Badge color="gold">{a.tag}</Badge> {a.date}
              </div>
              <h4 className="mt-2 font-bold text-navy-900">{a.title}</h4>
              <p className="mt-1 text-sm text-slate-500">{a.type}</p>
            </div>
          ))}
          {!data.recentAnnouncements?.length && <p className="text-sm text-slate-400">No announcements yet.</p>}
        </div>
      </Card>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(data.latestStudents || []).map((s) => (
          <Card key={s.studentId} hover className="p-4">
            <div className="flex items-center gap-3">
              <Avatar initials={s.initials} color={s.color} />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-navy-900">{s.name}</p>
                <p className="text-xs text-slate-400">{s.className || '—'} • {s.studentId}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
