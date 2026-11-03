import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  HeartHandshake,
  School,
  BookOpen,
  CalendarRange,
  ClipboardCheck,
  ClipboardList,
  FileText,
  PenSquare,
  BookMarked,
  Wallet,
  CreditCard,
  Megaphone,
  CalendarDays,
  MessageSquare,
  BarChart3,
  Settings,
  ShieldCheck,
  Table2,
  FileSpreadsheet,
  KeyRound,
  X,
} from 'lucide-react'
import { school } from '../../data/mock'
import logo from '../../assets/witty logo.jpeg'

export const navGroups = {
  Admin: [
    {
      group: 'Main',
      items: [
        { to: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
        { to: '/admin/students', label: 'Students', icon: Users },
        { to: '/admin/admissions', label: 'Admissions', icon: ClipboardList },
        { to: '/admin/teachers', label: 'Teachers', icon: GraduationCap },
        { to: '/admin/parents', label: 'Parents', icon: HeartHandshake },
        { to: '/admin/classes', label: 'Classes', icon: School },
        { to: '/admin/subjects', label: 'Subjects', icon: BookOpen },
        { to: '/admin/sessions', label: 'Sessions & Terms', icon: CalendarRange },
      ],
    },
    {
      group: 'Academic',
      items: [
        { to: '/admin/attendance', label: 'Attendance', icon: ClipboardCheck },
        { to: '/admin/results', label: 'Results', icon: FileText },
        { to: '/admin/timetable', label: 'Timetable', icon: Table2 },
        { to: '/admin/assignments', label: 'Assignments', icon: PenSquare },
        { to: '/admin/exams', label: 'Examinations', icon: BookMarked },
      ],
    },
    {
      group: 'Finance',
      items: [
        { to: '/admin/fees', label: 'Fees', icon: Wallet },
        { to: '/admin/payments', label: 'Payments', icon: CreditCard },
      ],
    },
    {
      group: 'Communication',
      items: [
        { to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
        { to: '/admin/events', label: 'Events', icon: CalendarDays },
        { to: '/admin/messages', label: 'Messages', icon: MessageSquare },
        { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
      ],
    },
    {
      group: 'System',
      items: [
        { to: '/admin/settings', label: 'School Settings', icon: Settings },
        { to: '/admin/users', label: 'System Users', icon: ShieldCheck },
      ],
    },
  ],
  Teacher: [
    {
      group: 'Main',
      items: [
        { to: '/teacher/dashboard', label: 'Overview', icon: LayoutDashboard },
        { to: '/teacher/classes', label: 'My Classes', icon: School },
        { to: '/teacher/students', label: 'My Students', icon: Users },
      ],
    },
    {
      group: 'Teaching',
      items: [
        { to: '/teacher/attendance', label: 'Attendance', icon: ClipboardCheck },
        { to: '/teacher/assignments', label: 'Assignments', icon: PenSquare },
        { to: '/teacher/scores', label: 'CA Scores', icon: FileSpreadsheet },
        { to: '/teacher/exams', label: 'Examinations', icon: BookMarked },
        { to: '/teacher/results', label: 'Results', icon: FileText },
        { to: '/teacher/timetable', label: 'Timetable', icon: Table2 },
      ],
    },
    {
      group: 'Communication',
      items: [
        { to: '/teacher/announcements', label: 'Announcements', icon: Megaphone },
        { to: '/teacher/messages', label: 'Messages', icon: MessageSquare },
      ],
    },
    {
      group: 'Account',
      items: [
        { to: '/teacher/profile', label: 'My Profile', icon: Settings },
        { to: '/teacher/password', label: 'Change Password', icon: KeyRound },
      ],
    },
  ],
  Student: [
    {
      group: 'Main',
      items: [
        { to: '/student/dashboard', label: 'Overview', icon: LayoutDashboard },
        { to: '/student/profile', label: 'My Profile', icon: Users },
        { to: '/student/subjects', label: 'My Subjects', icon: BookOpen },
        { to: '/student/timetable', label: 'Timetable', icon: Table2 },
      ],
    },
    {
      group: 'Academic',
      items: [
        { to: '/student/attendance', label: 'Attendance', icon: ClipboardCheck },
        { to: '/student/results', label: 'Results', icon: FileText },
        { to: '/student/assignments', label: 'Assignments', icon: PenSquare },
        { to: '/student/exams', label: 'Examinations', icon: BookMarked },
      ],
    },
    {
      group: 'Finance & More',
      items: [
        { to: '/student/fees', label: 'Fees', icon: Wallet },
        { to: '/student/scratch-card', label: 'Scratch Card', icon: KeyRound },
        { to: '/student/announcements', label: 'Announcements', icon: Megaphone },
        { to: '/student/messages', label: 'Messages', icon: MessageSquare },
        { to: '/student/password', label: 'Change Password', icon: KeyRound },
      ],
    },
  ],
  Parent: [
    {
      group: 'Main',
      items: [
        { to: '/parent/dashboard', label: 'Overview', icon: LayoutDashboard },
        { to: '/parent/children', label: 'My Children', icon: Users },
        { to: '/parent/timetable', label: 'Timetable', icon: Table2 },
      ],
    },
    {
      group: 'Monitoring',
      items: [
        { to: '/parent/attendance', label: 'Attendance', icon: ClipboardCheck },
        { to: '/parent/results', label: 'Results', icon: FileText },
        { to: '/parent/assignments', label: 'Assignments', icon: PenSquare },
        { to: '/parent/exams', label: 'Examinations', icon: BookMarked },
      ],
    },
    {
      group: 'Finance & More',
      items: [
        { to: '/parent/fees', label: 'Fees & Payments', icon: Wallet },
        { to: '/parent/announcements', label: 'Announcements', icon: Megaphone },
        { to: '/parent/messages', label: 'Messages', icon: MessageSquare },
        { to: '/parent/reports', label: 'Download Reports', icon: FileSpreadsheet },
        { to: '/parent/password', label: 'Change Password', icon: KeyRound },
      ],
    },
  ],
}

export default function Sidebar({ role, onClose, collapsed, open = false }) {
  const groups = navGroups[role] || []

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 flex flex-col bg-navy-950 text-cream-100 transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-64'} ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
    >
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-white">
          <img src={logo} alt={`${school.name} logo`} className="h-9 w-9 object-contain" />
        </span>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">Witty Group</p>
            <p className="truncate text-[11px] text-cream-100/60">{role} Portal</p>
          </div>
        )}
        <button className="ml-auto text-cream-100/60 lg:hidden" onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {groups.map((g) => (
          <div key={g.group} className="mb-4">
            {!collapsed && (
              <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-widest text-cream-100/40">
                {g.group}
              </p>
            )}
            {collapsed && <div className="mx-3 mb-2 h-px bg-white/10" />}
            <ul className="space-y-0.5">
              {g.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={onClose}
                    title={item.label}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-gold-500/20 to-transparent text-gold-400 shadow-inner'
                          : 'text-cream-100/70 hover:bg-white/5 hover:text-white'
                      } ${collapsed ? 'justify-center' : ''}`
                    }
                  >
                    <item.icon size={18} className="shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

    </aside>
  )
}