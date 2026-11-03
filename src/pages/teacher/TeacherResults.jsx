import { useEffect, useMemo, useRef, useState } from 'react'
import {
  FileText, Eye, CheckCircle2, UploadCloud, FileSpreadsheet, Download,
  Pencil, Trash2, Save, X,
} from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'
import { teacher } from '../../services/api'

const makeDraft = (list) => list.map((score) => ({
  studentId: score.studentDbId,
  name: score.studentName || score.studentId,
  code: score.studentCode,
  ca1: score.ca1,
  ca2: score.ca2,
  exam: score.exam,
}))

export default function TeacherResults() {
  const [assignments, setAssignments] = useState([])
  const [terms, setTerms] = useState([])
  const [uploadClassId, setUploadClassId] = useState('')
  const [uploadSubjectIds, setUploadSubjectIds] = useState([])
  const [uploadTermId, setUploadTermId] = useState('')
  const [uploadFile, setUploadFile] = useState(null)
  const [uploads, setUploads] = useState([])
  const [uploadNote, setUploadNote] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [editingUpload, setEditingUpload] = useState(null)
  const [editDraft, setEditDraft] = useState([])
  const [editLoading, setEditLoading] = useState(false)
  const [savingEdit, setSavingEdit] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const fileRef = useRef(null)

  const loadOptions = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await teacher.resultOptions()
      const list = res.assignments || []
      const termList = res.terms || []
      setAssignments(list)
      setTerms(termList)
      const firstClass = list[0] ? String(list[0].classId) : ''
      const defaultTerm = termList.find((term) => term.isCurrent) || termList[0]
      setUploadClassId((current) => current || firstClass)
      setUploadTermId((current) => current || (defaultTerm ? String(defaultTerm.id) : ''))
      setUploadSubjectIds((current) => (
        current.length
          ? current
          : list.filter((item) => String(item.classId) === firstClass).slice(0, 1).map((item) => item.subjectId)
      ))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOptions()
  }, [])

  const assignmentOptions = useMemo(() => {
    const seen = new Set()
    return assignments.filter((assignment) => {
      const key = assignment.classId + '|' + assignment.subjectId
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [assignments])

  const classOptions = useMemo(() => {
    const seen = new Set()
    return assignmentOptions.filter((assignment) => {
      if (seen.has(assignment.classId)) return false
      seen.add(assignment.classId)
      return true
    })
  }, [assignmentOptions])

  const subjectOptions = useMemo(
    () => assignmentOptions.filter((assignment) => String(assignment.classId) === String(uploadClassId)),
    [assignmentOptions, uploadClassId],
  )

  useEffect(() => {
    if (!uploadClassId) return
    const available = assignmentOptions
      .filter((assignment) => String(assignment.classId) === String(uploadClassId))
      .map((assignment) => assignment.subjectId)

    setUploadSubjectIds((current) => {
      const valid = current.filter((id) => available.includes(id))
      return valid.length ? valid : available.slice(0, 1)
    })
  }, [uploadClassId, assignmentOptions])

  const loadUploads = async () => {
    try {
      const res = await teacher.results()
      setUploads(res.data || [])
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => {
    loadUploads()
  }, [])

  const toggleSubject = (id) => {
    setUploadSubjectIds((current) => (
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
    ))
  }

  const handleDownloadTemplate = () => {
    if (!uploadClassId || !uploadTermId || !uploadSubjectIds.length) {
      setUploadNote('Select a class, at least one subject and a term before downloading the template.')
      return
    }
    teacher.downloadResultTemplate({
      classId: uploadClassId,
      termId: uploadTermId,
      subjectIds: uploadSubjectIds,
    }).catch((e) => {
      setError(e.message)
    })
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null
    if (file && file.size > 10 * 1024 * 1024) {
      setUploadNote('That file is larger than 10MB. Please choose a smaller file.')
      setUploadFile(null)
      event.target.value = ''
      return
    }
    setUploadFile(file)
    setUploadNote(file ? `${file.name} is ready to upload.` : '')
  }

  const handleUpload = async () => {
    if (!uploadFile) {
      setUploadNote('Choose a result file first.')
      return
    }
    if (!uploadClassId || !uploadTermId || !uploadSubjectIds.length) {
      setUploadNote('Select a class, at least one subject and a term before uploading.')
      return
    }
    setUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('classId', uploadClassId)
      formData.append('termId', uploadTermId)
      uploadSubjectIds.forEach((id) => formData.append('subjectIds[]', id))
      formData.append('file', uploadFile)
      const res = await teacher.uploadResults(formData)
      setUploadNote(res.message)
      setUploadFile(null)
      if (fileRef.current) fileRef.current.value = ''
      await loadUploads()
    } catch (e) {
      setUploadNote(e.errors ? Object.values(e.errors).flat().join(' ') : e.message)
    } finally {
      setUploading(false)
    }
  }

  const openEdit = async (upload) => {
    setEditingUpload(upload)
    setEditDraft([])
    setEditLoading(true)
    try {
      const res = await teacher.resultScores(upload.id)
      const list = res.scores || []
      setEditDraft(makeDraft(list))
    } catch (e) {
      setError(e.message)
      setEditingUpload(null)
    } finally {
      setEditLoading(false)
    }
  }

  const updateEditDraft = (index, field, value) => {
    setEditDraft((current) => current.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  }

  const saveEdit = async () => {
    if (!editingUpload) return
    setSavingEdit(true)
    setError(null)
    try {
      const payload = editDraft.map((score) => ({
        studentId: Number(score.studentId),
        ca1: Number(score.ca1 || 0),
        ca2: Number(score.ca2 || 0),
        exam: Number(score.exam || 0),
      }))
      const res = await teacher.updateResultScores(editingUpload.id, { scores: payload })
      setUploadNote(res.message)
      setEditingUpload(null)
      await loadUploads()
    } catch (e) {
      setError(e.errors ? Object.values(e.errors).flat().join(' ') : e.message)
    } finally {
      setSavingEdit(false)
    }
  }

  const deleteUpload = async (upload) => {
    if (!window.confirm(`Delete the ${upload.subject} results for ${upload.className}? This cannot be undone.`)) return
    setDeletingId(upload.id)
    try {
      const res = await teacher.deleteResult(upload.id)
      setUploadNote(res.message)
      await loadUploads()
    } catch (e) {
      setError(e.message)
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) : ''

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-navy-100 border-t-navy-700" />
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Results Entry" subtitle="Download a multi-subject score template, fill scores and upload them for admin approval" />

      {error && <div className="mb-6 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">{error}</div>}
      {uploadNote && <div className="mb-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600">{uploadNote}</div>}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={FileText} label="Score Uploads" value={uploads.length} sub="for your classes" tone="navy" index={0} />
        <StatCard icon={CheckCircle2} label="Approved" value={uploads.filter((u) => u.status === 'Approved').length} sub="released to students" tone="emerald" index={1} />
        <StatCard icon={Eye} label="Pending" value={uploads.filter((u) => u.status !== 'Approved').length} sub="awaiting admin" tone="amber" index={2} />
      </div>

      <Card className="mb-6 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="flex items-center gap-2 font-bold text-navy-900"><UploadCloud size={18} className="text-navy-600" /> Upload Term Results</h3>
            <p className="mt-1 text-xs text-slate-400">Select one or more of your subjects, download the workbook with a sheet per subject, fill the scores, then upload. Admin must approve before students see results.</p>
          </div>
          <Badge color="sky" dot>Teacher upload</Badge>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Class</span>
            <select value={uploadClassId} onChange={(e) => setUploadClassId(e.target.value)} className="w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none focus:border-navy-400">
              <option value="">Select class</option>
              {classOptions.map((assignment) => <option key={assignment.classId} value={assignment.classId}>{assignment.className}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Term</span>
            <select value={uploadTermId} onChange={(e) => setUploadTermId(e.target.value)} className="w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none focus:border-navy-400">
              <option value="">Select term</option>
              {terms.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </label>
          <div className="flex items-end">
            <div className="w-full rounded-xl bg-cream-100/60 px-3.5 py-2.5 text-xs font-semibold text-slate-500">
              {uploadSubjectIds.length} subject{uploadSubjectIds.length === 1 ? '' : 's'} selected
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-semibold text-navy-800">My subjects</span>
            <div className="flex gap-2">
              <button onClick={() => setUploadSubjectIds(subjectOptions.map((assignment) => assignment.subjectId))} className="text-xs font-semibold text-navy-600 hover:text-navy-900">Select all</button>
              <span className="text-slate-300">|</span>
              <button onClick={() => setUploadSubjectIds([])} className="text-xs font-semibold text-navy-600 hover:text-navy-900">Clear</button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {subjectOptions.map((assignment) => {
              const selected = uploadSubjectIds.includes(assignment.subjectId)
              return (
                <button
                  key={assignment.classId + '-' + assignment.subjectId}
                  type="button"
                  onClick={() => toggleSubject(assignment.subjectId)}
                  className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${selected ? 'border-navy-800 bg-navy-800 text-white' : 'border-navy-100 bg-white text-slate-500 hover:bg-navy-50'}`}
                >
                  {assignment.subjectName}
                </button>
              )
            })}
            {!subjectOptions.length && <span className="text-xs text-slate-400">No subjects are assigned to you for this class.</span>}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button tone="outline" onClick={handleDownloadTemplate}><Download size={15} /> Download Excel Template</Button>
          <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFileChange} className="hidden" />
          <Button tone="outline" onClick={() => fileRef.current?.click()}><UploadCloud size={15} /> {uploadFile ? 'Change File' : 'Choose File'}</Button>
          <span className="text-xs text-slate-400">{uploadFile ? uploadFile.name : 'XLSX, XLS or CSV - max 10MB'}</span>
          <Button tone="primary" className="sm:ml-auto" onClick={handleUpload} disabled={uploading}><UploadCloud size={15} /> {uploading ? 'Uploading...' : 'Upload & Submit'}</Button>
        </div>
      </Card>

      {uploads.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between border-b border-navy-100 px-6 py-4">
            <h3 className="font-bold text-navy-900">My Uploads</h3>
            <Badge color="slate" dot>{uploads.length} upload{uploads.length === 1 ? '' : 's'}</Badge>
          </div>
          <div className="mt-4 divide-y divide-navy-50">
            {uploads.map((upload) => (
              <div key={upload.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-navy-50 text-navy-600"><FileSpreadsheet size={16} /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy-900">{upload.subject}</p>
                  <p className="text-xs text-slate-400">{upload.className} - {upload.term} - {upload.studentsCount} students - {formatDate(upload.date)}</p>
                </div>
                <Badge color={upload.status === 'Approved' ? 'emerald' : 'amber'} dot>{upload.status}</Badge>
                {upload.status !== 'Approved' ? (
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(upload)} className="grid h-8 w-8 place-items-center rounded-lg text-navy-600 transition hover:bg-navy-50" title="Edit scores"><Pencil size={15} /></button>
                    <button onClick={() => deleteUpload(upload)} disabled={deletingId === upload.id} className="grid h-8 w-8 place-items-center rounded-lg text-rose-600 transition hover:bg-rose-50 disabled:opacity-50" title="Delete upload"><Trash2 size={15} /></button>
                  </div>
                ) : (
                  <span className="text-xs font-medium text-slate-400">Locked</span>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="mt-6 p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <Badge color="slate">Teacher Upload</Badge>
          <span>-&gt;</span><Badge color="slate">Admin Review</Badge>
          <span>-&gt;</span><Badge color="emerald" dot>Approve &amp; Publish</Badge>
          <span>-&gt;</span><Badge color="emerald" dot>Student &amp; Parent See Result</Badge>
        </div>
      </Card>

      <Modal open={!!editingUpload} onClose={() => setEditingUpload(null)} title={editingUpload ? `${editingUpload.className} - ${editingUpload.subject}` : 'Edit Scores'} wide>
        {editingUpload && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-slate-400">{editingUpload.term} - {editingUpload.session}</p>
              <Badge color="amber" dot>{editingUpload.status}</Badge>
            </div>

            <div className="mt-4 max-h-[400px] overflow-auto rounded-xl border border-navy-100">
              {editLoading ? (
                <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-navy-100 border-t-navy-700" /></div>
              ) : editDraft.length ? (
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-navy-900 text-white">
                    <tr>{['Student', 'CA1', 'CA2', 'Exam', 'Total'].map((h) => <th key={h} className="whitespace-nowrap px-4 py-2.5 text-xs font-semibold uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-navy-50">
                    {editDraft.map((score, index) => (
                      <tr key={score.studentId}>
                        <td className="px-4 py-2">
                          <p className="font-medium text-navy-900">{score.name}</p>
                          <p className="text-xs text-slate-400">{score.code}</p>
                        </td>
                        {['ca1', 'ca2', 'exam'].map((field) => (
                          <td key={field} className="px-4 py-2">
                            <input
                              type="number"
                              min="0"
                              max={field === 'exam' ? 60 : 20}
                              value={score[field]}
                              onChange={(e) => updateEditDraft(index, field, e.target.value)}
                              className="w-20 rounded-lg border border-navy-100 px-2 py-1.5 text-sm outline-none focus:border-navy-400"
                            />
                          </td>
                        ))}
                        <td className="px-4 py-2 font-bold text-navy-900">{Number(score.ca1 || 0) + Number(score.ca2 || 0) + Number(score.exam || 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="p-8 text-center text-sm text-slate-400">No scores found for this upload.</p>
              )}
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <Button tone="ghost" size="sm" onClick={() => setEditingUpload(null)}><X size={14} /> Cancel</Button>
              <Button tone="primary" size="sm" onClick={saveEdit} disabled={savingEdit || !editDraft.length}><Save size={14} /> {savingEdit ? 'Saving...' : 'Save & Resubmit'}</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
