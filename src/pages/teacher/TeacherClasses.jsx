import { useState } from 'react'
import { School, Users } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import ProgressBar from '../../components/ui/ProgressBar'
import StatCard from '../../components/ui/StatCard'
import { classes, subjects } from '../../data/mock'

export default function TeacherClasses() {
  const [active, setActive] = useState('SS 2A')
  const myClasses = classes.filter((c) => ['SS 2A', 'SS 3A'].includes(c.name))
  const students = [
    { name: 'Abdullahi Jimoh', gender: 'Male', status: 'Active' },
    { name: 'Maryam Adeleke', gender: 'Female', status: 'Active' },
    { name: 'Majeed Olawale', gender: 'Male', status: 'Active' },
    { name: 'Aminah Kolawole', gender: 'Female', status: 'Active' },
    { name: 'Aisha Mohammed', gender: 'Female', status: 'Active' },
    { name: 'Ibrahim Yusuf', gender: 'Male', status: 'Active' },
    { name: 'Rukayat Okafor', gender: 'Female', status: 'Suspended' },
    { name: 'Abdulhakeem Obi', gender: 'Male', status: 'Active' },
    { name: 'Zainab Bello', gender: 'Female', status: 'Active' },
    { name: 'Uthman Adeyemi', gender: 'Male', status: 'Active' },
  ]

  return (
    <div>
      <PageHeader title="My Classes" subtitle="Classes you teach as assigned by admin" />

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <StatCard icon={School} label="Classes Taught" value="2" sub="SS 2A • SS 3A" tone="navy" index={0} />
        <StatCard icon={Users} label="Total Students" value="72" sub="combined" tone="emerald" index={1} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          {myClasses.map((c) => (
            <Card key={c.id} hover className={`p-5 cursor-pointer ${active === c.name ? 'ring-2 ring-navy-600 ring-offset-2' : ''}`} onClick={() => setActive(c.name)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy-800 text-gold-400"><School size={20} /></span>
                  <div><p className="font-extrabold text-navy-900">{c.name}</p><p className="text-xs text-slate-400">{c.studentCount} students</p></div>
                </div>
                <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-600">{Math.round(c.studentCount / c.capacity * 100)}%</span>
              </div>
              <ProgressBar value={c.studentCount / c.capacity * 100} color="bg-emerald-500" className="mt-3" height="h-1.5" />
            </Card>
          ))}
          <Card className="p-5">
            <p className="text-sm font-bold text-navy-900">Subjects I Teach</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {subjects.filter((s) => ['English Language', 'Literature in English'].includes(s.name)).map((s) => <Badge key={s.id} color="gold">{s.name}</Badge>)}
            </div>
          </Card>
        </div>

        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-navy-100 px-6 py-4">
            <div>
              <h3 className="font-bold text-navy-900">{active} Students</h3>
              <p className="text-xs text-slate-400">Click a student to view their profile</p>
            </div>
            <Badge color="emerald" dot>Class teacher assigned</Badge>
          </div>
          <div className="divide-y divide-navy-50">
            {students.filter((s) => s.status === 'Active').map((s, i) => (
              <div key={s.name} className="flex items-center gap-3 px-6 py-3">
                <Avatar initials={s.name.split(' ').map(x => x[0]).join('')} size="sm" color={['bg-navy-600', 'bg-emerald-600', 'bg-gold-500', 'bg-sky-600', 'bg-violet-600', 'bg-teal-700', 'bg-rose-600', 'bg-indigo-600'][i % 8]} />
                <p className="flex-1 text-sm font-semibold text-navy-900">{s.name}</p>
                <Badge color="slate">{s.gender}</Badge>
                <span className="text-xs font-semibold text-navy-700">View →</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}