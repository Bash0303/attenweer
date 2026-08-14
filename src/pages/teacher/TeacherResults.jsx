import { useState } from 'react'
import { FileText, Send, Eye, CheckCircle2 } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'
import { resultData, resultSummary } from '../../data/mock'

const gradeOf = (t) => (t >= 75 ? 'A' : t >= 70 ? 'B' : t >= 60 ? 'C' : t >= 50 ? 'D' : t >= 45 ? 'E' : 'F')
const gradCls = { A: 'bg-emerald-50 text-emerald-600', B: 'bg-sky-50 text-sky-600', C: 'bg-amber-50 text-amber-600', D: 'bg-orange-50 text-orange-600', E: 'bg-rose-50 text-rose-500', F: 'bg-rose-100 text-rose-700' }

export default function TeacherResults() {
  const [className, setClassName] = useState('SS 2A')
  const [subject, setSubject] = useState('Mathematics')
  const [rows, setRows] = useState(resultData['SS 2A'])
  const [submitted, setSubmitted] = useState(false)

  const setExam = (subject, v) => setRows((prev) => prev.map((r) => (r.subject === subject ? { ...r, exam: Math.min(60, Math.max(0, Number(v) || 0)) } : r)))

  const sum = resultSummary(rows)

  return (
    <div>
      <PageHeader title="Results Entry" subtitle="Enter scores, review computed totals and submit for approval" />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={FileText} label="Results Submitted" value={submitted ? 'Submitted' : 'Draft'} sub={className} tone="navy" index={0} />
        <StatCard icon={FileText} label="Class Average" value={`${sum.average}%`} sub="current draft" tone="emerald" index={1} />
        <StatCard icon={CheckCircle2} label="Approval Status" value="Pending" sub="awaiting HOD/Admin" tone="amber" index={2} />
      </div>

      <Card className="p-6">
        <div className="flex flex-wrap items-center gap-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Class</span>
            <select value={className} onChange={(e) => setClassName(e.target.value)} className="w-40 rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none focus:border-navy-400">
              <option>SS 2A</option><option>SS 3A</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Subject</span>
            <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-48 rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none focus:border-navy-400">
              <option>Mathematics</option><option>English Language</option><option>Literature in English</option>
            </select>
          </label>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs text-slate-400">CA locked after submit • Exam editable</span>
            <Button tone="primary" onClick={() => setSubmitted(true)}><Send size={15} /> Submit for Review</Button>
          </div>
        </div>
      </Card>

      <Card className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead>
            <tr className="border-b border-navy-100 bg-navy-50/50 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-6 py-3.5 font-semibold">Subject</th>
              <th className="px-6 py-3.5 font-semibold">CA 1</th><th className="px-6 py-3.5 font-semibold">CA 2</th>
              <th className="px-6 py-3.5 font-semibold">CA Total (40)</th>
              <th className="px-6 py-3.5 font-semibold">Exam (60)</th>
              <th className="px-6 py-3.5 font-semibold">Total (100)</th>
              <th className="px-6 py-3.5 font-semibold">Grade</th>
              <th className="px-6 py-3.5 font-semibold">Remark</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-50">
            {rows.map((r) => {
              const total = r.ca1 + r.ca2 + r.exam
              const g = gradeOf(total)
              return (
                <tr key={r.subject}>
                  <td className="px-6 py-3 font-semibold text-navy-900">{r.subject}</td>
                  <td className="px-6 py-3">{r.ca1}</td>
                  <td className="px-6 py-3">{r.ca2}</td>
                  <td className="px-6 py-3 font-medium">{r.ca1 + r.ca2}</td>
                  <td className="px-6 py-3"><input className="w-16 rounded-lg border border-navy-100 px-2 py-1.5 text-center font-semibold focus:border-navy-400" defaultValue={r.exam} onChange={(e) => setExam(r.subject, e.target.value)} /></td>
                  <td className="px-6 py-3 font-bold text-navy-900">{total}</td>
                  <td className="px-6 py-3"><span className={`inline-flex min-w-7 justify-center rounded-lg px-2 py-0.5 text-xs font-bold ${gradCls[g]}`}>{g}</span></td>
                  <td className="px-6 py-3 text-xs text-slate-500">{total >= 75 ? 'Excellent' : total >= 60 ? 'Good' : total >= 45 ? 'Pass' : 'Needs Support'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-navy-100 px-6 py-4">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-500">Total: <strong className="text-navy-900">{sum.totalScore}</strong></span>
            <span className="text-slate-500">Average: <strong className="text-navy-900">{sum.average}%</strong></span>
            <span className="text-slate-500">Best: <strong className="text-navy-900">{sum.best}</strong></span>
          </div>
          <div className="flex gap-2">
            <Button tone="outline" size="sm"><Eye size={14} /> Preview</Button>
            <Button tone="emerald" size="sm"><CheckCircle2 size={14} /> Save & Submit</Button>
          </div>
        </div>
      </Card>

      <Card className="mt-6 p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <Badge color="slate">HOD Review</Badge>
          <span>→</span><Badge color="slate">Admin Verify</Badge>
          <span>→</span><Badge color="slate">Approve</Badge>
          <span>→</span><Badge color="slate">Publish</Badge>
          <span>→</span><Badge color="emerald" dot>Student & Parent See Result</Badge>
        </div>
      </Card>
    </div>
  )
}