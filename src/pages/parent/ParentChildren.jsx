import { ChevronRight, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import ProgressBar from '../../components/ui/ProgressBar'
import StatCard from '../../components/ui/StatCard'
import { EmptyBlock, ErrorBlock, LoadBlock, money, useParentChildren } from './parentUtils'

export default function ParentChildren() {
  const navigate = useNavigate()
  const { children, loading, error, reload } = useParentChildren()

  if (loading) return <LoadBlock label="Loading your children..." />
  if (error) return <ErrorBlock message={error} onRetry={reload} />
  if (!children.length) {
    return (
      <div>
        <PageHeader title="My Children" subtitle="All children linked to your parent account" />
        <EmptyBlock title="No children linked yet" message="Ask the school administrator to link your parent account to your children." />
      </div>
    )
  }

  const totalBalance = children.reduce((sum, child) => sum + Number(child.fees.balance || 0), 0)
  const active = children.filter((child) => child.status === 'Active').length

  const openChild = (id, path) => {
    sessionStorage.setItem('wgs.parentChild', String(id))
    navigate(path)
  }

  return (
    <div>
      <PageHeader title="My Children" subtitle="All children linked to your parent account" />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={Users} label="Children Enrolled" value={children.length} sub={`${active} active`} tone="navy" index={0} />
        <StatCard icon={Users} label="Good Standing" value={`${active} / ${children.length}`} sub="active students" tone="emerald" index={1} />
        <StatCard icon={Users} label="Total Fees Owed" value={money(totalBalance)} sub="across all wards" tone={totalBalance > 0 ? 'rose' : 'emerald'} index={2} />
      </div>

      <div className="space-y-5">
        {children.map((child) => (
          <Card key={child.id} hover className="p-6">
            <div className="flex flex-wrap items-center gap-5">
              <Avatar initials={child.initials} color={child.color} size="lg" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-extrabold text-navy-900">{child.name}</h3>
                  <Badge color="navy">{child.className}</Badge>
                  <Badge color={child.section === 'Primary' ? 'emerald' : 'gold'}>{child.section}</Badge>
                  <Badge color={child.status === 'Active' ? 'emerald' : 'slate'} dot>{child.status}</Badge>
                </div>
                <p className="mt-0.5 font-mono text-xs text-slate-400">{child.studentId}</p>
              </div>
              <button onClick={() => openChild(child.id, '/parent/results')} className="inline-flex items-center gap-1 rounded-xl bg-navy-800 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-navy-900 active:scale-95">
                View Results <ChevronRight size={16} />
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-navy-100 p-4">
                <div className="flex justify-between text-sm"><span className="font-medium text-slate-600">Attendance</span><span className="font-bold text-emerald-600">{child.attendance.rate}%</span></div>
                <ProgressBar value={child.attendance.rate} color="bg-emerald-500" className="mt-2" />
                <p className="mt-2 text-xs text-slate-400">{child.attendance.total} school days recorded</p>
              </div>
              <div className="rounded-xl border border-navy-100 p-4">
                <div className="flex justify-between text-sm"><span className="font-medium text-slate-600">Average Score</span><span className="font-bold text-navy-900">{child.average === null ? 'N/A' : `${child.average}%`}</span></div>
                <ProgressBar value={child.average || 0} color="bg-navy-600" className="mt-2" />
                <p className="mt-2 text-xs text-slate-400">{child.grade ? `Grade ${child.grade}` : 'No approved results yet'}</p>
              </div>
              <button onClick={() => openChild(child.id, '/parent/fees')} className="rounded-xl border border-navy-100 p-4 text-left transition hover:border-navy-300">
                <div className="flex justify-between text-sm"><span className="font-medium text-slate-600">Fees Balance</span><span className={`font-bold ${child.fees.balance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{money(child.fees.balance)}</span></div>
                <ProgressBar value={child.fees.rate} color={child.fees.balance > 0 ? 'bg-gold-500' : 'bg-emerald-500'} className="mt-2" />
                <p className="mt-2 text-xs text-slate-400">{money(child.fees.paid)} paid of {money(child.fees.due)}</p>
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
