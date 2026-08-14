import { BookMarked, CalendarDays } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

const exams = [
  { title: 'First Term Examination', date: '21 Sep 2026', time: '8:00am', status: 'Upcoming' },
  { title: 'CA Test 2', date: '10 Sep 2026', time: '9:00am', status: 'Upcoming' },
  { title: 'First Term Examination (Completed)', date: 'Term Complete', time: '—', status: 'Completed' },
]

export default function StudentExams() {
  return (
    <div>
      <PageHeader title="Examinations" subtitle="Examination schedule, timetables and results" actions={<Button tone="primary"><CalendarDays size={15} /> Exam Timetable</Button>} />

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="mb-3 font-bold text-navy-900">My Exam Schedule</h3>
          <div className="space-y-4">
            {exams.map((e) => (
              <Card key={e.title} hover className="p-6">
                <div className="flex items-start gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-navy-800 text-gold-400"><BookMarked size={20} /></span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-navy-900">{e.title}</h4>
                      <Badge color={e.status === 'Completed' ? 'slate' : 'amber'} dot>{e.status}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">{e.date} • {e.time}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {['English', 'Maths', 'Physics', 'Chem', 'Bio', 'Econs', 'IRS'].map((s) => <span key={s} className="rounded-full bg-cream-100 px-2 py-0.5 text-[11px] font-semibold text-navy-700">{s}</span>)}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Card className="p-6 h-fit">
          <h3 className="font-bold text-navy-900">Examination Guidelines</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-500">
            {['Arrive 30 minutes before the exam.', 'Dress in full school uniform (cream shirt, navy blue trouser/skirt).', 'Candidates must present their student ID.', 'Phones and smart devices are prohibited.', 'All answers must be written in the provided answer booklet.', 'Islamic Studies exams include oral memorisation assessments.'].map((t) => (
              <li key={t} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />{t}</li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}