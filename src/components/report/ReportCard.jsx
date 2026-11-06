import { forwardRef } from 'react'
import { Printer, Download } from 'lucide-react'
import { school } from '../../data/mock'
import Button from '../ui/Button'
import logo from '../../assets/atenweer logo .png'

const gradeColor = {
  A: 'bg-emerald-50 text-emerald-600',
  B: 'bg-sky-50 text-sky-600',
  C: 'bg-amber-50 text-amber-600',
  D: 'bg-orange-50 text-orange-600',
  E: 'bg-rose-50 text-rose-500',
  F: 'bg-rose-100 text-rose-700',
}

const ordinal = (value) => {
  if (!value) return ''
  const remainder = value % 100
  if (remainder >= 11 && remainder <= 13) return 'th'
  return { 1: 'st', 2: 'nd', 3: 'rd' }[value % 10] || 'th'
}

const ReportCardInner = forwardRef(({ student, rows, term = school.term, session = school.session, summary, schoolInfo = school, teacherComment, principalComment, nextTerm }, ref) => {
  const computed = summary || {
    totalScore: rows.reduce((total, row) => total + Number(row.total || 0), 0),
    count: rows.length,
    average: rows.length ? Math.round(rows.reduce((total, row) => total + Number(row.total || 0), 0) / rows.length) : 0,
    position: null,
    classSize: null,
  }
  const info = schoolInfo || school

  return (
    <div ref={ref} id="report-card" className="rounded-2xl border border-navy-100 bg-white p-6 font-sans sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-navy-900 pb-4">
        <div className="flex items-center gap-3">
          <span className="grid h-14 w-14 place-items-center overflow-hidden rounded-2xl bg-navy-900">
            <img src={logo} alt={`${info.name} logo`} className="h-12 w-12 object-contain" />
          </span>
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-navy-900">{info.name}</h2>
            <p className="text-xs text-slate-500">{info.location}</p>
            <p className="text-xs font-semibold text-gold-600">{info.motto}{info.mottoArabicPlain ? ` - ${info.mottoArabicPlain}` : ''}</p>
          </div>
        </div>
        <div className="rounded-xl bg-navy-900 px-4 py-2 text-center text-white">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gold-400">{term} / Report Card</p>
          <p className="text-sm font-extrabold">{session}</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-4">
        {[
          ['Student', student.name],
          ['Student ID', student.studentId || student.studentIdVal],
          ['Class', student.className],
          ['Gender', student.gender],
        ].map(([k, v]) => (
          <div key={k}>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{k}</p>
            <p className="font-bold text-navy-900">{v}</p>
          </div>
        ))}
      </div>

      <table className="mt-6 w-full border-collapse overflow-hidden rounded-xl text-sm">
        <thead>
          <tr className="bg-navy-900 text-left text-white">
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Subject</th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">CA (40)</th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Exam (60)</th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Total (100)</th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Grade</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.subject} className={i % 2 ? 'bg-cream-100/50' : 'bg-white'}>
              <td className="px-4 py-2.5 font-semibold text-navy-900">{r.subject}</td>
              <td className="px-4 py-2.5">{r.ca1 + r.ca2}</td>
              <td className="px-4 py-2.5">{r.exam}</td>
              <td className="px-4 py-2.5 font-bold">{r.total}</td>
              <td className="px-4 py-2.5">
                <span className={`inline-flex min-w-7 justify-center rounded-lg px-2 py-0.5 text-xs font-bold ${gradeColor[r.grade] || 'bg-slate-50 text-slate-600'}`}>
                  {r.grade || '-'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-cream-100/70 p-4 text-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Total Score</p>
          <p className="text-xl font-extrabold text-navy-900">{computed.totalScore}<span className="text-sm font-semibold text-slate-400"> / {computed.count * 100}</span></p>
        </div>
        <div className="rounded-2xl bg-navy-50 p-4 text-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Average / Remark</p>
          <p className="text-xl font-extrabold text-navy-900">{computed.average}%</p>
        </div>
        <div className="rounded-2xl bg-sky-50 p-4 text-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Position</p>
          <p className="text-xl font-extrabold text-navy-900">{computed.position ? `${computed.position}${ordinal(computed.position)}` : 'N/A'} <span className="text-sm text-slate-400">of {computed.classSize || '-'}</span></p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="rounded-2xl p-4 text-sm italic text-slate-600">
          <p><span className="font-semibold not-italic text-navy-800">Teacher's Comment:</span> {teacherComment || 'Not provided yet.'}</p>
        </div>
        <div className="rounded-2xl p-4 text-sm italic text-slate-600">
          <p><span className="font-semibold not-italic text-navy-800">Principal's Comment:</span> {principalComment || 'Not provided yet.'}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-navy-100 pt-4 text-xs text-slate-400">
        <span>{nextTerm ? `Next term resumes: ${nextTerm}` : 'School calendar will be shared by the school office.'}</span>
        <span className="font-semibold text-navy-700">Signed by the School Management</span>
      </div>
    </div>
  )
})
ReportCardInner.displayName = 'ReportCard'

export default function ReportCard({ student, rows, term, session, showActions = true, summary, schoolInfo, teacherComment, principalComment, nextTerm }) {
  return (
    <div>
      {showActions && (
        <div className="mb-4 flex flex-wrap gap-2 print:hidden">
          <Button tone="primary" onClick={() => window.print()}>
            <Printer size={16} /> Print / Save as PDF
          </Button>
          <Button tone="gold" onClick={() => window.print()}>
            <Download size={16} /> Download Report Card
          </Button>
        </div>
      )}
      <ReportCardInner
        student={student}
        rows={rows}
        term={term}
        session={session}
        summary={summary}
        schoolInfo={schoolInfo}
        teacherComment={teacherComment}
        principalComment={principalComment}
        nextTerm={nextTerm}
      />
    </div>
  )
}