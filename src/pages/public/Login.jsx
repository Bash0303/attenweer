import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GraduationCap, ShieldCheck, Users, BookOpen, HeartHandshake, Mail, Lock, Eye, EyeOff, KeyRound } from 'lucide-react'
import SiteNav from '../../components/layout/SiteNav'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import { school, demoUsers } from '../../data/mock'

const roles = [
  { key: 'admin', label: 'Admin', icon: ShieldCheck, color: 'bg-navy-700', dot: 'bg-navy-600' },
  { key: 'teacher', label: 'Teacher', icon: BookOpen, color: 'bg-emerald-600', dot: 'bg-emerald-600' },
  { key: 'student', label: 'Student', icon: Users, color: 'bg-navy-600', dot: 'bg-navy-600' },
  { key: 'parent', label: 'Parent', icon: HeartHandshake, color: 'bg-gold-500', dot: 'bg-gold-500' },
]

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [demoType, setDemoType] = useState('student')

  const doLogin = (e) => {
    e.preventDefault()
    const res = login(email, password)
    if (!res.ok) {
      setError(res.error)
      return
    }
    const dest = {
      Admin: '/admin/dashboard',
      Teacher: '/teacher/dashboard',
      Student: '/student/dashboard',
      Parent: '/parent/dashboard',
    }[res.user.role]
    navigate(dest)
  }

  const quickLogin = (key) => {
    const u = demoUsers[key]
    login(u.email, u.password)
    const dest = { Admin: '/admin/dashboard', Teacher: '/teacher/dashboard', Student: '/student/dashboard', Parent: '/parent/dashboard' }[u.role]
    navigate(dest)
  }

  const inputCls =
    'w-full rounded-xl border border-navy-100 bg-white py-3 pl-10 pr-10 text-sm text-navy-900 placeholder:text-slate-400 outline-none transition focus:border-navy-400 focus:ring-2 focus:ring-navy-100'

  const active = roles.find((r) => r.key === demoType)

  return (
    <div className="min-h-screen bg-cream-50">
      <SiteNav />
      <div className="mx-auto grid min-h-[80vh] max-w-6xl gap-0 overflow-hidden px-4 py-10 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-lift lg:grid lg:grid-cols-2"
        >
          <div className="relative hidden bg-navy-950 text-white lg:flex lg:flex-col lg:justify-center lg:p-12">
            <div className="absolute inset-0 opacity-15"
              style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, #d9a62e 0%, transparent 45%), radial-gradient(circle at 80% 70%, #2a478e 0%, transparent 50%)' }}
            />
            <div className="relative">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-gold-400">
                <GraduationCap size={18} /> {school.shortName} Portal
              </span>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight">
                One Account.<br />One Student.<br /><span className="text-gold-400">Connected.</span>
              </h2>
              <p className="mt-4 max-w-sm text-cream-100/70">
                Admins, teachers, students and parents stay in sync around the same records — results, attendance, fees and reports.
              </p>
              <div className="mt-10 space-y-3 text-sm">
                {[
                  ['Results & report cards', 'View and download results instantly'],
                  ['Attendance in real time', 'Parents see daily attendance'],
                  ['Fees & payments', 'Track bills and balances clearly'],
                  ['Reports & analytics', 'Powerful insights for administrators'],
                ].map(([t, d]) => (
                  <div key={t} className="flex items-start gap-3 rounded-xl bg-white/5 p-3">
                    <span className={`mt-1 h-2.5 w-2.5 rounded-full ${active.dot}`} />
                    <div><p className="font-semibold">{t}</p><p className="text-cream-100/60">{d}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-8 sm:p-10">
            <h1 className="text-2xl font-extrabold tracking-tight text-navy-900">Welcome back 👋</h1>
            <p className="mt-1 text-sm text-slate-500">Sign in to access your {school.shortName} portal dashboard.</p>

            <div className="mt-6 grid grid-cols-4 gap-2">
              {roles.map((r) => (
                <button
                  key={r.key}
                  onClick={() => { setDemoType(r.key); setError(''); setEmail(''); setPassword('') }}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-semibold transition ${demoType === r.key ? `border-transparent ${r.color} text-white shadow-lg` : 'border-navy-100 bg-white text-slate-500 hover:border-navy-300'}`}
                >
                  <r.icon size={18} />
                  {r.label}
                </button>
              ))}
            </div>

            <form onSubmit={doLogin} className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-navy-800">Email / Username</label>
                <div className="relative">
                  <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input className={inputCls} placeholder={demoUsers[demoType].email} value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-navy-800">Password</label>
                <div className="relative">
                  <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type={show ? 'text' : 'password'} className={inputCls} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                  <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy-700">
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && <p className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600">{error}</p>}

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-500">
                  <input type="checkbox" className="h-4 w-4 rounded border-navy-200" /> Remember me
                </label>
                <button type="button" className="font-semibold text-navy-700 hover:text-navy-900">Forgot password?</button>
              </div>

              <Button type="submit" className="w-full" size="lg">Sign In</Button>
            </form>

            <div className="mt-6 rounded-2xl border border-dashed border-gold-400/50 bg-cream-100/60 p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-navy-800">
                <KeyRound size={16} className="text-gold-600" /> Demo Login
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Currently selected: <strong className="text-navy-800">{active.label}</strong> — tap the button below to preview this dashboard.
              </p>
              <button
                onClick={() => quickLogin(demoType)}
                className={`mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl ${active.color} px-4 py-2.5 text-sm font-bold text-white shadow-lg transition active:scale-95`}
              >
                Enter {active.label} Dashboard →
              </button>
            </div>

            <p className="mt-6 text-center text-xs text-slate-400">
              New student? <Link to="/register" className="font-semibold text-navy-700">Register for admission</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}