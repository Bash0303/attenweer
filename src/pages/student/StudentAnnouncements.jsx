import { Megaphone } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { announcementsForStudent } from '../../data/mock'

export default function StudentAnnouncements() {
  return (
    <div>
      <PageHeader title="Announcements" subtitle="News and notices for you" />

      <div className="space-y-4">
        {announcementsForStudent.map((a) => (
          <Card key={a.id} hover className={`p-6 ${!a.read ? 'ring-1 ring-navy-200' : ''}`}>
            <div className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy-800 text-gold-400"><Megaphone size={18} /></span>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge color={a.read ? 'slate' : 'navy'}>{a.tag}</Badge>
                  <span className="text-xs text-slate-400">{a.date} • by {a.author}</span>
                  {!a.read && <span className="rounded-full bg-navy-50 px-2 py-0.5 text-[10px] font-bold uppercase text-navy-700">New</span>}
                </div>
                <h3 className="mt-1.5 font-bold text-navy-900">{a.title}</h3>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">{a.message}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}