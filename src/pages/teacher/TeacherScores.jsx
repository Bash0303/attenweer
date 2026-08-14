import { useState } from 'react'
import { FileSpreadsheet, Save } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'
import { students } from '../../data/mock'

const caDefaults = { 'Abdullahi Jimoh': [18, 17], 'Maryam Adeleke': [16, 15], 'Majeed Olawale': [17, 16], 'Aminah Kolawole': [15, 14], 'Aisha Mohammed': [19, 18], 'Ibrahim Yusuf': [17, 15], 'Rukayat Okafor': [12, 13], 'Abdulhakeem Obi': [18, 16], 'Zainab Bello': [16, 17], 'Uthman Adeyemi': [14, 15] }

export default function TeacherScores() {
  const [className, setClassName] = useState('SS 2A')
  const [subject, setSubject] = useState('Mathematics')
  const [scores, setScores] = useState(caDefaults)

  const setScore = (name, i, v) => setScores((prev) => ({ ...prev, [name]: prev[name].map((x, idx) => (idx === i ? Math.min(20, Math.max(0, Number(v) || 0)) : x)) }))

  return (
    <div>
      <PageHeader title="CA Scores" subtitle="Record continuous assessment scores (CA1 & CA2 out of 20 each)" />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={FileSpreadsheet} label="Subjects Graded" value="English" sub="SS 2A • SS 3A" tone="navy" index={0} />
        <StatCard icon={FileSpreadsheet} label="Avg CA Score" value="82%" sub="class average" tone="emerald" index={1} />
        <StatCard icon={FileSpreadsheet} label="Saved Records" value="68" sub="this term" tone="gold" index={2} />
      </div>

      <Card className="p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Class</span>
            <select value={className} onChange={(e) => setClassName(e.target.value)} className="w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none focus:border-navy-400">
              <option>SS 2A</option><option>SS 3A</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Subject</span>
            <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none focus:border-navy-400">
              <option>Mathematics</option><option>English Language</option><option>Literature in English</option>
            </select>
          </label>
        </div>
      </Card>

      <Card className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-navy-100 bg-navy-50/50 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-6 py-3.5 font-semibold">Student</th>
              <th className="px-6 py-3.5 font-semibold">CA 1 (/20)</th>
              <th className="px-6 py-3.5 font-semibold">CA 2 (/20)</th>
              <th className="px-6 py-3.5 font-semibold">Total (/40)</th>
              <th className="px-6 py-3.5 font-semibold">Performance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-50">
            {students.filter((s) => s.className === className).map((s) => {
              const [c1, c2] = scores[s.name] || [0, 0]
              const total = c1 + c2
              const pct = Math.round(total / 40 * 100)
              return (
                <tr key={s.id}>
                  <td className="px-6 py-3 font-semibold text-navy-900">{s.name}</td>
                  <td className="px-6 py-3"><input className="w-16 rounded-lg border border-navy-100 bg-white px-2 py-1.5 text-center text-sm font-semibold focus:border-navy-400" value={c1} onChange={(e) => setScore(s.name, 0, e.target.value)} /></td>
                  <td className="px-6 py-3"><input className="w-16 rounded-lg border border-navy-100 bg-white px-2 py-1.5 text-center text-sm font-semibold focus:border-navy-400" value={c2} onChange={(e) => setScore(s.name, 1, e.target.value)} /></td>
                  <td className="px-6 py-3 font-bold text-navy-900">{total}</td>
                  <td className="px-6 py-3">
                    <Badge color={pct >= 75 ? 'emerald' : pct >= 60 ? 'navy' : pct >= 45 ? 'amber' : 'rose'}>{pct}%</Badge>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className="flex items-center justify-between border-t border-navy-100 px-6 py-4">
          <p className="text-xs text-slate-400">CA scores combine with exam scores to compute term totals.</p>
          <Button tone="primary"><Save size={16} /> Save CA Scores</Button>
        </div>
      </Card>
    </div>
  )
}