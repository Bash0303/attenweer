import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'

export const inputCls = 'w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none transition focus:border-navy-400 focus:ring-2 focus:ring-navy-100'

export function money(value) {
  return `\u20A6${Number(value || 0).toLocaleString()}`
}

export function LoadBlock({ label = 'Loading...' }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-navy-100 border-t-navy-700" />
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  )
}

export function ErrorBlock({ message, onRetry }) {
  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-bold text-navy-900">We could not load this page</p>
          <p className="mt-1 text-sm text-slate-500">{message}</p>
        </div>
        {onRetry && <Button tone="primary" onClick={onRetry}>Try again</Button>}
      </div>
    </Card>
  )
}

export function EmptyBlock({ title, message }) {
  return (
    <Card className="p-10 text-center">
      <p className="text-lg font-bold text-navy-900">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">{message}</p>
    </Card>
  )
}

export function TermSelect({ terms, value, onChange }) {
  if (!terms?.length) return null

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="font-semibold text-navy-800">Term</span>
      <select
        value={value || ''}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-xl border border-navy-100 bg-white px-3 py-2 text-sm font-semibold text-navy-800 outline-none focus:border-navy-400"
      >
        {terms.map((term) => (
          <option key={term.id} value={term.id}>{term.label || term.name}</option>
        ))}
      </select>
    </label>
  )
}
