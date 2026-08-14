const colors = {
  navy: 'bg-navy-50 text-navy-700 border-navy-100',
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  gold: 'bg-cream-100 text-gold-600 border-cream-300',
  rose: 'bg-rose-50 text-rose-600 border-rose-100',
  amber: 'bg-amber-50 text-amber-600 border-amber-100',
  sky: 'bg-sky-50 text-sky-600 border-sky-100',
  slate: 'bg-slate-100 text-slate-600 border-slate-200',
  violet: 'bg-violet-50 text-violet-600 border-violet-100',
}

export default function Badge({ children, color = 'slate', dot = false }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${colors[color]}`}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}

export function statusColor(status) {
  const map = {
    Active: 'emerald',
    Verified: 'emerald',
    Approved: 'emerald',
    Present: 'emerald',
    Submitted: 'sky',
    Open: 'emerald',
    Graded: 'navy',
    Pending: 'amber',
    Late: 'amber',
    Failed: 'rose',
    Rejected: 'rose',
    Absent: 'rose',
    Suspended: 'rose',
    'On Leave': 'amber',
    Published: 'emerald',
    Overdue: 'rose',
  }
  return map[status] || 'slate'
}