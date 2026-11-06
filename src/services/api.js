const BASE = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '')

const TOKEN_KEY = 'wgs.token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export class ApiError extends Error {
  constructor(message, status, errors) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors || null
  }
}

export async function api(path, { method = 'GET', body, params, signal } = {}) {
  const url = new URL(BASE + path)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item !== undefined && item !== null && item !== '') url.searchParams.append(`${key}[]`, item)
        })
      } else if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, value)
      }
    })
  }

  const headers = { Accept: 'application/json' }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  let res
  try {
    res = await fetch(url.toString(), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    })
  } catch {
    throw new ApiError('Could not reach the server. Is the backend running?', 0)
  }

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    if (res.status === 401) setToken(null)
    const message =
      data && data.message
        ? data.message
        : res.status === 401
          ? 'Your session has expired. Please sign in again.'
          : `Request failed (${res.status})`
    throw new ApiError(message, res.status, data ? data.errors : null)
  }

  return data
}

export async function apiUpload(path, formData, { params } = {}) {
  const url = new URL(BASE + path)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item !== undefined && item !== null && item !== '') url.searchParams.append(`${key}[]`, item)
        })
      } else if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, value)
      }
    })
  }

  const headers = { Accept: 'application/json' }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  let res
  try {
    res = await fetch(url.toString(), { method: 'POST', headers, body: formData })
  } catch {
    throw new ApiError('Could not reach the server. Is the backend running?', 0)
  }

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    if (res.status === 401) setToken(null)
    const message = data?.message || `Upload failed (${res.status})`
    throw new ApiError(message, res.status, data ? data.errors : null)
  }

  return data
}

export async function downloadFile(path, { params, filename } = {}) {
  const url = new URL(BASE + path)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item !== undefined && item !== null && item !== '') url.searchParams.append(`${key}[]`, item)
        })
      } else if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, value)
      }
    })
  }

  const headers = {}
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  let res
  try {
    res = await fetch(url.toString(), { headers })
  } catch {
    throw new ApiError('Could not reach the server. Is the backend running?', 0)
  }

  if (!res.ok) {
    if (res.status === 401) setToken(null)
    const data = await res.json().catch(() => null)
    throw new ApiError(data?.message || `Download failed (${res.status})`, res.status)
  }

  const blob = await res.blob()
  const disposition = res.headers.get('content-disposition') || ''
  const match = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(disposition)
  const name = filename || (match ? decodeURIComponent(match[1]) : 'download')

  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = name
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(link.href)
}

export const parent = {
  children: () => api('/parent/children'),
  childAttendance: (id, params) => api(`/parent/children/${id}/attendance`, { params }),
  childAssignments: (id) => api(`/parent/children/${id}/assignments`),
  childTimetable: (id) => api(`/parent/children/${id}/timetable`),
  childExams: (id) => api(`/parent/children/${id}/exams`),
  childFees: (id, params) => api(`/parent/children/${id}/fees`, { params }),
  childResults: (id, params) => api(`/parent/children/${id}/results`, { params }),
  childCbt: (id) => api(`/parent/children/${id}/cbt`),
  announcements: () => api('/parent/announcements'),
  conversations: () => api('/parent/messages/conversations'),
  thread: (partnerId) => api(`/parent/messages/conversations/${partnerId}`),
  sendMessage: (body) => api('/parent/messages', { method: 'POST', body }),
  unreadCount: () => api('/parent/messages/unread'),
}

export const auth = {
  forgotPassword: (email) => api('/auth/forgot-password', { method: 'POST', body: { email } }),
  verifyResetCode: (email, code) => api('/auth/verify-reset-code', { method: 'POST', body: { email, code } }),
  resetPassword: (body) => api('/auth/reset-password', { method: 'POST', body }),
}

export const admissions = {
  options: () => api('/admission-options'),
  apply: (formData) => apiUpload('/admissions', formData),
}

export const site = {
  announcements: (params) => api('/site/announcements', { params }),
  events: (params) => api('/site/events', { params }),
}

export const admin = {
  dashboard: () => api('/admin/dashboard'),

  students: (params) => api('/admin/students', { params }),
  showStudent: (id) => api(`/admin/students/${id}`),
  createStudent: (body) => api('/admin/students', { method: 'POST', body }),
  updateStudent: (id, body) => api(`/admin/students/${id}`, { method: 'PUT', body }),
  deleteStudent: (id) => api(`/admin/students/${id}`, { method: 'DELETE' }),
  bulkDeleteStudents: (ids) => api('/admin/students/bulk', { method: 'DELETE', body: { ids } }),
  promoteStudents: (body) => api('/admin/students/promote', { method: 'POST', body }),

  teachers: (params) => api('/admin/teachers', { params }),
  createTeacher: (body) => api('/admin/teachers', { method: 'POST', body }),
  updateTeacher: (id, body) => api(`/admin/teachers/${id}`, { method: 'PUT', body }),
  assignSubjects: (id, assignments) => api(`/admin/teachers/${id}/subjects`, { method: 'POST', body: { assignments } }),
  deleteTeacher: (id) => api(`/admin/teachers/${id}`, { method: 'DELETE' }),
  bulkDeleteTeachers: (ids) => api('/admin/teachers/bulk', { method: 'DELETE', body: { ids } }),

  parents: (params) => api('/admin/parents', { params }),
  showParent: (id) => api(`/admin/parents/${id}`),
  createParent: (body) => api('/admin/parents', { method: 'POST', body }),
  updateParent: (id, body) => api(`/admin/parents/${id}`, { method: 'PUT', body }),
  deleteParent: (id) => api(`/admin/parents/${id}`, { method: 'DELETE' }),
  bulkDeleteParents: (ids) => api('/admin/parents/bulk', { method: 'DELETE', body: { ids } }),

  classes: (params) => api('/admin/classes', { params }),
  showClass: (id) => api(`/admin/classes/${id}`),
  createClass: (body) => api('/admin/classes', { method: 'POST', body }),
  updateClass: (id, body) => api(`/admin/classes/${id}`, { method: 'PUT', body }),
  deleteClass: (id) => api(`/admin/classes/${id}`, { method: 'DELETE' }),

  subjects: (params) => api('/admin/subjects', { params }),
  createSubject: (body) => api('/admin/subjects', { method: 'POST', body }),
  updateSubject: (id, body) => api(`/admin/subjects/${id}`, { method: 'PUT', body }),
  deleteSubject: (id) => api(`/admin/subjects/${id}`, { method: 'DELETE' }),

  sessions: () => api('/admin/sessions'),
  createSession: (body) => api('/admin/sessions', { method: 'POST', body }),
  updateTerm: (sessionId, termId, status) =>
    api(`/admin/sessions/${sessionId}/terms/${termId}`, { method: 'PUT', body: { status } }),
  lockResults: (sessionId, termId) =>
    api(`/admin/sessions/${sessionId}/terms/${termId}/lock-results`, { method: 'POST' }),

  attendance: (params) => api('/admin/attendance', { params }),
  attendanceTerms: () => api('/admin/attendance/terms'),
  saveAttendance: (body) => api('/admin/attendance', { method: 'POST', body }),
  attendanceStats: (params) => api('/admin/attendance/stats', { params }),
  studentAttendanceRate: (studentId, params) => api(`/admin/students/${studentId}/attendance-rate`, { params }),

  resultUploads: (params) => api('/admin/result-uploads', { params }),
  compiledResults: (params) => api('/admin/results/compiled', { params }),
  resultScores: (id) => api(`/admin/result-uploads/${id}/scores`),
  updateResultScores: (id, body) => api(`/admin/result-uploads/${id}/scores`, { method: 'PUT', body }),
  deleteResult: (id) => api(`/admin/result-uploads/${id}`, { method: 'DELETE' }),
  approveResult: (id) => api(`/admin/result-uploads/${id}/approve`, { method: 'POST' }),
  rejectResult: (id) => api(`/admin/result-uploads/${id}/reject`, { method: 'POST' }),
  downloadResultTemplate: (params) => downloadFile('/admin/result-uploads/template', { params }),
  uploadResults: (formData) => apiUpload('/admin/result-uploads/upload', formData),
  resultPublications: (params) => api('/admin/result-publications', { params }),
  publishResults: (body) => api('/admin/result-publications/publish', { method: 'POST', body }),
  unpublishResults: (body) => api('/admin/result-publications/unpublish', { method: 'POST', body }),

  timetable: (classId, termId) => api('/admin/timetable', { params: { classId, termId } }),
  saveTimetable: (body) => api('/admin/timetable', { method: 'POST', body }),
  downloadTimetableTemplate: (params) => downloadFile('/admin/timetable/template', { params }),
  uploadTimetable: (formData) => apiUpload('/admin/timetable/upload', formData),
  deleteTimetable: (params) => api('/admin/timetable', { method: 'DELETE', params }),

  assignments: (params) => api('/admin/assignments', { params }),
  createAssignment: (body) => api('/admin/assignments', { method: 'POST', body }),
  updateAssignment: (id, body) => api(`/admin/assignments/${id}`, { method: 'PUT', body }),
  deleteAssignment: (id) => api(`/admin/assignments/${id}`, { method: 'DELETE' }),

  exams: (params) => api('/admin/exams', { params }),
  createExam: (body) => api('/admin/exams', { method: 'POST', body }),
  updateExam: (id, body) => api(`/admin/exams/${id}`, { method: 'PUT', body }),
  deleteExam: (id) => api(`/admin/exams/${id}`, { method: 'DELETE' }),

  cbt: (params) => api('/admin/cbt', { params }),
  cbtOptions: () => api('/admin/cbt/options'),
  createCbt: (body) => api('/admin/cbt', { method: 'POST', body }),
  updateCbt: (id, body) => api(`/admin/cbt/${id}`, { method: 'PUT', body }),
  cbtExam: (id) => api(`/admin/cbt/${id}`),
  downloadCbtTemplate: () => downloadFile('/admin/cbt/template'),
  addCbtQuestion: (id, body) => api(`/admin/cbt/${id}/questions`, { method: 'POST', body }),
  updateCbtQuestion: (id, qid, body) => api(`/admin/cbt/${id}/questions/${qid}`, { method: 'PUT', body }),
  deleteCbtQuestion: (id, qid) => api(`/admin/cbt/${id}/questions/${qid}`, { method: 'DELETE' }),
  uploadCbtQuestions: (id, formData) => apiUpload(`/admin/cbt/${id}/questions/upload`, formData),
  updateCbtStatus: (id, action) => api(`/admin/cbt/${id}/status`, { method: 'POST', body: { action } }),
  deleteCbt: (id) => api(`/admin/cbt/${id}`, { method: 'DELETE' }),
  downloadCbtResults: (id) => downloadFile(`/admin/cbt/${id}/results/export`),

  feeStructure: (params) => api('/admin/fees/structure', { params }),
  feeStudents: (params) => api('/admin/fees/students', { params }),
  feeSummary: () => api('/admin/fees/summary'),
  feesByClass: () => api('/admin/fees/by-class'),
  feeTrend: () => api('/admin/fees/trend'),
  createFee: (body) => api('/admin/fees', { method: 'POST', body }),
  studentFees: (studentId) => api(`/admin/students/${studentId}/fees`),

  payments: (params) => api('/admin/payments', { params }),
  createPayment: (body) => api('/admin/payments', { method: 'POST', body }),
  verifyPayment: (id) => api(`/admin/payments/${id}/verify`, { method: 'POST' }),
  rejectPayment: (id) => api(`/admin/payments/${id}/reject`, { method: 'POST' }),

  announcements: (params) => api('/admin/announcements', { params }),
  createAnnouncement: (body) => api('/admin/announcements', { method: 'POST', body }),
  updateAnnouncement: (id, body) => api(`/admin/announcements/${id}`, { method: 'PUT', body }),
  deleteAnnouncement: (id) => api(`/admin/announcements/${id}`, { method: 'DELETE' }),

  events: (params) => api('/admin/events', { params }),
  createEvent: (body) => api('/admin/events', { method: 'POST', body }),
  updateEvent: (id, body) => api(`/admin/events/${id}`, { method: 'PUT', body }),
  deleteEvent: (id) => api(`/admin/events/${id}`, { method: 'DELETE' }),

  conversations: () => api('/admin/messages/conversations'),
  thread: (partnerId) => api(`/admin/messages/conversations/${partnerId}`),
  sendMessage: (body) => api('/admin/messages', { method: 'POST', body }),
  unreadCount: () => api('/admin/messages/unread'),

  admissions: (params) => api('/admin/admissions', { params }),
  decideAdmission: (id, status) => api(`/admin/admissions/${id}/decide`, { method: 'POST', body: { status } }),

  reportSummary: () => api('/admin/reports/summary'),
  gradeDistribution: (params) => api('/admin/reports/grade-distribution', { params }),
  performanceTrend: () => api('/admin/reports/performance-trend'),
  generateReport: (type, params) => api(`/admin/reports/${type}`, { params }),

  settings: () => api('/admin/settings'),
  updateSchool: (body) => api('/admin/settings/school', { method: 'PUT', body }),
  updateNotifications: (body) => api('/admin/settings/notifications', { method: 'PUT', body }),

  users: (params) => api('/admin/users', { params }),
  createUser: (body) => api('/admin/users', { method: 'POST', body }),
  updateUser: (id, body) => api(`/admin/users/${id}`, { method: 'PUT', body }),
  resetUserPassword: (id, password) => api(`/admin/users/${id}/reset-password`, { method: 'POST', body: { password } }),
  deleteUser: (id) => api(`/admin/users/${id}`, { method: 'DELETE' }),
}

export const academic = {
  current: () => api('/academic/current'),
}

export const teacher = {
  dashboard: () => api('/teacher/dashboard'),
  profile: () => api('/teacher/profile'),
  updateProfile: (body) => api('/teacher/profile', { method: 'PUT', body }),
  classes: () => api('/teacher/classes'),
  students: (params) => api('/teacher/students', { params }),

  attendance: (params) => api('/teacher/attendance', { params }),
  attendanceTerms: () => api('/teacher/attendance/terms'),
  attendanceStats: (params) => api('/teacher/attendance/stats', { params }),
  saveAttendance: (body) => api('/teacher/attendance', { method: 'POST', body }),

  assignments: (params) => api('/teacher/assignments', { params }),
  createAssignment: (body) => api('/teacher/assignments', { method: 'POST', body }),
  updateAssignment: (id, body) => api(`/teacher/assignments/${id}`, { method: 'PUT', body }),
  deleteAssignment: (id) => api(`/teacher/assignments/${id}`, { method: 'DELETE' }),
  assignmentSubmissions: (id) => api(`/teacher/assignments/${id}/submissions`),
  gradeAssignment: (id, body) => api(`/teacher/assignments/${id}/submissions`, { method: 'PUT', body }),

  scoreOptions: () => api('/teacher/scores/options'),
  scores: (params) => api('/teacher/scores', { params }),
  saveScores: (body) => api('/teacher/scores', { method: 'POST', body }),

  exams: (params) => api('/teacher/exams', { params }),

  cbtOptions: () => api('/teacher/cbt/options'),
  cbtExams: () => api('/teacher/cbt'),
  createCbt: (body) => api('/teacher/cbt', { method: 'POST', body }),
  updateCbt: (id, body) => api(`/teacher/cbt/${id}`, { method: 'PUT', body }),
  deleteCbt: (id) => api(`/teacher/cbt/${id}`, { method: 'DELETE' }),
  cbt: (id) => api(`/teacher/cbt/${id}`),
  updateCbtStatus: (id, action) => api(`/teacher/cbt/${id}/status`, { method: 'POST', body: { action } }),
  addCbtQuestion: (id, body) => api(`/teacher/cbt/${id}/questions`, { method: 'POST', body }),
  updateCbtQuestion: (id, qid, body) => api(`/teacher/cbt/${id}/questions/${qid}`, { method: 'PUT', body }),
  deleteCbtQuestion: (id, qid) => api(`/teacher/cbt/${id}/questions/${qid}`, { method: 'DELETE' }),
  uploadCbtQuestions: (id, formData) => apiUpload(`/teacher/cbt/${id}/questions/upload`, formData),
  downloadCbtTemplate: () => downloadFile('/teacher/cbt/template'),
  cbtResults: (id) => api(`/teacher/cbt/${id}/results`),
  downloadCbtResults: (id) => downloadFile(`/teacher/cbt/${id}/results/export`),

  timetable: (params) => api('/teacher/timetable', { params }),
  announcements: () => api('/teacher/announcements'),

  conversations: () => api('/teacher/messages/conversations'),
  thread: (partnerId) => api(`/teacher/messages/conversations/${partnerId}`),
  sendMessage: (body) => api('/teacher/messages', { method: 'POST', body }),
  unreadCount: () => api('/teacher/messages/unread'),

  resultOptions: () => api('/teacher/results/options'),
  results: () => api('/teacher/results'),
  resultScores: (id) => api(`/teacher/results/${id}/scores`),
  updateResultScores: (id, body) => api(`/teacher/results/${id}/scores`, { method: 'PUT', body }),
  deleteResult: (id) => api(`/teacher/results/${id}`, { method: 'DELETE' }),
  downloadResultTemplate: (params) => downloadFile('/teacher/results/template', { params }),
  uploadResults: (formData) => apiUpload('/teacher/results/upload', formData),
}

export const student = {
  dashboard: () => api('/student/dashboard'),
  profile: () => api('/student/profile'),
  updateProfile: (body) => api('/student/profile', { method: 'PUT', body }),
  subjects: (params) => api('/student/subjects', { params }),
  timetable: (params) => api('/student/timetable', { params }),
  attendance: (params) => api('/student/attendance', { params }),
  assignments: () => api('/student/assignments'),
  submitAssignment: (id, formData) => apiUpload(`/student/assignments/${id}/submit`, formData),
  exams: () => api('/student/exams'),
  cbt: () => api('/student/cbt'),
  startCbt: (id) => api(`/student/cbt/${id}/start`, { method: 'POST' }),
  cbtAttempt: (id) => api(`/student/cbt/attempts/${id}`),
  saveCbtAnswers: (id, answers) => api(`/student/cbt/attempts/${id}/answers`, { method: 'PUT', body: { answers } }),
  submitCbt: (id, answers) => api(`/student/cbt/attempts/${id}/submit`, { method: 'POST', body: { answers } }),
  announcements: () => api('/student/announcements'),
  fees: (params) => api('/student/fees', { params }),
  scratchCards: () => api('/student/scratch-cards'),
  generateScratchCard: (body) => api('/student/scratch-cards', { method: 'POST', body }),
  results: (params) => api('/student/results', { params }),
  checkResult: (body) => api('/student/results/check', { method: 'POST', body }),
  conversations: () => api('/student/messages/conversations'),
  thread: (partnerId) => api(`/student/messages/conversations/${partnerId}`),
  sendMessage: (body) => api('/student/messages', { method: 'POST', body }),
  unreadCount: () => api('/student/messages/unread'),
}
