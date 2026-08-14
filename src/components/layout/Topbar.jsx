import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Search, LogOut, User, ChevronDown, Menu, ClipboardList, Award, Wallet, Clock, Calendar } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Avatar from '../ui/Avatar'
import { notifications, school } from '../../data/mock'

const iconMap = {
  clipboard: ClipboardList,
  award: Award,
  wallet: Wallet,
  clock: Clock,
  calendar: Calendar,
}

export default function Topbar({ role, onMenuClick }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showProfile, setShowProfile] = useState(false)
  const [showNotifs, setShowNotifs] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const notifRef = useRef(null)
  const profileRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false)
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const unread = notifications.filter((n) => !n.read).length

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-navy-100 bg-white/80 px-4 backdrop-blur-md sm:px-6">
      <button className="grid h-10 w-10 place-items-center rounded-lg text-navy-700 lg:hidden" onClick={onMenuClick}>
        <Menu size={22} />
      </button>

      <button
        onClick={() => setShowSearch(!showSearch)}
        className="hidden items-center gap-2 rounded-xl border border-navy-100 bg-navy-50/50 px-3 py-2 text-sm text-slate-400 transition hover:border-navy-200 sm:flex md:w-72"
      >
        <Search size={16} />
        <span className="truncate">Search students, classes, results…</span>
      </button>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <div className="relative hidden rounded-full border border-cream-200 bg-cream-100 px-3 py-1.5 text-xs font-semibold text-navy-800 md:block">
          {school.session} • {school.term}
        </div>

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative grid h-10 w-10 place-items-center rounded-xl text-navy-600 transition hover:bg-navy-50"
          >
            <Bell size={20} />
            {unread > 0 && (
              <span className="absolute right-1.5 top-1.5 grid h-4 w-4 place-items-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                {unread}
              </span>
            )}
          </button>
          <AnimatePresence>
            {showNotifs && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-lift"
              >
                <div className="border-b border-navy-100 px-4 py-3">
                  <p className="text-sm font-bold text-navy-900">Notifications</p>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((n) => {
                    const Icon = iconMap[n.icon] || Bell
                    return (
                      <button
                        key={n.id}
                        className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-navy-50"
                      >
                        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${n.read ? 'bg-slate-100 text-slate-400' : 'bg-navy-50 text-navy-700'}`}>
                          <Icon size={16} />
                        </span>
                        <span className="min-w-0">
                          <span className={`block truncate text-sm ${n.read ? 'font-medium text-slate-500' : 'font-semibold text-navy-900'}`}>
                            {n.title}
                          </span>
                          <span className="block text-xs text-slate-400">{n.time}</span>
                        </span>
                        {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-navy-600" />}
                      </button>
                    )
                  })}
                </div>
                <button className="w-full border-t border-navy-100 py-2.5 text-center text-xs font-semibold text-navy-700 transition hover:bg-navy-50">
                  View all notifications
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2.5 rounded-xl p-1.5 transition hover:bg-navy-50"
          >
            <Avatar initials={user?.initials || 'U'} color={user?.color} size="md" />
            <span className="hidden text-left sm:block">
              <span className="block text-sm font-bold text-navy-900">{user?.name}</span>
              <span className="block text-[11px] font-medium text-slate-400">{role}</span>
            </span>
            <ChevronDown size={15} className="hidden text-slate-400 sm:block" />
          </button>
          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-lift"
              >
                <div className="border-b border-navy-100 bg-navy-50/50 px-4 py-3">
                  <p className="text-sm font-bold text-navy-900">{user?.name}</p>
                  <p className="truncate text-xs text-slate-400">{user?.email}</p>
                </div>
                <div className="p-1.5">
                  <Link
                    to={`/${role.toLowerCase()}/profile`}
                    onClick={() => setShowProfile(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-navy-50"
                  >
                    <User size={16} /> My Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      navigate('/login')
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}