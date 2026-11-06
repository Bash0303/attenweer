import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone, Mail } from 'lucide-react'
import { school } from '../../data/mock'
import logo from '../../assets/atenweer logo .png'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/admission', label: 'Admission' },
  { to: '/login', label: 'Portal' },
  { to: '/e-exam', label: 'e-Exam' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
]

export default function SiteNav() {
  const [open, setOpen] = useState(false)

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
          <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-xl bg-white shadow-lg shadow-navy-800/20 ring-1 ring-navy-100">
            <img src={logo} alt={`${school.name} logo`} className="h-10 w-10 object-contain" />
          </span>
          <span>
            <span className="block text-lg font-extrabold leading-tight tracking-tight text-navy-900">
              Attenweer <span className="text-gold-500">Schools</span>
            </span>
            <span className="block text-[11px] font-medium text-slate-500">
              Islamic & Western Education
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-5 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              className={({ isActive }) =>
                `text-[13px] font-semibold transition-colors hover:text-navy-800 ${isActive ? 'text-navy-800' : 'text-slate-500'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-lg text-navy-700 lg:hidden"
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
            className="overflow-hidden border-t border-navy-100 bg-white lg:hidden"
          >
            <div className="flex flex-col gap-2 px-6 py-4">
              {links.map((l) => (
                <Link
                  key={l.label}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-navy-50"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}