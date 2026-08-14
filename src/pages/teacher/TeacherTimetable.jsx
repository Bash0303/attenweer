import { Table2 } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { timetable } from '../../data/mock'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

export default function TeacherTimetable() {
  return (
    <div>
      <PageHeader title="My Timetable" subtitle="Weekly schedule across assigned classes and subjects" />

      <Card className="overflow-x-auto">
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
                  if (v === 'Break') return <td key={d} className="px-6 py-3 text-center"><Badge color="slate">Break</Badge></td>
                  const mine = v === 'English' || v === 'Literature'
                  return (
                    <td key={d} className="px-6 py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold ${mine ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'bg-navy-50 text-navy-800'}`}>
                        {mine && <Table2 size={12} />}{v}
                      </span>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center gap-5 border-t border-navy-100 px-6 py-3 text-xs text-slate-500">
          <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100" /> Classes I teach</span>
        </div>
      </Card>
    </div>
  )
}