import { useEffect, useMemo, useState } from 'react'
import { Bell, ChevronDown, Search } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { student } from '../../services/api'
import { EmptyBlock, ErrorBlock, LoadBlock, inputCls } from './studentUtils'

export default function StudentAnnouncements() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [query, setQuery] = useState('')
  const [tag, setTag] = useState('All')
  const [openId, setOpenId] = useState(null)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)

    student.announcements()
      .then((res) => {
        if (!cancelled) setData(res)
      })
      .catch((e) => {
        if (!cancelled) setError(e.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [reloadKey])

  const announcements = data?.data || []
  const tags = useMemo(() => ['All', ...new Set(announcements.map((item) => item.tag).filter(Boolean))], [announcements])

  const rows = useMemo(() => announcements.filter((item) => {
    const matchesTag = tag === 'All' || item.tag === tag
    const text = `${item.title} ${item.message || ''} ${item.author || ''}`.toLowerCase()
    return matchesTag && (!query || text.includes(query.toLowerCase()))
  }), [announcements, tag, query])

  if (loading && !data) return <LoadBlock label="Loading announcements..." />
  if (error) return <ErrorBlock message={error} onRetry={() => setReloadKey((key) => key + 1)} />

  return (
    <div>
      <PageHeader title="Announcements" subtitle="Notices and updates from the school" />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search announcements..." className={`${inputCls} pl-9`} />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((item) => (
            <button key={item} onClick={() => setTag(item)} className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${tag === item ? 'bg-navy-800 text-white' : 'bg-white text-slate-500 hover:bg-navy-50'}`}>{item}</button>
          ))}
        </div>
      </div>

      {!rows.length ? (
        <EmptyBlock title="No announcements" message={announcements.length ? 'No announcements match your search.' : 'The school has not published any announcements for students yet.'} />
      ) : (
        <div className="space-y-3">
          {rows.map((announcement) => {
            const open = openId === announcement.id
            return (
              <Card key={announcement.id} className="overflow-hidden">
                <button onClick={() => setOpenId(open ? null : announcement.id)} className="flex w-full items-center gap-3 px-5 py-4 text-left">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-navy-50 text-navy-700"><Bell size={17} /></span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-navy-900">{announcement.title}</p>
                    <p className="text-xs text-slate-400">{announcement.date} &bull; {announcement.author || 'School office'}</p>
                  </div>
                  {announcement.tag && <Badge color="gold">{announcement.tag}</Badge>}
                  <ChevronDown size={18} className={`shrink-0 text-slate-400 transition ${open ? 'rotate-180' : ''}`} />
                </button>
                {open && (
                  <div className="border-t border-navy-100 px-5 py-4">
                    <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">{announcement.message}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
                      <Badge color="slate">{announcement.audience}</Badge>
                      {announcement.type && <Badge color="navy">{announcement.type}</Badge>}
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
