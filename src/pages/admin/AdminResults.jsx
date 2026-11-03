import { useEffect, useRef, useState } from 'react'
import {
  Eye, CheckCircle2, FileSpreadsheet, Clock, XCircle, Download, UploadCloud,
  Printer, Trash2, Pencil, Save, X, Users,
} from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import DataTable from '../../components/ui/DataTable'
import Button from '../../components/ui/Button'
import StatCard from '../../components/ui/StatCard'
import ReportCard from '../../components/report/ReportCard'
import { admin } from '../../services/api'

const statusTabs = ['', 'Pending', 'Approved']

export default function AdminResults() {
  const [classes, setClasses] = useState([])
  const [terms, setTerms] = useState([])
  const [subjects, setSubjects] = useState([])
  const [classId, setClassId] = useState('')
  const [termId, setTermId] = useState('')
  const [status, setStatus] = useState('')
  const [subjectIds, setSubjectIds] = useState([])
  const [rows, setRows] = useState([])
  const [classBreakdown, setClassBreakdown] = useState([])
  const [uploadClassId, setUploadClassId] = useState('')
  const [uploadTermId, setUploadTermId] = useState('')
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [note, setNote] = useState('')
  const [preview, setPreview] = useState(null)
  const [scores, setScores] = useState([])
  const [scoreDraft, setScoreDraft] = useState([])
  const [previewLoading, setPreviewLoading] = useState(false)
  const [editingScores, setEditingScores] = useState(false)
  const [savingScores, setSavingScores] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [uploadFile, setUploadFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [downloadLoading, setDownloadLoading] = useState(false)
  const [compiledClassId, setCompiledClassId] = useState('')
  const [compiledTermId, setCompiledTermId] = useState('')
  const [compiled, setCompiled] = useState(null)
  const [compiledLoading, setCompiledLoading] = useState(false)
  const [compiledError, setCompiledError] = useState(null)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [publications, setPublications] = useState(null)
  const [publicationTermId, setPublicationTermId] = useState('')
  const [publicationLoading, setPublicationLoading] = useState(false)
  const [publicationError, setPublicationError] = useState(null)
  const [publishingId, setPublishingId] = useState(null)
  const fileRef = useRef(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = {}
      if (classId) params.classId = classId
      if (termId) params.termId = termId
      if (status) params.status = status
      const res = await admin.resultUploads(params)
      setRows(res.data || [])
      setStats(res.stats || null)
      setClassBreakdown(res.classBreakdown || [])
      const classList = res.classes || []
      const termList = res.terms || []
      const subjectList = res.subjects || []
      setClasses(classList)
      setTerms(termList)
      setSubjects(subjectList)
      setSubjectIds((current) => {
        const valid = current.filter((id) => subjectList.some((subject) => subject.id === id))
        return valid.length ? valid : subjectList.slice(0, 1).map((subject) => subject.id)
      })
      setUploadClassId((current) => current || (classList[0] ? String(classList[0].id) : ''))
      setUploadTermId((current) => current || (termList[0] ? String(termList[0].id) : ''))
      setCompiledClassId((current) => current || (classList[0] ? String(classList[0].id) : ''))
      setCompiledTermId((current) => current || (termList[0] ? String(termList[0].id) : ''))
      setPublicationTermId((current) => current || (termList[0] ? String(termList[0].id) : ''))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [classId, termId, status])

  const loadCompiled = async (selectedClassId = compiledClassId, selectedTermId = compiledTermId) => {
    if (!selectedClassId || !selectedTermId) return
    setCompiledLoading(true)
    setCompiledError(null)
    try {
      const res = await admin.compiledResults({ classId: selectedClassId, termId: selectedTermId })
      setCompiled(res)
    } catch (e) {
      setCompiledError(e.message)
    } finally {
      setCompiledLoading(false)
    }
  }

  useEffect(() => {
    if (compiledClassId && compiledTermId) loadCompiled()
  }, [compiledClassId, compiledTermId])

  const loadPublications = async (selectedTermId = publicationTermId) => {
    if (!selectedTermId) return
    setPublicationLoading(true)
    setPublicationError(null)
    try {
      const res = await admin.resultPublications({ termId: selectedTermId })
      setPublications(res)
    } catch (e) {
      setPublicationError(e.message)
    } finally {
      setPublicationLoading(false)
    }
  }

  useEffect(() => {
    if (publicationTermId) loadPublications(publicationTermId)
  }, [publicationTermId])

  const publishResults = async (row) => {
    if (!publicationTermId) {
      setPublicationError('Select a term before publishing results.')
      return
    }

    setPublishingId(row.id)
    setPublicationError(null)
    try {
      const res = await admin.publishResults({ classId: row.id, termId: Number(publicationTermId) })
      setNote(res.message)
      await loadPublications()
    } catch (e) {
      setPublicationError(e.message)
    } finally {
      setPublishingId(null)
    }
  }

  const unpublishResults = async (row) => {
    if (!window.confirm(`Unpublish results for ${row.name}? Parents and students will no longer see them.`)) return

    setPublishingId(row.id)
    setPublicationError(null)
    try {
      const res = await admin.unpublishResults({ classId: row.id, termId: Number(publicationTermId) })
      setNote(res.message)
      await loadPublications()
    } catch (e) {
      setPublicationError(e.message)
    } finally {
      setPublishingId(null)
    }
  }

  const toggleSubject = (id) => {
    setSubjectIds((current) => (
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
    ))
  }

  const makeDraft = (list) => list.map((score) => ({
    studentId: score.studentDbId,
    name: score.studentName || score.studentId,
    code: score.studentCode,
    ca1: score.ca1,
    ca2: score.ca2,
    exam: score.exam,
  }))

  const openPreview = async (row, startEditing = false) => {
    setPreview(row)
    setScores([])
    setScoreDraft([])
    setEditingScores(false)
    setPreviewLoading(true)
    try {
      const res = await admin.resultScores(row.id)
      const list = res.scores || []
      setScores(list)
      setScoreDraft(makeDraft(list))
      setEditingScores(startEditing && list.length > 0)
    } catch (e) {
      setError(e.message)
    } finally {
      setPreviewLoading(false)
    }
  }

  const approve = async (row) => {
    if (!window.confirm(`Approve ${row.subject} results for ${row.className}${row.term ? ` - ${row.term}` : ''}?`)) return
    try {
      await admin.approveResult(row.id)
      setNote(`Results approved for ${row.className} - ${row.subject}. Publish the class result when you are ready to release it.`)
      setPreview(null)
      await load()
      await loadCompiled()
      await loadPublications()
    } catch (e) {
      window.alert(e.message)
    }
  }

  const reject = async (row) => {
    if (!window.confirm(`Return ${row.subject} results to the teacher?`)) return
    try {
      await admin.rejectResult(row.id)
      setNote(`Results returned to ${row.teacher || 'teacher'} for correction.`)
      setPreview(null)
      await load()
      await loadCompiled()
      await loadPublications()
    } catch (e) {
      window.alert(e.message)
    }
  }

  const deleteUpload = async (row) => {
    if (!window.confirm(`Delete the ${row.subject} results for ${row.className}? This cannot be undone.`)) return
    setDeletingId(row.id)
    try {
      await admin.deleteResult(row.id)
      setNote(`Deleted ${row.subject} results for ${row.className}.`)
      if (preview?.id === row.id) setPreview(null)
      await load()
      await loadCompiled()
      await loadPublications()
    } catch (e) {
      window.alert(e.message)
    } finally {
      setDeletingId(null)
    }
  }

  const updateScoreDraft = (index, field, value) => {
    setScoreDraft((current) => current.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  }

  const saveScores = async () => {
    if (!preview) return
    setSavingScores(true)
    setError(null)
    try {
      const payload = scoreDraft.map((score) => ({
        studentId: Number(score.studentId),
        ca1: Number(score.ca1 || 0),
        ca2: Number(score.ca2 || 0),
        exam: Number(score.exam || 0),
      }))
      const res = await admin.updateResultScores(preview.id, { scores: payload })
      setScores(res.scores || [])
      setScoreDraft(makeDraft(res.scores || []))
      setPreview((current) => (current ? {
        ...current,
        studentsCount: res.data?.studentsCount ?? current.studentsCount,
        status: res.data?.status ?? current.status,
      } : current))
      setNote(res.message)
      setEditingScores(false)
      await load()
      await loadCompiled()
      await loadPublications()
    } catch (e) {
      setError(e.errors ? Object.values(e.errors).flat().join(' ') : e.message)
    } finally {
      setSavingScores(false)
    }
  }

  const downloadTemplate = async () => {
    if (!uploadClassId || !uploadTermId || !subjectIds.length) {
      setError('Select a class, term and at least one subject before downloading the template.')
      return
    }

    setDownloadLoading(true)
    setError(null)
    try {
      await admin.downloadResultTemplate({ classId: uploadClassId, termId: uploadTermId, subjectIds })
    } catch (e) {
      setError(e.message)
    } finally {
      setDownloadLoading(false)
    }
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null
    setUploadFile(file)
    setNote(file ? `${file.name} is ready to upload.` : '')
  }

  const handleUpload = async () => {
    if (!uploadFile) {
      setError('Choose the completed result file first.')
      return
    }

    if (!uploadClassId || !uploadTermId || !subjectIds.length) {
      setError('Select a class, term and at least one subject before uploading.')
      return
    }

    setUploading(true)
    setError(null)
    setNote('')
    try {
      const formData = new FormData()
      formData.append('classId', uploadClassId)
      formData.append('termId', uploadTermId)
      subjectIds.forEach((id) => formData.append('subjectIds[]', id))
      formData.append('file', uploadFile)
      const res = await admin.uploadResults(formData)
      setNote(res.message)
      setUploadFile(null)
      if (fileRef.current) fileRef.current.value = ''
      await load()
      await loadCompiled()
      await loadPublications()
    } catch (e) {
      setError(e.errors ? Object.values(e.errors).flat().join(' ') : e.message)
    } finally {
      setUploading(false)
    }
  }

  const printScores = () => {
    if (!preview) return

    const body = scores.map((s) => `
      <tr>
        <td>${s.position ?? ''}</td>
        <td>${s.studentName ?? s.studentId ?? ''}<br><span class="muted">${s.studentCode ?? ''}</span></td>
        <td>${s.ca1}</td>
        <td>${s.ca2}</td>
        <td>${s.exam}</td>
        <td>${s.total}</td>
        <td>${s.grade}</td>
        <td>${s.remark ?? ''}</td>
      </tr>`).join('')

    const win = window.open('', '_blank', 'width=900,height=700')
    if (!win) return

    win.document.write(`
      <html>
        <head>
          <title>${preview.className} - ${preview.subject} Results</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 28px; color: #12233f; }
            h1 { font-size: 20px; margin: 0; }
            h2 { font-size: 15px; margin: 4px 0 18px; font-weight: 600; color: #475569; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th { background: #1f3a68; color: #fff; text-align: left; padding: 8px; }
            td { border-bottom: 1px solid #e2e8f0; padding: 7px 8px; }
            .muted { color: #94a3b8; font-size: 10px; }
            .footer { margin-top: 18px; font-size: 11px; color: #64748b; }
          </style>
        </head>
        <body>
          <h1>Witty Academy</h1>
          <h2>${preview.className} - ${preview.subject} - ${preview.term} ${preview.session ? `(${preview.session})` : ''}</h2>
          <table>
            <thead><tr><th>Pos</th><th>Student</th><th>First CA</th><th>Second CA</th><th>Exam</th><th>Total</th><th>Grade</th><th>Remark</th></tr></thead>
            <tbody>${body}</tbody>
          </table>
          <p class="footer">Printed from Witty Academy School Management System</p>
          <script>window.onload = () => { window.print(); }</script>
        </body>
      </html>`)
    win.document.close()
  }

  const printStudentReport = (compiledData, studentRow) => {
    if (!compiledData || !studentRow) return
    const reportRows = studentRow.rows.filter((row) => row.hasScore)
    const summary = studentRow.summary
    const school = compiledData.school || {}
    const win = window.open('', '_blank', 'width=900,height=700')
    if (!win) return

    const body = reportRows.map((row) => `
      <tr>
        <td>${row.subject}</td>
        <td>${row.ca1 + row.ca2}</td>
        <td>${row.exam}</td>
        <td>${row.total}</td>
        <td>${row.grade || '-'}</td>
        <td>${row.remark || ''}</td>
      </tr>`).join('')

    win.document.write(`
      <html>
        <head>
          <title>${studentRow.name} - Report Card</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 28px; color: #12233f; }
            h1 { font-size: 22px; margin: 0; }
            h2 { font-size: 14px; margin: 4px 0 18px; font-weight: 600; color: #475569; }
            .meta { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 18px 0; }
            .meta div { font-size: 12px; }
            .meta span { display: block; color: #64748b; }
            .meta strong { color: #12233f; font-size: 13px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th { background: #1f3a68; color: #fff; text-align: left; padding: 8px; }
            td { border-bottom: 1px solid #e2e8f0; padding: 7px 8px; }
            .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 18px; }
            .summary div { background: #f4f6fb; border-radius: 10px; padding: 12px; font-size: 12px; }
            .summary span { display: block; color: #64748b; }
            .summary strong { font-size: 18px; }
            .footer { margin-top: 22px; font-size: 11px; color: #64748b; }
          </style>
        </head>
        <body>
          <h1>${school.name || 'Witty Academy'}</h1>
          <h2>${compiledData.term?.name || ''} ${compiledData.term?.session ? `(${compiledData.term.session})` : ''} - Student Report Card</h2>
          <div class="meta">
            <div><span>Student</span><strong>${studentRow.name}</strong></div>
            <div><span>Admission No.</span><strong>${studentRow.studentId || '-'}</strong></div>
            <div><span>Class</span><strong>${studentRow.className || compiledData.class?.name || '-'}</strong></div>
            <div><span>Gender</span><strong>${studentRow.gender || '-'}</strong></div>
          </div>
          <table>
            <thead><tr><th>Subject</th><th>CA (40)</th><th>Exam (60)</th><th>Total (100)</th><th>Grade</th><th>Remark</th></tr></thead>
            <tbody>${body}</tbody>
          </table>
          <div class="summary">
            <div><span>Total Score</span><strong>${summary.totalScore} / ${summary.count * 100}</strong></div>
            <div><span>Average</span><strong>${summary.average}% (${summary.grade || '-'})</strong></div>
            <div><span>Position</span><strong>${summary.position || 'N/A'} of ${summary.classSize || '-'}</strong></div>
          </div>
          <p class="footer">Printed from ${school.name || 'Witty Academy'} School Management System</p>
          <script>window.onload = () => { window.print(); }</script>
        </body>
      </html>`)
    win.document.close()
  }

  const columns = [
    {
      key: 'subject',
      label: 'Subject',
      render: (r) => (
        <div>
          <p className="font-semibold text-navy-900">{r.subject}</p>
          {r.subjectCode && <p className="text-xs text-slate-400">{r.subjectCode}</p>}
        </div>
      ),
    },
    {
      key: 'className',
      label: 'Class',
      render: (r) => (
        <div className="flex flex-col items-start gap-1">
          <Badge color="navy">{r.className}</Badge>
          <span className="text-[11px] text-slate-400">{r.term}{r.session ? ` - ${r.session}` : ''}</span>
        </div>
      ),
    },
    { key: 'teacher', label: 'Teacher', render: (r) => <span className="text-sm text-slate-600">{r.teacher || '-'}</span> },
    { key: 'fileName', label: 'File', render: (r) => <span className="block max-w-[180px] truncate text-xs text-slate-500" title={r.fileName || ''}>{r.fileName || '-'}</span> },
    { key: 'studentsCount', label: 'Students', render: (r) => <span className="text-sm font-semibold text-slate-600">{r.studentsCount}</span> },
    { key: 'date', label: 'Uploaded', render: (r) => <span className="text-xs text-slate-500">{r.date}</span> },
    {
      key: 'status',
      label: 'Status',
      render: (r) => (
        <div className="flex flex-col items-start gap-1">
          <Badge color={r.status === 'Approved' ? 'emerald' : 'amber'} dot>{r.status}</Badge>
          {r.status === 'Approved' && r.approvedBy && <span className="text-[11px] text-slate-400">by {r.approvedBy}</span>}
        </div>
      ),
    },
    { key: 'actions', label: '', right: true, render: (r) => (
      <div className="flex justify-end gap-1.5">
        <button onClick={(e) => { e.stopPropagation(); openPreview(r) }} className="grid h-8 w-8 place-items-center rounded-lg text-navy-600 transition hover:bg-navy-50" title="Preview score"><Eye size={15} /></button>
        <button onClick={(e) => { e.stopPropagation(); openPreview(r, true) }} className="grid h-8 w-8 place-items-center rounded-lg text-navy-600 transition hover:bg-navy-50" title="Edit scores"><Pencil size={15} /></button>
        <button onClick={(e) => { e.stopPropagation(); deleteUpload(r) }} disabled={deletingId === r.id} className="grid h-8 w-8 place-items-center rounded-lg text-rose-600 transition hover:bg-rose-50 disabled:opacity-50" title="Delete upload"><Trash2 size={15} /></button>
        {r.status !== 'Approved' ? (
          <Button tone="emerald" size="sm" onClick={(e) => { e.stopPropagation(); approve(r) }}><CheckCircle2 size={14} /> Approve</Button>
        ) : (
          <Button tone="outline" size="sm" className="text-rose-600" onClick={(e) => { e.stopPropagation(); reject(r) }}><XCircle size={14} /> Return</Button>
        )}
      </div>
    ) },
  ]

  if (loading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-navy-100 border-t-navy-700" /></div>
  }

  const compiledSubjects = compiled?.subjects || []
  const compiledStudents = compiled?.students || []

  return (
    <div>
      <PageHeader title="Result Processing" subtitle="Upload multiple subjects, approve results, edit mistakes and view compiled class results" />

      {error && <div className="mb-6 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">{error}</div>}
      {note && <div className="mb-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600">{note}</div>}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={Clock} label="Pending Approval" value={stats?.pending ?? '-'} sub="in current filter" tone="gold" index={0} />
        <StatCard icon={CheckCircle2} label="Approved Uploads" value={stats?.approved ?? '-'} sub="ready to publish" tone="emerald" index={1} />
        <StatCard icon={FileSpreadsheet} label="Score Uploads" value={stats?.totalUploads ?? '-'} sub="matching class & term" tone="navy" index={2} />
      </div>

      <Card className="mb-6 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="flex items-center gap-2 font-bold text-navy-900"><FileSpreadsheet size={18} className="text-navy-600" /> Bulk Result Upload</h3>
            <p className="mt-1 text-xs text-slate-400">Choose several subjects, download one workbook with a sheet per subject, enter First CA, Second CA and Exam scores, then upload.</p>
          </div>
          <Badge color="sky" dot>Admin upload</Badge>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Class</span>
            <select value={uploadClassId} onChange={(e) => setUploadClassId(e.target.value)} className="w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none focus:border-navy-400">
              <option value="">Select class</option>
              {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Term</span>
            <select value={uploadTermId} onChange={(e) => setUploadTermId(e.target.value)} className="w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none focus:border-navy-400">
              <option value="">Select term</option>
              {terms.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </label>
          <div className="flex items-end">
            <div className="w-full rounded-xl bg-cream-100/60 px-3.5 py-2.5 text-xs font-semibold text-slate-500">
              {subjectIds.length} subject{subjectIds.length === 1 ? '' : 's'} selected
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-semibold text-navy-800">Subjects</span>
            <div className="flex gap-2">
              <button onClick={() => setSubjectIds(subjects.map((subject) => subject.id))} className="text-xs font-semibold text-navy-600 hover:text-navy-900">Select all</button>
              <span className="text-slate-300">|</span>
              <button onClick={() => setSubjectIds([])} className="text-xs font-semibold text-navy-600 hover:text-navy-900">Clear</button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {subjects.map((subject) => {
              const selected = subjectIds.includes(subject.id)
              return (
                <button
                  key={subject.id}
                  type="button"
                  onClick={() => toggleSubject(subject.id)}
                  className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${selected ? 'border-navy-800 bg-navy-800 text-white' : 'border-navy-100 bg-white text-slate-500 hover:bg-navy-50'}`}
                >
                  {subject.name}
                </button>
              )
            })}
            {!subjects.length && <span className="text-xs text-slate-400">No subjects have been created yet.</span>}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button tone="outline" onClick={downloadTemplate} disabled={downloadLoading}><Download size={15} /> {downloadLoading ? 'Preparing...' : 'Download Template'}</Button>
          <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFileChange} className="hidden" />
          <Button tone="outline" onClick={() => fileRef.current?.click()}><UploadCloud size={15} /> {uploadFile ? 'Change File' : 'Choose File'}</Button>
          <span className="text-xs text-slate-400">{uploadFile ? uploadFile.name : 'XLSX, XLS or CSV - max 10MB'}</span>
          <Button tone="primary" className="sm:ml-auto" onClick={handleUpload} disabled={uploading}><UploadCloud size={15} /> {uploading ? 'Uploading...' : 'Upload Results'}</Button>
        </div>
      </Card>

      <Card className="mb-6 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="flex items-center gap-2 font-bold text-navy-900"><CheckCircle2 size={18} className="text-navy-600" /> Review &amp; Approve Teacher Submissions</h3>
            <p className="mt-1 text-xs text-slate-400">Select a class to review only that class's submissions before approving. This keeps results from different classes separate.</p>
          </div>
          <Badge color={stats?.pending ? 'amber' : 'emerald'} dot>{stats?.pending ?? 0} pending review</Badge>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Class</span>
            <select value={classId} onChange={(e) => setClassId(e.target.value)} className="w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none focus:border-navy-400">
              <option value="">All Classes</option>
              {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Term</span>
            <select value={termId} onChange={(e) => setTermId(e.target.value)} className="w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none focus:border-navy-400">
              <option value="">All Terms</option>
              {terms.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </label>
          <div>
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Status</span>
            <div className="flex gap-2">
              {statusTabs.map((s) => (
                <button key={s || 'all'} onClick={() => setStatus(s)} className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${status === s ? 'bg-navy-800 text-white' : 'bg-white text-slate-500 ring-1 ring-navy-100 hover:bg-navy-50'}`}>{s || 'All'}</button>
              ))}
            </div>
          </div>
        </div>

        {classBreakdown.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Jump to class</span>
            <button onClick={() => setClassId('')} className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${!classId ? 'border-navy-800 bg-navy-800 text-white' : 'border-navy-100 bg-white text-slate-500 hover:bg-navy-50'}`}>All classes</button>
            {classBreakdown.map((item) => (
              <button
                key={item.id}
                onClick={() => setClassId(String(item.id))}
                className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${String(classId) === String(item.id) ? 'border-navy-800 bg-navy-800 text-white' : 'border-navy-100 bg-white text-slate-600 hover:bg-navy-50'}`}
              >
                {item.name}
                <span className={`ml-2 ${String(classId) === String(item.id) ? 'text-cream-100/80' : 'text-slate-400'}`}>{item.pending} pending &middot; {item.approved} approved</span>
              </button>
            ))}
          </div>
        )}

        <p className="mt-4 border-t border-navy-100 pt-3 text-xs text-slate-500">
          <strong className="text-navy-800">Approval workflow:</strong> Review the uploaded score sheet, check the class, subject, teacher and student count, then approve. Approved results stay hidden from parents and students until you publish the class result below.
        </p>

        <div className="mt-4">
          {rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-navy-200 bg-navy-50/30 px-6 py-12 text-center">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-navy-500 shadow-card"><FileSpreadsheet size={22} /></span>
              <p className="mt-3 text-sm font-semibold text-navy-900">No submissions found</p>
              <p className="mt-1 max-w-sm text-xs text-slate-500">Try a different class, term or status. Teacher uploads will appear here for review.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-navy-100">
              <DataTable columns={columns} rows={rows} rowKey="id" onRowClick={openPreview} />
            </div>
          )}
        </div>
      </Card>

      <Card className="mb-6 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="flex items-center gap-2 font-bold text-navy-900"><UploadCloud size={18} className="text-navy-600" /> Publish Results</h3>
            <p className="mt-1 text-xs text-slate-400">Release approved results class by class. Unpublish any class immediately if you discover an error.</p>
          </div>
          <Badge color="gold" dot>Parents & students</Badge>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block sm:max-w-xs">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Term</span>
            <select value={publicationTermId} onChange={(e) => setPublicationTermId(e.target.value)} className="w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none focus:border-navy-400">
              <option value="">Select term</option>
              {terms.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </label>
          {publications?.summary && (
            <div className="flex flex-wrap items-end gap-2 sm:ml-auto">
              <Badge color="emerald" dot>{publications.summary.published} published</Badge>
              <Badge color="amber" dot>{publications.summary.ready - publications.summary.published > 0 ? publications.summary.ready - publications.summary.published : 0} ready</Badge>
              <Badge color="navy">{publications.summary.classes} classes</Badge>
            </div>
          )}
        </div>

        {publicationError && <p className="mt-3 text-sm font-medium text-rose-600">{publicationError}</p>}

        {publicationLoading ? (
          <div className="flex justify-center py-8"><div className="h-8 w-8 animate-spin rounded-full border-4 border-navy-100 border-t-navy-700" /></div>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-navy-100">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-navy-900 text-white">
                <tr>
                  {['Class', 'Students', 'Approved Subjects', 'Pending Subjects', 'Status', 'Published', ''].map((heading) => (
                    <th key={heading} className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wide">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {(publications?.data || []).map((row) => (
                  <tr key={row.id}>
                    <td className="px-3 py-2.5 font-semibold text-navy-900">{row.name}</td>
                    <td className="px-3 py-2.5 text-slate-600">{row.studentsCount}</td>
                    <td className="px-3 py-2.5 text-slate-600">{row.approvedSubjects}</td>
                    <td className="px-3 py-2.5 text-slate-600">{row.pendingSubjects}</td>
                    <td className="px-3 py-2.5">
                      <Badge color={row.published ? 'emerald' : row.canPublish ? 'amber' : 'slate'} dot>
                        {row.published ? 'Published' : row.canPublish ? 'Ready' : 'No approved results'}
                      </Badge>
                    </td>
                    <td className="px-3 py-2.5 text-xs text-slate-500">
                      {row.publishedAt ? `${new Date(row.publishedAt).toLocaleDateString('en-GB')}${row.publishedBy ? ` by ${row.publishedBy}` : ''}` : '-'}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      {row.published ? (
                        <Button tone="danger" size="sm" onClick={() => unpublishResults(row)} disabled={publishingId === row.id}>
                          <XCircle size={14} /> {publishingId === row.id ? 'Working...' : 'Unpublish'}
                        </Button>
                      ) : (
                        <Button tone="emerald" size="sm" onClick={() => publishResults(row)} disabled={!row.canPublish || publishingId === row.id}>
                          <UploadCloud size={14} /> {publishingId === row.id ? 'Publishing...' : 'Publish'}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
                {!(publications?.data || []).length && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-500">No classes are available for this term.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card className="mb-6 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="flex items-center gap-2 font-bold text-navy-900"><Users size={18} className="text-navy-600" /> Compiled Approved Results</h3>
            <p className="mt-1 text-xs text-slate-400">Select a class and term to see every student's approved subjects, total, average, grade and class position.</p>
          </div>
          <Badge color="emerald" dot>Approved only</Badge>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Class</span>
            <select value={compiledClassId} onChange={(e) => setCompiledClassId(e.target.value)} className="w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none focus:border-navy-400">
              <option value="">Select class</option>
              {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Term</span>
            <select value={compiledTermId} onChange={(e) => setCompiledTermId(e.target.value)} className="w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none focus:border-navy-400">
              <option value="">Select term</option>
              {terms.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </label>
        </div>

        {compiledError && <p className="mt-3 text-sm font-medium text-rose-600">{compiledError}</p>}

        {compiledLoading ? (
          <div className="flex justify-center py-10"><div className="h-8 w-8 animate-spin rounded-full border-4 border-navy-100 border-t-navy-700" /></div>
        ) : compiled && compiledSubjects.length ? (
          <>
            <div className="mt-4 flex flex-wrap gap-2">
              {compiledSubjects.map((subject) => <Badge key={subject.id} color="navy">{subject.name}</Badge>)}
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-cream-100/60 px-4 py-3 text-sm"><span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Class average</span><strong className="text-lg text-navy-900">{compiled.summary.average != null ? `${compiled.summary.average}%` : '-'}</strong></div>
              <div className="rounded-xl bg-cream-100/60 px-4 py-3 text-sm"><span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Students with results</span><strong className="text-lg text-navy-900">{compiled.summary.studentsWithResults} / {compiled.summary.studentsCount}</strong></div>
              <div className="rounded-xl bg-cream-100/60 px-4 py-3 text-sm"><span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Approved subjects</span><strong className="text-lg text-navy-900">{compiled.summary.subjectsCount}</strong></div>
            </div>

            <div className="mt-4 overflow-x-auto rounded-xl border border-navy-100">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-navy-900 text-white">
                  <tr>
                    <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wide">Pos</th>
                    <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wide">Student</th>
                    {compiledSubjects.map((subject) => <th key={subject.id} className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wide">{subject.name}</th>)}
                    <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wide">Total</th>
                    <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wide">Avg</th>
                    <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wide">Grade</th>
                    <th className="px-3 py-2.5" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-50">
                  {compiledStudents.map((student) => (
                    <tr key={student.id} className={student.hasResults ? '' : 'bg-slate-50/60'}>
                      <td className="px-3 py-2 font-bold text-navy-900">{student.summary.position ?? '-'}</td>
                      <td className="px-3 py-2">
                        <p className="font-semibold text-navy-900">{student.name}</p>
                        <p className="text-xs text-slate-400">{student.studentId}</p>
                      </td>
                      {compiledSubjects.map((subject) => {
                        const row = student.rows.find((item) => item.subjectId === subject.id)
                        return <td key={subject.id} className="px-3 py-2 text-slate-600">{row?.hasScore ? row.total : '-'}</td>
                      })}
                      <td className="px-3 py-2 font-bold text-navy-900">{student.hasResults ? student.summary.totalScore : '-'}</td>
                      <td className="px-3 py-2 text-slate-600">{student.summary.average ?? '-'}</td>
                      <td className="px-3 py-2 font-semibold text-navy-700">{student.summary.grade ?? '-'}</td>
                      <td className="px-3 py-2 text-right">
                        <Button tone="outline" size="sm" onClick={() => setSelectedStudent(student)} disabled={!student.hasResults}><Eye size={14} /> View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="mt-4 rounded-xl bg-cream-100/60 px-4 py-6 text-center text-sm text-slate-500">
            No approved results have been compiled for this class and term yet.
          </p>
        )}
      </Card>

      <Modal open={!!preview} onClose={() => setPreview(null)} title={preview ? `${preview.className} - ${preview.subject}` : 'Score Preview'} wide>
        {preview && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-slate-400">{preview.term} - {preview.session} - {preview.teacher || 'Teacher'}</p>
              <Badge color={preview.status === 'Approved' ? 'emerald' : 'amber'} dot>{preview.status}</Badge>
            </div>

            <div className="mt-4 max-h-[360px] overflow-auto rounded-xl border border-navy-100">
              {previewLoading ? (
                <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-navy-100 border-t-navy-700" /></div>
              ) : editingScores ? (
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-navy-900 text-white">
                    <tr>{['Student', 'CA1', 'CA2', 'Exam', 'Total'].map((h) => <th key={h} className="whitespace-nowrap px-4 py-2.5 text-xs font-semibold uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-navy-50">
                    {scoreDraft.map((score, index) => (
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
                              onChange={(e) => updateScoreDraft(index, field, e.target.value)}
                              className="w-20 rounded-lg border border-navy-100 px-2 py-1.5 text-sm outline-none focus:border-navy-400"
                            />
                          </td>
                        ))}
                        <td className="px-4 py-2 font-bold text-navy-900">{Number(score.ca1 || 0) + Number(score.ca2 || 0) + Number(score.exam || 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : scores.length ? (
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-navy-900 text-white">
                    <tr>{['Pos', 'Student', 'CA1', 'CA2', 'Exam', 'Total', 'Grade', 'Remark'].map((h) => <th key={h} className="whitespace-nowrap px-4 py-2.5 text-xs font-semibold uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-navy-50">
                    {scores.map((s) => (
                      <tr key={s.studentDbId || s.studentCode}>
                        <td className="px-4 py-2 font-bold text-navy-900">{s.position}</td>
                        <td className="px-4 py-2 font-medium text-navy-900">{s.studentName || s.studentId}<span className="ml-1 text-xs text-slate-400">{s.studentCode}</span></td>
                        <td className="px-4 py-2 text-slate-600">{s.ca1}</td>
                        <td className="px-4 py-2 text-slate-600">{s.ca2}</td>
                        <td className="px-4 py-2 text-slate-600">{s.exam}</td>
                        <td className="px-4 py-2 font-bold text-navy-900">{s.total}</td>
                        <td className="px-4 py-2 font-semibold text-navy-700">{s.grade}</td>
                        <td className="px-4 py-2 text-slate-600">{s.remark}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="p-8 text-center text-sm text-slate-400">No scores found for this upload.</p>
              )}
            </div>

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              {editingScores ? (
                <>
                  <Button tone="ghost" size="sm" onClick={() => { setEditingScores(false); setScoreDraft(makeDraft(scores)) }}><X size={14} /> Cancel</Button>
                  <Button tone="primary" size="sm" onClick={saveScores} disabled={savingScores}><Save size={14} /> {savingScores ? 'Saving...' : 'Save Scores'}</Button>
                </>
              ) : (
                <>
                  <Button tone="outline" size="sm" onClick={printScores}><Printer size={14} /> Print / PDF</Button>
                  <Button tone="outline" size="sm" onClick={() => { setScoreDraft(makeDraft(scores)); setEditingScores(true) }} disabled={!scores.length}><Pencil size={14} /> Edit Scores</Button>
                  <Button tone="danger" size="sm" onClick={() => deleteUpload(preview)} disabled={deletingId === preview.id}><Trash2 size={14} /> Delete</Button>
                  {preview.status === 'Approved' ? (
                    <Button tone="danger" size="sm" onClick={() => reject(preview)}><XCircle size={14} /> Return to Teacher</Button>
                  ) : (
                    <Button tone="emerald" size="sm" onClick={() => approve(preview)}><CheckCircle2 size={14} /> Approve Results</Button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!selectedStudent} onClose={() => setSelectedStudent(null)} title={selectedStudent ? `${selectedStudent.name} - Report Card` : 'Student Report Card'} wide>
        {selectedStudent && compiled && (
          <div>
            <div className="mb-4 flex justify-end">
              <Button tone="primary" size="sm" onClick={() => printStudentReport(compiled, selectedStudent)}><Download size={14} /> Download PDF</Button>
            </div>
            <ReportCard
              student={selectedStudent}
              rows={selectedStudent.rows.filter((row) => row.hasScore)}
              term={compiled.term?.name}
              session={compiled.term?.session}
              summary={selectedStudent.summary}
              schoolInfo={compiled.school}
              showActions={false}
            />
          </div>
        )}
      </Modal>
    </div>
  )
}
