export const ASSESSMENT_TYPES = ['Classwork', 'First CA', 'Second CA', 'Exam']

export const ASSESSMENT_COLORS = {
  Classwork: 'slate',
  'First CA': 'sky',
  'Second CA': 'violet',
  Exam: 'gold',
}

export const CBT_STATUS_COLORS = { Draft: 'slate', Scheduled: 'amber', Active: 'emerald', Closed: 'rose' }

export const blankCbtExam = {
  title: '', assessmentType: 'Classwork', classId: '', subjectId: '', termId: '', teacherId: '',
  instructions: '', durationMinutes: 30, startsAt: '', endsAt: '', status: 'Draft',
  shuffleQuestions: true, shuffleOptions: false, showResultImmediately: true,
}

export const toLocalInput = (iso) => {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (value) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export const toIso = (value) => {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

export const fmtCbtDateTime = (iso) => {
  if (!iso) return '—'
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
}
