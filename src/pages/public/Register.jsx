import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CheckCircle2, Upload, ChevronRight, ChevronLeft, Phone, Mail, MapPin, Loader2 } from 'lucide-react'
import SiteNav from '../../components/layout/SiteNav'
import SiteFooter from '../../components/layout/SiteFooter'
import Button from '../../components/ui/Button'
import { classes, school } from '../../data/mock'

const steps = ['Student Details', 'Admission & Class', 'Parent / Guardian', 'Review & Submit']

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

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1))
  const back = () => setStep((s) => Math.max(s - 1, 0))

  const handleSubmit = () => {
    setAppId('APP-' + Math.floor(2300 + Math.random() * 200))
    setSubmitted(true)
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
            Student Registration
          </motion.h1>
          <p className="mt-3 text-cream-100/70">
            Apply for admission into {school.secondaryName}. Our admin team will review and approve your application.
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
              Once approved, a student ID and login credentials will be generated, and your ward will be assigned to their class for the {school.session} session.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/login">
                <Button tone="primary">Go to Login</Button>
              </Link>
              <Button tone="ghost" onClick={() => { setStep(0); setForm({}); setSubmitted(false) }}>
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
                      <Field label="Phone Number *"><input className={inputCls} placeholder="080xxxxxxxxx" value={form.phone || ''} onChange={set('phone')} /></Field>
                      <Field label="Email Address"><input className={inputCls} placeholder="you@example.com" value={form.email || ''} onChange={set('email')} /></Field>
                      <Field label="State of Origin">
                        <select className={inputCls} value={form.state || ''} onChange={set('state')}>
                          <option value="">Select state</option><option>Kwara</option><option>Oyo</option><option>Lagos</option><option>Osun</option><option>Others</option>
                        </select>
                      </Field>
                      <Field label="Home Address *" col><input className={inputCls} placeholder="House number, street, area" value={form.address || ''} onChange={set('address')} /></Field>
                      <Field label="Passport Photograph">
                        <div className="flex items-center gap-3 rounded-xl border-2 border-dashed border-navy-200 bg-navy-50/40 p-3 text-sm text-slate-500 hover:border-navy-400">
                          <Upload size={18} className="text-navy-400" /> <span>Upload passport (jpg/png, max 2MB)</span>
                        </div>
                      </Field>
                    </div>
                  )}

                  {step === 1 && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Previous School"><input className={inputCls} placeholder="Name of previous school" value={form.prevSchool || ''} onChange={set('prevSchool')} /></Field>
                      <Field label="Admission Type *">
                        <select className={inputCls} value={form.admissionType || ''} onChange={set('admissionType')}>
                          <option value="">Select type</option><option>Fresh Intake</option><option>Transfer</option><option>Re-admission</option>
                        </select>
                      </Field>
                      <Field label="Class Applying To *">
                        <select className={inputCls} value={form.className || ''} onChange={set('className')}>
                          <option value="">Select class (Secondary)</option>
                          {classes.map((c) => <option key={c.id}>{c.name}</option>)}
                        </select>
                      </Field>
                      <Field label="Academic Session *">
                        <select className={inputCls} value={form.session || ''} onChange={set('session')}>
                          <option>{school.session}</option><option>2026/2027</option>
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
                        <Field label="Parent Phone *"><input className={inputCls} placeholder="080xxxxxxxxx" value={form.parentPhone || ''} onChange={set('parentPhone')} /></Field>
                        <Field label="Parent Email"><input className={inputCls} placeholder="parent@example.com" value={form.parentEmail || ''} onChange={set('parentEmail')} /></Field>
                        <Field label="Emergency Contact"><input className={inputCls} placeholder="080xxxxxxxxx" value={form.emergency || ''} onChange={set('emergency')} /></Field>
                      </div>
                      <h4 className="pt-2 text-sm font-bold uppercase tracking-wide text-navy-800">Medical Information (optional)</h4>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Blood Group">
                          <select className={inputCls}><option value="">Select</option><option>A+</option><option>O+</option><option>B+</option><option>AB+</option><option>O-</option></select>
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
                          ['Class', form.className || '—'],
                          ['Admission Type', form.admissionType || '—'],
                          ['Session', form.session || school.session],
                          ['Parent / Guardian', form.parentName || '—'],
                          ['Parent Phone', form.parentPhone || '—'],
                        ].map(([k, v]) => (
                          <div key={k} className="flex justify-between gap-4 border-b border-navy-50 pb-2 last:border-0">
                            <span className="text-slate-500">{k}</span>
                            <span className="font-semibold text-navy-900">{v}</span>
                          </div>
                        ))}
                      </div>
                      <label className="mt-4 flex items-start gap-3 text-sm text-slate-600">
                        <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-navy-200" />
                        <span>I confirm that the information provided is true and I agree to the school's terms and conditions, including its Islamic and moral code of conduct.</span>
                      </label>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 flex items-center justify-between border-t border-navy-100 pt-5">
                <button onClick={back} disabled={step === 0} className={`inline-flex items-center gap-1 rounded-xl px-4 py-2.5 text-sm font-semibold ${step === 0 ? 'cursor-not-allowed text-slate-300' : 'text-navy-700 hover:bg-navy-50'}`}>
                  <ChevronLeft size={16} /> Back
                </button>
                {step < steps.length - 1 ? (
                  <Button onClick={next}>Continue <ChevronRight size={16} /></Button>
                ) : (
                  <Button tone="gold" onClick={handleSubmit}>
                    <Loader2 size={16} className="animate-spin" /> Submit Application
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