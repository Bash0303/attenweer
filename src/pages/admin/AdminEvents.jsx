import { CalendarDays, Plus } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { events } from '../../data/mock'

const eventTone = {
  exam: 'bg-navy-600',
  meeting: 'bg-gold-500',
  sports: 'bg-emerald-600',
  islamic: 'bg-teal-700',
  resumption: 'bg-sky-600',
}
const eventLabel = {
  exam: 'Examination',
  meeting: 'Meeting',
  sports: 'Sports',
  islamic: 'Islamic',
  resumption: 'Resumption',
}

export default function AdminEvents() {
  return (
    <div>
      <PageHeader title="School Events" subtitle="Manage calendar of activities and competitions" actions={<Button tone="primary"><Plus size={16} /> Add Event</Button>} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((e) => (
          <Card key={e.id} className="p-6" hover>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <span className={`grid h-14 w-14 place-items-center rounded-2xl ${eventTone[e.type]} text-white`}>
                  <CalendarDays size={24} />
                </span>
                <div>
                  <h3 className="font-bold text-navy-900">{e.title}</h3>
                  <p className="text-xs font-semibold text-gold-600">{e.date}</p>
                </div>
              </div>
              <Badge color="navy">{eventLabel[e.type]}</Badge>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-500">{e.desc}</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button tone="ghost" size="sm">Edit</Button>
              <Button tone="outline" size="sm">Notify</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}