import { useEffect, useState } from 'react'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { parent } from '../../services/api'

const CHILD_KEY = 'wgs.parentChild'

const loaders = {
  attendance: parent.childAttendance,
  assignments: parent.childAssignments,
  timetable: parent.childTimetable,
  exams: parent.childExams,
  fees: parent.childFees,
  results: parent.childResults,
}

export function money(value) {
  return `\u20A6${Number(value || 0).toLocaleString()}`
}

export function useParentChildren() {
  const [children, setChildren] = useState([])
  const [guardian, setGuardian] = useState(null)
  const [childId, setChildIdState] = useState(() => sessionStorage.getItem(CHILD_KEY) || '')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)

    parent.children()
      .then((res) => {
        if (cancelled) return
        const list = res.data || []
        setChildren(list)
        setGuardian(res.guardian || null)
        setChildIdState((current) => {
          const next = list.some((child) => String(child.id) === String(current))
            ? current
            : (list[0] ? String(list[0].id) : '')
          if (next) sessionStorage.setItem(CHILD_KEY, next)
          return next
        })
      })
      .catch((e) => {
        if (!cancelled) setError(e.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [reloadKey])

  const setChildId = (id) => {
    const value = id === null || id === undefined ? '' : String(id)
    setChildIdState(value)
    if (value) sessionStorage.setItem(CHILD_KEY, value)
  }

  return {
    children,
    guardian,
    childId,
    setChildId,
    child: children.find((c) => String(c.id) === String(childId)) || children[0] || null,
    loading,
    error,
    reload: () => setReloadKey((key) => key + 1),
  }
}

export function useChildResource(resource, childId, params) {
  const paramsKey = JSON.stringify(params || {})
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(Boolean(childId))
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (!childId) {
      setData(null)
      setLoading(false)
      return undefined
    }

    let cancelled = false
    const loader = loaders[resource]
    const requestParams = JSON.parse(paramsKey)

    setLoading(true)
    setError(null)

    loader(childId, requestParams)
      .then((res) => {
        if (!cancelled) setData(res)
      })
      .catch((e) => {
        if (!cancelled) setError(e.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [resource, childId, paramsKey, reloadKey])

  return {
    data,
    loading,
    error,
    reload: () => setReloadKey((key) => key + 1),
  }
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
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-navy-100 bg-white px-3 py-2 text-sm font-semibold text-navy-800 outline-none focus:border-navy-400"
      >
        {terms.map((term) => (
          <option key={term.id} value={term.id}>{term.label || term.name}</option>
        ))}
      </select>
    </label>
  )
}
