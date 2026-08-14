import { useState } from 'react'
import { PenSquare } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import ChildSwitcher from './ChildSwitcher'
import { studentAssignments } from '../../data/mock'

const statusBadge = { Pending: 'amber', Submitted: 'sky', Graded: 'navy' }

export default function ParentAssignments() {
  const [child, setChild] = useState('cjk')

  return (
    <div>
      <PageHeader title="Assignments" subtitle="Monitor your child's assignments and submissions" />

      <ChildSwitcher value={child} onChange={setChild} />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['Assigned', '4', 'navy'],
          ['Submitted', '2', 'emerald'],
          ['Pending', '2', 'amber'],
          ['Avg Score', '82%', 'emerald'],
        ].map(([k, v, c]) => (
          <div key={k} className={`rounded-2xl border border-navy-100 p-5 shadow-card ${c === 'navy' ? 'bg-white' : c === 'emerald' ? 'bg-emerald-50/60' : 'bg-amber-50/60'}`}>
            <p className="text-2xl font-extrabold text-navy-900">{v}</p>
            <p className="text-sm font-medium text-slate-500">{k}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {studentAssignments.map((a) => (
          <Card key={a.id} hover className="p-5">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-navy-800 text-gold-400"><PenSquare size={16} /></span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-navy-900">{a.title}</h4>
                  <Badge color={statusBadge[a.status]} dot>{a.status}</Badge>
                </div>
                <p className="text-xs text-slate-400">{a.subject} • {a.teacher}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{a.desc}</p>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="font-semibold text-navy-700">Deadline: {a.deadline}</span>
                  {a.score !== null && <span className="font-bold text-emerald-600">Score: {a.score}/20</span>}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}