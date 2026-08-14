import { ShieldCheck, UserPlus, KeyRound } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import DataTable from '../../components/ui/DataTable'

const users = [
  { name: 'Alhaji Abdul Kareem', email: 'admin@wittyacademy.com', role: 'Admin', initials: 'AK', color: 'bg-navy-700', last: 'Today, 09:12' },
  { name: 'Mrs. Ramat Ibrahim', email: 'teacher@wittyacademy.com', role: 'Teacher', initials: 'RI', color: 'bg-emerald-600', last: 'Today, 08:45' },
  { name: 'Mr. Ismail Bello', email: 'ismail.bello@wittyacademy.com', role: 'Teacher', initials: 'IB', color: 'bg-navy-600', last: 'Yesterday' },
  { name: 'Abdullahi Jimoh', email: 'student@wittyacademy.com', role: 'Student', initials: 'AJ', color: 'bg-gold-500', last: 'Today, 07:58' },
  { name: 'Mr. Abdullahi Jimoh Snr.', email: 'parent@wittyacademy.com', role: 'Parent', initials: 'AJ', color: 'bg-sky-600', last: 'Today, 07:55' },
]

const roleColor = { Admin: 'navy', Teacher: 'emerald', Student: 'gold', Parent: 'sky' }

const columns = [
  { key: 'name', label: 'User', render: (u) => (
    <div className="flex items-center gap-3">
      <Avatar initials={u.initials} color={u.color} size="sm" />
      <div><p className="font-semibold text-navy-900">{u.name}</p><p className="text-xs text-slate-400">{u.email}</p></div>
    </div>
  ) },
  { key: 'role', label: 'Role', render: (u) => <Badge color={roleColor[u.role]}>{u.role}</Badge> },
  { key: 'last', label: 'Last Login', render: (u) => <span className="text-sm text-slate-600">{u.last}</span> },
  { key: 'actions', label: '', right: true, render: () => (
    <button className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-navy-700 transition hover:bg-navy-50"><KeyRound size={13} /> Reset</button>
  ) },
]

export default function AdminUsers() {
  return (
    <div>
      <PageHeader title="System Users" subtitle="Manage admin, teacher, student and parent accounts" actions={<Button tone="primary"><UserPlus size={16} /> Add User</Button>} />

      <Card className="mb-6 p-5">
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <ShieldCheck size={18} className="text-emerald-600" />
          <span><strong className="text-navy-800">Role-based access control</strong> is enforced — students can never access admin routes even by typing the URL manually.</span>
        </div>
      </Card>

      <Card>
        <div className="border-b border-navy-100 px-6 py-4">
          <h3 className="font-bold text-navy-900">All Portal Accounts</h3>
          <p className="text-xs text-slate-400">Passwords are hashed; sessions use secure tokens</p>
        </div>
        <DataTable columns={columns} rows={users} rowKey="email" />
      </Card>
    </div>
  )
}