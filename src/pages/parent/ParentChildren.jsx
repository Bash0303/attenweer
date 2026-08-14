import { Users, ChevronRight } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import ProgressBar from '../../components/ui/ProgressBar'
import StatCard from '../../components/ui/StatCard'

const kids = [
  { name: 'Abdullahi Jimoh', className: 'SS 2A', studentId: 'WGS/2025/00101', section: 'Secondary', attendance: 94, average: 78, fees: 85000, initials: 'AJ', color: 'bg-navy-600' },
  { name: 'Abdulrahman Adeleke', className: 'JSS 3B', studentId: 'WGS/2023/00880', section: 'Secondary', attendance: 91, average: 72, fees: 105000, initials: 'AA', color: 'bg-emerald-600' },
  { name: 'Musa Mohammed', className: 'Primary 5', studentId: 'WGS/2022/00610', section: 'Primary', attendance: 96, average: 84, fees: 25000, initials: 'MM', color: 'bg-gold-500' },
]

export default function ParentChildren() {
  return (
    <div>
      <PageHeader title="My Children" subtitle="All children linked to your parent account" />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={Users} label="Children Enrolled" value="3" sub="2 secondary • 1 primary" tone="navy" index={0} />
        <StatCard icon={Users} label="Good Standing" value="3 / 3" sub="all active" tone="emerald" index={1} />
        <StatCard icon={Users} label="Total Fees Owed" value="₦215,000" sub="across all wards" tone="rose" index={2} />
      </div>

      <div className="space-y-5">
        {kids.map((k) => (
          <Card key={k.name} hover className="p-6">
            <div className="flex flex-wrap items-center gap-5">
              <Avatar initials={k.initials} color={k.color} size="lg" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-extrabold text-navy-900">{k.name}</h3>
                  <Badge color="navy">{k.className}</Badge>
                  <Badge color={k.section === 'Primary' ? 'emerald' : 'gold'}>{k.section}</Badge>
                </div>
                <p className="mt-0.5 font-mono text-xs text-slate-400">{k.studentId}</p>
              </div>
              <button className="inline-flex items-center gap-1 rounded-xl bg-navy-800 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-navy-900 active:scale-95">
                View Profile <ChevronRight size={16} />
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-navy-100 p-4">
                <div className="flex justify-between text-sm"><span className="font-medium text-slate-600">Attendance</span><span className="font-bold text-emerald-600">{k.attendance}%</span></div>
                <ProgressBar value={k.attendance} color="bg-emerald-500" className="mt-2" />
              </div>
              <div className="rounded-xl border border-navy-100 p-4">
                <div className="flex justify-between text-sm"><span className="font-medium text-slate-600">Average Score</span><span className="font-bold text-navy-900">{k.average}%</span></div>
                <ProgressBar value={k.average} color="bg-navy-600" className="mt-2" />
              </div>
              <div className="rounded-xl border border-navy-100 p-4">
                <div className="flex justify-between text-sm"><span className="font-medium text-slate-600">Fees Balance</span><span className="font-bold text-rose-600">₦{k.fees.toLocaleString()}</span></div>
                <ProgressBar value={k.fees ? Math.min(100, 100 - k.fees / 185000 * 100) : 100} color="bg-gold-500" className="mt-2" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}