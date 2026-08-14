import { useState } from 'react'
import { Megaphone, Plus, Bell } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { announcements } from '../../data/mock'

export default function AdminAnnouncements() {
  const [create, setCreate] = useState(false)
  const typeColor = { info: 'navy', exam: 'violet', meeting: 'gold', fees: 'amber', event: 'emerald' }

  return (
    <div>
      <PageHeader title="Announcements" subtitle="Publish news targeted to students, parents or teachers" actions={<Button tone="primary" onClick={() => setCreate(true)}><Plus size={16} /> New Announcement</Button>} />

      <div className="space-y-4">
        {announcements.map((a) => (
          <Card key={a.id} className="p-6 transition hover:shadow-lift" hover>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy-800 text-gold-400"><Megaphone size={18} /></span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge color={typeColor[a.type]}>{a.tag}</Badge>
                    <span className="text-xs text-slate-400">{a.date} • by {a.author}</span>
                  </div>
                  <h3 className="mt-1.5 font-bold text-navy-900">{a.title}</h3>
                  <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">{a.message}</p>
                  <div className="mt-2">
                    <Badge color="slate" dot>Audience: {a.audience}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button tone="outline" size="sm">Edit</Button>
                <Button tone="ghost" size="sm">Archive</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={create} onClose={() => setCreate(false)} title="New Announcement" wide>
        <div className="grid gap-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Title</span>
            <input className="w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none focus:border-navy-400" placeholder="e.g. Resumption Date" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Message</span>
            <textarea rows={4} className="w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none focus:border-navy-400" placeholder="Announcement message…" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-navy-800">Audience</span>
              <select className="w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none focus:border-navy-400">
                <option>All Students</option><option>Parents of SS 3 Students</option><option>All Teachers</option><option>SS 2 Students</option><option>All Parents</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-navy-800">Tag</span>
              <select className="w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none focus:border-navy-400">
                <option>Resumption</option><option>Examination</option><option>Fees</option><option>Meeting</option><option>Event</option>
              </select>
            </label>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button tone="ghost" onClick={() => setCreate(false)}>Cancel</Button>
          <Button tone="primary"><Bell size={15} /> Publish</Button>
        </div>
      </Modal>
    </div>
  )
}