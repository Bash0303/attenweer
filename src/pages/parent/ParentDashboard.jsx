import { useState } from 'react'
import { motion } from 'framer-motion'
import { ClipboardCheck, FileText, PenSquare, Wallet, Sparkles, HeartHandshake, Bell, TrendingUp, AlertCircle } from 'lucide-react'
import StatCard from '../../components/ui/StatCard'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import ProgressBar from '../../components/ui/ProgressBar'
import { DonutChart } from '../../components/ui/Charts'
import ChildSwitcher from './ChildSwitcher'
import { useAuth } from '../../context/AuthContext'
import { attendanceRate, attendanceData, balanceOwed, resultData, resultSummary, notifications } from '../../data/mock'

const hour = new Date().getHours()
const greeting = hour < 12 ? 'Good Morning' : hour < 16 ? 'Good Afternoon' : 'Good Evening'

export default function ParentDashboard() {
  const { user } = useAuth()
  const [child, setChild] = useState('cjk')
  const sum = resultSummary(resultData['SS 2A'])
  const chart = [
    { name: 'Present', value: attendanceData.present, color: '#10b981' },
    { name: 'Late', value: attendanceData.late, color: '#d9a62e' },
    { name: 'Absent', value: attendanceData.absent, color: '#ef4444' },
  ]

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-gold-600 via-amber-700 to-navy-900 p-6 text-white shadow-lift sm:p-8">
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle at 85% 20%, #fff 0%, transparent 40%)' }} />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-cream-100"><HeartHandshake size={15} /> Parent Portal</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">{greeting}, {user?.name?.split(' ')[2] || user?.name} 👋</h1>
            <p className="mt-1.5 text-sm text-cream-100/80">Stay informed about your wards' learning journey.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-3">
            {[['Children', '3'], ['All Active', 'Good standing'], ['Fees Balance', `₦${balanceOwed.toLocaleString()}`]].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur"><p className="text-lg font-extrabold text-cream-100">{v}</p><p className="text-[11px] text-cream-100/70">{k}</p></div>
            ))}
          </div>
        </div>
      </motion.div>

      <ChildSwitcher value={child} onChange={setChild} />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={ClipboardCheck} label="Attendance (John)" value={`${attendanceRate}%`} sub="this term" tone="emerald" index={0} />
        <StatCard icon={FileText} label="Average Score" value={`${sum.average}%`} sub="position 4th" tone="navy" index={1} />
        <StatCard icon={PenSquare} label="Pending Assignments" value="2" sub="need attention" tone="amber" index={2} />
        <StatCard icon={Wallet} label="Fees Owed (John)" value={`₦${balanceOwed.toLocaleString()}`} sub="due 30 Sep" tone="rose" index={3} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="p-6">
          <h3 className="font-bold text-navy-900">John's Attendance</h3>
          <p className="text-xs text-slate-400">August attendance</p>
          <DonutChart data={chart} height={220} centerValue={`${attendanceRate}%`} centerLabel="Rate" />
          <div className="space-y-1.5">
            {[['Present', attendanceData.present], ['Late', attendanceData.late], ['Absent', attendanceData.absent]].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm"><span className="font-medium text-slate-600">{k}</span><span className="font-bold text-navy-900">{v} days</span></div>
            ))}
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div><h3 className="font-bold text-navy-900">Recent Activity Across Children</h3><p className="text-xs text-slate-400">Live from the school database</p></div>
            <Badge color="emerald" dot>Real-time</Badge>
          </div>
          <div className="mt-4 space-y-4">
            {[
              ['Abdullahi Jimoh', 'SS 2A', 'First Term result published', 'Today', 'result', 'bg-navy-50 text-navy-700'],
              ['Abdulrahman Adeleke', 'JSS 3B', 'Marked present today', 'Today', 'attendance', 'bg-emerald-50 text-emerald-600'],
              ['Abdullahi Jimoh', 'SS 2A', 'Assignment: Quadratic Equations due', '20 Aug', 'assignment', 'bg-amber-50 text-amber-600'],
              ['Musa Mohammed', 'Primary 5', 'Fee payment reminder', '14 Aug', 'fees', 'bg-rose-50 text-rose-600'],
            ].map(([n, c, t, d, type, tone]) => (
              <div key={t} className="flex items-center gap-3 rounded-xl border border-navy-100 p-3">
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${tone}`}>
                  {type === 'result' && <FileText size={16} />}
                  {type === 'attendance' && <ClipboardCheck size={16} />}
                  {type === 'assignment' && <PenSquare size={16} />}
                  {type === 'fees' && <Wallet size={16} />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy-900">{t}</p>
                  <p className="text-xs text-slate-400">{n} • {c} • {d}</p>
                </div>
                <Badge color="slate">{type}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-2"><Bell size={18} className="text-gold-500" /><h3 className="font-bold text-navy-900">Alert</h3></div>
          <div className="mt-3 flex items-start gap-3 rounded-xl bg-rose-50 p-4">
            <AlertCircle size={18} className="mt-0.5 shrink-0 text-rose-600" />
            <div>
              <p className="text-sm font-bold text-rose-700">John was marked Late today</p>
              <p className="text-xs text-rose-600/80">14 August 2026, 8:15am • Mathematics period</p>
            </div>
          </div>
          <div className="mt-3 flex items-start gap-3 rounded-xl bg-emerald-50 p-4">
            <TrendingUp size={18} className="mt-0.5 shrink-0 text-emerald-600" />
            <div>
              <p className="text-sm font-bold text-emerald-700">Excellent improvement in English</p>
              <p className="text-xs text-emerald-600/80">Mrs. Ramat Ibrahim • score improved 12%</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-navy-900">Fees Overview</h3>
            <Badge color="rose" dot>₦{balanceOwed.toLocaleString()} total owed</Badge>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {[
              ['Abdullahi Jimoh — SS 2A', 'Paid ₦100,000', 54, 'bg-emerald-500'],
              ['Abdulrahman Adeleke — JSS 3B', 'Paid ₦45,000', 30, 'bg-gold-500'],
              ['Musa Mohammed — Primary 5', 'Paid ₦90,000', 78, 'bg-navy-600'],
            ].map(([n, p, v, c]) => (
              <div key={n} className="rounded-xl border border-navy-100 p-4">
                <p className="text-sm font-bold text-navy-900">{n}</p>
                <p className="mt-0.5 text-xs text-slate-400">{p}</p>
                <ProgressBar value={v} color={c} className="mt-3" />
                <button className="mt-3 w-full rounded-lg bg-navy-800 py-2 text-xs font-bold text-white transition hover:bg-navy-900 active:scale-95">Pay Now</button>
              </div>
            ))}
          </div>
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