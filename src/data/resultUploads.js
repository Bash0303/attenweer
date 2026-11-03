const UPLOADS_KEY = 'wgs.teacherResultUploads.v1'

const isBrowser = () => typeof window !== 'undefined'

const readJson = (key, fallback) => {
  if (!isBrowser()) return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const writeJson = (key, value) => {
  if (!isBrowser()) return
  window.localStorage.setItem(key, JSON.stringify(value))
}

const normalizeUpload = (upload) => ({
  ...upload,
  subject: upload.subject || 'General',
  teacher: upload.teacher || 'Teacher',
  status: upload.status === 'Approved' || upload.status === 'Published' ? 'Approved' : 'Pending',
})

export const readResultUploads = () => {
  const uploads = readJson(UPLOADS_KEY, [])
  return Array.isArray(uploads) ? uploads.map(normalizeUpload) : []
}

export const saveResultUploads = (uploads) => writeJson(UPLOADS_KEY, uploads)

export const addResultUpload = (upload) => {
  const next = [normalizeUpload(upload), ...readResultUploads()]
  saveResultUploads(next)
  return next
}

export const approveResultUpload = (id) => {
  const next = readResultUploads().map((upload) => (
    upload.id === id ? { ...upload, status: 'Approved' } : upload
  ))
  saveResultUploads(next)
  return next
}

export const resultsForClass = (className, term) =>
  readResultUploads().filter((upload) => upload.className === className && upload.term === term)

export const approvedResultsForClass = (className, term) =>
  resultsForClass(className, term).filter((upload) => upload.status === 'Approved')
