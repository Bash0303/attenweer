import { Search, Download } from 'lucide-react'
import Button from './Button'

export function TableToolbar({ title, subtitle, onSearch, actions, placeholder = 'Search…' }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy-100 px-6 py-4">
      <div>
        <h3 className="font-bold text-navy-900">{title}</h3>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {onSearch && (
          <div className="relative">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              onChange={(e) => onSearch(e.target.value)}
              placeholder={placeholder}
              className="w-44 rounded-xl border border-navy-100 bg-navy-50/40 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-navy-300 focus:bg-white sm:w-56"
            />
          </div>
        )}
        <Button tone="outline" size="sm"><Download size={15} /> Export</Button>
        {actions}
      </div>
    </div>
  )
}

export default function DataTable({
  columns,
  rows,
  rowKey,
  onRowClick,
  selectable = false,
  selectedIds = [],
  onSelect,
  onSelectAll,
}) {
  const keyOf = (row) => String(rowKey ? row[rowKey] : rows.indexOf(row))
  const selectedSet = new Set(selectedIds.map(String))
  const allSelected = selectable && rows.length > 0 && rows.every((row) => selectedSet.has(keyOf(row)))
  const someSelected = selectable && rows.some((row) => selectedSet.has(keyOf(row)))
  const columnCount = columns.length + (selectable ? 1 : 0)

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-navy-100 bg-navy-50/50 text-xs uppercase tracking-wider text-slate-500">
            {selectable && (
              <th className="w-12 px-6 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(element) => {
                    if (element) element.indeterminate = !allSelected && someSelected
                  }}
                  onChange={(event) => onSelectAll?.(event.target.checked, rows)}
                  className="h-4 w-4 rounded border-navy-200 accent-navy-700"
                  aria-label="Select all rows"
                />
              </th>
            )}
            {columns.map((c) => (
              <th key={c.key} className={`px-6 py-3 font-semibold ${c.right ? 'text-right' : ''}`}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-navy-50">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columnCount} className="px-6 py-12 text-center text-sm text-slate-400">
                No records found.
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr
                key={rowKey ? row[rowKey] : i}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={`transition ${onRowClick ? 'cursor-pointer hover:bg-cream-100/40' : 'hover:bg-navy-50/40'}`}
              >
                {selectable && (
                  <td className="px-6 py-3.5" onClick={(event) => event.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedSet.has(keyOf(row))}
                      onChange={() => onSelect?.(row)}
                      className="h-4 w-4 rounded border-navy-200 accent-navy-700"
                      aria-label={`Select ${row.name || 'row'}`}
                    />
                  </td>
                )}
                {columns.map((c) => (
                  <td key={c.key} className={`px-6 py-3.5 ${c.right ? 'text-right' : ''}`}>
                    {c.render ? c.render(row) : row[c.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}