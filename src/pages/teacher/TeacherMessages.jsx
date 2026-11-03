import { useEffect, useMemo, useRef, useState } from 'react'
import { Send, Search, MessageSquare } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Avatar from '../../components/ui/Avatar'
import Button from '../../components/ui/Button'
import { teacher } from '../../services/api'
import { EmptyBlock, ErrorBlock, LoadBlock } from './teacherUtils'

export default function TeacherMessages() {
  const [contacts, setContacts] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [threadLoading, setThreadLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sending, setSending] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const endRef = useRef(null)

  const active = contacts.find((contact) => contact.id === activeId) || null

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)

    teacher.conversations()
      .then((res) => {
        if (cancelled) return
        const data = res.data || []
        setContacts(data)
        setActiveId((current) => (data.some((contact) => contact.id === current) ? current : (data[0]?.id ?? null)))
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
    if (!activeId) return undefined

    let cancelled = false

    setThreadLoading(true)
    setError(null)

    teacher.thread(activeId)
      .then((res) => {
        if (cancelled) return
        setMessages(res.data || [])
        setContacts((list) => list.map((contact) => (contact.id === activeId ? { ...contact, unread: 0 } : contact)))
      })
      .catch((e) => {
        if (!cancelled) setError(e.message)
      })
      .finally(() => {
        if (!cancelled) setThreadLoading(false)
      })

    return () => { cancelled = true }
  }, [activeId])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const filtered = useMemo(
    () => contacts.filter((contact) => `${contact.name} ${contact.role} ${contact.preview || ''}`.toLowerCase().includes(query.toLowerCase())),
    [contacts, query],
  )

  const handleSend = async (event) => {
    event.preventDefault()
    const body = text.trim()

    if (!body || !activeId || sending) return

    setSending(true)

    try {
      const res = await teacher.sendMessage({ receiverId: activeId, body })
      setMessages((list) => [...list, res.data])
      setContacts((list) => list.map((contact) => (contact.id === activeId ? { ...contact, preview: body, time: 'Just now' } : contact)))
      setText('')
    } catch (e) {
      setError(e.message)
    } finally {
      setSending(false)
    }
  }

  if (loading) return <LoadBlock label="Loading messages..." />
  if (error && !contacts.length) return <ErrorBlock message={error} onRetry={() => setReloadKey((key) => key + 1)} />

  if (!contacts.length) {
    return (
      <div>
        <PageHeader title="Messages" subtitle="Communicate with students, parents and staff" />
        <EmptyBlock title="No conversations yet" message="Messages from students, parents and staff will appear here." />
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Messages" subtitle="Communicate with students, parents and staff" />

      {error && (
        <div className="mb-6 flex items-center justify-between rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
          <span>{error}</span>
          <Button tone="ghost" size="sm" onClick={() => setReloadKey((key) => key + 1)}>Retry</Button>
        </div>
      )}

      <Card className="grid overflow-hidden lg:grid-cols-3">
        <div className="border-r border-navy-100 lg:col-span-1">
          <div className="border-b border-navy-100 p-4">
            <div className="relative">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search messages…" className="w-full rounded-xl border border-navy-100 bg-navy-50/40 py-2 pl-9 pr-3 text-sm outline-none focus:border-navy-300" />
            </div>
          </div>
          <div className="max-h-[520px] divide-y divide-navy-50 overflow-y-auto">
            {!filtered.length && <p className="p-5 text-sm text-slate-400">No conversations found.</p>}
            {filtered.map((contact) => (
              <button key={contact.id} onClick={() => setActiveId(contact.id)} className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${activeId === contact.id ? 'bg-navy-50/70' : 'hover:bg-cream-100/40'}`}>
                <Avatar initials={contact.initials} size="sm" color={contact.color} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="truncate text-sm font-semibold text-navy-900">{contact.name}</p>
                    <span className="shrink-0 text-[11px] text-slate-400">{contact.time || ''}</span>
                  </div>
                  <p className="truncate text-xs text-slate-500">{contact.role}</p>
                  <p className="truncate text-xs text-slate-400">{contact.preview}</p>
                </div>
                {contact.unread > 0 && <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-navy-700 text-[10px] font-bold text-white">{contact.unread}</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="flex min-h-[520px] flex-col lg:col-span-2">
          {active ? (
            <>
              <div className="flex items-center gap-3 border-b border-navy-100 px-6 py-4">
                <Avatar initials={active.initials} size="md" color={active.color} />
                <div>
                  <p className="font-bold text-navy-900">{active.name}</p>
                  <p className="text-xs text-slate-400">{active.role}</p>
                </div>
              </div>
              <div className="flex-1 space-y-4 overflow-y-auto p-6">
                {threadLoading && <p className="text-sm text-slate-400">Loading messages…</p>}
                {!threadLoading && !messages.length && <p className="text-sm text-slate-400">No messages yet. Start the conversation below.</p>}
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.mine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.mine ? 'rounded-br-sm bg-navy-800 text-white' : 'rounded-bl-sm bg-navy-50 text-navy-800'}`}>
                      {message.body}
                      <span className={`mt-1 block text-[10px] ${message.mine ? 'text-white/50' : 'text-slate-400'}`}>{message.date} • {message.time}</span>
                    </div>
                  </div>
                ))}
                <div ref={endRef} />
              </div>
              <form onSubmit={handleSend} className="border-t border-navy-100 p-4">
                <div className="flex items-center gap-2">
                  <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message…" className="flex-1 rounded-xl border border-navy-100 bg-navy-50/40 px-4 py-2.5 text-sm outline-none focus:border-navy-300" />
                  <button type="submit" disabled={sending || !text.trim()} className="grid h-10 w-10 place-items-center rounded-xl bg-navy-800 text-white transition hover:bg-navy-900 active:scale-95 disabled:opacity-40">
                    <Send size={16} />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="grid flex-1 place-items-center text-center">
              <div>
                <MessageSquare size={36} className="mx-auto text-slate-300" />
                <p className="mt-3 text-sm text-slate-400">Select a conversation to start messaging.</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
