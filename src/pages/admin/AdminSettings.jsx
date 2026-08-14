import { Save, School, Palette, Bell } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { school } from '../../data/mock'

const inputCls = 'w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none transition focus:border-navy-400 focus:ring-2 focus:ring-navy-100'
const Field = ({ label, children, hint }) => (
  <label className="block">
    <span className="mb-1.5 block text-sm font-semibold text-navy-800">{label}</span>
    {children}
    {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
  </label>
)

export default function AdminSettings() {
  return (
    <div>
      <PageHeader title="School Settings" subtitle="Manage institution profile and preferences" actions={<Button tone="primary"><Save size={15} /> Save Changes</Button>} />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center gap-2">
            <School size={18} className="text-gold-500" />
            <h3 className="font-bold text-navy-900">School Profile</h3>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="School Name"><input className={inputCls} defaultValue={school.name} /></Field>
            <Field label="Short Name"><input className={inputCls} defaultValue={school.shortName} /></Field>
            <Field label="Address" hint="As printed on letters and report cards"><input className={inputCls} defaultValue={school.location} /></Field>
            <Field label="Email Address"><input className={inputCls} defaultValue={school.email} /></Field>
            <Field label="Phone 1"><input className={inputCls} defaultValue={school.phones[0]} /></Field>
            <Field label="Phone 2"><input className={inputCls} defaultValue={school.phones[1]} /></Field>
            <Field label="Motto"><input className={inputCls} defaultValue={school.motto} /></Field>
            <Field label="Motto (Arabic)"><input className={inputCls} defaultValue={school.mottoArabic} /></Field>
            <Field label="Mission"><textarea rows={3} className={inputCls} defaultValue={school.mission} /></Field>
            <Field label="Vision"><textarea rows={3} className={inputCls} defaultValue={school.vision} /></Field>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2">
              <Palette size={18} className="text-gold-500" />
              <h3 className="font-bold text-navy-900">Brand & Uniform</h3>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <p className="mb-1.5 text-sm font-semibold text-navy-800">Primary Colour</p>
                <div className="flex items-center gap-3">
                  <span className="h-9 w-9 rounded-xl bg-navy-700" />
                  <span className="text-sm font-semibold text-slate-600">Navy Blue — #1a2c55</span>
                </div>
              </div>
              <div>
                <p className="mb-1.5 text-sm font-semibold text-navy-800">Accent Colour</p>
                <div className="flex items-center gap-3">
                  <span className="h-9 w-9 rounded-xl bg-gold-500" />
                  <span className="text-sm font-semibold text-slate-600">Cream Gold — #d9a62e</span>
                </div>
              </div>
              <Field label="Uniform — Shirt"><input className={inputCls} defaultValue={school.uniform.shirt} /></Field>
              <Field label="Uniform — Trouser"><input className={inputCls} defaultValue={school.uniform.trouser} /></Field>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-gold-500" />
              <h3 className="font-bold text-navy-900">Notifications</h3>
            </div>
            <div className="mt-4 space-y-3">
              {['Attendance alerts to parents', 'Fee payment reminders', 'Result published notifications', 'Assignment deadlines'].map((t) => (
                <label key={t} className="flex items-center justify-between rounded-xl border border-navy-100 p-3 text-sm font-medium text-navy-800">
                  {t}
                  <span className="relative inline-flex h-6 w-11 items-center rounded-full bg-emerald-500 transition"><span className="ml-0.5 h-5 w-5 rounded-full bg-white shadow" /></span>
                </label>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}