import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ListChecks, Play, Clock, Square, FileSpreadsheet, Trash2, Search, Filter, Plus, Pencil, Save,
  UploadCloud, Download, CheckCircle2,
} from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import DataTable from '../../components/ui/DataTable'
import StatCard from '../../components/ui/StatCard'
import Modal from '../../components/ui/Modal'
import { admin } from '../../services/api'
import {
  ASSESSMENT_COLORS, ASSESSMENT_TYPES, CBT_STATUS_COLORS, blankCbtExam, fmtCbtDateTime, toIso, toLocalInput,
} from '../../lib/cbt'

const inputCls = 'w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none transition focus:border-navy-400 focus:ring-2 focus:ring-navy-100'
const blankQuestion = {
  question: '', optionA: '', optionB: '', optionC: '', optionD: '', optionE: '',
  correctOption: 'A', marks: 1,
}

function LoadBlock() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-navy-100 border-t-navy-700" />
      <p className="text-sm text-slate-400">Loading CBT oversight...</p>
    </div>
  )
}

export default function AdminCbt() {
  const [rows, setRows] = useState([])
  const [stats, setStats] = useState({})
  const [classes, setClasses] = useState([])
  const [options, setOptions] = useState({ assignments: [], terms: [], assessmentTypes: ASSESSMENT_TYPES })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [classId, setClassId] = useState('')
  const [status, setStatus] = useState('')
  const [assessmentType, setAssessmentType] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')

  const [examModal, setExamModal] = useState(false)
  const [editingExam, setEditingExam] = useState(null)
  const [form, setForm] = useState(blankCbtExam)
  const [formError, setFormError] = useState(null)
  const [saving, setSaving] = useState(false)

  const [manageExam, setManageExam] = useState(null)
  const [manageDetail, setManageDetail] = useState(null)
  const [manageLoading, setManageLoading] = useState(false)
  const [manageError, setManageError] = useState(null)
  const [manageKey, setManageKey] = useState(0)
  const [questionModal, setQuestionModal] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [questionForm, setQuestionForm] = useState(blankQuestion)
  const [questionError, setQuestionError] = useState(null)
  const [questionSaving, setQuestionSaving] = useState(false)
  const [questionFile, setQuestionFile] = useState(null)
  const [uploadMode, setUploadMode] = useState('append')
  const [uploadNote, setUploadNote] = useState(null)
  const [uploading, setUploading] = useState(false)
  const questionFileRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)

    admin.cbt({ classId, status, assessmentType, search })
      .then((res) => {
        if (cancelled) return
        setRows(res.data || [])
        setStats(res.stats || {})
        setClasses(res.classes || [])
      })
      .catch((e) => {
        if (!cancelled) setError(e.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [classId, status, assessmentType, search, reloadKey])

  useEffect(() => {
    let cancelled = false

    admin.cbtOptions()
      .then((res) => {
        if (!cancelled) setOptions(res)
      })
      .catch((e) => {
        if (!cancelled) setError(e.message)
      })

    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!manageExam?.id) return undefined

    let cancelled = false
    setManageLoading(true)
    setManageError(null)

    admin.cbtExam(manageExam.id)
      .then((res) => {
        if (!cancelled) setManageDetail(res)
      })
      .catch((e) => {
        if (!cancelled) setManageError(e.message)
      })
      .finally(() => {
        if (!cancelled) setManageLoading(false)
      })

    return () => { cancelled = true }
  }, [manageExam?.id, manageKey])

  const assignments = useMemo(() => options.assignments || [], [options.assignments])
  const terms = useMemo(() => options.terms || [], [options.terms])
  const types = useMemo(
    () => (options.assessmentTypes?.length ? options.assessmentTypes : ASSESSMENT_TYPES),
    [options.assessmentTypes],
  )

  const manageData = manageDetail?.data || manageExam
  const manageQuestions = manageDetail?.questions || []
  const questionsLocked = Boolean(manageData?.attemptsCount)

  const classOptions = useMemo(() => {
    const seen = new Set()
    return assignments.filter((item) => {
      if (seen.has(item.classId)) return false
      seen.add(item.classId)
      return true
    })
  }, [assignments])

  const subjectOptions = useMemo(() => {
    const seen = new Set()
    return assignments
      .filter((item) => String(item.classId) === String(form.classId))
      .filter((item) => {
        if (seen.has(item.subjectId)) return false
        seen.add(item.subjectId)
        return true
      })
  }, [assignments, form.classId])

  const teacherOptions = useMemo(
    () => assignments.filter((item) => (
      String(item.classId) === String(form.classId) && String(item.subjectId) === String(form.subjectId)
    )),
    [assignments, form.classId, form.subjectId],
  )

  const setField = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value

    setForm((current) => {
      if (key === 'classId') {
        const next = assignments.find((item) => String(item.classId) === String(value))
        return {
          ...current,
          classId: value,
          subjectId: next ? String(next.subjectId) : '',
          teacherId: next ? String(next.teacherId) : '',
        }
      }

      if (key === 'subjectId') {
        const next = assignments.find((item) => (
          String(item.classId) === String(current.classId) && String(item.subjectId) === String(value)
        ))
        return { ...current, subjectId: value, teacherId: next ? String(next.teacherId) : '' }
      }

      return { ...current, [key]: value }
    })
  }

  const openCreate = () => {
    const first = assignments[0]
    const term = terms.find((item) => item.isCurrent) || terms[0]
    setEditingExam(null)
    setForm({
      ...blankCbtExam,
      assessmentType: 'Classwork',
      classId: first ? String(first.classId) : '',
      subjectId: first ? String(first.subjectId) : '',
      teacherId: first ? String(first.teacherId) : '',
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
      teacherId: exam.teacherId ? String(exam.teacherId) : '',
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

  const openManage = (exam) => {
    setManageExam(exam)
    setManageDetail(null)
    setManageError(null)
    setQuestionFile(null)
    setUploadNote(null)
    setManageKey((key) => key + 1)
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
    if (!questionForm.question.trim() || !questionForm.optionA || !questionForm.optionB || !questionForm.optionC || !questionForm.optionD) {
      setQuestionError('Question, options A-D and correct answer are required.')
      return
    }
    if (!['A','B','C','D','E'].includes(questionForm.correctOption)) {
      setQuestionError('Select correct answer A-E.')
      return
    }
    const key = 'option'+questionForm.correctOption
    if (questionForm[key] === '') {
      setQuestionError('The correct answer must match a provided option.')
      return
    }

    setQuestionSaving(true)
    setQuestionError(null)

    const payload = {
      question: questionForm.question.trim(),
      optionA: questionForm.optionA.trim(),
      optionB: questionForm.optionB.trim(),
      optionC: questionForm.optionC.trim(),
      optionD: questionForm.optionD.trim(),
      optionE: questionForm.optionE.trim() || null,
      correctOption: questionForm.correctOption,
      marks: Number(questionForm.marks) || 1,
    }

    try {
      if (editingQuestion) {
        await admin.updateCbtQuestion(manageExam.id, editingQuestion.id, payload)
      } else {
        await admin.addCbtQuestion(manageExam.id, payload)
      }
      setQuestionModal(false)
      setManageKey((key) => key + 1)
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
      await admin.deleteCbtQuestion(manageExam.id, question.id)
      setManageKey((key) => key + 1)
      setReloadKey((key) => key + 1)
    } catch (e) {
      setManageError(e.message)
    }
  }

  const handleQuestionFile = (event) => {
    setQuestionFile(event.target.files?.[0] ?? null)
    setUploadNote(null)
    event.target.value = ''
  }

  const uploadQuestions = async () => {
    if (!questionFile) return
    setUploading(true)
    setUploadNote(null)

    const formData = new FormData()
    formData.append('file', questionFile)
    formData.append('mode', uploadMode)

    try {
      const res = await admin.uploadCbtQuestions(manageExam.id, formData)
      setUploadNote(`${res.saved} question(s) uploaded (skipped ${res.skipped}).`)
      setQuestionFile(null)
      setManageKey((key) => key + 1)
      setReloadKey((key) => key + 1)
    } catch (e) {
      setUploadNote(e.message || 'Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  const saveExam = async () => {
    if (!form.title.trim() || !form.assessmentType || !form.termId || !form.classId || !form.subjectId || !form.teacherId) {
      setFormError('Title, assessment type, term, class, subject and teacher are required.')
      return
    }

    setSaving(true)
    setFormError(null)

    const payload = {
      title: form.title.trim(),
      assessmentType: form.assessmentType,
      classId: Number(form.classId),
      subjectId: Number(form.subjectId),
      teacherId: Number(form.teacherId),
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
        await admin.updateCbt(editingExam.id, payload)
      } else {
        await admin.createCbt(payload)
      }
      setExamModal(false)
      setReloadKey((key) => key + 1)
    } catch (e) {
      setFormError(e.errors ? Object.values(e.errors).flat().join(' ') : e.message)
    } finally {
      setSaving(false)
    }
  }

  const changeStatus = async (exam, action) => {
    try {
      await admin.updateCbtStatus(exam.id, action)
      setReloadKey((key) => key + 1)
    } catch (e) {
      setError(e.message)
    }
  }

  const remove = async (exam) => {
    if (!window.confirm(`Delete "${exam.title}"? This removes all questions and attempts.`)) return
    try {
      await admin.deleteCbt(exam.id)
      setReloadKey((key) => key + 1)
    } catch (e) {
      setError(e.message)
    }
  }

  const scopeLocked = Boolean(editingExam?.attemptsCount)

  const columns = [
    {
      key: 'title',
      label: 'CBT',
      render: (exam) => (
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-cream-100 text-navy-700"><ListChecks size={16} /></span>
          <div>
            <p className="font-semibold text-navy-900">{exam.title}</p>
            <p className="text-xs text-slate-400">{exam.className} · {exam.subjectName} · {exam.teacher || 'No teacher'}{exam.term ? ` · ${exam.term}` : ''}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'assessmentType',
      label: 'Type',
      render: (exam) => <Badge color={ASSESSMENT_COLORS[exam.assessmentType] || 'slate'}>{exam.assessmentType}</Badge>,
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
          <p className="text-slate-400">{exam.totalMarks} marks</p>
        </div>
      ),
    },
    {
      key: 'attemptsCount',
      label: 'Attempts',
      render: (exam) => (
        <div className="text-xs">
          <p className="font-semibold text-navy-900">{exam.submittedCount}/{exam.attemptsCount}</p>
          <p className="text-slate-400">{exam.averagePercentage}% average</p>
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
          {exam.status === 'Active' ? (
            <button onClick={() => changeStatus(exam, 'close')} title="Close CBT" className="grid h-8 w-8 place-items-center rounded-lg text-rose-600 transition hover:bg-rose-50"><Square size={15} /></button>
          ) : (
            <button onClick={() => changeStatus(exam, 'open')} title="Open CBT now" className="grid h-8 w-8 place-items-center rounded-lg text-emerald-600 transition hover:bg-emerald-50"><Play size={15} /></button>
          )}
          <button onClick={() => openManage(exam)} title="Manage questions" className="grid h-8 w-8 place-items-center rounded-lg text-navy-600 transition hover:bg-navy-50"><ListChecks size={15} /></button>
          <button onClick={() => openEdit(exam)} title="Edit CBT" className="grid h-8 w-8 place-items-center rounded-lg text-navy-600 transition hover:bg-navy-50"><Pencil size={15} /></button>
          <button onClick={() => admin.downloadCbtResults(exam.id).catch((e) => setError(e.message))} title="Download results" className="grid h-8 w-8 place-items-center rounded-lg text-navy-600 transition hover:bg-navy-50"><FileSpreadsheet size={15} /></button>
          <button onClick={() => remove(exam)} title="Delete CBT" className="grid h-8 w-8 place-items-center rounded-lg text-rose-600 transition hover:bg-rose-50"><Trash2 size={15} /></button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="CBT Oversight"
        subtitle="Create CBTs for assigned teachers, monitor every assessment and download results"
        actions={<Button tone="primary" onClick={openCreate}><Plus size={16} /> New CBT</Button>}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard icon={ListChecks} label="Total CBTs" value={stats.total || 0} sub="all classes" tone="navy" index={0} />
        <StatCard icon={Play} label="Open" value={stats.active || 0} sub="live now" tone="emerald" index={1} />
        <StatCard icon={Clock} label="Scheduled" value={stats.scheduled || 0} sub="upcoming" tone="gold" index={2} />
        <StatCard icon={Square} label="Closed" value={stats.closed || 0} sub="finished" tone="rose" index={3} />
        <StatCard icon={FileSpreadsheet} label="Attempts" value={stats.attempts || 0} sub="student attempts" tone="sky" index={4} />
      </div>

      <Card className="mb-4 p-4">
        <div className="flex flex-wrap items-end gap-3">
          <label className="block w-full sm:w-40">
            <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-navy-800"><Filter size={13} /> Class</span>
            <select className={inputCls} value={classId} onChange={(event) => setClassId(event.target.value)}>
              <option value="">All classes</option>
              {classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
          <label className="block w-full sm:w-40">
            <span className="mb-1.5 block text-xs font-semibold text-navy-800">Assessment</span>
            <select className={inputCls} value={assessmentType} onChange={(event) => setAssessmentType(event.target.value)}>
              <option value="">All types</option>
              {types.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </label>
          <label className="block w-full sm:w-40">
            <span className="mb-1.5 block text-xs font-semibold text-navy-800">Status</span>
            <select className={inputCls} value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="">All statuses</option>
              {['Draft', 'Scheduled', 'Active', 'Closed'].map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <form
            className="flex flex-1 items-end gap-2"
            onSubmit={(event) => { event.preventDefault(); setSearch(searchInput.trim()) }}
          >
            <label className="block min-w-[180px] flex-1">
              <span className="mb-1.5 block text-xs font-semibold text-navy-800">Search title</span>
              <input className={inputCls} value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="e.g. First Term Mathematics" />
            </label>
            <Button tone="primary" type="submit"><Search size={15} /> Search</Button>
          </form>
          {(classId || status || assessmentType || search) && (
            <Button tone="ghost" onClick={() => { setClassId(''); setStatus(''); setAssessmentType(''); setSearchInput(''); setSearch('') }}>Reset</Button>
          )}
        </div>
      </Card>

      {error && <p className="mb-4 rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600">{error}</p>}

      {loading && !rows.length ? (
        <LoadBlock />
      ) : (
        <Card>
          <div className="border-b border-navy-100 px-6 py-4">
            <h3 className="font-bold text-navy-900">All CBTs</h3>
            <p className="text-xs text-slate-400">Newest first. New CBTs are owned by the selected teacher.</p>
          </div>
          <DataTable columns={columns} rows={rows} rowKey="id" />
        </Card>
      )}

      <Modal open={examModal} onClose={() => setExamModal(false)} title={editingExam ? 'Edit CBT' : 'Create CBT for Teacher'} size="xl">
        {scopeLocked && (
          <p className="mb-4 rounded-xl bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700">Class, subject and teacher are locked because students have already started this CBT.</p>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Title</span>
            <input className={inputCls} value={form.title} onChange={setField('title')} placeholder="e.g. First Term Mathematics First CA" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Assessment Type</span>
            <select className={inputCls} value={form.assessmentType} onChange={setField('assessmentType')}>
              {types.map((type) => <option key={type} value={type}>{type}</option>)}
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
            <select className={inputCls} value={form.classId} onChange={setField('classId')} disabled={scopeLocked}>
              <option value="">Select class</option>
              {classOptions.map((item) => <option key={item.classId} value={item.classId}>{item.className}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Subject</span>
            <select className={inputCls} value={form.subjectId} onChange={setField('subjectId')} disabled={scopeLocked}>
              <option value="">Select subject</option>
              {subjectOptions.map((item) => <option key={item.subjectId} value={item.subjectId}>{item.subjectName}</option>)}
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Teacher</span>
            <select className={inputCls} value={form.teacherId} onChange={setField('teacherId')} disabled={scopeLocked}>
              <option value="">Select assigned teacher</option>
              {teacherOptions.map((item) => <option key={`${item.teacherId}-${item.classId}-${item.subjectId}`} value={item.teacherId}>{item.teacherName}</option>)}
            </select>
            <span className="mt-1 block text-xs text-slate-400">Only teachers assigned to the selected class and subject are listed.</span>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Duration (minutes)</span>
            <input type="number" min="1" max="240" className={inputCls} value={form.durationMinutes} onChange={setField('durationMinutes')} />
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
          <div className="flex flex-col justify-end gap-2 text-sm text-slate-600 sm:col-span-2">
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

      <Modal open={!!manageExam} onClose={() => setManageExam(null)} title={manageExam?.title ? `Questions — ${manageExam.title}` : 'Manage Questions'} size="xl">
        {manageExam && (
          <div>
            {questionsLocked && (
              <p className="mb-3 rounded-xl bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700">Questions are locked because students have already started this CBT.</p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Button tone="primary" size="sm" onClick={() => openQuestion()} disabled={questionsLocked}><Plus size={14} /> Add Question</Button>
              <Button tone="outline" size="sm" onClick={() => admin.downloadCbtTemplate().catch((e) => setUploadNote(e.message))}><Download size={14} /> Template</Button>
              <Button tone="outline" size="sm" onClick={() => questionFileRef.current?.click()} disabled={questionsLocked}><UploadCloud size={14} /> {questionFile ? 'Change File' : 'Bulk Upload'}</Button>
              <input ref={questionFileRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleQuestionFile} className="hidden" />
              <select value={uploadMode} onChange={(event) => setUploadMode(event.target.value)} disabled={questionsLocked} className="rounded-xl border border-navy-100 px-3 py-1.5 text-sm">
                <option value="append">Append</option>
                <option value="replace">Replace all</option>
              </select>
              <Button tone="gold" size="sm" onClick={uploadQuestions} disabled={uploading || questionsLocked || !questionFile}><UploadCloud size={14} /> {uploading ? 'Uploading...' : 'Upload'}</Button>
              <span className="text-xs text-slate-400">{questionFile ? questionFile.name : 'XLSX, XLS or CSV · max 10MB'}</span>
            </div>
            <p className="mt-2 text-xs text-slate-500">Scoring: 50 questions × 1 mark = 50 total; 50 questions × 2 marks = 100 total. Set each question's score in Add/Edit Question or the Marks column in the template.</p>
            {manageError && <p className="mt-3 rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600">{manageError}</p>}
            {uploadNote && <p className="mt-2 rounded-xl bg-navy-50 px-4 py-2.5 text-sm font-medium text-navy-700">{uploadNote}</p>}
            <div className="mt-3 max-h-[420px] space-y-2 overflow-y-auto">
              {manageLoading && !manageDetail && <p className="py-8 text-center text-sm text-slate-400">Loading questions...</p>}
              {!manageLoading && !manageQuestions.length && <p className="py-8 text-center text-sm text-slate-400">No questions yet. Add manually or upload the Excel template.</p>}
              {manageQuestions.map((question, index) => (
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
