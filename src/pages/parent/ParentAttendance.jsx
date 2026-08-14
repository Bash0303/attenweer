import { useState } from 'react'
import { ClipboardCheck } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import StatCard from '../../components/ui/StatCard'
import ProgressBar from '../../components/ui/ProgressBar'
import ChildSwitcher from './ChildSwitcher'
import { attendanceData, attendanceRate } from '../../data/mock'

const days = ['Mon 1', 'Tue 2', 'Wed 3', 'Thu 4', 'Fri 5', 'Mon 8', 'Tue 9', 'Wed 10', 'Thu 11', 'Fri 12', 'Mon 15', 'Tue 16', 'Wed 17', 'Thu 18', 'Fri 19', 'Mon 22', 'Tue 23', 'Wed 24', 'Thu 25', 'Fri 26', 'Mon 29']
const status = ['P', 'P', 'P', 'P', 'L', 'P', 'P', 'P', 'P', 'L', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'A', 'P']

export default function ParentAttendance() {
  const [child, setChild] = useState('cjk')

  return (
    <div>
      <PageHeader title="Attendance Monitoring" subtitle="Track your child's daily attendance in real time" />

      <ChildSwitcher value={child} onChange={setChild} />

      <div className="mt-6 mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={ClipboardCheck} label="Attendance Rate" value={`${attendanceRate}%`} sub="this term" tone="emerald" index={0} />
        <StatCard icon={ClipboardCheck} label="Present" value={attendanceData.present} sub="days" tone="navy" index={1} />
        <StatCard icon={ClipboardCheck} label="Late / Absent" value={`${attendanceData.late} / ${attendanceData.absent}`} sub="this month" tone="amber" index={2} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <h3 className="font-bold text-navy-900">August 2026 Attendance</h3>
          <p className="text-xs text-slate-400">P = Present • L = Late • A = Absent</p>
          <div className="mt-4 grid grid-cols-7 gap-2 sm:grid-cols-11">
            {days.map((d, i) => {
              const s = status[i]
              const cls = s === 'P' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : s === 'L' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-rose-50 text-rose-500 border-rose-100'
              return (
                <div key={d} className={`rounded-xl border p-2 text-center ${cls}`}>
                  <p className="text-[10px] leading-tight text-slate-400">{d}</p>
                  <p className="text-sm font-extrabold">{s}</p>
                </div>
              )
            })}
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Present</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Late</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Absent</span>
          </div>
        </Card>

        <Card className="p-6 h-fit">
          <h3 className="font-bold text-navy-900">Term Overview</h3>
          <div className="mt-4 space-y-4">
            {[['Present', `${attendanceData.present} days`, 87], ['Late', `${attendanceData.late} days`, 10], ['Absent', `${attendanceData.absent} day`, 3]].map(([k, v, p]) => (
              <div key={k}>
                <div className="mb-1 flex justify-between text-sm"><span className="font-medium text-slate-600">{k}</span><span className="font-bold text-navy-900">{v}</span></div>
                <ProgressBar value={p} color={k === 'Present' ? 'bg-emerald-500' : k === 'Late' ? 'bg-amber-400' : 'bg-rose-500'} />
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl bg-rose-50 p-4">
            <p className="text-sm font-bold text-rose-700">Attendance Alert</p>
            <p className="mt-1 text-xs text-rose-600/80">John was marked absent on Friday, 29 August 2026.</p>
          </div>
        </Card>
      </div>
    </div>
  )
}