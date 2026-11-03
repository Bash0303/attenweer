import { useEffect, useState } from 'react'
import { Megaphone } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { teacher } from '../../services/api'
import { EmptyBlock, ErrorBlock, LoadBlock } from './teacherUtils'

const typeColor = { info: 'navy', exam: 'violet', meeting: 'gold', fees: 'amber', event: 'emerald' }

export default function TeacherAnnouncements() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)

    teacher.announcements()
      .then((res) => {
        if (!cancelled) setRows(res.data || [])
      })
      .catch((e) => {
        if (!cancelled) setError(e.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [reloadKey])

  if (loading) return <LoadBlock label="Loading announcements..." />
  if (error) return <ErrorBlock message={error} onRetry={() => setReloadKey((key) => key + 1)} />

  return (
    <div>
      <PageHeader title="Announcements" subtitle="Official notices from school management" />

      {!rows.length ? (
        <EmptyBlock title="No announcements yet" message="Notices addressed to teachers will appear here." />
      ) : (
        <div className="space-y-4">
          {rows.map((announcement) => (
            <Card key={announcement.id} hover className="p-6">
              <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy-800 text-gold-400"><Megaphone size={18} /></span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge color={typeColor[announcement.type] || 'navy'}>{announcement.tag}</Badge>
                    <span className="text-xs text-slate-400">{announcement.date} • by {announcement.author}</span>
                  </div>
                  <h3 className="mt-1.5 font-bold text-navy-900">{announcement.title}</h3>
                  <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">{announcement.message}</p>
                  <div className="mt-2"><Badge color="slate" dot>Audience: {announcement.audience}</Badge></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
