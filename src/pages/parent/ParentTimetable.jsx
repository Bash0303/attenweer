import { useState } from 'react'
import { Table2 } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import ChildSwitcher from './ChildSwitcher'
import { timetable } from '../../data/mock'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

export default function ParentTimetable() {
  const [child, setChild] = useState('cjk')

  return (
    <div>
      <PageHeader title="Timetable" subtitle="Weekly class schedule for your child" />

      <ChildSwitcher value={child} onChange={setChild} />

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
                  if (v === 'Break') return <td key={d} className="px-6 py-3 text-center"><Badge color="slate">Break</Badge></td>
                  const islamic = ['Islamic Studies', 'Arabic'].includes(v)
                  return (
                    <td key={d} className="px-6 py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold ${islamic ? 'bg-teal-50 text-teal-700 ring-1 ring-teal-100' : 'bg-navy-50 text-navy-800'}`}>
                        {islamic && <Table2 size={12} />}{v}
                      </span>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}