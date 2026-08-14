import { Save, KeyRound } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Avatar from '../../components/ui/Avatar'
import { useAuth } from '../../context/AuthContext'

const inputCls = 'w-full rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-100'
const Field = ({ label, children }) => (
  <label className="block">
    <span className="mb-1.5 block text-sm font-semibold text-navy-800">{label}</span>{children}
  </label>
)

export function ChangePassword() {
  return (
    <Card className="max-w-xl p-6">
      <div className="flex items-center gap-2"><KeyRound size={18} className="text-gold-500" /><h3 className="font-bold text-navy-900">Change Password</h3></div>
      <div className="mt-5 space-y-4">
        <Field label="Current Password"><input type="password" className={inputCls} placeholder="••••••••" /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="New Password"><input type="password" className={inputCls} placeholder="••••••••" /></Field>
          <Field label="Confirm New Password"><input type="password" className={inputCls} placeholder="••••••••" /></Field>
        </div>
        <div className="flex justify-end"><Button tone="primary"><Save size={15} /> Update Password</Button></div>
      </div>
    </Card>
  )
}

export default function TeacherProfile() {
  const { user } = useAuth()
  return (
    <div>
      <PageHeader title="My Profile" subtitle="Personal and professional details" />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 text-center">
          <div className="mx-auto w-fit"><Avatar initials={user?.initials} color={user?.color} size="xl" /></div>
          <h3 className="mt-4 text-lg font-extrabold text-navy-900">{user?.name}</h3>
          <p className="text-sm text-slate-400">{user?.email}</p>
          <p className="mt-1 text-xs font-semibold text-gold-600">Teacher • English Dept.</p>
          <div className="mt-4 rounded-xl bg-cream-100/70 p-3 text-sm">
            <p className="font-semibold text-navy-800">Staff ID</p>
            <p className="font-mono text-xs text-slate-500">WGS/T/002</p>
          </div>
        </Card>
        <Card className="p-6 lg:col-span-2">
          <h3 className="font-bold text-navy-900">Professional Information</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[['Full Name', user?.name], ['Email Address', user?.email], ['Phone', '08045566778'], ['Qualification', 'B.A. English'], ['Department', 'Arts / English'], ['Employment', 'Full Time'], ['Class Teacher', 'SS 2A'], ['Assigned Classes', 'SS 2A, SS 3A']].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-navy-100 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{k}</p>
                <p className="mt-0.5 text-sm font-semibold text-navy-900">{v}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end"><Button tone="primary"><Save size={15} /> Save Changes</Button></div>
        </Card>
      </div>
    </div>
  )
}