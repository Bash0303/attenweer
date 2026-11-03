import { useEffect, useState } from 'react'
import { BookOpen, GraduationCap, User } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Badge, { statusColor } from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'
import { student } from '../../services/api'
import { EmptyBlock, ErrorBlock, LoadBlock, TermSelect } from './studentUtils'

export default function StudentSubjects() {
  const [termId, setTermId] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)

    student.subjects(termId ? { termId } : undefined)
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
  }, [termId, reloadKey])

  const changeTerm = (value) => {
    setTermId(value)
  }

  if (loading && !data) return <LoadBlock label="Loading your subjects..." />
  if (error) return <ErrorBlock message={error} onRetry={() => setReloadKey((key) => key + 1)} />

  const subjects = data?.data || []
  const summary = data?.summary || {}

  return (
    <div>
      <PageHeader
        title="My Subjects"
        subtitle={`${data?.className || 'Your class'} • ${data?.session || ''}`}
        actions={<TermSelect terms={data?.terms} value={termId || data?.termId} onChange={changeTerm} />}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={BookOpen} label="Subjects Offered" value={summary.subjects || 0} tone="navy" index={0} />
        <StatCard icon={GraduationCap} label="Subjects With Results" value={summary.withResults || 0} sub={data?.term} tone="emerald" index={1} />
        <StatCard icon={User} label="Class" value={data?.className || '-'} tone="gold" index={2} />
      </div>

      {!subjects.length ? (
        <div className="mt-6"><EmptyBlock title="No subjects yet" message="No subjects have been assigned to your class for this term." /></div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {subjects.map((subject) => (
            <Card key={subject.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy-50 text-navy-700"><BookOpen size={20} /></span>
                  <div>
                    <p className="font-bold text-navy-900">{subject.name}</p>
                    <p className="text-xs text-slate-400">{subject.code || 'No code'} • {subject.category || 'Core'}</p>
                  </div>
                </div>
                <Badge color={subject.published ? statusColor('Approved') : 'slate'} dot>{subject.published ? 'Result out' : 'Pending'}</Badge>
              </div>
              <div className="mt-4 flex items-center justify-between rounded-xl bg-cream-100/70 px-3 py-2.5">
                <span className="text-xs font-semibold text-slate-500">Teacher</span>
                <span className="text-sm font-semibold text-navy-800">{subject.teacher || 'Not assigned'}</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl border border-navy-100 p-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Score</p>
                  <p className="text-sm font-extrabold text-navy-900">{subject.published && subject.total !== null ? subject.total : '-'}</p>
                </div>
                <div className="rounded-xl border border-navy-100 p-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Grade</p>
                  <p className="text-sm font-extrabold text-navy-900">{subject.published ? subject.grade || '-' : '-'}</p>
                </div>
                <div className="rounded-xl border border-navy-100 p-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Remark</p>
                  <p className="text-sm font-extrabold text-navy-900">{subject.published ? subject.remark || '-' : '-'}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
