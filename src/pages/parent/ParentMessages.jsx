import { useEffect, useMemo, useState } from 'react'
import { Search, Send } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Avatar from '../../components/ui/Avatar'
import { EmptyBlock, ErrorBlock, LoadBlock } from './parentUtils'
import { parent } from '../../services/api'

export default function ParentMessages() {
  const [conversations, setConversations] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [thread, setThread] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [threadLoading, setThreadLoading] = useState(false)
  const [threadError, setThreadError] = useState(null)
  const [query, setQuery] = useState('')
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)

    parent.conversations()
      .then((res) => {
        if (cancelled) return
        const list = res.data || []
        setConversations(list)
        setActiveId((current) => (list.some((item) => item.id === current) ? current : (list[0]?.id ?? null)))
      })
      .catch((e) => {
        if (!cancelled) setError(e.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [reloadKey])

  useEffect(() => {
    if (!activeId) {
      setThread(null)
      return undefined
    }

    let cancelled = false

    setThread(null)
    setThreadLoading(true)
    setThreadError(null)

    parent.thread(activeId)
      .then((res) => {
        if (!cancelled) {
          setThread(res)
          setConversations((list) => list.map((item) => (item.id === activeId ? { ...item, unread: 0 } : item)))
        }
      })
      .catch((e) => {
        if (!cancelled) setThreadError(e.message)
      })
      .finally(() => {
        if (!cancelled) setThreadLoading(false)
      })

    return () => { cancelled = true }
  }, [activeId])

  const filtered = useMemo(
    () => conversations.filter((item) => `${item.name} ${item.role} ${item.preview}`.toLowerCase().includes(query.toLowerCase())),
    [conversations, query],
  )

  const active = conversations.find((item) => item.id === activeId)
  const partner = thread?.partner || active

  const sendMessage = async (event) => {
    event.preventDefault()
    const body = text.trim()

    if (!body || !activeId || sending) return

    setSending(true)
    setThreadError(null)

    try {
      await parent.sendMessage({ receiverId: activeId, body })
      setText('')
      const res = await parent.thread(activeId)
      setThread(res)
      setConversations((list) => list.map((item) => (
        item.id === activeId
          ? { ...item, preview: body.length > 60 ? `${body.slice(0, 60)}...` : body, time: 'Just now', unread: 0 }
          : item
      )))
    } catch (e) {
      setThreadError(e.message)
    } finally {
      setSending(false)
    }
  }

  if (loading) return <LoadBlock label="Loading messages..." />
  if (error) return <ErrorBlock message={error} onRetry={() => setReloadKey((key) => key + 1)} />

  if (!conversations.length) {
    return (
      <div>
        <PageHeader title="Messages" subtitle="Communicate directly with teachers and school staff" />
        <EmptyBlock title="No conversations yet" message="Messages from teachers and school staff will appear here." />
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Messages" subtitle="Communicate directly with teachers and school staff" />

      <Card className="grid overflow-hidden lg:grid-cols-3">
        <div className="border-r border-navy-100 lg:col-span-1">
          <div className="border-b border-navy-100 p-4">
            <div className="relative">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." className="w-full rounded-xl border border-navy-100 bg-navy-50/40 py-2 pl-9 pr-3 text-sm outline-none focus:border-navy-300" />
            </div>
          </div>
          <div className="max-h-[520px] divide-y divide-navy-50 overflow-y-auto">
            {filtered.map((item) => (
              <button key={item.id} onClick={() => setActiveId(item.id)} className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${activeId === item.id ? 'bg-navy-50/70' : 'hover:bg-cream-100/40'}`}>
                <Avatar initials={item.initials} size="sm" color={item.color} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="truncate text-sm font-semibold text-navy-900">{item.name}</p>
                    <span className="shrink-0 text-[11px] text-slate-400">{item.time || ''}</span>
                  </div>
                  <p className="truncate text-xs text-slate-500">{item.role}</p>
                  <p className="truncate text-xs text-slate-400">{item.preview}</p>
                </div>
                {item.unread > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-gold-500 px-1 text-[10px] font-bold text-white">{item.unread}</span>}
              </button>
            ))}
            {!filtered.length && <p className="px-4 py-8 text-center text-sm text-slate-400">No matching conversations.</p>}
          </div>
        </div>

        <div className="flex min-h-[520px] flex-col lg:col-span-2">
          <div className="flex items-center gap-3 border-b border-navy-100 px-6 py-4">
            <Avatar initials={partner?.initials} size="md" color={partner?.color || 'bg-navy-600'} />
            <div>
              <p className="font-bold text-navy-900">{partner?.name || 'Conversation'}</p>
              <p className="text-xs text-slate-400">{partner?.role}</p>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-6">
            {threadLoading && !thread && <p className="text-sm text-slate-400">Loading conversation...</p>}
            {(thread?.data || []).map((message) => (
              <div key={message.id} className={`flex ${message.mine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.mine ? 'rounded-br-sm bg-navy-800 text-white' : 'rounded-bl-sm bg-navy-50 text-navy-800'}`}>
                  <p>{message.body}</p>
                  <p className={`mt-1 text-[10px] ${message.mine ? 'text-white/60' : 'text-slate-400'}`}>{message.date} &middot; {message.time}</p>
                </div>
              </div>
            ))}
            {thread && !thread.data?.length && <p className="rounded-xl bg-cream-100/70 p-4 text-sm text-slate-500">No messages in this conversation yet. Say hello.</p>}
            {threadError && <p className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600">{threadError}</p>}
          </div>

          <form onSubmit={sendMessage} className="border-t border-navy-100 p-4">
            <div className="flex items-center gap-2">
              <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message..." className="flex-1 rounded-xl border border-navy-100 bg-navy-50/40 px-4 py-2.5 text-sm outline-none focus:border-navy-300" />
              <button type="submit" disabled={sending || !text.trim()} className="grid h-10 w-10 place-items-center rounded-xl bg-navy-800 text-white transition hover:bg-navy-900 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300"><Send size={16} /></button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}
