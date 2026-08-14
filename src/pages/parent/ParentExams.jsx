import { useState } from 'react'
import { BookMarked, CalendarDays } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import ChildSwitcher from './ChildSwitcher'

const exams = [
  { title: 'First Term Examination', date: '21 Sep 2026', status: 'Upcoming', note: 'All subjects' },
  { title: 'CA Test 2', date: '10 Sep 2026', status: 'Upcoming', note: 'Continuous assessment' },
  { title: 'First Term Results Published', date: 'Term Complete', status: 'Completed', note: 'View report card' },
]

export default function ParentExams() {
  const [child, setChild] = useState('cjk')

  return (
    <div>
      <PageHeader title="Examinations" subtitle="Exam schedules and results across all children" actions={<Button tone="primary"><CalendarDays size={15} /> Exam Timetable</Button>} />

      <ChildSwitcher value={child} onChange={setChild} />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {exams.map((e, i) => (
          <Card key={e.title} hover className="p-6">
            <div className="flex items-start justify-between">
              <span className={`grid h-12 w-12 place-items-center rounded-2xl ${i === 2 ? 'bg-emerald-600 text-white' : 'bg-navy-800 text-gold-400'}`}><BookMarked size={20} /></span>
              <Badge color={i === 2 ? 'emerald' : 'amber'} dot>{e.status}</Badge>
            </div>
            <h3 className="mt-4 font-bold text-navy-900">{e.title}</h3>
            <p className="text-xs text-slate-400">{e.date} • {e.note}</p>
            {i === 2 && (
              <button className="mt-4 w-full rounded-xl bg-navy-800 py-2.5 text-sm font-bold text-white transition hover:bg-navy-900 active:scale-95">View Report Card</button>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}