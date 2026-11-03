import { useEffect, useMemo, useState } from 'react'
import { Wallet, Plus, CreditCard, TrendingUp, Trash2, Pencil, Save } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import ProgressBar from '../../components/ui/ProgressBar'
import Modal from '../../components/ui/Modal'
import StatCard from '../../components/ui/StatCard'
import { admin } from '../../services/api'

const inputCls = 'w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none transition focus:border-navy-400 focus:ring-2 focus:ring-navy-100'
const money = (value) => `\u20A6${Number(value || 0).toLocaleString()}`
const emptyItem = () => ({ label: '', amount: '' })
const blankForm = () => ({ title: '', items: [{ label: 'Tuition', amount: '' }], publish: true })

export default function AdminFees() {
  const [summary, setSummary] = useState(null)
  const [structure, setStructure] = useState(null)
  const [classes, setClasses] = useState([])
  const [terms, setTerms] = useState([])
  const [byClass, setByClass] = useState([])
  const [trend, setTrend] = useState([])
  const [classId, setClassId] = useState('')
  const [termId, setTermId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [edit, setEdit] = useState(false)
  const [form, setForm] = useState(blankForm)
  const [formError, setFormError] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [summaryRes, structureRes, byClassRes, trendRes] = await Promise.all([
        admin.feeSummary(),
        admin.feeStructure({
          classId: classId || undefined,
          termId: termId || undefined,
        }),
        admin.feesByClass(),
        admin.feeTrend(),
      ])
      setSummary(summaryRes.stats || null)
      setStructure(structureRes.structure || null)
      setClasses(structureRes.classes || [])
      setTerms(structureRes.terms || [])
      if (!classId && structureRes.classId) setClassId(String(structureRes.classId))
      if (!termId && structureRes.termId) setTermId(String(structureRes.termId))
      setByClass(byClassRes.data || [])
      setTrend(trendRes.data || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [classId, termId])

  const formTotal = useMemo(
    () => form.items.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [form.items],
  )

  const maxTrend = Math.max(1, ...trend.map((item) => Number(item.amount || 0)))

  const openEditor = () => {
    setForm({
      title: structure?.title || '',
      items: structure?.items?.length
        ? structure.items.map((item) => ({ label: item.label, amount: String(item.amount) }))
        : [{ label: 'Tuition', amount: '' }],
      publish: structure?.published ?? true,
    })
    setFormError(null)
    setEdit(true)
  }

  const setItem = (index, key, value) => {
    setForm((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)),
    }))
  }

  const addItem = () => setForm((current) => ({ ...current, items: [...current.items, emptyItem()] }))

  const removeItem = (index) => {
    setForm((current) => ({
      ...current,
      items: current.items.length > 1 ? current.items.filter((_, itemIndex) => itemIndex !== index) : current.items,
    }))
  }

  const handleSave = async () => {
    if (!classId || !termId) {
      setFormError('Select a class and term first.')
      return
    }

    const items = form.items
      .map((item) => ({ label: item.label.trim(), amount: Number(item.amount || 0) }))
      .filter((item) => item.label)

    if (!items.length) {
      setFormError('Add at least one fee item.')
      return
    }

    if (items.some((item) => item.amount < 0)) {
      setFormError('Fee amounts cannot be negative.')
      return
    }

    setSaving(true)
    setFormError(null)
    try {
      await admin.createFee({
        title: form.title.trim() || null,
        classId: Number(classId),
        termId: Number(termId),
        items,
        publish: form.publish,
      })
      setEdit(false)
      await load()
    } catch (e) {
      setFormError(e.errors ? Object.values(e.errors).flat().join(' ') : e.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading && !structure && !classes.length) {
    return <div className="flex min-h-[60vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-navy-100 border-t-navy-700" /></div>
  }

  return (
    <div>
      <PageHeader
        title="Fee Management"
        subtitle="Set fee items per class and term, then publish them to parents and students"
        actions={(
          <Button tone="primary" onClick={openEditor}>
            {structure ? <Pencil size={16} /> : <Plus size={16} />}
            {structure ? 'Edit Structure' : 'Create Structure'}
          </Button>
        )}
      />

      {error && (
        <div className="mb-6 flex items-center justify-between rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
          <span>{error}</span>
          <Button tone="ghost" size="sm" onClick={load}>Retry</Button>
        </div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={Wallet} label="Total Outstanding" value={summary ? money(summary.outstanding) : '—'} sub="all students" tone="rose" index={0} />
        <StatCard icon={CreditCard} label="Collected This Month" value={summary ? money(summary.collectedThisMonth) : '—'} sub="verified payments" tone="emerald" index={1} />
        <StatCard icon={TrendingUp} label="Collection Rate" value={`${summary?.collectionRate ?? 0}%`} sub={summary ? `${money(summary.totalPaid)} of ${money(summary.totalOwed)}` : '—'} tone="gold" index={2} />
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-navy-800">Class</span>
          <select value={classId} onChange={(event) => setClassId(event.target.value)} className="rounded-xl border border-navy-100 bg-white px-3.5 py-2 text-sm font-medium text-navy-800 outline-none">
            {classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-navy-800">Term</span>
          <select value={termId} onChange={(event) => setTermId(event.target.value)} className="rounded-xl border border-navy-100 bg-white px-3.5 py-2 text-sm font-medium text-navy-800 outline-none">
            {terms.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        </label>
        <Button tone="outline" size="sm" onClick={load}>Refresh</Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-navy-100 px-6 py-4">
              <div>
                <h3 className="font-bold text-navy-900">{structure?.title || 'Fee Structure'}</h3>
                <p className="text-xs text-slate-400">
                  {structure ? `${structure.className} • ${structure.session || ''} ${structure.term || ''}` : 'No structure for this class and term'}
                </p>
              </div>
              {structure && <Badge color={structure.published ? 'emerald' : 'amber'} dot>{structure.published ? 'Published' : 'Draft'}</Badge>}
            </div>

            {structure ? (
              <>
                <div className="divide-y divide-navy-50">
                  {(structure.items || []).map((item) => (
                    <div key={item.id || item.label} className="flex items-center justify-between px-6 py-3.5 text-sm">
                      <span className="text-slate-600">{item.label}</span>
                      <span className="font-semibold text-navy-900">{money(item.amount)}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between bg-navy-900 px-6 py-4 text-white">
                    <span className="font-bold">Total</span>
                    <span className="text-lg font-extrabold text-gold-400">{money(structure.total)}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between text-sm"><span className="font-semibold text-navy-800">Collection Progress</span><span className="font-bold text-emerald-600">{structure.rate}%</span></div>
                  <ProgressBar value={structure.rate} color="bg-emerald-500" className="mt-2" />
                  <p className="mt-2 text-xs text-slate-400">{money(structure.collected)} collected of {money(structure.total)} • {structure.completedStudents} of {structure.students} students completed</p>
                </div>
              </>
            ) : (
              <div className="p-8 text-center">
                <p className="text-sm text-slate-400">No fee structure has been created for this class and term.</p>
                <Button tone="primary" size="sm" className="mt-4" onClick={openEditor}><Plus size={15} /> Create Structure</Button>
              </div>
            )}
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <div className="border-b border-navy-100 px-6 py-4"><h3 className="font-bold text-navy-900">Fee Records by Class</h3></div>
            <div className="max-h-[420px] divide-y divide-navy-50 overflow-y-auto">
              {byClass.map((row) => (
                <div key={row.className} className="px-6 py-3.5">
                  <div className="flex items-center justify-between">
                    <Badge color="navy">{row.className}</Badge>
                    <span className="text-xs text-slate-400">{row.debtors} debtors</span>
                  </div>
                  <p className="mt-1 text-sm font-extrabold text-rose-600">{money(row.balance)} <span className="text-xs font-medium text-slate-400">balance</span></p>
                  <ProgressBar value={row.rate} color="bg-emerald-500" className="mt-1.5" height="h-1.5" />
                </div>
              ))}
              {!byClass.length && <p className="p-6 text-sm text-slate-400">No class fee records yet.</p>}
            </div>
          </Card>
        </div>
      </div>

      <Card className="mt-6">
        <div className="border-b border-navy-100 px-6 py-4">
          <h3 className="font-bold text-navy-900">Collections Trend</h3>
          <p className="text-xs text-slate-400">Verified payments over the last 12 months</p>
        </div>
        <div className="flex h-48 items-end gap-2 px-6 pb-6 pt-4">
          {trend.map((month) => (
            <div key={month.month} className="flex flex-1 flex-col items-center gap-1.5">
              <span className="text-[10px] font-bold text-navy-800">{`\u20A6${Math.round(Number(month.amount || 0) / 1000)}k`}</span>
              <div className="w-full rounded-t-xl bg-gradient-to-t from-gold-600 to-gold-400" style={{ height: `${Math.max(4, (Number(month.amount || 0) / maxTrend) * 100)}%` }} />
              <span className="text-[11px] text-slate-400">{month.month}</span>
            </div>
          ))}
        </div>
      </Card>

      <Modal open={edit} onClose={() => setEdit(false)} title={structure ? 'Edit Fee Structure' : 'Create Fee Structure'} wide>
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-navy-800">Class</span>
              <select className={inputCls} value={classId} onChange={(event) => setClassId(event.target.value)}>
                {classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-navy-800">Term</span>
              <select className={inputCls} value={termId} onChange={(event) => setTermId(event.target.value)}>
                {terms.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
              </select>
            </label>
          </div>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy-800">Title</span>
            <input className={inputCls} value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} placeholder="e.g. First Term School Fees" />
          </label>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-navy-800">Fee Items</span>
              <Button tone="outline" size="sm" onClick={addItem}><Plus size={14} /> Add Item</Button>
            </div>
            <div className="space-y-2">
              {form.items.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input className={inputCls} value={item.label} onChange={(event) => setItem(index, 'label', event.target.value)} placeholder="Item name e.g. Textbook" />
                  <input type="number" min="0" className={`${inputCls} w-36`} value={item.amount} onChange={(event) => setItem(index, 'amount', event.target.value)} placeholder="Amount" />
                  <button type="button" onClick={() => removeItem(index)} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-slate-400 transition hover:bg-rose-50 hover:text-rose-600" title="Remove item">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-navy-50 px-4 py-3 text-sm">
            <span className="font-semibold text-navy-800">Total</span>
            <span className="text-lg font-extrabold text-navy-900">{money(formTotal)}</span>
          </div>

          <label className="flex items-center gap-2 text-sm font-medium text-navy-800">
            <input type="checkbox" checked={form.publish} onChange={(event) => setForm((current) => ({ ...current, publish: event.target.checked }))} />
            Publish immediately to parents and students
          </label>
        </div>
        {formError && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600">{formError}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <Button tone="ghost" onClick={() => setEdit(false)}>Cancel</Button>
          <Button tone="primary" disabled={saving} onClick={handleSave}><Save size={15} /> {saving ? 'Saving...' : form.publish ? 'Save & Publish' : 'Save Draft'}</Button>
        </div>
      </Modal>
    </div>
  )
}
