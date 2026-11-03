import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowRight, GraduationCap, School as SchoolIcon, BookOpen, HeartHandshake, Shield,
  Star, Megaphone, CalendarDays, MapPin, Phone, Mail, Users, Sparkles, Award, Target, Moon, Newspaper,
} from 'lucide-react'
import SiteNav from '../../components/layout/SiteNav'
import SiteFooter from '../../components/layout/SiteFooter'
import { school } from '../../data/mock'
import { site } from '../../services/api'
import heroImg from '../../assets/witty.jpeg'

const blaze = (i = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, delay: i * 0.08 },
})

const whyChoose = [
  { icon: Moon, title: 'Islamic & Western Education', desc: 'Qur\'anic excellence and modern curriculum united under one roof.' },
  { icon: BookOpen, title: 'Tailored Guidance', desc: 'Every child supported according to their unique academic and moral background.' },
  { icon: Users, title: 'Caring, Qualified Staff', desc: 'A dedicated team of experienced and compassionate educators.' },
  { icon: Shield, title: 'Safe & Disciplined', desc: 'A secure, orderly and moral learning environment parents can trust.' },
  { icon: Target, title: 'Strong Results', desc: 'Consistent academic performance with structured CA, exams and reports.' },
  { icon: HeartHandshake, title: 'Parent Partnership', desc: 'Transparent portal access to results, fees, attendance and more.' },
]

const eventTone = {
  exam: 'bg-navy-600',
  meeting: 'bg-gold-500',
  sports: 'bg-emerald-600',
  islamic: 'bg-teal-700',
  resumption: 'bg-sky-600',
}

export default function Home() {
  const [announcements, setAnnouncements] = useState([])
  const [events, setEvents] = useState([])
  const [newsLoading, setNewsLoading] = useState(true)

  useEffect(() => {
    let active = true

    Promise.allSettled([site.announcements({ limit: 4 }), site.events({ limit: 5 })])
      .then(([announcementResult, eventResult]) => {
        if (!active) return
        if (announcementResult.status === 'fulfilled') setAnnouncements(announcementResult.value.data || [])
        if (eventResult.status === 'fulfilled') setEvents(eventResult.value.data || [])
      })
      .finally(() => {
        if (active) setNewsLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <SiteNav />

      <section className="relative flex min-h-[88vh] flex-col justify-center overflow-hidden bg-navy-950 text-white lg:min-h-[680px]">
        <div className="absolute inset-0 bg-cover bg-center lg:bg-[position:50%_40%]" style={{ backgroundImage: `url(${heroImg})` }} />
        <div className="absolute inset-0 lg:hidden"
          style={{ background: 'radial-gradient(circle at 50% 45%, rgba(5,14,38,0.42) 0%, rgba(5,14,38,0.9) 80%)' }}
        />
        <div className="absolute inset-0 hidden lg:block"
          style={{ background: 'linear-gradient(100deg, rgba(5,14,38,0.95) 0%, rgba(5,14,38,0.82) 45%, rgba(5,14,38,0.5) 72%, rgba(5,14,38,0.3) 100%)' }}
        />
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:py-24">
          <div>
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-gold-400 backdrop-blur">
              <Sparkles size={14} /> Since {school.established} • Basin Road, Ilorin
            </motion.span>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
              Where Faith Meets<br />{" "}the <span className="text-gold-400">Future</span> of Learning
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="mt-5 max-w-xl text-lg leading-relaxed text-cream-100/80">
              {school.tagline}. An Islamic and Western academy empowering every child with academic brilliance, moral integrity, and proud character.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mt-8 flex flex-wrap gap-4">
              <Link to="/register" className="inline-flex items-center gap-2 rounded-xl bg-gold-500 px-6 py-3 font-bold text-navy-950 shadow-lg shadow-gold-500/30 transition hover:bg-gold-400 active:scale-95">
                Enrol Your Ward <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3 font-bold text-white backdrop-blur transition hover:bg-white/20 active:scale-95">
                Enter Student Portal
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-cream-100/70">
              <span className="inline-flex items-center gap-2"><Award size={16} className="text-gold-400" /> 1,250+ Students</span>
              <span className="inline-flex items-center gap-2"><GraduationCap size={16} className="text-gold-400" /> 85+ Teachers</span>
              <span className="inline-flex items-center gap-2"><Star size={16} className="text-gold-400" /> 98% Pass Rate</span>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <p className="font-arabic text-2xl text-gold-400">{school.mottoArabic}</p>
              <p className="mt-1 text-sm font-semibold uppercase tracking-widest text-cream-100/70">Our Motto</p>
              <h3 className="mt-2 text-xl font-extrabold">{school.motto}</h3>
              <p className="mt-3 text-sm leading-relaxed text-cream-100/75">{school.mission}</p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/5 p-3 text-xs">
                  <p className="text-cream-100/60">Uniform Colour</p>
                  <p className="mt-1 flex items-center gap-2 font-bold">
                    <span className="h-3 w-3 rounded-full bg-cream-100" /> Shirt: {school.uniform.shirt}
                  </p>
                  <p className="mt-1 flex items-center gap-2 font-bold">
                    <span className="h-3 w-3 rounded-full bg-navy-400" /> Trouser: {school.uniform.trouser}
                  </p>
                </div>
                <div className="rounded-xl bg-white/5 p-3 text-xs">
                  <p className="text-cream-100/60">Session</p>
                  <p className="mt-1 font-bold">{school.session} • {school.term}</p>
                  <p className="mt-2 text-cream-100/60">Portal Access</p>
                  <p className="mt-1 font-bold">Students • Parents • Staff</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl bg-gold-500 px-5 py-3 text-navy-950 shadow-lift sm:block">
              <p className="text-xs font-semibold uppercase tracking-wide">Fully Transitioning</p>
              <p className="text-sm font-extrabold">Analog → Digital Portal</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <motion.div {...blaze()} className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-gold-600">Welcome to Witty</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">A Heartfelt Welcome Message</h2>
          <p className="mx-auto mt-4 max-w-3xl leading-relaxed text-slate-600">
            Dear Parents, Guardians, and our dear Learners,
          </p>
          <p className="mx-auto mt-3 max-w-3xl leading-relaxed text-slate-600">
            It is with immense joy that we welcome you to Witty Group of Schools — a place where every child
            is seen, every voice is heard, and every potential is nurtured. Here, your child will grow in
            knowledge, deepen in faith, and blossom in character. As the Prophet Muhammad (peace be upon him)
            taught, <em className="font-semibold text-navy-800">"Seeking knowledge is an obligation upon every Muslim."</em>{' '}
            We take that sacred duty seriously, blending it beautifully with modern academic rigour.
            Together, let us raise children who succeed in this world and the Hereafter.
          </p>
          <p className="mt-3 font-semibold text-navy-800">— Management, Witty Group of Schools</p>
        </motion.div>
      </section>

      <section className="bg-cream-100/60 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div {...blaze()} className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-gold-600">Why Choose Us</p>
            <h2 className="mt-2 text-3xl font-extrabold text-navy-900">The Witty Advantage</h2>
          </motion.div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyChoose.map((c, i) => (
              <motion.div key={c.title} {...blaze(i)} className="group rounded-2xl border border-navy-100 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-400/40 hover:shadow-lift">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-navy-800 text-gold-400 transition group-hover:bg-gold-500 group-hover:text-navy-950">
                  <c.icon size={22} />
                </span>
                <h3 className="mt-4 text-lg font-bold text-navy-900">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <motion.div {...blaze()} className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-gold-600">Our Sections</p>
          <h2 className="mt-2 text-3xl font-extrabold text-navy-900">One Family, Two Schools</h2>
        </motion.div>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {[
            { icon: SchoolIcon, name: 'Witty Primary School', desc: 'A strong foundation in literacy, numeracy, Islamic values and character from Early Years to Grade 6.', color: 'from-emerald-600 to-teal-700', fill: 'bg-teal-700' },
            { icon: GraduationCap, name: 'Witty Secondary School', desc: 'JSS to SS — WAEC & NECO-ready learners, trained in sciences, humanities, commerce, Islamic and Arabic studies.', color: 'from-navy-600 to-navy-900', fill: 'bg-navy-700' },
          ].map((s, i) => (
            <motion.div key={s.name} {...blaze(i)} className="group overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-card transition-all duration-300 hover:shadow-lift">
              <div className={`bg-gradient-to-br ${s.color} p-8 text-white`}>
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/15 backdrop-blur">
                  <s.icon size={28} className="text-gold-400" />
                </span>
                <h3 className="mt-5 text-2xl font-extrabold">{s.name}</h3>
                <p className="mt-2 max-w-md text-sm text-white/80">{s.desc}</p>
              </div>
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-navy-700">
                  <GraduationCap size={16} className="text-gold-500" /> Fully integrated on the same portal
                </div>
                <span className="rounded-full bg-cream-100 px-3 py-1 text-xs font-bold text-navy-700">
                  {i === 0 ? 'Foundation' : 'WAEC • NECO'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-navy-950 py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2">
          <motion.div {...blaze()}>
            <div className="flex items-center gap-2 text-gold-400">
              <Newspaper size={20} /><h3 className="text-xl font-extrabold">News & Announcements</h3>
            </div>
            <div className="mt-6 space-y-4">
              {newsLoading && (
                <p className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-cream-100/60">Loading latest updates…</p>
              )}
              {!newsLoading && !announcements.length && (
                <p className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-cream-100/60">No announcements yet. Check back soon.</p>
              )}
              {announcements.map((a) => (
                <div key={a.id} className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10">
                  <div className="flex items-center gap-2 text-xs text-gold-400">
                    <Megaphone size={14} /> {a.tag} • {(a.date || '').split(',')[0]}
                  </div>
                  <h4 className="mt-2 font-bold">{a.title}</h4>
                  <p className="mt-1 truncate text-sm text-cream-100/60">{a.message}</p>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div {...blaze(1)}>
            <div className="flex items-center gap-2 text-gold-400">
              <CalendarDays size={20} /><h3 className="text-xl font-extrabold">Upcoming Events</h3>
            </div>
            <div className="mt-6 space-y-4">
              {newsLoading && (
                <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-cream-100/60">Loading upcoming events…</p>
              )}
              {!newsLoading && !events.length && (
                <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-cream-100/60">No upcoming events scheduled.</p>
              )}
              {events.map((e) => (
                <div key={e.id} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10">
                  <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${eventTone[e.type] || 'bg-navy-600'} font-bold`}>
                    {(e.date || '').split(' ')[0] || '—'}
                  </span>
                  <div>
                    <h4 className="font-bold">{e.title}</h4>
                    <p className="text-sm text-cream-100/60">
                      {[e.description, e.location].filter(Boolean).join(' • ') || 'School event'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <motion.div {...blaze()} className="rounded-3xl border border-navy-100 bg-gradient-to-br from-cream-50 to-cream-100 p-10 text-center shadow-card">
          <h2 className="text-2xl font-extrabold text-navy-900 sm:text-3xl">Ready to Give Your Child the Witty Advantage?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Join a school where faith and scholarship flourish together. Admissions are open for the {school.session} session.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/register" className="inline-flex items-center gap-2 rounded-xl bg-navy-800 px-7 py-3 font-bold text-white shadow-lg shadow-navy-800/25 transition hover:bg-navy-900 active:scale-95">
              Register Now <ArrowRight size={18} />
            </Link>
            <div className="inline-flex items-center gap-6 rounded-xl border border-navy-100 bg-white px-6 py-3 text-sm text-navy-800">
              <span className="flex items-center gap-2"><Phone size={15} className="text-gold-600" /> {school.phones.join(' • ')}</span>
              <span className="flex items-center gap-2"><Mail size={15} className="text-gold-600" /> {school.email}</span>
              <span className="hidden items-center gap-2 md:flex"><MapPin size={15} className="text-gold-600" /> {school.location}</span>
            </div>
          </div>
        </motion.div>
      </section>

      <SiteFooter />
    </div>
  )
}