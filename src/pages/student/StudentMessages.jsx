import { useState } from 'react'
import { Send, Search, Bell } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Avatar from '../../components/ui/Avatar'
import { messages } from '../../data/mock'

export default function StudentMessages() {
  const [active, setActive] = useState(0)

  return (
    <div>
      <PageHeader title="Messages" subtitle="Messages from teachers and school admin" />

      <Card className="grid overflow-hidden lg:grid-cols-3">
        <div className="border-r border-navy-100 lg:col-span-1">
          <div className="border-b border-navy-100 p-4">
            <div className="relative">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input placeholder="Search messages…" className="w-full rounded-xl border border-navy-100 bg-navy-50/40 py-2 pl-9 pr-3 text-sm outline-none focus:border-navy-300" />
            </div>
          </div>
          <div className="divide-y divide-navy-50">
            {messages.map((m, i) => (
              <button key={m.id} onClick={() => setActive(i)} className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${active === i ? 'bg-navy-50/70' : 'hover:bg-cream-100/40'}`}>
                <Avatar initials={m.from.split(' ').map(x => x[0]).slice(0, 2).join('')} size="sm" color={i % 2 ? 'bg-emerald-600' : 'bg-navy-600'} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="truncate text-sm font-semibold text-navy-900">{m.from}</p>
                    <span className="shrink-0 text-[11px] text-slate-400">{m.time}</span>
                  </div>
                  <p className="truncate text-xs text-slate-500">{m.role}</p>
                </div>
                {m.unread && <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-navy-600" />}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col lg:col-span-2">
          <div className="flex items-center gap-3 border-b border-navy-100 px-6 py-4">
            <Avatar initials={messages[active].from.split(' ').map(x => x[0]).slice(0, 2).join('')} size="md" color="bg-navy-600" />
            <div>
              <p className="font-bold text-navy-900">{messages[active].from}</p>
              <p className="text-xs text-slate-400">{messages[active].role}</p>
            </div>
            <span className="ml-auto flex items-center gap-1.5 text-xs text-slate-400"><Bell size={13} /> Notifications on</span>
          </div>
          <div className="flex-1 p-6">
            <div className="flex justify-start">
              <div className="max-w-[75%] rounded-2xl rounded-bl-sm bg-navy-50 px-4 py-3 text-sm leading-relaxed text-navy-800">
                {messages[active].text}
              </div>
            </div>
          </div>
          <div className="border-t border-navy-100 p-4">
            <div className="flex items-center gap-2">
              <input placeholder="Reply…" className="flex-1 rounded-xl border border-navy-100 bg-navy-50/40 px-4 py-2.5 text-sm outline-none focus:border-navy-300" />
              <button className="grid h-10 w-10 place-items-center rounded-xl bg-navy-800 text-white transition hover:bg-navy-900 active:scale-95"><Send size={16} /></button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}