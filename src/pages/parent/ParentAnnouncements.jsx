import { useEffect, useState } from 'react'
import { Megaphone } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { EmptyBlock, ErrorBlock, LoadBlock } from './parentUtils'
import { parent } from '../../services/api'

export default function ParentAnnouncements() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)

    parent.announcements()
      .then((res) => {
        if (!cancelled) setAnnouncements(res.data || [])
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

  return (
    <div>
      <PageHeader title="Announcements" subtitle="Official notices from school management" />

      {error && <div className="mb-4"><ErrorBlock message={error} onRetry={() => setReloadKey((key) => key + 1)} /></div>}

      {!error && (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id} hover className="p-6">
              <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy-800 text-gold-400"><Megaphone size={18} /></span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge color="navy">{announcement.tag}</Badge>
                    <span className="text-xs text-slate-400">{announcement.date} &middot; by {announcement.author || 'School office'}</span>
                  </div>
                  <h3 className="mt-1.5 font-bold text-navy-900">{announcement.title}</h3>
                  <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">{announcement.message}</p>
                  <div className="mt-2"><Badge color="slate" dot>Audience: {announcement.audience}</Badge></div>
                </div>
              </div>
            </Card>
          ))}
          {!announcements.length && <EmptyBlock title="No announcements yet" message="Official notices for parents will appear here once they are published." />}
        </div>
      )}
    </div>
  )
}
