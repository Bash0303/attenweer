import { useState } from 'react'
import { Send, Search } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Avatar from '../../components/ui/Avatar'

const contacts = [
  { name: 'Mrs. Ramat Ibrahim', role: 'Class Teacher — SS 2A', preview: "John's academic progress for this term.", time: 'Yesterday' },
  { name: 'Alhaji Abdul Kareem', role: 'Principal', preview: 'Parent-teacher meeting on 23 August.', time: '2d ago' },
  { name: 'Mrs. Grace Emmanuel', role: 'Computer Studies Teacher', preview: "Your ward's submission was excellent.", time: '3d ago' },
]

const thread = [
  { from: 'them', text: 'Good day. We appreciate your daughter Aisha\'s improvement in English this term.' },
  { from: 'me', text: 'Thank you, we are very proud of her. Please keep guiding her.' },
  { from: 'them', text: 'Certainly. Also remember the PTA meeting on 23rd August by 10:00am.' },
]

export default function ParentMessages() {
  const [active, setActive] = useState(0)

  return (
    <div>
      <PageHeader title="Messages" subtitle="Communicate directly with your child's teachers" />

      <Card className="grid overflow-hidden lg:grid-cols-3">
        <div className="border-r border-navy-100 lg:col-span-1">
          <div className="border-b border-navy-100 p-4">
            <div className="relative">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input placeholder="Search…" className="w-full rounded-xl border border-navy-100 bg-navy-50/40 py-2 pl-9 pr-3 text-sm outline-none focus:border-navy-300" />
            </div>
          </div>
          <div className="divide-y divide-navy-50">
            {contacts.map((c, i) => (
              <button key={c.name} onClick={() => setActive(i)} className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${active === i ? 'bg-navy-50/70' : 'hover:bg-cream-100/40'}`}>
                <Avatar initials={c.name.split(' ').map(x => x[0]).slice(0, 2).join('')} size="sm" color={i % 2 ? 'bg-emerald-600' : 'bg-navy-600'} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="truncate text-sm font-semibold text-navy-900">{c.name}</p>
                    <span className="shrink-0 text-[11px] text-slate-400">{c.time}</span>
                  </div>
                  <p className="truncate text-xs text-slate-500">{c.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col lg:col-span-2">
          <div className="flex items-center gap-3 border-b border-navy-100 px-6 py-4">
            <Avatar initials={contacts[active].name.split(' ').map(x => x[0]).slice(0, 2).join('')} size="md" color="bg-navy-600" />
            <div><p className="font-bold text-navy-900">{contacts[active].name}</p><p className="text-xs text-slate-400">{contacts[active].role}</p></div>
          </div>
          <div className="flex-1 space-y-4 p-6">
            {thread.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.from === 'me' ? 'rounded-br-sm bg-emerald-700 text-white' : 'rounded-bl-sm bg-navy-50 text-navy-800'}`}>{m.text}</div>
              </div>
            ))}
          </div>
          <div className="border-t border-navy-100 p-4">
            <div className="flex items-center gap-2">
              <input placeholder="Type a message…" className="flex-1 rounded-xl border border-navy-100 bg-navy-50/40 px-4 py-2.5 text-sm outline-none focus:border-navy-300" />
              <button className="grid h-10 w-10 place-items-center rounded-xl bg-navy-800 text-white transition hover:bg-navy-900 active:scale-95"><Send size={16} /></button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}