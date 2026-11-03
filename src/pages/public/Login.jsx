import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import SiteNav from '../../components/layout/SiteNav'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import { school } from '../../data/mock'
import logo from '../../assets/witty logo.jpeg'

const features = [
  ['Results & report cards', 'View and download results instantly'],
  ['Attendance in real time', 'Parents see daily attendance'],
  ['Fees & payments', 'Track bills and balances clearly'],
  ['Reports & analytics', 'Powerful insights for administrators'],
]

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const doLogin = async (e) => {
    e.preventDefault()
    if (loading) return
    setError('')
    setLoading(true)
    const res = await login(identifier.trim(), password)
    setLoading(false)
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

  const inputCls =
    'w-full rounded-xl border border-navy-100 bg-white py-3 pl-10 pr-10 text-sm text-navy-900 placeholder:text-slate-400 outline-none transition focus:border-navy-400 focus:ring-2 focus:ring-navy-100'

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
                <img src={logo} alt={`${school.name} logo`} className="h-7 w-7 rounded-lg object-contain" /> {school.shortName} Portal
              </span>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight">
                One Account.<br />One Student.<br /><span className="text-gold-400">Connected.</span>
              </h2>
              <p className="mt-4 max-w-sm text-cream-100/70">
                Admins, teachers, students and parents stay in sync around the same records — results, attendance, fees and reports.
              </p>
              <div className="mt-10 space-y-3 text-sm">
                {features.map(([t, d]) => (
                  <div key={t} className="flex items-start gap-3 rounded-xl bg-white/5 p-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-gold-400" />
                    <div><p className="font-semibold">{t}</p><p className="text-cream-100/60">{d}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-8 sm:p-10">
            <h1 className="text-2xl font-extrabold tracking-tight text-navy-900">Welcome back 👋</h1>
            <p className="mt-1 text-sm text-slate-500">Sign in to access your {school.shortName} portal dashboard.</p>

            <form onSubmit={doLogin} className="mt-8 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-navy-800">Email or ID Number</label>
                <div className="relative">
                  <User size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    autoComplete="username"
                    className={inputCls}
                    placeholder="Email, admission or staff number"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                  />
                </div>
                <p className="mt-1.5 text-xs text-slate-400">Students use their admission number, staff use their staff number, or sign in with email.</p>
              </div>
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="block text-sm font-semibold text-navy-800">Password</label>
                  <Link to="/forgot-password" className="text-xs font-semibold text-navy-700 hover:underline">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={show ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    className={inputCls}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy-700">
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && <p className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600">{error}</p>}

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <span className="inline-flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> Signing in…</span>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-400">
              New student? <Link to="/register" className="font-semibold text-navy-700">Register for admission</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
