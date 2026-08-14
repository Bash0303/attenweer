import { Save, BadgeCheck } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import ProgressBar from '../../components/ui/ProgressBar'
import Avatar from '../../components/ui/Avatar'
import { students, attendanceRate, school } from '../../data/mock'

const Field = ({ label, value }) => (
  <div className="rounded-xl border border-navy-100 p-3">
    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
    <p className="mt-0.5 text-sm font-semibold text-navy-900">{value}</p>
  </div>
)

export default function StudentProfile() {
  const me = students[0]

  return (
    <div>
      <PageHeader title="My Profile" subtitle="Personal, academic and contact information" />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 text-center">
          <div className="mx-auto w-fit"><Avatar initials={me.initials} color={me.color} size="xl" /></div>
          <h3 className="mt-4 text-xl font-extrabold text-navy-900">{me.name}</h3>
          <p className="font-mono text-xs font-semibold text-navy-600">{me.studentId}</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <Badge color="navy">{me.className}</Badge>
            <Badge color="gold" dot>{me.house}</Badge>
            <Badge color="emerald" dot>Active</Badge>
          </div>
          <div className="mt-5 rounded-xl bg-cream-100/70 p-4">
            <div className="flex justify-between text-sm"><span className="font-medium text-slate-600">Attendance</span><span className="font-bold text-emerald-600">{attendanceRate}%</span></div>
            <ProgressBar value={attendanceRate} color="bg-emerald-500" className="mt-2" />
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <h3 className="font-bold text-navy-900">Personal Information</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Full Name" value={me.name} />
            <Field label="Student ID" value={me.studentId} />
            <Field label="Gender" value={me.gender} />
            <Field label="Date of Birth" value={me.dob} />
            <Field label="Class" value={`${me.className} • ${school.session}`} />
            <Field label="Admission Type" value={me.admission} />
            <Field label="Phone" value={me.phone} />
            <Field label="Email" value={me.email} />
            <Field label="House" value={me.house} />
            <Field label="Sports / Club" value="Islamic Literary Club" />
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-6">
        <div className="flex items-center gap-2">
          <BadgeCheck size={18} className="text-emerald-600" />
          <h3 className="font-bold text-navy-900">Parent / Guardian</h3>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <Avatar initials={me.parent.name.split(' ').map(x => x[0]).slice(0, 2).join('')} color="bg-gold-500" size="lg" />
          <div>
            <p className="font-bold text-navy-900">{me.parent.name}</p>
            <p className="text-sm text-slate-400">{me.parent.phone} • Father</p>
          </div>
          <div className="ml-auto"><Button tone="primary" size="sm"><Save size={14} /> Edit Profile</Button></div>
        </div>
      </Card>
    </div>
  )
}