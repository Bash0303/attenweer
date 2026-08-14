import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { useAuth } from '../../context/AuthContext'

export default function DashboardLayout({ role, children }) {
  const { user } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return (
    <div className="min-h-screen bg-[#f4f6fb]">
      <Sidebar
        role={role}
        onClose={() => setMobileOpen(false)}
        collapsed={false}
        open={mobileOpen}
      />
      <div className="lg:pl-64">
        <Topbar role={role} onMenuClick={() => setMobileOpen(true)} />
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mx-auto max-w-[1400px] p-4 sm:p-6 lg:p-8"
        >
          {children}
        </motion.main>
      </div>
    </div>
  )
}
