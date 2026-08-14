import { BookOpen, Star } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'
import Card from '../../components/ui/Card'
import ProgressBar from '../../components/ui/ProgressBar'
import { subjects } from '../../data/mock'

export default function StudentSubjects() {
  const mine = subjects.filter((s) => ['Mathematics', 'English Language', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Computer Studies', 'Islamic Studies', 'Arabic Language', 'Literature in English', 'Civic Education', 'Further Mathematics'].includes(s.name))

  return (
    <div>
      <PageHeader title="My Subjects" subtitle="Subjects registered for SS 2A • First Term" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mine.map((s, i) => {
          const perf = [82, 71, 75, 81, 68, 74, 77, 95, 90, 66, 78, 70][i] || 70
          const islamic = ['Islamic Studies', 'Arabic Language'].includes(s.name)
          return (
            <Card key={s.id} hover className="p-5">
              <div className="flex items-center justify-between">
                <span className={`grid h-11 w-11 place-items-center rounded-xl ${islamic ? 'bg-teal-700 text-gold-400' : 'bg-navy-800 text-gold-400'}`}>
                  {islamic ? <Star size={20} /> : <BookOpen size={20} />}
                </span>
                <Badge color={islamic ? 'emerald' : 'navy'}>SS 2A</Badge>
              </div>
              <h3 className="mt-4 font-bold text-navy-900">{s.name}</h3>
              <p className="text-xs text-slate-400">{s.code} • {s.teacherId ? 'Assigned' : 'Core'}</p>
              <div className="mt-3 flex items-center gap-2">
                <ProgressBar value={perf} color={islamic ? 'bg-teal-600' : 'bg-navy-600'} height="h-1.5" className="flex-1" />
                <span className="text-xs font-bold text-navy-900">{perf}%</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <Badge color="slate" dot>Teacher graded</Badge>
                <span className="font-semibold text-navy-700">Result →</span>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}