import { BarChart3, FileText, FileSpreadsheet, Printer, TrendingUp, PieChart } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { DonutChart, BarsChart } from '../../components/ui/Charts'
import { gradeDistribution, performanceTrend } from '../../data/mock'

const reports = [
  'Student Report', 'Teacher Report', 'Attendance Report', 'Result Report',
  'Class Performance', 'Subject Performance', 'Fee Report', 'Payment Report',
  'Assignment Report', 'Examination Report', 'Student Population Report',
]

export default function AdminReports() {
  return (
    <div>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Generate and export powerful school reports"
        actions={
          <>
            <Button tone="outline"><FileText size={15} /> PDF</Button>
            <Button tone="outline"><FileSpreadsheet size={15} /> Excel</Button>
            <Button tone="primary"><Printer size={15} /> Print</Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <PieChart size={18} className="text-gold-500" />
            <h3 className="font-bold text-navy-900">Grade Distribution</h3>
          </div>
          <DonutChart data={gradeDistribution.map((g) => ({ ...g, color: { A: '#10b981', B: '#2a478e', C: '#d9a62e', D: '#f59e0b', E: '#f97316', F: '#ef4444' }[g.grade] }))} height={230} centerValue="1,018" centerLabel="Graded" />
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {gradeDistribution.map((g) => (
              <div key={g.grade} className="flex items-center justify-between rounded-lg bg-navy-50/50 px-2.5 py-1 text-xs">
                <span className="font-bold text-navy-800">{g.grade}</span>
                <span className="text-slate-500">{g.count}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald-600" />
            <h3 className="font-bold text-navy-900">Termly Performance</h3>
          </div>
          <BarsChart data={performanceTrend.map((t) => ({ name: `${t.term} Term`, average: t.average }))} dataKey="average" xKey="name" color="#2a478e" height={230} suffix="%" />
        </Card>

        <Card>
          <div className="flex items-center gap-2 border-b border-navy-100 px-6 py-4">
            <BarChart3 size={18} className="text-gold-500" />
            <h3 className="font-bold text-navy-900">Available Reports</h3>
          </div>
          <div className="divide-y divide-navy-50">
            {reports.map((r) => (
              <button key={r} className="flex w-full items-center gap-3 px-6 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-navy-50">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-cream-100 text-navy-700"><FileText size={15} /></span>
                {r}
                <span className="ml-auto font-semibold text-navy-700">Generate →</span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-6">
        <h3 className="font-bold text-navy-900">Quick Insight Summary</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Class Average', '71%', 'emerald'],
            ['Pass Rate', '98%', 'emerald'],
            ['Attendance Rate', '94%', 'emerald'],
            ['Fee Collection', '83%', 'emerald'],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl bg-cream-100/60 p-4 text-center">
              <p className="text-2xl font-extrabold text-navy-900">{v}</p>
              <p className="text-xs font-medium text-slate-500">{k}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}