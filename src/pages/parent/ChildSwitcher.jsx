import { ChevronDown } from 'lucide-react'
import Avatar from '../../components/ui/Avatar'

export default function ChildSwitcher({ children, value, onChange }) {
  const list = children || []
  const active = list.find((child) => String(child.id) === String(value)) || list[0]

  if (!active) return null

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-navy-100 bg-white p-4 shadow-card">
      <div className="flex items-center gap-3">
        <Avatar initials={active.initials} color={active.color} size="lg" />
        <div>
          <p className="text-sm font-bold text-navy-900">{active.name}</p>
          <p className="text-xs text-slate-400">{active.className} &middot; {active.studentId}</p>
        </div>
      </div>
      {list.length > 1 && (
        <div className="relative ml-auto">
          <select
            value={active.id}
            onChange={(e) => onChange(e.target.value)}
            className="appearance-none rounded-xl border border-navy-200 bg-cream-50 px-4 py-2.5 pr-9 text-sm font-bold text-navy-800 outline-none transition hover:border-navy-300"
          >
            {list.map((child) => (
              <option key={child.id} value={child.id}>{child.name} - {child.className}</option>
            ))}
          </select>
          <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-navy-700" />
        </div>
      )}
    </div>
  )
}
