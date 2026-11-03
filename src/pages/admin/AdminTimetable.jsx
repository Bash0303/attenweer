import { useEffect, useRef, useState } from 'react'
import { Pencil, Save, X, Download, UploadCloud, Trash2 } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { admin } from '../../services/api'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const keyOf = (start, day) => `${start}::${day}`

export default function AdminTimetable() {
  const [classes, setClasses] = useState([])
  const [terms, setTerms] = useState([])
  const [subjects, setSubjects] = useState([])
  const [classId, setClassId] = useState('')
  const [termId, setTermId] = useState('')
  const [periods, setPeriods] = useState([])
  const [grid, setGrid] = useState({})
  const [draft, setDraft] = useState({})
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [note, setNote] = useState('')
  const [uploadFile, setUploadFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [downloadLoading, setDownloadLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const fileRef = useRef(null)

  const initialise = (entries) => {
    const next = {}
    Object.entries(entries || {}).forEach(([startKey, items]) => {
      const start = startKey.slice(0, 5)
      items.forEach((item) => {
        next[keyOf(start, item.day)] = item.isBreak ? 'break' : (item.subjectId ? String(item.subjectId) : '')
      })
    })
    return next
  }

  const load = async () => {
      setLoading(true)
    setError(null)
    setEditing(false)
    setNote('')
    try {
      const [timetableRes, subjectsRes] = await Promise.all([
        admin.timetable(classId, termId || undefined),
        admin.subjects(),
      ])
      setPeriods(timetableRes.periods || [])
      setGrid(timetableRes.entries || {})
      setDraft(initialise(timetableRes.entries))
      setSubjects(subjectsRes.data || [])
      setTerms(timetableRes.terms || [])
      if (!classId && timetableRes.classes?.[0]) setClassId(String(timetableRes.classes[0].id))
      if (!termId && timetableRes.termId) setTermId(String(timetableRes.termId))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (classId) load()
  }, [classId, termId])

  useEffect(() => {
    if (!classId) {
      admin.classes().then((res) => {
        const list = res.data || []
        setClasses(list)
        if (list[0]) setClassId(String(list[0].id))
      }).catch((e) => setError(e.message))
    }
  }, [])

  const cellValue = (start, day) => editing
    ? (draft[keyOf(start, day)] ?? '')
    : (() => {
      const item = (grid[start] || grid[`${start}:00`] || []).find((e) => e.day === day)
      if (!item) return ''
      if (item.isBreak) return 'break'
      return item.subject || ''
    })()

  const getItem = (start, day) => {
    const list = grid[start] || grid[`${start}:00`] || []
    return list.find((e) => e.day === day)
  }

  const updateCell = (start, day, value) => {
    setDraft((d) => ({ ...d, [keyOf(start, day)]: value }))
  }

  const startEdit = () => {
    setDraft(initialise(grid))
    setEditing(true)
    setNote('')
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      const entries = []
      periods.forEach((p) => {
        days.forEach((day) => {
          const value = draft[keyOf(p.start, day)]
          if (value === 'break') {
            entries.push({ day, start: p.start, end: p.end, isBreak: true, label: p.label || 'Break' })
          } else {
            entries.push({ day, start: p.start, end: p.end, subjectId: value ? Number(value) : null, isBreak: false })
          }
        })
      })
      await admin.saveTimetable({ classId: Number(classId), termId: Number(termId), entries })
      await load()
      setNote('Timetable saved successfully.')
    } catch (e) {
      setError(e.errors ? Object.values(e.errors).flat().join(' ') : e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDownloadTemplate = async () => {
    if (!classId || !termId) {
      setError('Select a class and term before downloading the template.')
      return
    }
    setDownloadLoading(true)
    setError(null)
    try {
      await admin.downloadTimetableTemplate({ classId, termId })
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

  const handleUploadTimetable = async () => {
    if (!uploadFile) {
      setError('Choose the timetable file first.')
      return
    }
    if (!classId || !termId) {
      setError('Select a class and term before uploading.')
      return
    }
    setUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('classId', classId)
      formData.append('termId', termId)
      formData.append('file', uploadFile)
      const res = await admin.uploadTimetable(formData)
      setUploadFile(null)
      if (fileRef.current) fileRef.current.value = ''
      await load()
      setNote(res.message)
    } catch (e) {
      setError(e.errors ? Object.values(e.errors).flat().join(' ') : e.message)
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteTimetable = async () => {
    if (!classId || !termId) {
      setError('Select a class and term before deleting.')
      return
    }

    const label = `${classes.find((c) => c.id === Number(classId))?.name || 'this class'} - ${terms.find((t) => t.id === Number(termId))?.name || 'this term'}`

    if (!window.confirm(`Delete the entire timetable for ${label}? This cannot be undone.`)) return

    setDeleting(true)
    setError(null)
    setNote('')
    try {
      const res = await admin.deleteTimetable({ classId, termId })
      setPeriods([])
      setGrid({})
      setDraft({})
      setEditing(false)
      await load()
      setNote(res.message)
    } catch (e) {
      setError(e.message)
    } finally {
      setDeleting(false)
    }
  }

  const className = classes.find((c) => c.id === Number(classId))?.name || ''
  const termName = terms.find((t) => t.id === Number(termId))?.name || ''
  const isIslamic = (name) => ['Islamic Studies', 'Arabic'].includes(name)

  return (
    <div>
      <PageHeader title="School Timetable" subtitle="Create and manage weekly timetables for every class and term" />

      {error && <div className="mb-6 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">{error}</div>}
      {note && <div className="mb-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600">{note}</div>}

      <Card className="p-6">
        <div className="flex flex-wrap items-center gap-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Class</span>
            <select value={classId} onChange={(e) => setClassId(e.target.value)} className="w-44 rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none focus:border-navy-400">
              {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Term</span>
            <select value={termId} onChange={(e) => setTermId(e.target.value)} className="w-44 rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none focus:border-navy-400">
              <option value="">Select term</option>
              {terms.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </label>
          <div className="ml-auto flex gap-2">
            {editing ? (
              <>
                <Button tone="ghost" size="sm" onClick={() => { setEditing(false); setDraft(initialise(grid)) }}><X size={14} /> Cancel</Button>
                <Button tone="primary" size="sm" disabled={saving} onClick={handleSave}><Save size={14} /> {saving ? 'Saving…' : 'Save Timetable'}</Button>
              </>
            ) : (
              <>
                <Button tone="outline" size="sm" onClick={startEdit} disabled={!periods.length || !termId}><Pencil size={14} /> Edit Timetable</Button>
                <Button tone="outline" size="sm" onClick={handleDownloadTemplate} disabled={downloadLoading}>
                  <Download size={14} /> {downloadLoading ? 'Preparing.' : 'Download Template'}
                </Button>
                <Button tone="danger" size="sm" onClick={handleDeleteTimetable} disabled={deleting || !periods.length || !termId}>
                  <Trash2 size={14} /> {deleting ? 'Deleting...' : 'Delete Timetable'}
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      <Card className="mt-6 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="flex items-center gap-2 font-bold text-navy-900"><UploadCloud size={18} className="text-navy-600" /> Bulk Timetable Upload</h3>
            <p className="mt-1 text-xs text-slate-400">Download the Excel template for a class and term, fill in subjects per period, then upload. This replaces all existing timetable entries for that class and term.</p>
          </div>
          <Badge color="sky" dot>Admin upload</Badge>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFileChange} className="hidden" />
          <Button tone="outline" onClick={() => fileRef.current?.click()}><UploadCloud size={15} /> {uploadFile ? 'Change File' : 'Choose File'}</Button>
          <span className="text-xs text-slate-400">{uploadFile ? uploadFile.name : 'XLSX, XLS or CSV · max 10MB'}</span>
          <Button tone="primary" onClick={handleUploadTimetable} disabled={uploading}>
            <UploadCloud size={15} /> {uploading ? 'Uploading…' : 'Upload Timetable'}
          </Button>
        </div>
      </Card>

      <Card className="mt-6 overflow-x-auto">
        {loading ? (
          <div className="flex justify-center py-20"><div className="h-9 w-9 animate-spin rounded-full border-4 border-navy-100 border-t-navy-700" /></div>
        ) : (
          <>
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-navy-100 bg-navy-900 text-white">
                  <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide">Time</th>
                  {days.map((d) => <th key={d} className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide">{d}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {periods.map((p, i) => {
                  const anyBreak = days.some((d) => (getItem(p.start, d)?.isBreak))
                  return (
                    <tr key={p.start} className={i % 2 ? 'bg-cream-100/40' : 'bg-white'}>
                      <td className="px-6 py-3 font-bold text-navy-800">
                        {p.start} – {p.end}
                        {p.isBreak || anyBreak ? <span className="ml-1 text-[10px] font-semibold uppercase text-slate-400">break</span> : null}
                      </td>
                      {days.map((d) => {
                        const value = cellValue(p.start, d)
                        if (editing) {
                          return (
                            <td key={d} className="px-3 py-2">
                              <select
                                value={draft[keyOf(p.start, d)] || ''}
                                onChange={(e) => updateCell(p.start, d, e.target.value)}
                                className="w-full rounded-lg border border-navy-100 px-2 py-1.5 text-xs outline-none focus:border-navy-400"
                              >
                                <option value="">–</option>
                                <option value="break">Break</option>
                                {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                              </select>
                            </td>
                          )
                        }
                        if (!value) return <td key={d} className="px-6 py-3 text-slate-300">–</td>
                        if (value === 'break') return <td key={d} className="px-6 py-3 text-center"><Badge color="slate">Break</Badge></td>
                        const islamic = isIslamic(value)
                        return (
                          <td key={d} className="px-6 py-3">
                            <span className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold ${islamic ? 'bg-teal-50 text-teal-700' : 'bg-navy-50 text-navy-800'}`}>
                              {islamic && <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />}
                              {value}
                            </span>
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {!periods.length && <p className="px-6 py-16 text-center text-sm text-slate-400">No timetable has been created for {className} yet.</p>}
            <div className="flex flex-wrap items-center gap-5 border-t border-navy-100 px-6 py-3 text-xs text-slate-500">
              <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-teal-500" /> Islamic Studies / Arabic</span>
              <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-navy-600" /> Core Subjects</span>
              <Badge color="gold" dot>{className}</Badge>
              <Badge color="sky" dot>{termName}</Badge>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
