import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Seo from './components/Seo'

const Home = lazy(() => import('./pages/public/Home'))
const About = lazy(() => import('./pages/public/About'))
const Register = lazy(() => import('./pages/public/Register'))
const Login = lazy(() => import('./pages/public/Login'))

const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminStudents = lazy(() => import('./pages/admin/AdminStudents'))
const AdminTeachers = lazy(() => import('./pages/admin/AdminTeachers'))
const AdminParents = lazy(() => import('./pages/admin/AdminParents'))
const AdminClasses = lazy(() => import('./pages/admin/AdminClasses'))
const AdminSubjects = lazy(() => import('./pages/admin/AdminSubjects'))
const AdminSessions = lazy(() => import('./pages/admin/AdminSessions'))
const AdminAttendance = lazy(() => import('./pages/admin/AdminAttendance'))
const AdminResults = lazy(() => import('./pages/admin/AdminResults'))
const AdminTimetable = lazy(() => import('./pages/admin/AdminTimetable'))
const AdminAssignments = lazy(() => import('./pages/admin/AdminAssignments'))
const AdminExams = lazy(() => import('./pages/admin/AdminExams'))
const AdminFees = lazy(() => import('./pages/admin/AdminFees'))
const AdminPayments = lazy(() => import('./pages/admin/AdminPayments'))
const AdminAnnouncements = lazy(() => import('./pages/admin/AdminAnnouncements'))
const AdminEvents = lazy(() => import('./pages/admin/AdminEvents'))
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages'))
const AdminReports = lazy(() => import('./pages/admin/AdminReports'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'))
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'))

const TeacherDashboard = lazy(() => import('./pages/teacher/TeacherDashboard'))
const TeacherClasses = lazy(() => import('./pages/teacher/TeacherClasses'))
const TeacherStudents = lazy(() => import('./pages/teacher/TeacherStudents'))
const TeacherAttendance = lazy(() => import('./pages/teacher/TeacherAttendance'))
const TeacherAssignments = lazy(() => import('./pages/teacher/TeacherAssignments'))
const TeacherScores = lazy(() => import('./pages/teacher/TeacherScores'))
const TeacherExams = lazy(() => import('./pages/teacher/TeacherExams'))
const TeacherResults = lazy(() => import('./pages/teacher/TeacherResults'))
const TeacherTimetable = lazy(() => import('./pages/teacher/TeacherTimetable'))
const TeacherAnnouncements = lazy(() => import('./pages/teacher/TeacherAnnouncements'))
const TeacherMessages = lazy(() => import('./pages/teacher/TeacherMessages'))
const TeacherProfile = lazy(() => import('./pages/teacher/TeacherProfile'))

const StudentDashboard = lazy(() => import('./pages/student/StudentDashboard'))
const StudentProfile = lazy(() => import('./pages/student/StudentProfile'))
const StudentSubjects = lazy(() => import('./pages/student/StudentSubjects'))
const StudentTimetable = lazy(() => import('./pages/student/StudentTimetable'))
const StudentAttendance = lazy(() => import('./pages/student/StudentAttendance'))
const StudentResults = lazy(() => import('./pages/student/StudentResults'))
const StudentAssignments = lazy(() => import('./pages/student/StudentAssignments'))
const StudentExams = lazy(() => import('./pages/student/StudentExams'))
const StudentFees = lazy(() => import('./pages/student/StudentFees'))
const StudentAnnouncements = lazy(() => import('./pages/student/StudentAnnouncements'))
const StudentMessages = lazy(() => import('./pages/student/StudentMessages'))
const StudentPassword = lazy(() => import('./pages/student/StudentPassword'))

import DashboardLayout from './components/layout/DashboardLayout'
const ParentDashboard = lazy(() => import('./pages/parent/ParentDashboard'))
const ParentChildren = lazy(() => import('./pages/parent/ParentChildren'))
const ParentResults = lazy(() => import('./pages/parent/ParentResults'))
const ParentAttendance = lazy(() => import('./pages/parent/ParentAttendance'))
const ParentAssignments = lazy(() => import('./pages/parent/ParentAssignments'))
const ParentTimetable = lazy(() => import('./pages/parent/ParentTimetable'))
const ParentExams = lazy(() => import('./pages/parent/ParentExams'))
const ParentFees = lazy(() => import('./pages/parent/ParentFees'))
const ParentAnnouncements = lazy(() => import('./pages/parent/ParentAnnouncements'))
const ParentMessages = lazy(() => import('./pages/parent/ParentMessages'))
const ParentReports = lazy(() => import('./pages/parent/ParentReports'))
const ParentPassword = lazy(() => import('./pages/parent/ParentPassword'))

function RoleRoute({ role, children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== role) {
    const home = { Admin: '/admin/dashboard', Teacher: '/teacher/dashboard', Student: '/student/dashboard', Parent: '/parent/dashboard' }[user.role]
    return <Navigate to={home} replace />
  }
  return <DashboardLayout role={role}>{children}</DashboardLayout>
}

function Loader() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#f4f6fb]">
      <div className="flex flex-col items-center gap-3">
        <span className="h-10 w-10 animate-spin rounded-full border-4 border-navy-100 border-t-navy-700" />
        <p className="text-sm font-semibold text-navy-700">Loading…</p>
      </div>
    </div>
  )
}

const adminRoutes = [
  ['dashboard', AdminDashboard],
  ['students', AdminStudents],
  ['teachers', AdminTeachers],
  ['parents', AdminParents],
  ['classes', AdminClasses],
  ['subjects', AdminSubjects],
  ['sessions', AdminSessions],
  ['attendance', AdminAttendance],
  ['results', AdminResults],
  ['timetable', AdminTimetable],
  ['assignments', AdminAssignments],
  ['exams', AdminExams],
  ['fees', AdminFees],
  ['payments', AdminPayments],
  ['announcements', AdminAnnouncements],
  ['events', AdminEvents],
  ['messages', AdminMessages],
  ['reports', AdminReports],
  ['settings', AdminSettings],
  ['users', AdminUsers],
]

const teacherRoutes = [
  ['dashboard', TeacherDashboard],
  ['classes', TeacherClasses],
  ['students', TeacherStudents],
  ['attendance', TeacherAttendance],
  ['assignments', TeacherAssignments],
  ['scores', TeacherScores],
  ['exams', TeacherExams],
  ['results', TeacherResults],
  ['timetable', TeacherTimetable],
  ['announcements', TeacherAnnouncements],
  ['messages', TeacherMessages],
  ['profile', TeacherProfile],
]

const studentRoutes = [
  ['dashboard', StudentDashboard],
  ['profile', StudentProfile],
  ['subjects', StudentSubjects],
  ['timetable', StudentTimetable],
  ['attendance', StudentAttendance],
  ['results', StudentResults],
  ['assignments', StudentAssignments],
  ['exams', StudentExams],
  ['fees', StudentFees],
  ['announcements', StudentAnnouncements],
  ['messages', StudentMessages],
  ['password', StudentPassword],
]

const parentRoutes = [
  ['dashboard', ParentDashboard],
  ['children', ParentChildren],
  ['results', ParentResults],
  ['attendance', ParentAttendance],
  ['assignments', ParentAssignments],
  ['timetable', ParentTimetable],
  ['exams', ParentExams],
  ['fees', ParentFees],
  ['announcements', ParentAnnouncements],
  ['messages', ParentMessages],
  ['reports', ParentReports],
  ['password', ParentPassword],
]

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Seo />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        {adminRoutes.map(([path, C]) => (
          <Route key={path} path={`/admin/${path}`} element={<RoleRoute role="Admin"><C /></RoleRoute>} />
        ))}

        <Route path="/teacher" element={<Navigate to="/teacher/dashboard" replace />} />
        {teacherRoutes.map(([path, C]) => (
          <Route key={path} path={`/teacher/${path}`} element={<RoleRoute role="Teacher"><C /></RoleRoute>} />
        ))}

        <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />
        {studentRoutes.map(([path, C]) => (
          <Route key={path} path={`/student/${path}`} element={<RoleRoute role="Student"><C /></RoleRoute>} />
        ))}

        <Route path="/parent" element={<Navigate to="/parent/dashboard" replace />} />
        {parentRoutes.map(([path, C]) => (
          <Route key={path} path={`/parent/${path}`} element={<RoleRoute role="Parent"><C /></RoleRoute>} />
        ))}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App