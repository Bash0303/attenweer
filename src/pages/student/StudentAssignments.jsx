import { useEffect, useRef, useState } from 'react'
import { CheckCircle2, Clock, Paperclip, PenSquare, Send, UploadCloud } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Badge, { statusColor } from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { student } from '../../services/api'
import { EmptyBlock, ErrorBlock, LoadBlock, inputCls } from './studentUtils'

const FILTERS = ['All', 'Pending', 'Submitted', 'Graded', 'Overdue']

export default function StudentAssignments() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [filter, setFilter] = useState('All')
  const [active, setActive] = useState(null)
  const [answer, setAnswer] = useState('')
  const [file, setFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)
  const [notice, setNotice] = useState(null)
  const fileRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)

    student.assignments()
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

  const openSubmit = (assignment) => {
    setActive(assignment)
    setAnswer(assignment.answer || '')
    setFile(null)
    setFormError(null)
    setNotice(null)
  }

  const closeSubmit = () => {
    if (submitting) return
    setActive(null)
    setFile(null)
    setFormError(null)
  }

  const submit = async () => {
    if (!active) return
    if (!answer.trim() && !file) {
      setFormError('Type your answer or attach a file before submitting.')
      return
    }

    setSubmitting(true)
    setFormError(null)

    try {
      const formData = new FormData()
      if (answer.trim()) formData.append('answer', answer.trim())
      if (file) formData.append('file', file)
      const res = await student.submitAssignment(active.id, formData)
      setNotice(res.message || 'Assignment submitted successfully.')
      setActive(null)
      setFile(null)
      setReloadKey((key) => key + 1)
    } catch (e) {
      setFormError(e.errors ? Object.values(e.errors).flat().join(' ') : e.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading && !data) return <LoadBlock label="Loading your assignments..." />
  if (error) return <ErrorBlock message={error} onRetry={() => setReloadKey((key) => key + 1)} />

  const assignments = data?.data || []
  const stats = data?.stats || {}
  const rows = filter === 'All' ? assignments : assignments.filter((assignment) => assignment.status === filter)

  return (
    <div>
      <PageHeader title="Assignments" subtitle="View tasks, submit your work and check your scores" />

      {notice && <div className="mb-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{notice}</div>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          ['Total', stats.total || 0],
          ['Pending', stats.pending || 0],
          ['Submitted', stats.submitted || 0],
          ['Graded', stats.graded || 0],
          ['Overdue', stats.overdue || 0],
        ].map(([label, value]) => (
          <Card key={label} className="p-4">
            <p className="text-2xl font-extrabold text-navy-900">{value}</p>
            <p className="text-xs font-medium text-slate-500">{label}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <button key={item} onClick={() => setFilter(item)} className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition ${filter === item ? 'bg-navy-800 text-white' : 'bg-white text-slate-500 hover:bg-navy-50'}`}>{item}</button>
        ))}
      </div>

      {!rows.length ? (
        <div className="mt-6"><EmptyBlock title="Nothing here" message={filter === 'All' ? 'No assignments have been posted for your class yet.' : `You have no ${filter.toLowerCase()} assignments.`} /></div>
      ) : (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {rows.map((assignment) => {
            const canSubmit = assignment.status === 'Pending' || assignment.status === 'Overdue'
            return (
              <Card key={assignment.id} className="p-5">
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-navy-800 text-gold-400"><PenSquare size={16} /></span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h4 className="font-bold text-navy-900">{assignment.title}</h4>
                      <Badge color={statusColor(assignment.status)} dot>{assignment.status}</Badge>
                    </div>
                    <p className="text-xs text-slate-400">{assignment.subject || 'General'} &middot; {assignment.teacher || 'Unassigned'}</p>
                    {assignment.description && <p className="mt-2 text-sm leading-relaxed text-slate-500">{assignment.description}</p>}
                    <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
                      <span className="flex items-center gap-1.5 font-semibold text-navy-700"><Clock size={13} /> Due {assignment.deadline || 'not set'}</span>
                      <span className="text-slate-400">{assignment.type || 'Assignment'}</span>
                    </div>
                    {assignment.submittedAt && (
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600"><CheckCircle2 size={13} /> Submitted {new Date(assignment.submittedAt).toLocaleDateString('en-GB')}</p>
                    )}
                    {assignment.answer && <p className="mt-2 rounded-lg bg-navy-50 p-2 text-xs text-slate-600">{assignment.answer}</p>}
                    {(assignment.score !== null && assignment.score !== undefined) && (
                      <p className="mt-2 text-xs font-bold text-navy-900">Score: {assignment.score}{assignment.grade ? ` (${assignment.grade})` : ''}</p>
                    )}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Button tone={canSubmit ? 'primary' : 'outline'} size="sm" onClick={() => openSubmit(assignment)}>
                        {canSubmit ? <Send size={14} /> : <CheckCircle2 size={14} />} {canSubmit ? (assignment.submissionStatus ? 'Resubmit' : 'Submit work') : 'View submission'}
                      </Button>
                      {assignment.file && <span className="flex items-center gap-1 text-xs text-slate-400"><Paperclip size={12} />{assignment.file}</span>}
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <Modal open={Boolean(active)} onClose={closeSubmit} title={active ? `Submit: ${active.title}` : 'Submit assignment'}>
        {active && (
          <div className="space-y-4">
            <p className="rounded-xl bg-cream-100/70 p-3 text-sm text-slate-600">Due {active.deadline || 'not set'} &bull; {active.subject || 'General'}</p>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-navy-800">Your Answer</span>
              <textarea rows={6} value={answer} onChange={(event) => setAnswer(event.target.value)} className={inputCls} placeholder="Type your answer here..." />
            </label>
            <div>
              <span className="mb-1.5 block text-sm font-semibold text-navy-800">Attachment (optional)</span>
              <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={(event) => setFile(event.target.files?.[0] || null)} className="hidden" />
              <div className="flex flex-wrap items-center gap-2">
                <Button tone="outline" size="sm" onClick={() => fileRef.current?.click()}><UploadCloud size={14} /> Choose file</Button>
                <span className="text-xs text-slate-400">{file ? file.name : 'PDF, DOC, DOCX, JPG or PNG up to 10MB'}</span>
              </div>
            </div>
            {formError && <p className="text-sm font-medium text-rose-600">{formError}</p>}
            <div className="flex justify-end gap-2">
              <Button tone="ghost" onClick={closeSubmit} disabled={submitting}>Cancel</Button>
              <Button tone="primary" onClick={submit} disabled={submitting}><Send size={15} /> {submitting ? 'Submitting...' : 'Submit'}</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
