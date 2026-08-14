import { ChevronDown } from 'lucide-react'
import Avatar from '../../components/ui/Avatar'

export default function ChildSwitcher({ children, value, onChange }) {
  const base = [
    { id: 'cjk', name: 'Abdullahi Jimoh', className: 'SS 2A', studentId: 'WGS/2025/00101', initials: 'AJ', color: 'bg-navy-600' },
    { id: 'cpa', name: 'Abdulrahman Adeleke', className: 'JSS 3B', studentId: 'WGS/2023/00880', initials: 'AA', color: 'bg-emerald-600' },
    { id: 'cmm', name: 'Musa Mohammed', className: 'Primary 5', studentId: 'WGS/2022/00610', initials: 'MM', color: 'bg-gold-500' },
  ]
  const list = children && children.length ? children : base
  const active = list.find((c) => c.id === value) || list[0]

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-navy-100 bg-white p-4 shadow-card">
      <div className="flex items-center gap-3">
        <Avatar initials={active.initials} color={active.color} size="lg" />
        <div>
          <p className="text-sm font-bold text-navy-900">{active.name}</p>
          <p className="text-xs text-slate-400">{active.className} • {active.studentId}</p>
        </div>
      </div>
      <div className="relative ml-auto">
        <select
          value={active.id}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none rounded-xl border border-navy-200 bg-cream-50 px-4 py-2.5 pr-9 text-sm font-bold text-navy-800 outline-none transition hover:border-navy-300"
        >
          {list.map((c) => <option key={c.id} value={c.id}>{c.name} — {c.className}</option>)}
        </select>
        <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-navy-700" />
      </div>
    </div>
  )
}