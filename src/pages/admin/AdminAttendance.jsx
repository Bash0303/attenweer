import { useState } from 'react'
import { ClipboardCheck, Save } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'
import { students } from '../../data/mock'

const presets = ['SS 2A', 'SS 2B', 'SS 1A', 'JSS 3A']

export default function AdminAttendance() {
  const [className, setClassName] = useState('SS 2A')
  const [date, setDate] = useState('2026-08-14')

  return (
    <div>
      <PageHeader title="Attendance Management" subtitle="Monitor and administer daily attendance across classes" />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={ClipboardCheck} label="Today's Attendance" value="94%" sub="1120 present" tone="emerald" index={0} />
        <StatCard icon={ClipboardCheck} label="Late Comers" value="48" sub="4%" tone="amber" index={1} />
        <StatCard icon={ClipboardCheck} label="Absent Today" value="24" sub="2%" tone="rose" index={2} />
      </div>

      <Card className="p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Class</span>
            <select value={className} onChange={(e) => setClassName(e.target.value)} className="w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none focus:border-navy-400">
              {presets.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Date</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none focus:border-navy-400" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Subject</span>
            <select className="w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none focus:border-navy-400">
              <option>Mathematics</option><option>English Language</option><option>Physics</option>
            </select>
          </label>
        </div>
      </Card>

      <Card className="mt-6">
        <div className="flex items-center justify-between border-b border-navy-100 px-6 py-4">
          <div>
            <h3 className="font-bold text-navy-900">{className} Attendance</h3>
            <p className="text-xs text-slate-400">{date} • {students.filter(s => s.className === className).length} students</p>
          </div>
          <Badge color="emerald" dot>Live</Badge>
        </div>
        <div className="divide-y divide-navy-50">
          {students.filter((s) => s.className === className).map((s) => (
            <div key={s.id} className="flex items-center gap-3 px-6 py-3">
              <span className={`h-2.5 w-2.5 rounded-full ${s.status === 'Suspended' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
              <p className="min-w-0 flex-1 truncate text-sm font-medium text-navy-900">{s.name}</p>
              <span className="hidden font-mono text-xs text-slate-400 sm:block">{s.studentId}</span>
              <div className="flex gap-1.5">
                {['Present', 'Late', 'Absent'].map((v) => (
                  <button key={v} className={`rounded-lg px-3 py-1.5 text-xs font-bold transition active:scale-95 ${s.status === 'Suspended' ? 'cursor-not-allowed opacity-40' : v === 'Present' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : v === 'Late' ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'}`}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end border-t border-navy-100 px-6 py-4">
          <Button tone="primary"><Save size={16} /> Save Attendance</Button>
        </div>
      </Card>
    </div>
  )
}