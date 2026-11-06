import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowRight, CheckCircle2, ClipboardList, FileText, GraduationCap, Mail, MapPin,
  MessageCircle, Phone, School, Sparkles,
} from 'lucide-react'
import SiteNav from '../../components/layout/SiteNav'
import SiteFooter from '../../components/layout/SiteFooter'
import { school } from '../../data/mock'

const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, delay: i * 0.08 },
})

const process = [
  'Obtain admission information from the school',
  'Submit required documents',
  'Participate in assessment or interview where applicable',
  'Admission confirmation and enrollment',
]

const levels = [
  'Pre-Nursery',
  'Nursery',
  'Basic Education',
  'Junior Secondary School',
  'Senior Secondary School',
]

const requirements = [
  'Completed admission form',
  'Copy of birth certificate',
  'Recent passport photographs',
  'Previous school report or testimonial',
  'Transfer certificate where applicable',
]

const benefits = [
  'Quran Memorization',
  'Arabic & Islamic Studies',
  'Quality Western Education',
  'Experienced Teachers',
  'Excellent Learning Environment',
  'Character Building & Extracurricular Activities',
]

export default function Admission() {
  return (
    <div className="min-h-screen bg-white">
      <SiteNav />

      <section className="relative overflow-hidden bg-navy-950 py-20 text-white">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #e67f39 0%, transparent 40%), radial-gradient(circle at 80% 20%, #4faa70 0%, transparent 45%)' }}
        />
        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-gold-400 backdrop-blur">
            <Sparkles size={14} /> {school.session} Session
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Our Admission
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="mx-auto mt-4 max-w-3xl text-lg text-cream-100/80">
            Attenweer Schools welcomes pupils and students into various academic levels in a safe, disciplined and
            nurturing environment.
          </motion.p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <motion.div {...fadeUp()} className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-gold-600">How to Apply</p>
          <h2 className="mt-2 text-3xl font-extrabold text-navy-900">Admission Process</h2>
        </motion.div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {process.map((step, i) => (
            <motion.div key={step} {...fadeUp(i)} className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy-800 font-extrabold text-gold-400">
                {i + 1}
              </span>
              <p className="mt-4 text-sm font-semibold leading-relaxed text-navy-900">{step}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-cream-100/60 py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2">
          <motion.div {...fadeUp()}>
            <div className="flex items-center gap-2 text-gold-600">
              <School size={20} /><p className="text-sm font-bold uppercase tracking-widest">Available Classes</p>
            </div>
            <h2 className="mt-2 text-3xl font-extrabold text-navy-900">Admissions are offered into:</h2>
            <ul className="mt-6 space-y-3">
              {levels.map((level) => (
                <li key={level} className="flex items-center gap-3 rounded-xl border border-navy-100 bg-white px-4 py-3 text-sm font-semibold text-navy-800">
                  <CheckCircle2 size={18} className="shrink-0 text-navy-600" /> {level}
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-2xl border border-navy-100 bg-white p-5">
              <h3 className="font-bold text-navy-900">Senior Secondary School options</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {['Science', 'Art', 'Commercial'].map((option) => (
                  <span key={option} className="rounded-full bg-navy-50 px-4 py-1.5 text-sm font-semibold text-navy-800">
                    {option}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div {...fadeUp(1)}>
            <div className="flex items-center gap-2 text-gold-600">
              <ClipboardList size={20} /><p className="text-sm font-bold uppercase tracking-widest">Requirements</p>
            </div>
            <h2 className="mt-2 text-3xl font-extrabold text-navy-900">Applicants are required to present:</h2>
            <ul className="mt-6 space-y-3">
              {requirements.map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-xl border border-navy-100 bg-white px-4 py-3 text-sm text-slate-600">
                  <FileText size={18} className="mt-0.5 shrink-0 text-gold-600" /> {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-slate-500">Additional requirements may apply depending on the class level.</p>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <motion.div {...fadeUp()} className="rounded-3xl border border-gold-400/30 bg-gold-500/10 p-8">
          <h2 className="text-2xl font-extrabold text-navy-900">Important Note</h2>
          <p className="mt-3 leading-relaxed text-slate-600">
            Admission is based on availability of space and satisfactory performance in the assessment process.
            Parents and guardians are encouraged to apply early.
          </p>
        </motion.div>

        <motion.div {...fadeUp(1)} className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-navy-100 bg-white p-8 shadow-card">
            <h2 className="text-2xl font-extrabold text-navy-900">Admission Enquiries</h2>
            <p className="mt-3 leading-relaxed text-slate-600">
              For enquiries and guidance on admission, please contact the school administration.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="https://wa.me/23470636179685" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-500">
                <MessageCircle size={17} /> Chat on WhatsApp
              </a>
              <a href="tel:09161265553" className="inline-flex items-center gap-2 rounded-xl bg-navy-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-navy-800">
                <Phone size={17} /> Call Us 09161265553
              </a>
            </div>
            <div className="mt-6 space-y-2 text-sm text-slate-600">
              <p className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 shrink-0 text-gold-600" /> {school.location}</p>
              <p className="flex items-center gap-2"><Mail size={16} className="shrink-0 text-gold-600" /> {school.email}</p>
            </div>
          </div>

          <div className="rounded-3xl bg-navy-950 p-8 text-white">
            <div className="flex items-center gap-2 text-gold-400">
              <GraduationCap size={22} /><h2 className="text-2xl font-extrabold">Admissions Now Open!</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-cream-100/75">
              Give your child the advantage of a balanced education at Attenweer College, Yakuba, Ilorin.
            </p>
            <ul className="mt-5 grid gap-2 text-sm text-cream-100/80 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-gold-400" /> {benefit}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-cream-100/75">
              Enroll now and help your child grow in knowledge, faith, and excellence.
            </p>
            <div className="mt-5 space-y-2 text-sm text-cream-100/75">
              <p className="flex items-center gap-2"><Phone size={16} className="text-gold-400" /> 07036179685</p>
              <p className="flex items-center gap-2"><Mail size={16} className="text-gold-400" /> {school.email}</p>
              <p className="flex items-center gap-2"><MapPin size={16} className="text-gold-400" /> Visit our school for admission enquiries</p>
            </div>
            <Link to="/register" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gold-500 px-6 py-3 font-bold text-navy-950 transition hover:bg-gold-400 active:scale-95">
              Click to Apply <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </section>

      <SiteFooter />
    </div>
  )
}
