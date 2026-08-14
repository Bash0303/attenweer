export default function ProgressBar({ value, color = 'bg-navy-600', className = '', height = 'h-2' }) {
  return (
    <div className={`w-full overflow-hidden rounded-full bg-slate-100 ${height} ${className}`}>
      <div
        className={`rounded-full ${color} transition-all duration-700`}
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  )
}