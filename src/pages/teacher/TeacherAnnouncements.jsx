import { Megaphone } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { announcements } from '../../data/mock'

const typeColor = { info: 'navy', exam: 'violet', meeting: 'gold', fees: 'amber', event: 'emerald' }

export default function TeacherAnnouncements() {
  return (
    <div>
      <PageHeader title="Announcements" subtitle="Official notices from school management" />

      <div className="space-y-4">
        {announcements.map((a) => (
          <Card key={a.id} hover className="p-6">
            <div className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy-800 text-gold-400"><Megaphone size={18} /></span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge color={typeColor[a.type]}>{a.tag}</Badge>
                  <span className="text-xs text-slate-400">{a.date} • by {a.author}</span>
                </div>
                <h3 className="mt-1.5 font-bold text-navy-900">{a.title}</h3>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">{a.message}</p>
                <div className="mt-2"><Badge color="slate" dot>Audience: {a.audience}</Badge></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}