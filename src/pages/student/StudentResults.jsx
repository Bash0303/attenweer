import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Award, Download, FileText, KeyRound, Lock, ShieldCheck } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import StatCard from '../../components/ui/StatCard'
import ReportCard from '../../components/report/ReportCard'
import { student } from '../../services/api'

const ordinal = (value) => {
  if (!value) return ''
  const remainder = value % 100
  if (remainder >= 11 && remainder <= 13) return 'th'
  return { 1: 'st', 2: 'nd', 3: 'rd' }[value % 10] || 'th'
}

export default function StudentResults() {
  const location = useLocation()
  const initial = location.state || {}
  const [cards, setCards] = useState([])
  const [loadingCards, setLoadingCards] = useState(true)
  const [cardError, setCardError] = useState(null)
  const [termId, setTermId] = useState(initial.termId ? String(initial.termId) : '')
  const [serial, setSerial] = useState(initial.serial || '')
  const [pin, setPin] = useState(initial.pin || '')
  const [result, setResult] = useState(null)
  const [checking, setChecking] = useState(false)
  const [checkError, setCheckError] = useState(null)
  const [notice, setNotice] = useState('')

  const loadCards = async () => {
    setLoadingCards(true)
    setCardError(null)
    try {
      const res = await student.scratchCards()
      const list = res.data || []
      setCards(list)
      if (!termId && list[0]) setTermId(String(list[0].termId))
    } catch (e) {
      setCardError(e.message)
    } finally {
      setLoadingCards(false)
    }
  }

  useEffect(() => {
    loadCards()
  }, [])

  useEffect(() => {
    if (!termId) return
    const card = cards.find((item) => String(item.termId) === String(termId))
    if (card) {
      setSerial(card.serial)
      setPin(card.pin)
    }
  }, [termId, cards])

  const submit = async (event) => {
    event.preventDefault()
    if (!termId || !serial.trim() || !pin.trim()) {
      setCheckError('Select a term and enter the card serial and PIN.')
      return
    }

    setChecking(true)
    setCheckError(null)
    setNotice('')
    try {
      const res = await student.checkResult({
        termId: Number(termId),
        serial: serial.trim(),
        pin: pin.trim(),
      })
      setResult(res)
      setNotice(`Result unlocked. ${res.card?.usesLeft ?? 0} of ${res.card?.maxUses ?? 5} checks left on this card.`)
      loadCards()
    } catch (e) {
      setCheckError(e.errors ? Object.values(e.errors).flat().join(' ') : e.message)
    } finally {
      setChecking(false)
    }
  }

  if (loadingCards) {
    return <div className="flex min-h-[60vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-navy-100 border-t-navy-700" /></div>
  }

  const summary = result?.summary
  const published = Boolean(result?.published && result?.data?.length)

  return (
    <div>
      <PageHeader
        title="My Results"
        subtitle="Use your term scratch card to unlock your approved report card"
        actions={published ? <Button tone="primary" onClick={() => window.print()}><Download size={15} /> Download PDF</Button> : undefined}
      />

      {cardError && <div className="mb-6 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">{cardError}</div>}

      {!cards.length ? (
        <Card className="p-8 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-cream-100 text-gold-600"><KeyRound size={26} /></span>
          <h2 className="mt-4 text-lg font-bold text-navy-900">No scratch card yet</h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">Complete your term fees, then generate your result scratch card.</p>
          <Link to="/student/scratch-card" className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-navy-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-800">
            <KeyRound size={15} /> Go to Scratch Cards
          </Link>
        </Card>
      ) : (
        <>
          <Card className="p-6">
            <form onSubmit={submit} className="grid gap-4 sm:grid-cols-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-navy-800">Term</span>
                <select value={termId} onChange={(event) => setTermId(event.target.value)} className="w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none focus:border-navy-400">
                  {cards.map((card) => <option key={card.id} value={card.termId}>{card.session} {card.term}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-navy-800">Card Serial</span>
                <input value={serial} onChange={(event) => setSerial(event.target.value)} className="w-full rounded-xl border border-navy-100 px-3.5 py-2.5 font-mono text-sm outline-none focus:border-navy-400" placeholder="ATN-..." />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-navy-800">Scratch PIN</span>
                <input value={pin} onChange={(event) => setPin(event.target.value)} className="w-full rounded-xl border border-navy-100 px-3.5 py-2.5 font-mono text-sm outline-none focus:border-navy-400" placeholder="12-digit PIN" />
              </label>
              <div className="flex items-end">
                <Button tone="primary" className="w-full" disabled={checking} type="submit">
                  <Lock size={15} /> {checking ? 'Checking...' : 'Check Result'}
                </Button>
              </div>
            </form>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-400"><ShieldCheck size={13} /> Each successful check uses one of the 5 checks on your card.</p>
          </Card>

          {checkError && <div className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">{checkError}</div>}
          {notice && <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{notice}</div>}

          {result && !published && (
            <Card className="mt-6 p-8 text-center">
              <h2 className="text-lg font-bold text-navy-900">Result Not Available</h2>
              <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">Your result has not been released for this term yet.</p>
            </Card>
          )}

          {published && (
            <div className="mt-6">
              <div className="mb-6 grid gap-4 sm:grid-cols-3">
                <StatCard icon={FileText} label="Total Score" value={summary.totalScore} sub={`/ ${summary.count * 100}`} tone="navy" index={0} />
                <StatCard icon={Award} label="Average" value={`${summary.average}%`} sub={summary.grade ? `Grade ${summary.grade}` : 'No grade'} tone="emerald" index={1} />
                <StatCard icon={Award} label="Position" value={summary.position ? `${summary.position}${ordinal(summary.position)}` : 'N/A'} sub={`of ${summary.classSize} students`} tone="gold" index={2} />
              </div>

              <ReportCard
                student={result.student}
                rows={result.data}
                term={result.term?.name}
                session={result.session}
                summary={summary}
                schoolInfo={result.school}
                showActions={false}
              />

              <Card className="mt-6 p-6">
                <h3 className="font-bold text-navy-900">Grade Key</h3>
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                  {[['A', '75 - 100', 'Excellent'], ['B', '65 - 74', 'Very Good'], ['C', '55 - 64', 'Good'], ['D', '45 - 54', 'Pass'], ['E', '40 - 44', 'Fair'], ['F', '0 - 39', 'Needs Support']].map(([grade, range, meaning]) => (
                    <span key={grade} className="rounded-full border border-navy-100 bg-cream-100/50 px-3 py-1.5 text-navy-800">{grade}: {range} - {meaning}</span>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  )
}
