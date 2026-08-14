import { useState } from 'react'
import { FileText, Download, Award } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import StatCard from '../../components/ui/StatCard'
import ChildSwitcher from './ChildSwitcher'
import ReportCard from '../../components/report/ReportCard'
import { resultData, resultSummary, school } from '../../data/mock'

const resultsByChild = {
  cjk: resultData['SS 2A'],
  cpa: resultData['SS 1A'],
  cmm: resultData['SS 2A'],
}

const childMeta = {
  cjk: { name: 'Abdullahi Jimoh', className: 'SS 2A', studentId: 'WGS/2025/00101', gender: 'Male', initials: 'AJ', color: 'bg-navy-600' },
  cpa: { name: 'Abdulrahman Adeleke', className: 'JSS 3B', studentId: 'WGS/2023/00880', gender: 'Male', initials: 'AA', color: 'bg-emerald-600' },
  cmm: { name: 'Musa Mohammed', className: 'Primary 5', studentId: 'WGS/2022/00610', gender: 'Male', initials: 'MM', color: 'bg-gold-500' },
}

export default function ParentResults() {
  const [child, setChild] = useState('cjk')
  const rows = resultsByChild[child]
  const sum = resultSummary(rows)
  const meta = childMeta[child]

  return (
    <div>
      <PageHeader title="Results & Report Cards" subtitle="View and download each child's termly report" actions={<Button tone="primary" onClick={() => window.print()}><Download size={15} /> Download PDF</Button>} />

      <ChildSwitcher value={child} onChange={setChild} />

      <div className="mt-6 mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={FileText} label="Total Score" value={`${sum.totalScore}`} sub={`/ ${sum.count * 100}`} tone="navy" index={0} />
        <StatCard icon={Award} label="Average" value={`${sum.average}%`} sub={sum.remark} tone="emerald" index={1} />
        <StatCard icon={Award} label="Position" value={`${sum.position}th`} sub="of 34 students" tone="gold" index={2} />
      </div>

      <ReportCard student={meta} rows={rows} term={school.term} session={school.session} showActions={false} />
    </div>
  )
}