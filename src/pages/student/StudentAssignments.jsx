import { useState } from 'react'
import { PenSquare, Upload, Download } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import ProgressBar from '../../components/ui/ProgressBar'
import { studentAssignments } from '../../data/mock'

const statusBadge = { Pending: 'amber', Submitted: 'sky', Graded: 'navy' }

export default function StudentAssignments() {
  const [selected, setSelected] = useState(null)

  return (
    <div>
      <PageHeader title="My Assignments" subtitle="View, submit and track grades on assignments" />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {studentAssignments.map((a) => (
            <Card key={a.id} hover className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy-800 text-gold-400"><PenSquare size={18} /></span>
                  <div>
                    <h3 className="font-bold text-navy-900">{a.title}</h3>
                    <p className="text-xs text-slate-400">{a.subject} • {a.teacher}</p>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">{a.desc}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge color={statusBadge[a.status]} dot>{a.status}</Badge>
                  <p className="mt-1.5 text-xs text-slate-400">Deadline: <span className="font-semibold text-navy-800">{a.deadline}</span></p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                {a.score !== null ? (
                  <>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs"><span className="font-semibold text-navy-800">Score</span><span className="font-bold text-navy-900">{a.score}/20</span></div>
                      <ProgressBar value={a.score / 20 * 100} color="bg-emerald-500" className="mt-1" height="h-1.5" />
                    </div>
                    <Button tone="outline" size="sm" onClick={() => setSelected(a)}><Download size={14} /> View Feedback</Button>
                  </>
                ) : a.status === 'Pending' ? (
                  <>
                    <div className="flex-1" />
                    <Button tone="outline" size="sm"><Upload size={14} /> Upload File</Button>
                    <Button tone="primary" size="sm" onClick={() => setSelected(a)}>Submit Answer</Button>
                  </>
                ) : (
                  <Button tone="outline" size="sm">View Submission</Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6 h-fit">
          <h3 className="font-bold text-navy-900">Submission Tips</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-500">
            {['Submit before the deadline to avoid the \'Overdue\' status.', 'Attach clear, scanned files (pdf/jpg, max 2MB).', 'Show all workings for mathematics questions.', 'For memorisation, record a clear audio clip.', 'Check your score and teacher\'s feedback after grading.'].map((t) => (
              <li key={t} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />{t}</li>
            ))}
          </ul>
          <Button className="w-full mt-5" tone="gold">View All Submissions</Button>
        </Card>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-navy-950/50 p-4 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lift" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-navy-900">{selected.title}</h3>
            <p className="mt-1 text-sm text-slate-400">{selected.subject}</p>
            <div className="mt-4 space-y-3">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-navy-800">Your Answer</span>
                <textarea rows={4} className="w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none focus:border-navy-400" placeholder="Type or paste your answer…" />
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border-2 border-dashed border-navy-200 p-3 text-center text-xs text-slate-500"><Upload size={16} className="mx-auto mb-1" /> Click to upload file</div>
                <div className="rounded-xl border-2 border-dashed border-navy-200 p-3 text-center text-xs text-slate-500"><PenSquare size={16} className="mx-auto mb-1" /> Or scan to answer</div>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button tone="ghost" onClick={() => setSelected(null)}>Cancel</Button>
              <Button tone="primary">Submit Assignment</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}