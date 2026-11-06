import { useEffect, useRef, useState } from 'react'
import {
  Clock, ListChecks, Trophy, Play, CheckCircle2, AlertCircle, Save, ChevronLeft,
  ChevronRight, RotateCcw, ArrowLeft, Award,
} from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'
import { student } from '../../services/api'
import { EmptyBlock, ErrorBlock, LoadBlock } from './studentUtils'

const stateMeta = {
  open: { label: 'Open now', color: 'emerald' },
  in_progress: { label: 'In progress', color: 'amber' },
  completed: { label: 'Completed', color: 'sky' },
  upcoming: { label: 'Upcoming', color: 'gold' },
  awaiting: { label: 'Not opened', color: 'slate' },
  closed: { label: 'Closed', color: 'rose' },
  no_questions: { label: 'No questions', color: 'rose' },
  draft: { label: 'Draft', color: 'slate' },
}

const fmtDateTime = (iso) => {
  if (!iso) return '—'
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
}

const clock = (seconds) => {
  const safe = Math.max(0, Number(seconds) || 0)
  const h = Math.floor(safe / 3600)
  const m = Math.floor((safe % 3600) / 60)
  const s = safe % 60
  const pad = (value) => String(value).padStart(2, '0')
  return h ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`
}

const remainingSeconds = (expiresAt, serverNow) => {
  const offset = new Date(serverNow).getTime() - Date.now()
  const deadline = new Date(expiresAt).getTime() - offset
  return Math.max(0, Math.floor((deadline - Date.now()) / 1000))
}

export default function StudentCbt() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [busyId, setBusyId] = useState(null)
  const [actionError, setActionError] = useState(null)

  const [taking, setTaking] = useState(null)
  const [answers, setAnswers] = useState({})
  const [current, setCurrent] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [saveNote, setSaveNote] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [completion, setCompletion] = useState(null)

  const submittedRef = useRef(false)
  const saveTimerRef = useRef(null)
  const answersRef = useRef({})
  const finishRef = useRef(null)
  const attemptId = taking?.attemptId

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)

    student.cbt()
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

  useEffect(() => {
    if (!attemptId) return undefined

    const id = setInterval(() => {
      setSecondsLeft((value) => (value > 0 ? value - 1 : 0))
    }, 1000)

    return () => clearInterval(id)
  }, [attemptId])

  useEffect(() => {
    if (!taking) return undefined

    const handler = (event) => {
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [taking])

  useEffect(() => {
    if (taking && secondsLeft === 0 && !submittedRef.current) {
      finishRef.current?.(true)
    }
  }, [secondsLeft, taking])

  const begin = async (exam) => {
    setBusyId(exam.id)
    setActionError(null)

    try {
      const res = await student.startCbt(exam.id)
      const attempt = res.data
      const initial = {}

      Object.entries(attempt.answers || {}).forEach(([questionId, option]) => {
        if (option) initial[questionId] = option
      })

      submittedRef.current = false
      answersRef.current = initial
      setAnswers(initial)
      setCurrent(0)
      setSaveNote(null)
      setCompletion(null)
      setTaking(attempt)
      setSecondsLeft(remainingSeconds(attempt.expiresAt, attempt.serverNow))
    } catch (e) {
      setActionError(e.message)
    } finally {
      setBusyId(null)
    }
  }

  const saveAnswer = async (questionId, selectedOption) => {
    if (!taking) return

    try {
      await student.saveCbtAnswers(taking.attemptId, [{ questionId, selectedOption }])
      setSaveNote('Answers saved')
    } catch (e) {
      setSaveNote(e.message)
    }
  }

  const choose = (questionId, option) => {
    const next = { ...answersRef.current, [questionId]: option }
    answersRef.current = next
    setAnswers(next)
    setSaveNote('Saving...')

    clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => saveAnswer(questionId, option), 500)
  }

  const saveNow = async () => {
    if (!taking) return
    setSaveNote('Saving...')

    const list = Object.entries(answersRef.current)
      .filter(([, option]) => option)
      .map(([questionId, selectedOption]) => ({ questionId: Number(questionId), selectedOption }))

    try {
      await student.saveCbtAnswers(taking.attemptId, list)
      setSaveNote('All answers saved')
    } catch (e) {
      setSaveNote(e.message)
    }
  }

  const finish = async (auto = false) => {
    if (!taking || submittedRef.current) return
    if (!auto && !window.confirm('Submit this CBT now? You will not be able to change your answers after submission.')) return

    const unanswered = (taking.questions || []).filter((question) => !answersRef.current[question.id]).length
    if (!auto && unanswered > 0 && !window.confirm(`${unanswered} question${unanswered === 1 ? ' is' : 's are'} still unanswered. Submit anyway?`)) return

    submittedRef.current = true
    setSubmitting(true)
    setSaveNote(null)
    clearTimeout(saveTimerRef.current)

    const list = Object.entries(answersRef.current)
      .filter(([, option]) => option)
      .map(([questionId, selectedOption]) => ({ questionId: Number(questionId), selectedOption }))

    const exam = taking.exam

    try {
      const res = await student.submitCbt(taking.attemptId, list)
      setCompletion({
        auto,
        message: res.message,
        result: res.result,
        resultVisible: res.resultVisible,
        exam,
      })
      setTaking(null)
      setReloadKey((key) => key + 1)
    } catch (e) {
      submittedRef.current = false
      setSaveNote(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    finishRef.current = finish
  })

  const rows = data?.data || []
  const stats = data?.stats || {}

  if (loading) return <LoadBlock label="Loading CBTs..." />
  if (error) return <ErrorBlock message={error} onRetry={() => setReloadKey((key) => key + 1)} />

  if (completion) {
    const result = completion.result

    return (
      <div>
        <PageHeader title="CBT Submitted" subtitle={completion.exam?.title} />

        <Card className="overflow-hidden">
          <div className="bg-navy-900 px-6 py-8 text-center text-white">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/10"><CheckCircle2 size={28} /></span>
            <p className="mt-4 text-lg font-bold">{completion.auto ? 'Time is up — your answers were submitted.' : 'Your CBT has been submitted.'}</p>
            <p className="mt-1 text-sm text-white/70">{completion.exam?.assessmentType} · {completion.exam?.subject} · {completion.exam?.className}</p>
          </div>

          {completion.resultVisible && result ? (
            <div className="p-6">
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="rounded-xl bg-emerald-50 p-4 text-center"><p className="text-xs text-slate-500">Score</p><p className="mt-1 text-2xl font-bold text-emerald-700">{result.score}/{result.totalMarks}</p></div>
                <div className="rounded-xl bg-navy-50 p-4 text-center"><p className="text-xs text-slate-500">Percentage</p><p className="mt-1 text-2xl font-bold text-navy-900">{result.percentage}%</p></div>
                <div className="rounded-xl bg-cream-100 p-4 text-center"><p className="text-xs text-slate-500">Grade</p><p className="mt-1 text-2xl font-bold text-gold-600">{result.grade}</p></div>
                <div className="rounded-xl bg-sky-50 p-4 text-center"><p className="text-xs text-slate-500">Correct</p><p className="mt-1 text-2xl font-bold text-sky-700">{result.correctCount}/{result.questionsCount}</p></div>
              </div>
              <p className="mt-4 text-center text-sm text-slate-500">Submitted {fmtDateTime(result.submittedAt)}</p>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="flex items-center justify-center gap-2 text-sm font-medium text-amber-700"><AlertCircle size={16} /> {completion.message || 'Your score will be released by your teacher.'}</p>
            </div>
          )}

          <div className="flex justify-center border-t border-navy-100 p-5">
            <Button tone="primary" onClick={() => { setCompletion(null); setReloadKey((key) => key + 1) }}><ArrowLeft size={15} /> Back to CBT</Button>
          </div>
        </Card>
      </div>
    )
  }

  if (taking) {
    const questions = taking.questions || []
    const question = questions[current]
    const answeredCount = Object.values(answers).filter(Boolean).length
    const progress = questions.length ? Math.round((answeredCount / questions.length) * 100) : 0
    const urgent = secondsLeft <= 60

    return (
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-navy-100 bg-white p-4 shadow-card">
          <div>
            <p className="font-bold text-navy-900">{taking.exam.title}</p>
            <p className="text-xs text-slate-500">{taking.exam.assessmentType} · {taking.exam.subject} · {taking.exam.className} · {taking.exam.durationMinutes} minutes</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold ${urgent ? 'bg-rose-50 text-rose-600' : 'bg-navy-50 text-navy-800'}`}><Clock size={15} /> {clock(secondsLeft)}</span>
            <Button tone="outline" size="sm" onClick={saveNow} disabled={submitting}><Save size={14} /> Save</Button>
            <Button tone="emerald" size="sm" onClick={() => finish(false)} disabled={submitting}>{submitting ? 'Submitting...' : 'Submit CBT'}</Button>
          </div>
        </div>

        {saveNote && <p className="mb-3 text-xs font-medium text-slate-500">{saveNote}</p>}

        <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
          <Card className="h-fit p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-navy-900">Progress</span>
              <span className="text-slate-500">{answeredCount}/{questions.length}</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-navy-50"><div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${progress}%` }} /></div>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {questions.map((item, index) => {
                const answered = !!answers[item.id]
                const active = index === current
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrent(index)}
                    className={`grid h-9 place-items-center rounded-lg text-xs font-bold transition ${
                      active
                        ? 'bg-navy-800 text-white ring-2 ring-navy-300'
                        : answered
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-navy-50 text-slate-500 hover:bg-navy-100'
                    }`}
                  >
                    {index + 1}
                  </button>
                )
              })}
            </div>
            <p className="mt-4 text-[11px] leading-relaxed text-slate-400">{taking.exam.instructions || 'Answer all questions before submitting.'}</p>
          </Card>

          <Card className="p-6">
            {!question ? (
              <p className="py-12 text-center text-sm text-slate-400">No questions are available for this CBT.</p>
            ) : (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Question {current + 1} of {questions.length}</p>
                    <p className="mt-2 text-lg font-semibold leading-relaxed text-navy-900">{question.question}</p>
                  </div>
                  <Badge color="navy">{question.marks} mark{question.marks === 1 ? '' : 's'}</Badge>
                </div>

                <div className="mt-5 space-y-2">
                  {question.options.map((option) => {
                    const selected = answers[question.id] === option.key
                    return (
                      <button
                        key={option.key}
                        onClick={() => choose(question.id, option.key)}
                        className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${
                          selected
                            ? 'border-navy-700 bg-navy-50 text-navy-900'
                            : 'border-navy-100 bg-white text-slate-600 hover:border-navy-300 hover:bg-navy-50/50'
                        }`}
                      >
                        <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-bold ${selected ? 'bg-navy-800 text-white' : 'bg-navy-50 text-navy-700'}`}>{option.key}</span>
                        <span className="pt-1 text-sm">{option.text}</span>
                      </button>
                    )
                  })}
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-navy-100 pt-4">
                  <div className="flex gap-2">
                    <Button tone="outline" size="sm" onClick={() => setCurrent((value) => Math.max(0, value - 1))} disabled={current === 0}><ChevronLeft size={15} /> Previous</Button>
                    <Button tone="outline" size="sm" onClick={() => setCurrent((value) => Math.min(questions.length - 1, value + 1))} disabled={current === questions.length - 1}>Next <ChevronRight size={15} /></Button>
                  </div>
                  <Button tone="ghost" size="sm" onClick={() => choose(question.id, null)}><RotateCcw size={14} /> Clear Answer</Button>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="CBT" subtitle="Write your computer-based tests, resume unfinished attempts and see released scores" />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Play} label="Available" value={stats.available || 0} sub="ready to start" tone="emerald" index={0} />
        <StatCard icon={Clock} label="In Progress" value={stats.resumable || 0} sub="resume now" tone="gold" index={1} />
        <StatCard icon={CheckCircle2} label="Completed" value={stats.completed || 0} sub="submitted" tone="navy" index={2} />
        <StatCard icon={Trophy} label="Average" value={`${Number(stats.averagePercentage || 0).toFixed(1)}%`} sub="released scores" tone="sky" index={3} />
      </div>

      {actionError && <p className="mb-4 rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600">{actionError}</p>}

      {!rows.length ? (
        <EmptyBlock title="No CBTs yet" message="Your teachers will publish computer-based tests here when they are ready." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {rows.map((exam) => {
            const meta = stateMeta[exam.availability.state] || stateMeta.closed
            const attempt = exam.attempt
            const canAct = exam.availability.canStart || exam.availability.canResume

            return (
              <Card key={exam.id} className="flex flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-navy-900">{exam.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{exam.assessmentType} · {exam.subject} · {exam.className}{exam.term ? ` · ${exam.term}` : ''}</p>
                  </div>
                  <Badge color={meta.color} dot>{meta.label}</Badge>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <span className="rounded-lg bg-navy-50 px-3 py-2 text-slate-600"><ListChecks size={13} className="mr-1 inline" /> {exam.questionsCount} questions</span>
                  <span className="rounded-lg bg-navy-50 px-3 py-2 text-slate-600"><Award size={13} className="mr-1 inline" /> {exam.totalMarks} marks</span>
                  <span className="rounded-lg bg-navy-50 px-3 py-2 text-slate-600"><Clock size={13} className="mr-1 inline" /> {exam.durationMinutes} minutes</span>
                  <span className="rounded-lg bg-navy-50 px-3 py-2 text-slate-600">{fmtDateTime(exam.startsAt)}</span>
                </div>

                {exam.instructions && <p className="mt-3 line-clamp-2 text-xs text-slate-400">{exam.instructions}</p>}

                {attempt?.status === 'Submitted' && (
                  <div className="mt-4 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-700">
                    {exam.resultVisible
                      ? `Score: ${attempt.score}/${attempt.totalMarks} (${attempt.percentage}%)`
                      : 'Submitted — score awaiting release'}
                  </div>
                )}

                {attempt?.status === 'In Progress' && (
                  <div className="mt-4 rounded-xl bg-amber-50 px-3 py-2.5 text-sm font-semibold text-amber-700">
                    You have an unfinished attempt. Resume before it expires.
                  </div>
                )}

                <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                  <p className="text-xs text-slate-400">
                    {exam.availability.state === 'upcoming' && `Opens ${fmtDateTime(exam.startsAt)}`}
                    {exam.availability.state === 'awaiting' && 'Waiting for your teacher to open it'}
                    {exam.availability.state === 'closed' && 'This CBT is closed'}
                    {exam.availability.state === 'no_questions' && 'Questions are being prepared'}
                  </p>
                  <Button
                    tone={exam.availability.canResume ? 'gold' : 'primary'}
                    size="sm"
                    onClick={() => begin(exam)}
                    disabled={!canAct || busyId === exam.id}
                  >
                    {busyId === exam.id ? 'Opening...' : exam.availability.canResume ? 'Resume CBT' : exam.availability.canStart ? 'Start CBT' : attempt?.status === 'Submitted' ? 'Completed' : 'Not available'}
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
