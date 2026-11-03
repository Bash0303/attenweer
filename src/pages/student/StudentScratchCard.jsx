import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { KeyRound, CheckCircle2, Copy, Eye, EyeOff, ShieldCheck, RefreshCw, Lock, Wallet, AlertCircle } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'
import { student } from '../../services/api'

const cardTone = { Active: 'emerald', Used: 'slate' }
const money = (value) => `\u20A6${Number(value || 0).toLocaleString()}`
const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-')

export default function StudentScratchCard() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [fees, setFees] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedTerm, setSelectedTerm] = useState('')
  const [generating, setGenerating] = useState(false)
  const [notice, setNotice] = useState('')
  const [revealed, setRevealed] = useState({})
  const [copied, setCopied] = useState('')

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [cardsRes, feesRes] = await Promise.all([student.scratchCards(), student.fees()])
      setData(cardsRes)
      setFees(feesRes)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const cards = data?.data || []
  const eligible = useMemo(() => data?.eligibleTerms || [], [data])
  const available = useMemo(() => eligible.filter((term) => !term.hasCard), [eligible])
  const checksLeft = cards.reduce((sum, card) => sum + Number(card.usesLeft || 0), 0)
  const balance = Number(fees?.totals?.balance || 0)

  useEffect(() => {
    if (!available.length) {
      if (selectedTerm) setSelectedTerm('')
      return
    }
    if (!available.some((term) => String(term.termId) === String(selectedTerm))) {
      setSelectedTerm(String(available[0].termId))
    }
  }, [available, selectedTerm])

  const generate = async () => {
    if (!selectedTerm) return
    setGenerating(true)
    setNotice('')
    try {
      const res = await student.generateScratchCard({ termId: Number(selectedTerm) })
      setNotice(res.message || 'Scratch card generated.')
      await load()
    } catch (e) {
      setNotice(e.errors ? Object.values(e.errors).flat().join(' ') : e.message)
    } finally {
      setGenerating(false)
    }
  }

  const toggleReveal = (id) => setRevealed((current) => ({ ...current, [id]: !current[id] }))

  const copyPin = async (card) => {
    try {
      await navigator.clipboard.writeText(card.pin)
      setCopied(card.id)
      setTimeout(() => setCopied(''), 2000)
    } catch {
      setNotice('Could not copy automatically. Please write the PIN down.')
    }
  }

  const checkResult = (card) => {
    navigate(`/student/results?termId=${card.termId}`, {
      state: { termId: card.termId, serial: card.serial, pin: card.pin },
    })
  }

  if (loading && !data) {
    return <div className="flex min-h-[60vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-navy-100 border-t-navy-700" /></div>
  }

  return (
    <div>
      <PageHeader title="Result Scratch Cards" subtitle="Generate your term card after fees are completed, then use it to check results" />

      {error && <div className="mb-6 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">{error}</div>}
      {notice && <div className="mb-6 rounded-xl bg-cream-100/70 px-4 py-3 text-sm font-medium text-navy-800">{notice}</div>}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={KeyRound} label="My Scratch Cards" value={cards.length} sub="one per term" tone="navy" index={0} />
        <StatCard icon={ShieldCheck} label="Checks Remaining" value={checksLeft} sub="across all cards" tone="emerald" index={1} />
        <StatCard icon={Wallet} label="Outstanding Fees" value={money(balance)} sub={balance > 0 ? 'complete fees to generate' : 'fees completed'} tone={balance > 0 ? 'rose' : 'emerald'} index={2} />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="p-6 lg:col-span-2">
          <h3 className="flex items-center gap-2 font-bold text-navy-900"><ShieldCheck size={18} className="text-navy-600" /> Generate Scratch Card</h3>
          <p className="mt-1 text-xs text-slate-400">No separate payment is required. Your card is available after all term fees are completed and results are published.</p>

          {available.length > 0 ? (
            <div className="mt-5 space-y-3">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-navy-800">Select Term</span>
                <select value={selectedTerm} onChange={(event) => setSelectedTerm(event.target.value)} className="w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none focus:border-navy-400">
                  {available.map((term) => <option key={term.termId} value={term.termId}>{term.label}</option>)}
                </select>
              </label>
              <Button tone="primary" className="w-full" disabled={generating || !selectedTerm} onClick={generate}>
                <KeyRound size={15} /> {generating ? 'Generating...' : 'Generate Scratch Card'}
              </Button>
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-dashed border-navy-200 bg-navy-50/40 p-4 text-sm text-slate-500">
              <p className="flex items-center gap-2 font-semibold text-navy-900"><AlertCircle size={16} /> No term is ready for a card yet.</p>
              <p className="mt-1 text-xs">{balance > 0 ? 'Complete your outstanding fees first. The bursary records payments, then your card becomes available.' : 'Your fees are complete. A card will appear once the school publishes an approved result for the term.'}</p>
            </div>
          )}

          <div className="mt-5 space-y-2">
            {eligible.map((term) => (
              <div key={term.termId} className="flex items-center justify-between rounded-xl border border-navy-100 px-3 py-2.5 text-xs">
                <div>
                  <p className="font-semibold text-navy-900">{term.label}</p>
                  <p className="text-slate-400">{term.hasCard ? `${term.usesLeft} checks left` : 'Ready to generate'}</p>
                </div>
                <Badge color={term.hasCard ? 'emerald' : 'gold'} dot>{term.hasCard ? 'Generated' : 'Eligible'}</Badge>
              </div>
            ))}
            {!eligible.length && <p className="text-xs text-slate-400">Eligible terms will appear here after fees and results are ready.</p>}
          </div>

          <Button tone="outline" size="sm" className="mt-4 w-full" onClick={load}><RefreshCw size={14} /> Refresh Status</Button>
        </Card>

        <Card className="p-6 lg:col-span-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-navy-900">My Scratch Cards</h3>
              <p className="text-xs text-slate-400">Each card allows 5 result checks for its term</p>
            </div>
            <Badge color="navy">{cards.length} card{cards.length === 1 ? '' : 's'}</Badge>
          </div>

          <div className="mt-4 space-y-4">
            {cards.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-navy-200 bg-navy-50/30 px-6 py-12 text-center">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-navy-500 shadow-card"><KeyRound size={22} /></span>
                <p className="mt-3 text-sm font-semibold text-navy-900">No scratch card yet</p>
                <p className="mt-1 max-w-xs text-xs text-slate-500">Complete your fees and generate a card to check your term result.</p>
              </div>
            ) : (
              cards.map((card) => {
                const isRevealed = revealed[card.id]
                return (
                  <div key={card.id} className="rounded-2xl border border-navy-100 bg-white p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-bold text-navy-900">{card.serial}</p>
                        <p className="text-xs text-slate-400">{card.session} {card.term} &middot; Generated {formatDate(card.generatedAt)}</p>
                      </div>
                      <Badge color={cardTone[card.status] || 'slate'} dot>{card.status}</Badge>
                    </div>

                    <div className="mt-3 rounded-xl bg-navy-900 px-4 py-3 text-white">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-cream-100/60">Scratch PIN</p>
                      <div className="mt-1 flex items-center gap-2">
                        <p className="flex-1 font-mono text-base font-bold tracking-widest text-gold-400 sm:text-lg">
                          {isRevealed ? card.pin : '•••• •••• ••••'}
                        </p>
                        <button onClick={() => toggleReveal(card.id)} className="grid h-8 w-8 place-items-center rounded-lg text-cream-100/70 transition hover:bg-white/10 hover:text-white" title={isRevealed ? 'Hide PIN' : 'Show PIN'}>
                          {isRevealed ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                        <button onClick={() => copyPin(card)} className="grid h-8 w-8 place-items-center rounded-lg text-cream-100/70 transition hover:bg-white/10 hover:text-white" title="Copy PIN">
                          {copied === card.id ? <CheckCircle2 size={15} className="text-emerald-400" /> : <Copy size={15} />}
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                      <Badge color={card.usesLeft > 0 ? 'sky' : 'rose'}>{card.usesLeft} of {card.maxUses} checks left</Badge>
                      <Button tone="primary" size="sm" disabled={card.usesLeft <= 0 || card.status !== 'Active'} onClick={() => checkResult(card)}>
                        <Lock size={14} /> Check Result
                      </Button>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          <div className="mt-5 rounded-xl bg-navy-50/60 p-4 text-xs text-slate-500">
            Each successful result check uses one of the 5 checks on the card. A card is tied to one term and cannot be reused for another term.
          </div>
        </Card>
      </div>
    </div>
  )
}
