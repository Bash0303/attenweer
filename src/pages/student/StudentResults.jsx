import { FileText, Download, Award } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import StatCard from '../../components/ui/StatCard'
import ReportCard from '../../components/report/ReportCard'
import { students, resultData, resultSummary, school } from '../../data/mock'

const termTabs = ['First Term', 'Second Term', 'Third Term']

export default function StudentResults() {
  const me = students[0]
  const rows = resultData['SS 2A']
  const sum = resultSummary(rows)

  return (
    <div>
      <PageHeader title="My Results" subtitle="View and download your termly report cards" actions={<Button tone="primary" onClick={() => window.print()}><Download size={15} /> Download PDF</Button>} />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={FileText} label="Total Score" value={`${sum.totalScore}`} sub={`/ ${sum.count * 100}`} tone="navy" index={0} />
        <StatCard icon={Award} label="Average" value={`${sum.average}%`} sub={sum.remark} tone="emerald" index={1} />
        <StatCard icon={Award} label="Position" value={`${sum.position}th`} sub="of 34 students" tone="gold" index={2} />
      </div>

      <div className="mb-4 flex gap-2">
        {termTabs.map((t) => (
          <button key={t} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${t === 'First Term' ? 'bg-navy-800 text-white' : 'bg-white text-slate-500 border border-navy-100 hover:bg-navy-50'}`}>
            {t}
          </button>
        ))}
      </div>

      <ReportCard student={me} rows={rows} term={school.term} session={school.session} showActions={false} />

      <Card className="mt-6 p-6">
        <h3 className="font-bold text-navy-900">Grade Key</h3>
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
          {[['A', '75 – 100', 'Excellent'], ['B', '70 – 74', 'Very Good'], ['C', '60 – 69', 'Good'], ['D', '50 – 59', 'Credit'], ['E', '45 – 49', 'Pass'], ['F', '0 – 44', 'Fail']].map(([g, r, m]) => (
            <span key={g} className="rounded-full border border-navy-100 bg-cream-100/50 px-3 py-1.5 text-navy-800">{g}: {r} • {m}</span>
          ))}
        </div>
      </Card>
    </div>
  )
}