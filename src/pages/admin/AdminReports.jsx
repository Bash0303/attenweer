import { useEffect, useState } from 'react'
import { BarChart3, FileText, Printer, TrendingUp, PieChart, Download } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Modal from '../../components/ui/Modal'
import { DonutChart, BarsChart } from '../../components/ui/Charts'
import { admin } from '../../services/api'

const reportTypes = [
  { label: 'Student Report', type: 'students' },
  { label: 'Teacher Report', type: 'teachers' },
  { label: 'Attendance Report', type: 'attendance' },
  { label: 'Result Report', type: 'results' },
  { label: 'Class Report', type: 'classes' },
  { label: 'Subject Report', type: 'subjects' },
  { label: 'Fee Report', type: 'fees' },
  { label: 'Payment Report', type: 'payments' },
  { label: 'Assignment Report', type: 'assignments' },
  { label: 'Examination Report', type: 'examinations' },
  { label: 'Student Population Report', type: 'population' },
]
const gradeColors = { A: '#10b981', B: '#2a478e', C: '#d9a62e', D: '#f59e0b', E: '#f97316', F: '#ef4444' }

export default function AdminReports() {
  const [summary, setSummary] = useState(null)
  const [grades, setGrades] = useState([])
  const [trend, setTrend] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [report, setReport] = useState(null)
  const [generating, setGenerating] = useState(null)

  useEffect(() => {
    Promise.all([admin.reportSummary(), admin.gradeDistribution(), admin.performanceTrend()])
      .then(([summaryRes, gradesRes, trendRes]) => {
        setSummary(summaryRes)
        setGrades(gradesRes.data || [])
        setTrend(trendRes.data || [])
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const generate = async (item) => {
    setGenerating(item.type)
    setError(null)
    try {
      const res = await admin.generateReport(item.type)
      setReport({ ...res, label: item.label })
    } catch (e) {
      setError(e.message)
    } finally {
      setGenerating(null)
    }
  }

  const exportCsv = () => {
    if (!report?.rows?.length) return
    const headers = Object.keys(report.rows[0])
    const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
    const csv = [headers.map(escape).join(','), ...report.rows.map((r) => headers.map((h) => escape(r[h])).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${report.type}-report.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const gradedTotal = grades.reduce((s, g) => s + g.value, 0)

  if (loading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-navy-100 border-t-navy-700" /></div>
  }

  return (
    <div>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Generate and export powerful school reports"
        actions={
          <>
            <Button tone="outline" onClick={() => window.print()}><Printer size={15} /> Print</Button>
          </>
        }
      />

      {error && <div className="mb-6 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">{error}</div>}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <PieChart size={18} className="text-gold-500" />
            <h3 className="font-bold text-navy-900">Grade Distribution</h3>
          </div>
          {gradedTotal ? (
            <>
              <DonutChart data={grades.map((g) => ({ ...g, name: g.label, color: gradeColors[g.label] }))} height={230} centerValue={gradedTotal.toLocaleString()} centerLabel="Graded" />
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                {grades.map((g) => (
                  <div key={g.label} className="flex items-center justify-between rounded-lg bg-navy-50/50 px-2.5 py-1 text-xs">
                    <span className="font-bold text-navy-800">{g.label}</span>
                    <span className="text-slate-500">{g.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="py-16 text-center text-sm text-slate-400">No approved results yet.</p>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald-600" />
            <h3 className="font-bold text-navy-900">Termly Performance</h3>
          </div>
          {trend.length ? (
            <BarsChart data={trend.map((t) => ({ name: t.label, average: t.value }))} dataKey="average" xKey="name" color="#2a478e" height={230} suffix="%" />
          ) : (
            <p className="py-16 text-center text-sm text-slate-400">No performance data yet.</p>
          )}
        </Card>

        <Card>
          <div className="flex items-center gap-2 border-b border-navy-100 px-6 py-4">
            <BarChart3 size={18} className="text-gold-500" />
            <h3 className="font-bold text-navy-900">Available Reports</h3>
          </div>
          <div className="max-h-[420px] divide-y divide-navy-50 overflow-y-auto">
            {reportTypes.map((r) => (
              <button key={r.type} onClick={() => generate(r)} disabled={!!generating} className="flex w-full items-center gap-3 px-6 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-navy-50 disabled:opacity-50">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-cream-100 text-navy-700"><FileText size={15} /></span>
                {r.label}
                <span className="ml-auto font-semibold text-navy-700">{generating === r.type ? 'Generating…' : 'Generate →'}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-6">
        <h3 className="font-bold text-navy-900">Quick Insight Summary</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Class Average', summary?.classAverage ?? '—', '%'],
            ['Pass Rate', summary?.passRate ?? '—', '%'],
            ['Attendance Rate', summary?.attendanceRate ?? '—', '%'],
            ['Fee Collection', summary?.feeCollection ?? '—', '%'],
          ].map(([k, v, suffix]) => (
            <div key={k} className="rounded-xl bg-cream-100/60 p-4 text-center">
              <p className="text-2xl font-extrabold text-navy-900">{v}{v === '—' ? '' : suffix}</p>
              <p className="text-xs font-medium text-slate-500">{k}</p>
            </div>
          ))}
        </div>
      </Card>

      <Modal open={!!report} onClose={() => setReport(null)} title={report?.label || 'Report'} wide>
        {report && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-slate-400">Generated {report.generatedAt} • {report.rows.length} rows</p>
              <div className="flex gap-2">
                <Button tone="outline" size="sm" onClick={() => window.print()}><Printer size={14} /> Print</Button>
                <Button tone="primary" size="sm" disabled={!report.rows.length} onClick={exportCsv}><Download size={14} /> CSV</Button>
              </div>
            </div>
            <div className="mt-4 max-h-[420px] overflow-auto rounded-xl border border-navy-100">
              {report.rows.length ? (
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-navy-900 text-white">
                    <tr>{Object.keys(report.rows[0]).map((h) => <th key={h} className="whitespace-nowrap px-4 py-2.5 text-xs font-semibold uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-navy-50">
                    {report.rows.map((row, i) => (
                      <tr key={i} className={i % 2 ? 'bg-cream-100/30' : 'bg-white'}>
                        {Object.keys(report.rows[0]).map((h) => <td key={h} className="whitespace-nowrap px-4 py-2 text-slate-600">{row[h] ?? '—'}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="p-8 text-center text-sm text-slate-400">No data available for this report.</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
