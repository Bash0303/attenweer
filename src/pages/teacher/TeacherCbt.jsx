import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Plus, Pencil, Trash2, Eye, Play, Square, UploadCloud, Download,
  FileSpreadsheet, Clock, ListChecks, Trophy, CheckCircle2, AlertCircle, Save,
} from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import DataTable from '../../components/ui/DataTable'
import Modal from '../../components/ui/Modal'
import StatCard from '../../components/ui/StatCard'
import { teacher } from '../../services/api'
import {
  ASSESSMENT_COLORS, ASSESSMENT_TYPES, CBT_STATUS_COLORS, blankCbtExam, fmtCbtDateTime, toIso, toLocalInput,
} from '../../lib/cbt'
import { EmptyBlock, ErrorBlock, LoadBlock, inputCls } from './teacherUtils'

const blankQuestion = {
  question: '', optionA: '', optionB: '', optionC: '', optionD: '', optionE: '',
  correctOption: 'A', marks: 1,
}

export default function TeacherCbt() {
  const [exams, setExams] = useState([])
  const [stats, setStats] = useState({})
  const [options, setOptions] = useState({ assignments: [], terms: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [typeFilter, setTypeFilter] = useState('')

  const [examModal, setExamModal] = useState(false)
  const [editingExam, setEditingExam] = useState(null)
  const [form, setForm] = useState(blankCbtExam)
  const [formError, setFormError] = useState(null)
  const [saving, setSaving] = useState(false)

  const [manageExam, setManageExam] = useState(null)
  const [detail, setDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState(null)
  const [detailKey, setDetailKey] = useState(0)
  const [tab, setTab] = useState('questions')

  const [questionModal, setQuestionModal] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [questionForm, setQuestionForm] = useState(blankQuestion)
  const [questionError, setQuestionError] = useState(null)
  const [questionSaving, setQuestionSaving] = useState(false)

  const [uploadFile, setUploadFile] = useState(null)
  const [uploadMode, setUploadMode] = useState('append')
  const [uploading, setUploading] = useState(false)
  const [uploadNote, setUploadNote] = useState(null)
  const fileRef = useRef(null)

  const [results, setResults] = useState(null)
  const [resultsLoading, setResultsLoading] = useState(false)
  const [resultsError, setResultsError] = useState(null)
  const manageId = manageExam?.id

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)

    Promise.all([teacher.cbtExams(), teacher.cbtOptions()])
      .then(([examRes, optionsRes]) => {
        if (cancelled) return
        setExams(examRes.data || [])
        setStats(examRes.stats || {})
        setOptions({ assignments: optionsRes.assignments || [], terms: optionsRes.terms || [] })
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
    if (!manageId) return undefined

    let cancelled = false
    setDetailLoading(true)
    setDetailError(null)

    teacher.cbt(manageId)
      .then((res) => {
        if (cancelled) return
        setDetail(res)
        setManageExam((current) => (current?.id === res.data.id ? res.data : current))
      })
      .catch((e) => {
        if (!cancelled) setDetailError(e.message)
      })
      .finally(() => {
        if (!cancelled) setDetailLoading(false)
      })

    return () => { cancelled = true }
  }, [manageId, detailKey])

  useEffect(() => {
    if (!manageId || tab !== 'results') return undefined

    let cancelled = false
    setResultsLoading(true)
    setResultsError(null)

    teacher.cbtResults(manageId)
      .then((res) => {
        if (!cancelled) setResults(res)
      })
      .catch((e) => {
        if (!cancelled) setResultsError(e.message)
      })
      .finally(() => {
        if (!cancelled) setResultsLoading(false)
      })

    return () => { cancelled = true }
  }, [manageId, tab, detailKey])

  const assignments = useMemo(() => options.assignments || [], [options.assignments])
  const terms = options.terms || []

  const classOptions = useMemo(() => {
    const seen = new Set()
    return assignments.filter((item) => {
      if (seen.has(item.classId)) return false
      seen.add(item.classId)
      return true
    })
  }, [assignments])

  const subjectOptions = useMemo(
    () => assignments.filter((item) => String(item.classId) === String(form.classId)),
    [assignments, form.classId],
  )

  const setField = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setForm((current) => {
      if (key === 'classId') {
        const nextSubject = assignments.find((item) => String(item.classId) === String(value))
        return { ...current, classId: value, subjectId: nextSubject ? String(nextSubject.subjectId) : '' }
      }
      return { ...current, [key]: value }
    })
  }

  const openCreate = () => {
    const first = classOptions[0]
    const term = terms.find((item) => item.isCurrent) || terms[0]
    setEditingExam(null)
    setForm({
      ...blankCbtExam,
      assessmentType: 'Classwork',
      classId: first ? String(first.classId) : '',
      subjectId: first ? String(first.subjectId) : '',
      termId: term ? String(term.id) : '',
      startsAt: toLocalInput(new Date().toISOString()),
      endsAt: toLocalInput(new Date(Date.now() + 60 * 60 * 1000).toISOString()),
    })
    setFormError(null)
    setExamModal(true)
  }

  const openEdit = (exam) => {
    setEditingExam(exam)
    setForm({
      title: exam.title || '',
      assessmentType: exam.assessmentType || 'Exam',
      classId: exam.classId ? String(exam.classId) : '',
      subjectId: exam.subjectId ? String(exam.subjectId) : '',
      termId: exam.termId ? String(exam.termId) : '',
      instructions: exam.instructions || '',
      durationMinutes: exam.durationMinutes || 30,
      startsAt: toLocalInput(exam.startsAt),
      endsAt: toLocalInput(exam.endsAt),
      status: exam.status || 'Draft',
      shuffleQuestions: !!exam.shuffleQuestions,
      shuffleOptions: !!exam.shuffleOptions,
      showResultImmediately: !!exam.showResultImmediately,
    })
    setFormError(null)
    setExamModal(true)
  }

  const saveExam = async () => {
    if (!form.title.trim() || !form.assessmentType || !form.termId || !form.classId || !form.subjectId) {
      setFormError('Title, assessment type, term, class and subject are required.')
      return
    }

    setSaving(true)
    setFormError(null)

    const payload = {
      title: form.title.trim(),
      assessmentType: form.assessmentType,
      classId: Number(form.classId),
      subjectId: Number(form.subjectId),
      termId: Number(form.termId),
      instructions: form.instructions || null,
      durationMinutes: Number(form.durationMinutes) || 30,
      startsAt: toIso(form.startsAt),
      endsAt: toIso(form.endsAt),
      status: form.status,
      shuffleQuestions: !!form.shuffleQuestions,
      shuffleOptions: !!form.shuffleOptions,
      showResultImmediately: !!form.showResultImmediately,
    }

    try {
      if (editingExam) {
        await teacher.updateCbt(editingExam.id, payload)
      } else {
        await teacher.createCbt(payload)
      }
      setExamModal(false)
      setReloadKey((key) => key + 1)
      setDetailKey((key) => key + 1)
    } catch (e) {
      setFormError(e.errors ? Object.values(e.errors).flat().join(' ') : e.message)
    } finally {
      setSaving(false)
    }
  }

  const deleteExam = async (exam) => {
    if (!window.confirm(`Delete "${exam.title}" and all its questions and attempts?`)) return
    try {
      await teacher.deleteCbt(exam.id)
      if (manageExam?.id === exam.id) setManageExam(null)
      setReloadKey((key) => key + 1)
    } catch (e) {
      setError(e.message)
    }
  }

  const changeStatus = async (exam, action) => {
    try {
      await teacher.updateCbtStatus(exam.id, action)
      setReloadKey((key) => key + 1)
      if (manageExam?.id === exam.id) setDetailKey((key) => key + 1)
    } catch (e) {
      setError(e.errors ? Object.values(e.errors).flat().join(' ') : e.message)
    }
  }

  const openManage = (exam) => {
    setManageExam(exam)
    setDetail(null)
    setResults(null)
    setTab('questions')
    setUploadNote(null)
    setDetailKey((key) => key + 1)
  }

  const openQuestion = (question = null) => {
    setEditingQuestion(question)
    setQuestionForm(question ? {
      question: question.question,
      optionA: question.optionA,
      optionB: question.optionB,
      optionC: question.optionC,
      optionD: question.optionD,
      optionE: question.optionE || '',
      correctOption: question.correctOption,
      marks: question.marks,
    } : blankQuestion)
    setQuestionError(null)
    setQuestionModal(true)
  }

  const saveQuestion = async () => {
    if (!manageExam) return
    setQuestionSaving(true)
    setQuestionError(null)

    const payload = {
      ...questionForm,
      optionE: questionForm.optionE || null,
      marks: Number(questionForm.marks) || 1,
    }

    try {
      if (editingQuestion) {
        await teacher.updateCbtQuestion(manageExam.id, editingQuestion.id, payload)
      } else {
        await teacher.addCbtQuestion(manageExam.id, payload)
      }
      setQuestionModal(false)
      setDetailKey((key) => key + 1)
      setReloadKey((key) => key + 1)
    } catch (e) {
      setQuestionError(e.errors ? Object.values(e.errors).flat().join(' ') : e.message)
    } finally {
      setQuestionSaving(false)
    }
  }

  const deleteQuestion = async (question) => {
    if (!manageExam || !window.confirm('Delete this question?')) return
    try {
      await teacher.deleteCbtQuestion(manageExam.id, question.id)
      setDetailKey((key) => key + 1)
      setReloadKey((key) => key + 1)
    } catch (e) {
      setError(e.message)
    }
  }

  const handleFile = (event) => {
    const file = event.target.files?.[0] || null
    if (file && file.size > 10 * 1024 * 1024) {
      setUploadNote('That file is larger than 10MB. Please choose a smaller file.')
      setUploadFile(null)
      event.target.value = ''
      return
    }
    setUploadFile(file)
    setUploadNote(file ? `${file.name} is ready to upload.` : null)
  }

  const uploadQuestions = async () => {
    if (!manageExam || !uploadFile) {
      setUploadNote('Choose a question file first.')
      return
    }

    setUploading(true)
    setUploadNote(null)

    try {
      const data = new FormData()
      data.append('file', uploadFile)
      data.append('mode', uploadMode)
      const res = await teacher.uploadCbtQuestions(manageExam.id, data)
      setUploadNote(res.message)
      setUploadFile(null)
      if (fileRef.current) fileRef.current.value = ''
      setDetailKey((key) => key + 1)
      setReloadKey((key) => key + 1)
    } catch (e) {
      setUploadNote(e.errors ? Object.values(e.errors).flat().join(' ') : e.message)
    } finally {
      setUploading(false)
    }
  }

  const openResults = () => {
    setTab('results')
    setDetailKey((key) => key + 1)
  }

  const columns = [
    {
      key: 'title',
      label: 'CBT',
      render: (exam) => (
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-cream-100 text-navy-700"><ListChecks size={16} /></span>
          <div>
            <p className="font-semibold text-navy-900">{exam.title}</p>
            <p className="text-xs text-slate-400">{exam.assessmentType} · {exam.subjectName} · {exam.className}{exam.term ? ` · ${exam.term}` : ''}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'schedule',
      label: 'Schedule',
      render: (exam) => (
        <div className="text-xs text-slate-500">
          <p>{fmtCbtDateTime(exam.startsAt)}</p>
          <p className="text-slate-400">to {fmtCbtDateTime(exam.endsAt)}</p>
        </div>
      ),
    },
    { key: 'durationMinutes', label: 'Duration', render: (exam) => <span className="text-sm text-slate-600">{exam.durationMinutes} min</span> },
    {
      key: 'questionsCount',
      label: 'Questions',
      render: (exam) => (
        <div className="text-xs">
          <p className="font-semibold text-navy-900">{exam.questionsCount} question{exam.questionsCount === 1 ? '' : 's'}</p>
          <p className="text-slate-400">{exam.totalMarks} mark{exam.totalMarks === 1 ? '' : 's'} · {exam.submittedCount}/{exam.attemptsCount} submitted</p>
        </div>
      ),
    },
    { key: 'status', label: 'Status', render: (exam) => <Badge color={CBT_STATUS_COLORS[exam.status] || 'slate'} dot>{exam.status}</Badge> },
    {
      key: 'actions',
      label: '',
      right: true,
      render: (exam) => (
        <div className="flex items-center justify-end gap-1">
          <button onClick={(event) => { event.stopPropagation(); openManage(exam) }} title="Manage questions and results" className="grid h-8 w-8 place-items-center rounded-lg text-navy-600 transition hover:bg-navy-50"><Eye size={15} /></button>
          {exam.status === 'Active' ? (
            <button onClick={(event) => { event.stopPropagation(); changeStatus(exam, 'close') }} title="Close CBT" className="grid h-8 w-8 place-items-center rounded-lg text-rose-600 transition hover:bg-rose-50"><Square size={15} /></button>
          ) : (
            <button onClick={(event) => { event.stopPropagation(); changeStatus(exam, 'open') }} title="Open CBT now" className="grid h-8 w-8 place-items-center rounded-lg text-emerald-600 transition hover:bg-emerald-50"><Play size={15} /></button>
          )}
          <button onClick={(event) => { event.stopPropagation(); openEdit(exam) }} title="Edit CBT" className="grid h-8 w-8 place-items-center rounded-lg text-navy-600 transition hover:bg-navy-50"><Pencil size={15} /></button>
          <button onClick={(event) => { event.stopPropagation(); deleteExam(exam) }} title="Delete CBT" className="grid h-8 w-8 place-items-center rounded-lg text-rose-600 transition hover:bg-rose-50"><Trash2 size={15} /></button>
        </div>
      ),
    },
  ]

  if (loading) return <LoadBlock label="Loading CBT centre..." />
  if (error) return <ErrorBlock message={error} onRetry={() => setReloadKey((key) => key + 1)} />

  const questions = detail?.questions || []
  const questionsLocked = (detail?.data?.attemptsCount || 0) > 0
  const visibleExams = typeFilter ? exams.filter((exam) => exam.assessmentType === typeFilter) : exams

  return (
    <div>
      <PageHeader
        title="CBT Centre"
        subtitle="Create computer-based tests, upload questions in bulk, schedule them and review results"
        actions={<Button tone="primary" onClick={openCreate}><Plus size={16} /> New CBT</Button>}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={ListChecks} label="Total CBTs" value={stats.total || 0} sub="created" tone="navy" index={0} />
        <StatCard icon={Play} label="Open" value={stats.active || 0} sub="in progress" tone="emerald" index={1} />
        <StatCard icon={Clock} label="Scheduled" value={stats.scheduled || 0} sub="upcoming" tone="gold" index={2} />
        <StatCard icon={Square} label="Closed" value={stats.closed || 0} sub="completed" tone="rose" index={3} />
      </div>

      {!exams.length ? (
        <EmptyBlock title="No CBTs yet" message="Create your first computer-based test, add questions manually or upload them from Excel, then schedule and open it for your class." />
      ) : (
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy-100 px-6 py-4">
            <div>
              <h3 className="font-bold text-navy-900">My CBTs</h3>
              <p className="text-xs text-slate-400">Only class and subject combinations assigned to you are available.</p>
            </div>
            <select className="rounded-xl border border-navy-100 px-3 py-2 text-sm" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
              <option value="">All assessment types</option>
              {ASSESSMENT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          <DataTable columns={columns} rows={visibleExams} rowKey="id" onRowClick={openManage} />
        </Card>
      )}

      <Modal open={examModal} onClose={() => setExamModal(false)} title={editingExam ? 'Edit CBT' : 'Create CBT'} size="xl">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Title</span>
            <input className={inputCls} value={form.title} onChange={setField('title')} placeholder="e.g. First Term Mathematics First CA" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Assessment Type</span>
            <select className={inputCls} value={form.assessmentType} onChange={setField('assessmentType')}>
              {ASSESSMENT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Term</span>
            <select className={inputCls} value={form.termId} onChange={setField('termId')}>
              <option value="">Select term</option>
              {terms.map((term) => <option key={term.id} value={term.id}>{term.label || term.name}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Class</span>
            <select className={inputCls} value={form.classId} onChange={setField('classId')}>
              <option value="">Select class</option>
              {classOptions.map((item) => <option key={item.classId} value={item.classId}>{item.className}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Subject</span>
            <select className={inputCls} value={form.subjectId} onChange={setField('subjectId')}>
              <option value="">Select subject</option>
              {subjectOptions.map((item) => <option key={item.subjectId} value={item.subjectId}>{item.subjectName}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Duration (minutes)</span>
            <input type="number" min="1" max="240" className={inputCls} value={form.durationMinutes} onChange={setField('durationMinutes')} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Starts (your local time)</span>
            <input type="datetime-local" className={inputCls} value={form.startsAt} onChange={setField('startsAt')} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Ends (your local time)</span>
            <input type="datetime-local" className={inputCls} value={form.endsAt} onChange={setField('endsAt')} />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Instructions</span>
            <textarea rows={3} className={inputCls} value={form.instructions} onChange={setField('instructions')} placeholder="Shown to students before they start" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Status</span>
            <select className={inputCls} value={form.status} onChange={setField('status')}>
              <option value="Draft">Draft</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Active">Open now</option>
              <option value="Closed">Closed</option>
            </select>
          </label>
          <div className="flex flex-col justify-end gap-2 text-sm text-slate-600">
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.shuffleQuestions} onChange={setField('shuffleQuestions')} /> Shuffle questions for each student</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.shuffleOptions} onChange={setField('shuffleOptions')} /> Shuffle option order</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.showResultImmediately} onChange={setField('showResultImmediately')} /> Show score immediately after submission</label>
          </div>
        </div>
        {formError && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600">{formError}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <Button tone="ghost" onClick={() => setExamModal(false)}>Cancel</Button>
          <Button tone="primary" onClick={saveExam} disabled={saving}><Save size={15} /> {saving ? 'Saving...' : editingExam ? 'Save Changes' : 'Create CBT'}</Button>
        </div>
      </Modal>

      <Modal open={!!manageExam} onClose={() => setManageExam(null)} title={manageExam ? manageExam.title : 'Manage CBT'} size="xl">
        {manageExam && (
          <div>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">{manageExam.className} · {manageExam.subjectName}{manageExam.term ? ` · ${manageExam.term}` : ''}</p>
                <p className="mt-1 text-xs text-slate-400">{fmtCbtDateTime(manageExam.startsAt)} — {fmtCbtDateTime(manageExam.endsAt)} · {manageExam.durationMinutes} minutes</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge color={ASSESSMENT_COLORS[manageExam.assessmentType] || 'slate'}>{manageExam.assessmentType}</Badge>
                <Badge color={CBT_STATUS_COLORS[manageExam.status] || 'slate'} dot>{manageExam.status}</Badge>
                <Badge color="navy">{manageExam.questionsCount} questions</Badge>
                <Badge color="slate">{manageExam.totalMarks} marks</Badge>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {manageExam.status !== 'Active' && <Button tone="emerald" size="sm" onClick={() => changeStatus(manageExam, 'open')}><Play size={14} /> Open Now</Button>}
              {manageExam.status === 'Active' && <Button tone="danger" size="sm" onClick={() => changeStatus(manageExam, 'close')}><Square size={14} /> Close CBT</Button>}
              <Button tone="outline" size="sm" onClick={() => changeStatus(manageExam, 'schedule')}><Clock size={14} /> Mark Scheduled</Button>
              <Button tone="outline" size="sm" onClick={() => openEdit(manageExam)}><Pencil size={14} /> Edit Settings</Button>
              <Button tone="outline" size="sm" onClick={() => { setTab('results'); setDetailKey((key) => key + 1) }}><Trophy size={14} /> Results</Button>
            </div>

            <div className="mt-5 flex gap-2 border-b border-navy-100">
              <button onClick={() => setTab('questions')} className={`px-3 pb-2 text-sm font-semibold ${tab === 'questions' ? 'border-b-2 border-navy-800 text-navy-900' : 'text-slate-400'}`}>Questions</button>
              <button onClick={openResults} className={`px-3 pb-2 text-sm font-semibold ${tab === 'results' ? 'border-b-2 border-navy-800 text-navy-900' : 'text-slate-400'}`}>Results</button>
            </div>

            {detailError && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600">{detailError}</p>}

            {tab === 'questions' && (
              <div className="mt-4">
                {questionsLocked && (
                  <p className="mb-3 flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700"><AlertCircle size={15} /> Questions are locked because students have already started this CBT.</p>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  <Button tone="primary" size="sm" onClick={() => openQuestion()} disabled={questionsLocked}><Plus size={14} /> Add Question</Button>
                  <Button tone="outline" size="sm" onClick={() => teacher.downloadCbtTemplate().catch((e) => setUploadNote(e.message))}><Download size={14} /> Template</Button>
                  <Button tone="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={questionsLocked}><UploadCloud size={14} /> {uploadFile ? 'Change File' : 'Bulk Upload'}</Button>
                  <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} className="hidden" />
                  <select value={uploadMode} onChange={(event) => setUploadMode(event.target.value)} disabled={questionsLocked} className="rounded-xl border border-navy-100 px-3 py-1.5 text-sm">
                    <option value="append">Append</option>
                    <option value="replace">Replace all</option>
                  </select>
                  <Button tone="gold" size="sm" onClick={uploadQuestions} disabled={uploading || questionsLocked || !uploadFile}><UploadCloud size={14} /> {uploading ? 'Uploading...' : 'Upload'}</Button>
                  <span className="text-xs text-slate-400">{uploadFile ? uploadFile.name : 'XLSX, XLS or CSV · max 10MB'}</span>
                </div>
                <p className="mt-2 text-xs text-slate-500">Scoring: 50 questions × 1 mark = 50 total; 50 questions × 2 marks = 100 total. Set each question's score in Add/Edit Question or the Marks column in the template.</p>

                {uploadNote && <p className="mt-3 rounded-xl bg-navy-50 px-4 py-2.5 text-sm font-medium text-navy-700">{uploadNote}</p>}

                <div className="mt-4 max-h-[420px] space-y-2 overflow-y-auto">
                  {detailLoading && !detail && <p className="py-8 text-center text-sm text-slate-400">Loading questions...</p>}
                  {!detailLoading && !questions.length && <p className="py-8 text-center text-sm text-slate-400">No questions yet. Add manually or upload the Excel template.</p>}
                  {questions.map((question, index) => (
                    <div key={question.id} className="rounded-xl border border-navy-100 p-3">
                      <div className="flex items-start gap-3">
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-navy-800 text-xs font-bold text-white">{index + 1}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-navy-900">{question.question}</p>
                          <div className="mt-1 grid gap-1 text-xs text-slate-500 sm:grid-cols-2">
                            {['A', 'B', 'C', 'D', 'E'].map((label) => {
                              const text = question[`option${label}`]
                              if (!text) return null
                              return (
                                <span key={label} className={question.correctOption === label ? 'font-semibold text-emerald-600' : ''}>
                                  {label}. {text}{question.correctOption === label ? ' ✓' : ''}
                                </span>
                              )
                            })}
                          </div>
                          <p className="mt-1 text-[11px] text-slate-400">{question.marks} mark{question.marks === 1 ? '' : 's'}</p>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => openQuestion(question)} disabled={questionsLocked} className="grid h-7 w-7 place-items-center rounded-lg text-navy-600 hover:bg-navy-50 disabled:opacity-40"><Pencil size={14} /></button>
                          <button onClick={() => deleteQuestion(question)} disabled={questionsLocked} className="grid h-7 w-7 place-items-center rounded-lg text-rose-600 hover:bg-rose-50 disabled:opacity-40"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'results' && (
              <div className="mt-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm text-slate-500">Scores are graded automatically when a student submits.</p>
                  <Button tone="outline" size="sm" onClick={() => teacher.downloadCbtResults(manageExam.id).catch((e) => setResultsError(e.message))}><FileSpreadsheet size={14} /> Download Excel</Button>
                </div>

                {resultsError && <p className="mt-3 rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600">{resultsError}</p>}
                {resultsLoading && !results && <p className="py-8 text-center text-sm text-slate-400">Loading results...</p>}

                {results && (
                  <>
                    <div className="mt-4 grid gap-3 sm:grid-cols-4">
                      <div className="rounded-xl bg-navy-50 p-3"><p className="text-xs text-slate-500">Attempted</p><p className="text-lg font-bold text-navy-900">{results.stats.attempted}/{results.stats.classStudents}</p></div>
                      <div className="rounded-xl bg-emerald-50 p-3"><p className="text-xs text-slate-500">Submitted</p><p className="text-lg font-bold text-emerald-700">{results.stats.submitted}</p></div>
                      <div className="rounded-xl bg-cream-100 p-3"><p className="text-xs text-slate-500">Average</p><p className="text-lg font-bold text-gold-600">{results.stats.averagePercentage}%</p></div>
                      <div className="rounded-xl bg-sky-50 p-3"><p className="text-xs text-slate-500">Highest</p><p className="text-lg font-bold text-sky-700">{results.stats.highest}%</p></div>
                    </div>

                    <div className="mt-4 max-h-[360px] overflow-auto rounded-xl border border-navy-100">
                      <table className="w-full min-w-[620px] text-left text-sm">
                        <thead className="sticky top-0 bg-navy-900 text-white">
                          <tr>{['Pos', 'Student', 'Admission No', 'Score', '%', 'Status', 'Submitted'].map((head) => <th key={head} className="whitespace-nowrap px-3 py-2.5 text-xs font-semibold uppercase tracking-wide">{head}</th>)}</tr>
                        </thead>
                        <tbody className="divide-y divide-navy-50">
                          {results.data.map((row) => (
                            <tr key={row.attemptId}>
                              <td className="px-3 py-2 font-bold text-navy-900">{row.position || '—'}</td>
                              <td className="px-3 py-2 font-medium text-navy-900">{row.name}</td>
                              <td className="px-3 py-2 text-xs text-slate-400">{row.admissionNo}</td>
                              <td className="px-3 py-2 font-semibold text-navy-900">{row.score}/{row.totalMarks}</td>
                              <td className="px-3 py-2">{row.percentage}%</td>
                              <td className="px-3 py-2"><Badge color={row.status === 'Submitted' ? 'emerald' : 'amber'} dot>{row.status}</Badge></td>
                              <td className="px-3 py-2 text-xs text-slate-400">{fmtCbtDateTime(row.submittedAt)}</td>
                            </tr>
                          ))}
                          {!results.data.length && <tr><td colSpan={7} className="px-3 py-8 text-center text-sm text-slate-400">No student has attempted this CBT yet.</td></tr>}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal open={questionModal} onClose={() => setQuestionModal(false)} title={editingQuestion ? 'Edit Question' : 'Add Question'} size="lg">
        <div className="space-y-3">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Question</span>
            <textarea rows={2} className={inputCls} value={questionForm.question} onChange={(event) => setQuestionForm((current) => ({ ...current, question: event.target.value }))} />
          </label>
          {['A', 'B', 'C', 'D', 'E'].map((label) => (
            <label key={label} className="block">
              <span className="mb-1.5 block text-sm font-semibold text-navy-800">Option {label}{label === 'E' ? ' (optional)' : ''}</span>
              <input className={inputCls} value={questionForm[`option${label}`]} onChange={(event) => setQuestionForm((current) => ({ ...current, [`option${label}`]: event.target.value }))} />
            </label>
          ))}
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-navy-800">Correct Answer</span>
              <select className={inputCls} value={questionForm.correctOption} onChange={(event) => setQuestionForm((current) => ({ ...current, correctOption: event.target.value }))}>
                {['A', 'B', 'C', 'D', 'E'].map((label) => <option key={label} value={label}>{label}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-navy-800">Score for this question</span>
              <input type="number" min="1" max="100" className={inputCls} value={questionForm.marks} onChange={(event) => setQuestionForm((current) => ({ ...current, marks: event.target.value }))} />
              <span className="mt-1 block text-xs text-slate-400">Use 1 or 2 marks. The CBT total is the sum of all question scores.</span>
            </label>
          </div>
        </div>
        {questionError && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600">{questionError}</p>}
        <div className="mt-5 flex justify-end gap-2">
          <Button tone="ghost" onClick={() => setQuestionModal(false)}>Cancel</Button>
          <Button tone="primary" onClick={saveQuestion} disabled={questionSaving}><CheckCircle2 size={15} /> {questionSaving ? 'Saving...' : 'Save Question'}</Button>
        </div>
      </Modal>
    </div>
  )
}
