import { CalendarRange, CheckCircle2, Lock, Plus } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { school } from '../../data/mock'

const sessionsData = [
  { session: '2023/2024', terms: [{ name: 'First Term', status: 'Locked' }, { name: 'Second Term', status: 'Locked' }, { name: 'Third Term', status: 'Locked' }], status: 'Completed' },
  { session: '2024/2025', terms: [{ name: 'First Term', status: 'Locked' }, { name: 'Second Term', status: 'Locked' }, { name: 'Third Term', status: 'Locked' }], status: 'Completed' },
  { session: '2025/2026', terms: [{ name: 'First Term', status: 'Open' }, { name: 'Second Term', status: 'Upcoming' }, { name: 'Third Term', status: 'Upcoming' }], status: 'Active' },
  { session: '2026/2027', terms: [{ name: 'First Term', status: 'Upcoming' }, { name: 'Second Term', status: 'Upcoming' }, { name: 'Third Term', status: 'Upcoming' }], status: 'Upcoming' },
]

export default function AdminSessions() {
  return (
    <div>
      <PageHeader
        title="Academic Sessions & Terms"
        subtitle="Create sessions and manage term states safely"
        actions={<Button tone="primary"><Plus size={16} /> New Session</Button>}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {sessionsData.map((s) => (
          <Card key={s.session} className="p-6" hover>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy-800 text-gold-400"><CalendarRange size={20} /></span>
                <div>
                  <h3 className="text-lg font-extrabold text-navy-900">{s.session}</h3>
                  <p className="text-xs text-slate-400">Academic session</p>
                </div>
              </div>
              <Badge color={s.status === 'Active' ? 'emerald' : s.status === 'Completed' ? 'navy' : 'slate'} dot>{s.status}</Badge>
            </div>
            <div className="mt-5 space-y-3">
              {s.terms.map((t) => (
                <div key={t.name} className="flex items-center justify-between rounded-xl border border-navy-100 p-3">
                  <span className="text-sm font-semibold text-navy-800">{t.name}</span>
                  {t.status === 'Locked' && <Badge color="slate"><Lock size={11} /> Locked</Badge>}
                  {t.status === 'Open' && <Badge color="emerald" dot>Open</Badge>}
                  {t.status === 'Upcoming' && <Badge color="amber" dot>Upcoming</Badge>}
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button tone="outline" size="sm"><CheckCircle2 size={14} /> Approve Term</Button>
              <Button tone="ghost" size="sm"><Lock size={14} /> Lock Results</Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-6 p-5">
        <p className="text-sm text-slate-500">
          <strong className="text-navy-800">Tip:</strong> The current open term is <strong className="text-navy-800">{school.term}</strong>. Once results are approved by admin, they can be locked to prevent further edits by teachers.
        </p>
      </Card>
    </div>
  )
}