import { useState } from 'react'
import { Pencil, Save } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { timetable } from '../../data/mock'

export default function AdminTimetable() {
  const [className, setClassName] = useState('SS 2A')
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  const isBreak = (v) => v === 'Break'
  const isFSubject = (v) => ['Islamic Studies', 'Arabic'].includes(v)

  return (
    <div>
      <PageHeader title="School Timetable" subtitle="Create and manage weekly timetables for every class" />

      <Card className="p-6">
        <div className="flex flex-wrap items-center gap-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Class</span>
            <select value={className} onChange={(e) => setClassName(e.target.value)} className="w-44 rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none focus:border-navy-400">
              {['SS 2A', 'SS 1A', 'SS 3A', 'JSS 3A', 'JSS 1A'].map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <div className="ml-auto flex gap-2">
            <Button tone="outline" size="sm"><Pencil size={14} /> Edit Period</Button>
            <Button tone="primary" size="sm"><Save size={14} /> Save Timetable</Button>
          </div>
        </div>
      </Card>

      <Card className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-navy-100 bg-navy-900 text-white">
              <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide">Time</th>
              {days.map((d) => <th key={d} className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide">{d}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-50">
            {timetable.map((row, i) => (
              <tr key={row.time} className={i % 2 ? 'bg-cream-100/40' : 'bg-white'}>
                <td className="px-6 py-3 font-bold text-navy-800">{row.time}</td>
                {days.map((d) => {
                  const v = row[d.toLowerCase().slice(0, 3)]
                  if (isBreak(v)) return <td key={d} className="px-6 py-3 text-center"><Badge color="slate">Break</Badge></td>
                  const islamic = isFSubject(v)
                  return (
                    <td key={d} className="px-6 py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold ${islamic ? 'bg-teal-50 text-teal-700' : 'bg-navy-50 text-navy-800'}`}>
                        {islamic && <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />}
                        {v}
                      </span>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center gap-5 border-t border-navy-100 px-6 py-3 text-xs text-slate-500">
          <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-teal-500" /> Islamic Studies / Arabic</span>
          <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-navy-600" /> Core Subjects</span>
          <Badge color="gold" dot>{className}</Badge>
        </div>
      </Card>
    </div>
  )
}