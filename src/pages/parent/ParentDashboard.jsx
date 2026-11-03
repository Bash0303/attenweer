import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, ClipboardCheck, FileText, HeartHandshake, TrendingUp, Users, Wallet } from 'lucide-react'
import { Link } from 'react-router-dom'
import StatCard from '../../components/ui/StatCard'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import ProgressBar from '../../components/ui/ProgressBar'
import { DonutChart } from '../../components/ui/Charts'
import ChildSwitcher from './ChildSwitcher'
import { EmptyBlock, ErrorBlock, LoadBlock, money, useParentChildren } from './parentUtils'
import { parent } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const hour = new Date().getHours()
const greeting = hour < 12 ? 'Good Morning' : hour < 16 ? 'Good Afternoon' : 'Good Evening'

export default function ParentDashboard() {
  const { user } = useAuth()
  const { children, child, childId, setChildId, loading, error, reload } = useParentChildren()
  const [announcements, setAnnouncements] = useState([])

  useEffect(() => {
    let cancelled = false

    parent.announcements()
      .then((res) => {
        if (!cancelled) setAnnouncements(res.data || [])
      })
      .catch(() => {
        if (!cancelled) setAnnouncements([])
      })

    return () => { cancelled = true }
  }, [])

  if (loading) return <LoadBlock label="Loading your family dashboard..." />
  if (error) return <ErrorBlock message={error} onRetry={reload} />
  if (!children.length) {
    return <EmptyBlock title="No children linked yet" message="Ask the school administrator to link your parent account to your children. Their attendance, results, fees and timetable will appear here." />
  }

  const totalBalance = children.reduce((sum, item) => sum + Number(item.fees.balance || 0), 0)
  const activeCount = children.filter((item) => item.status === 'Active').length
  const chart = [
    { name: 'Present', value: child.attendance.present, color: '#10b981' },
    { name: 'Late', value: child.attendance.late, color: '#d9a62e' },
    { name: 'Absent', value: child.attendance.absent, color: '#ef4444' },
  ]

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-gold-600 via-amber-700 to-navy-900 p-6 text-white shadow-lift sm:p-8">
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle at 85% 20%, #fff 0%, transparent 40%)' }} />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-cream-100"><HeartHandshake size={15} /> Parent Portal</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">{greeting}, {user?.name?.split(' ')[0] || 'Parent'}</h1>
            <p className="mt-1.5 text-sm text-cream-100/80">Stay informed about your wards' learning journey.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-3">
            <div className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur"><p className="text-lg font-extrabold text-cream-100">{children.length}</p><p className="text-[11px] text-cream-100/70">Children</p></div>
            <div className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur"><p className="text-lg font-extrabold text-cream-100">{activeCount}/{children.length}</p><p className="text-[11px] text-cream-100/70">Active</p></div>
            <div className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur"><p className="text-lg font-extrabold text-cream-100">{money(totalBalance)}</p><p className="text-[11px] text-cream-100/70">Fees Balance</p></div>
          </div>
        </div>
      </motion.div>

      <ChildSwitcher children={children} value={childId} onChange={setChildId} />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={ClipboardCheck} label={`Attendance (${child.name.split(' ')[0]})`} value={`${child.attendance.rate}%`} sub={`${child.attendance.total} school days`} tone="emerald" index={0} />
        <StatCard icon={FileText} label="Average Score" value={child.average === null ? 'N/A' : `${child.average}%`} sub={child.grade ? `grade ${child.grade}` : 'no results yet'} tone="navy" index={1} />
        <StatCard icon={Wallet} label={`Fees Owed (${child.name.split(' ')[0]})`} value={money(child.fees.balance)} sub={`${child.fees.rate}% paid`} tone={child.fees.balance > 0 ? 'rose' : 'emerald'} index={2} />
        <StatCard icon={Users} label="Children Enrolled" value={children.length} sub={`${activeCount} active`} tone="gold" index={3} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="p-6">
          <h3 className="font-bold text-navy-900">{child.name.split(' ')[0]}'s Attendance</h3>
          <p className="text-xs text-slate-400">Across recorded school days</p>
          {child.attendance.total ? (
            <>
              <DonutChart data={chart} height={220} centerValue={`${child.attendance.rate}%`} centerLabel="Rate" />
              <div className="space-y-1.5">
                {[['Present', child.attendance.present], ['Late', child.attendance.late], ['Absent', child.attendance.absent]].map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm"><span className="font-medium text-slate-600">{key}</span><span className="font-bold text-navy-900">{value} days</span></div>
                ))}
              </div>
            </>
          ) : (
            <p className="mt-6 rounded-xl bg-cream-100/70 p-4 text-sm text-slate-500">Attendance has not been recorded yet.</p>
          )}
        </Card>

        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div><h3 className="font-bold text-navy-900">School Announcements</h3><p className="text-xs text-slate-400">Official notices for parents</p></div>
            <Link to="/parent/announcements" className="text-xs font-bold text-navy-700 hover:text-navy-900">View all</Link>
          </div>
          <div className="mt-4 space-y-3">
            {announcements.slice(0, 4).map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-xl border border-navy-100 p-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-navy-50 text-navy-700"><Bell size={16} /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy-900">{item.title}</p>
                  <p className="truncate text-xs text-slate-400">{item.date} &middot; {item.author || 'School office'}</p>
                </div>
                <Badge color="slate">{item.tag}</Badge>
              </div>
            ))}
            {!announcements.length && <p className="rounded-xl bg-cream-100/70 p-4 text-sm text-slate-500">No announcements have been published for parents yet.</p>}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-2"><TrendingUp size={18} className="text-gold-500" /><h3 className="font-bold text-navy-900">Monitoring Snapshot</h3></div>
          <div className="mt-3 space-y-3">
            <div className="rounded-xl bg-emerald-50 p-4">
              <p className="text-sm font-bold text-emerald-700">Attendance rate is {child.attendance.rate}%</p>
              <p className="text-xs text-emerald-600/80">{child.attendance.present} present, {child.attendance.late} late, {child.attendance.absent} absent.</p>
            </div>
            <div className={`rounded-xl p-4 ${child.fees.balance > 0 ? 'bg-rose-50' : 'bg-emerald-50'}`}>
              <p className={`text-sm font-bold ${child.fees.balance > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>{child.fees.balance > 0 ? `${money(child.fees.balance)} outstanding` : 'Fees fully paid'}</p>
              <p className={`text-xs ${child.fees.balance > 0 ? 'text-rose-600/80' : 'text-emerald-600/80'}`}>{money(child.fees.paid)} paid of {money(child.fees.due)} billed.</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-navy-900">Fees Overview</h3>
            <Badge color={totalBalance > 0 ? 'rose' : 'emerald'} dot>{money(totalBalance)} total owed</Badge>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {children.map((item) => (
              <div key={item.id} className="rounded-xl border border-navy-100 p-4">
                <p className="text-sm font-bold text-navy-900">{item.name}</p>
                <p className="mt-0.5 text-xs text-slate-400">{item.className} &middot; {item.fees.rate}% paid</p>
                <ProgressBar value={item.fees.rate} color={item.fees.balance > 0 ? 'bg-gold-500' : 'bg-emerald-500'} className="mt-3" />
                <p className={`mt-2 text-xs font-semibold ${item.fees.balance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{item.fees.balance > 0 ? `${money(item.fees.balance)} balance` : 'Fully paid'}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
