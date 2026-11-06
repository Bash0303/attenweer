import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CheckCircle2, Upload, ChevronRight, ChevronLeft, Phone, Mail, MapPin, Loader2 } from 'lucide-react'
import SiteNav from '../../components/layout/SiteNav'
import SiteFooter from '../../components/layout/SiteFooter'
import Button from '../../components/ui/Button'
import { school } from '../../data/mock'
import { admissions } from '../../services/api'

const steps = ['Student Details', 'Admission & Class', 'Parent / Guardian', 'Review & Submit']

const MAX_PASSPORT_BYTES = 100 * 1024
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const inputCls =
  'w-full rounded-xl border border-navy-100 bg-white px-3.5 py-2.5 text-sm text-navy-900 placeholder:text-slate-400 outline-none transition focus:border-navy-400 focus:ring-2 focus:ring-navy-100'

function Field({ label, children, col = false }) {
  return (
    <label className={`block ${col ? '' : ''}`}>
      <span className="mb-1.5 block text-sm font-semibold text-navy-800">{label}</span>
      {children}
    </label>
  )
}

export default function Register() {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [appId, setAppId] = useState('')
  const [form, setForm] = useState({})
  const [options, setOptions] = useState(null)
  const [optionsLoading, setOptionsLoading] = useState(true)
  const [passportFile, setPassportFile] = useState(null)
  const [passportError, setPassportError] = useState(null)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [formError, setFormError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const passportRef = useRef(null)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  useEffect(() => {
    let active = true

    admissions
      .options()
      .then((res) => {
        if (!active) return
        const data = res.data || {}
        setOptions(data)
        setForm((f) => ({ ...f, session: f.session || data.session || school.session }))
      })
      .catch(() => {
        if (active) setOptions({ classes: [], admissionTypes: ['Fresh Intake', 'Transfer', 'Re-admission'], session: school.session })
      })
      .finally(() => {
        if (active) setOptionsLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const onPassport = (event) => {
    const file = event.target.files?.[0]
    setPassportError(null)

    if (!file) {
      setPassportFile(null)
      return
    }

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setPassportError('Passport must be a JPG or PNG image.')
      event.target.value = ''
      return
    }

    if (file.size > MAX_PASSPORT_BYTES) {
      setPassportError('Passport must be 100KB or smaller.')
      event.target.value = ''
      return
    }

    setPassportFile(file)
  }

  const validateStep = (current) => {
    if (current === 0) {
      if (!form.fullName?.trim()) return 'Enter the student full name.'
      if (!form.dob) return 'Select the date of birth.'
      if (!form.gender) return 'Select the gender.'
      if (!form.phone?.trim()) return 'Enter the phone number.'
      if (!emailPattern.test(form.email || '')) return 'Enter a valid email address.'
      if (!form.address?.trim()) return 'Enter the home address.'
      if (!passportFile) return 'Upload the passport photograph (JPG/PNG, max 100KB).'
    }

    if (current === 1) {
      if (!form.classId) return 'Select the class applying to.'
      if (!form.admissionType) return 'Select the admission type.'
    }

    if (current === 2) {
      if (!form.parentName?.trim()) return 'Enter the parent/guardian name.'
      if (!form.parentPhone?.trim()) return 'Enter the parent phone number.'
    }

    return null
  }

  const next = () => {
    const error = validateStep(step)
    if (error) {
      setFormError(error)
      return
    }
    setFormError(null)
    setStep((s) => Math.min(s + 1, steps.length - 1))
  }

  const back = () => {
    setFormError(null)
    setStep((s) => Math.max(s - 1, 0))
  }

  const handleSubmit = async () => {
    if (!termsAccepted) {
      setFormError('Please accept the terms and conditions before submitting.')
      return
    }

    setSubmitting(true)
    setFormError(null)

    try {
      const payload = new FormData()
      payload.append('fullName', form.fullName || '')
      payload.append('email', form.email || '')
      payload.append('phone', form.phone || '')
      payload.append('gender', form.gender || '')
      payload.append('dob', form.dob || '')
      payload.append('state', form.state || '')
      payload.append('address', form.address || '')
      payload.append('classId', form.classId || '')
      payload.append('admissionType', form.admissionType || '')
      payload.append('session', form.session || options?.session || school.session)
      payload.append('prevSchool', form.prevSchool || '')
      payload.append('house', form.house || '')
      payload.append('bloodGroup', form.bloodGroup || '')
      payload.append('allergy', form.allergy || '')
      payload.append('parentName', form.parentName || '')
      payload.append('parentPhone', form.parentPhone || '')
      payload.append('parentEmail', form.parentEmail || '')
      payload.append('relation', form.relation || '')
      payload.append('emergency', form.emergency || '')

      if (passportFile) payload.append('passport', passportFile)

      const res = await admissions.apply(payload)
      setAppId(res.code || res.data?.code || '')
      setSubmitted(true)
      setStep(0)
    } catch (error) {
      setFormError(error.errors ? Object.values(error.errors).flat().join(' ') : error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const classList = options?.classes || []
  const selectedClass = classList.find((c) => String(c.id) === String(form.classId))
  const sessionLabel = form.session || options?.session || school.session

  const resetForm = () => {
    setStep(0)
    setForm({})
    setPassportFile(null)
    setPassportError(null)
    setTermsAccepted(false)
    setFormError(null)
    setSubmitted(false)
    setAppId('')
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <SiteNav />

      <section className="relative overflow-hidden bg-navy-950 py-16 text-white">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, #d9a62e 0%, transparent 45%)' }}
        />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-extrabold sm:text-4xl">
            Admission Registration
          </motion.h1>
          <p className="mt-3 text-cream-100/70">
            Apply for admission into {school.name}. Our admin team will review and approve your application.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-14">
        {submitted ? (
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="rounded-3xl border border-emerald-100 bg-white p-10 text-center shadow-card">
            <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-50">
              <CheckCircle2 size={40} className="text-emerald-600" />
            </span>
            <h2 className="mt-5 text-2xl font-extrabold text-navy-900">Application Submitted!</h2>
            <p className="mt-2 text-slate-600">
              Your admission application has been received. Keep your application ID safe — use it to track your admission status.
            </p>
            <div className="mt-6 inline-block rounded-2xl border border-dashed border-navy-200 bg-navy-50 px-8 py-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Application ID</p>
              <p className="mt-1 text-2xl font-extrabold text-navy-900">{appId}</p>
            </div>
            <p className="mx-auto mt-6 max-w-md rounded-xl bg-cream-100 p-4 text-sm text-navy-800">
              Once approved, a student ID and login credentials will be generated and sent to your email, and your ward will be assigned to their class for the {sessionLabel} session.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/login">
                <Button tone="primary">Go to Login</Button>
              </Link>
              <Button tone="ghost" onClick={resetForm}>
                Register Another Student
              </Button>
            </div>
          </motion.div>
        ) : (
          <>
            <div className="mb-8 flex items-center justify-between">
              {steps.map((s, i) => (
                <div key={s} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center gap-1.5 text-center">
                    <span className={`grid h-9 w-9 place-items-center rounded-full text-sm font-bold transition ${i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-navy-700 text-white' : 'bg-white text-slate-400 border border-navy-100'}`}>
                      {i < step ? <CheckCircle2 size={18} /> : i + 1}
                    </span>
                    <span className={`hidden text-[11px] font-semibold sm:block ${i === step ? 'text-navy-800' : 'text-slate-400'}`}>{s}</span>
                  </div>
                  {i < steps.length - 1 && <div className={`mx-2 h-0.5 flex-1 ${i < step ? 'bg-emerald-500' : 'bg-navy-100'}`} />}
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-navy-100 bg-white p-6 shadow-card sm:p-8">
              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                  {step === 0 && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Full Name *"><input className={inputCls} placeholder="e.g. Aisha Bello" value={form.fullName || ''} onChange={set('fullName')} /></Field>
                      <Field label="Date of Birth *"><input type="date" className={inputCls} value={form.dob || ''} onChange={set('dob')} /></Field>
                      <Field label="Gender *">
                        <select className={inputCls} value={form.gender || ''} onChange={set('gender')}>
                          <option value="">Select gender</option><option>Male</option><option>Female</option>
                        </select>
                      </Field>
                      <Field label="Phone Number *"><input type="tel" className={inputCls} placeholder="080xxxxxxxxx" value={form.phone || ''} onChange={set('phone')} /></Field>
                      <Field label="Email Address *"><input type="email" className={inputCls} placeholder="you@example.com" value={form.email || ''} onChange={set('email')} /></Field>
                      <Field label="State of Origin">
                        <select className={inputCls} value={form.state || ''} onChange={set('state')}>
                          <option value="">Select state</option><option>Kwara</option><option>Oyo</option><option>Lagos</option><option>Osun</option><option>Others</option>
                        </select>
                      </Field>
                      <Field label="Home Address *" col><input className={inputCls} placeholder="House number, street, area" value={form.address || ''} onChange={set('address')} /></Field>
                      <Field label="Passport Photograph *">
                        <input ref={passportRef} type="file" accept="image/jpeg,image/png" onChange={onPassport} className="hidden" />
                        <button
                          type="button"
                          onClick={() => passportRef.current?.click()}
                          className="flex w-full items-center gap-3 rounded-xl border-2 border-dashed border-navy-200 bg-navy-50/40 p-3 text-left text-sm text-slate-500 transition hover:border-navy-400"
                        >
                          <Upload size={18} className="shrink-0 text-navy-400" />
                          <span className="truncate">{passportFile ? passportFile.name : 'Upload passport (JPG/PNG, max 100KB)'}</span>
                        </button>
                        {passportFile && (
                          <span className="mt-1 block text-xs text-emerald-600">
                            {(passportFile.size / 1024).toFixed(0)}KB selected
                          </span>
                        )}
                        {passportError && <span className="mt-1 block text-xs text-rose-600">{passportError}</span>}
                      </Field>
                    </div>
                  )}

                  {step === 1 && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Previous School"><input className={inputCls} placeholder="Name of previous school" value={form.prevSchool || ''} onChange={set('prevSchool')} /></Field>
                      <Field label="Admission Type *">
                        <select className={inputCls} value={form.admissionType || ''} onChange={set('admissionType')}>
                          <option value="">Select type</option>
                          {(options?.admissionTypes || ['Fresh Intake', 'Transfer', 'Re-admission']).map((type) => (
                            <option key={type}>{type}</option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Class Applying To *">
                        <select className={inputCls} value={form.classId || ''} onChange={set('classId')} disabled={optionsLoading}>
                          <option value="">{optionsLoading ? 'Loading classes…' : 'Select class'}</option>
                          {classList.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </Field>
                      <Field label="Academic Session *">
                        <select className={inputCls} value={form.session || ''} onChange={set('session')}>
                          <option value={sessionLabel}>{sessionLabel}</option>
                          {school.session !== sessionLabel && <option value={school.session}>{school.session}</option>}
                          <option value="2026/2027">2026/2027</option>
                        </select>
                      </Field>
                      <Field label="Sports/House">
                        <select className={inputCls} value={form.house || ''} onChange={set('house')}>
                          <option value="">Select house</option><option>Red House</option><option>Blue House</option><option>Green House</option>
                        </select>
                      </Field>
                      <Field label="Required Documents">
                        <div className="flex items-center gap-3 rounded-xl border-2 border-dashed border-navy-200 bg-navy-50/40 p-3 text-sm text-slate-500">
                          <Upload size={18} className="text-navy-400" /> Upload documents (birth certificate, transfer letter)
                        </div>
                      </Field>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold uppercase tracking-wide text-navy-800">Parent / Guardian Information</h4>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Parent / Guardian Name *"><input className={inputCls} placeholder="Full name" value={form.parentName || ''} onChange={set('parentName')} /></Field>
                        <Field label="Relationship">
                          <select className={inputCls} value={form.relation || ''} onChange={set('relation')}>
                            <option value="">Select</option><option>Father</option><option>Mother</option><option>Guardian</option>
                          </select>
                        </Field>
                        <Field label="Parent Phone *"><input type="tel" className={inputCls} placeholder="080xxxxxxxxx" value={form.parentPhone || ''} onChange={set('parentPhone')} /></Field>
                        <Field label="Parent Email"><input type="email" className={inputCls} placeholder="parent@example.com" value={form.parentEmail || ''} onChange={set('parentEmail')} /></Field>
                        <Field label="Emergency Contact"><input type="tel" className={inputCls} placeholder="080xxxxxxxxx" value={form.emergency || ''} onChange={set('emergency')} /></Field>
                      </div>
                      <h4 className="pt-2 text-sm font-bold uppercase tracking-wide text-navy-800">Medical Information (optional)</h4>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Blood Group">
                          <select className={inputCls} value={form.bloodGroup || ''} onChange={set('bloodGroup')}>
                            <option value="">Select</option><option>A+</option><option>O+</option><option>B+</option><option>AB+</option><option>O-</option>
                          </select>
                        </Field>
                        <Field label="Allergies / Conditions"><input className={inputCls} placeholder="e.g. None" value={form.allergy || ''} onChange={set('allergy')} /></Field>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-wide text-navy-800">Review Your Application</h4>
                      <div className="mt-4 space-y-2 rounded-2xl bg-navy-50/40 p-5 text-sm">
                        {[
                          ['Student Name', form.fullName || '—'],
                          ['Date of Birth', form.dob || '—'],
                          ['Gender', form.gender || '—'],
                          ['Class', selectedClass?.name || '—'],
                          ['Admission Type', form.admissionType || '—'],
                          ['Session', sessionLabel],
                          ['Parent / Guardian', form.parentName || '—'],
                          ['Parent Phone', form.parentPhone || '—'],
                          ['Passport', passportFile?.name || '—'],
                        ].map(([k, v]) => (
                          <div key={k} className="flex justify-between gap-4 border-b border-navy-50 pb-2 last:border-0">
                            <span className="text-slate-500">{k}</span>
                            <span className="max-w-[60%] truncate text-right font-semibold text-navy-900">{v}</span>
                          </div>
                        ))}
                      </div>
                      <label className="mt-4 flex items-start gap-3 text-sm text-slate-600">
                        <input
                          type="checkbox"
                          checked={termsAccepted}
                          onChange={(event) => setTermsAccepted(event.target.checked)}
                          className="mt-0.5 h-4 w-4 rounded border-navy-200"
                        />
                        <span>I confirm that the information provided is true and I agree to the school's terms and conditions, including its Islamic and moral code of conduct.</span>
                      </label>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {formError && (
                <p className="mt-5 rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600">{formError}</p>
              )}

              <div className="mt-8 flex items-center justify-between border-t border-navy-100 pt-5">
                <button onClick={back} disabled={step === 0} className={`inline-flex items-center gap-1 rounded-xl px-4 py-2.5 text-sm font-semibold ${step === 0 ? 'cursor-not-allowed text-slate-300' : 'text-navy-700 hover:bg-navy-50'}`}>
                  <ChevronLeft size={16} /> Back
                </button>
                {step < steps.length - 1 ? (
                  <Button onClick={next}>Continue <ChevronRight size={16} /></Button>
                ) : (
                  <Button tone="gold" onClick={handleSubmit} disabled={submitting}>
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : null} {submitting ? 'Submitting…' : 'Submit Application'}
                  </Button>
                )}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-6 rounded-2xl border border-navy-100 bg-white p-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><Phone size={14} className="text-gold-600" /> {school.phones[0]}</span>
              <span className="flex items-center gap-1.5"><Mail size={14} className="text-gold-600" /> {school.email}</span>
              <span className="hidden items-center gap-1.5 sm:flex"><MapPin size={14} className="text-gold-600" /> {school.location}</span>
            </div>
          </>
        )}
      </section>

      <SiteFooter />
    </div>
  )
}
