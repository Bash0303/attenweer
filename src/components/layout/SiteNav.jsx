import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, GraduationCap, Phone, Mail, LogIn } from 'lucide-react'
import { school } from '../../data/mock'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/register', label: 'Register' },
]

export default function SiteNav() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-navy-100">
      <div className="hidden bg-navy-950 text-cream-100 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1.5 text-xs">
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-1.5">
              <Phone size={12} /> {school.phones.join(' • ')}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Mail size={12} /> {school.email}
            </span>
          </div>
          <span className="font-arabic text-sm">{school.mottoArabic}</span>
        </div>
      </div>

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy-800 text-white shadow-lg shadow-navy-800/30">
            <GraduationCap size={24} />
          </span>
          <span>
            <span className="block text-lg font-extrabold leading-tight tracking-tight text-navy-900">
              Witty Group <span className="text-gold-500">of Schools</span>
            </span>
            <span className="block text-[11px] font-medium text-slate-500">
              Secondary School Portal
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm font-semibold transition-colors hover:text-navy-800 ${isActive ? 'text-navy-800' : 'text-slate-500'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 rounded-xl bg-navy-700 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-navy-700/25 transition hover:bg-navy-800 active:scale-95"
          >
            <LogIn size={16} /> Login
          </button>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-lg text-navy-700 md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-navy-100 bg-white md:hidden"
          >
            <div className="flex flex-col gap-2 px-6 py-4">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-navy-50"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="rounded-lg bg-navy-700 px-3 py-2 text-center text-sm font-semibold text-white"
              >
                Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}