import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowRight, GraduationCap, School as SchoolIcon, BookOpen, HeartHandshake, Shield,
  Star, Megaphone, CalendarDays, MapPin, Phone, Mail, Users, Sparkles, Award, Target, Moon, Newspaper,
  Quote, Trophy, CheckCircle2,
} from 'lucide-react'
import SiteNav from '../../components/layout/SiteNav'
import SiteFooter from '../../components/layout/SiteFooter'
import { school } from '../../data/mock'
import { site } from '../../services/api'
import heroImg from '../../assets/attenweer school.png'
import classroomImg from '../../assets/Focused Classroom Learning.png'

const blaze = (i = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, delay: i * 0.08 },
})

const whyChoose = [
  { icon: Moon, title: 'Islamic & Western Education', desc: 'A balanced blend of Qur\'anic and Western education under one roof.' },
  { icon: Users, title: 'Caring, Qualified Staff', desc: 'Dedicated, experienced and compassionate educators.' },
  { icon: Shield, title: 'Safe & Disciplined', desc: 'A secure, orderly and moral learning environment parents can trust.' },
  { icon: Target, title: 'Moral & Academic Excellence', desc: 'Knowledge guided by sound morals, values and responsible citizenship.' },
  { icon: HeartHandshake, title: 'Affordable Quality', desc: 'Quality education at subsidized fees for rich and poor alike.' },
  { icon: BookOpen, title: 'Broad Curriculum', desc: 'From Pre-Nursery through Junior and Senior Secondary School.' },
]

const activities = [
  {
    icon: BookOpen,
    title: 'Academic Enrichment',
    items: ['Debate and Public Speaking', 'Quiz and Academic Competitions', 'Spelling Bee', 'Science and Mathematics Club', 'ICT and Coding Activities'],
  },
  {
    icon: Moon,
    title: 'Moral and Religious Development',
    items: ['Qur\'an Recitation and Memorization', 'Islamic Studies Competitions', 'Moral Instruction Sessions'],
  },
  {
    icon: Trophy,
    title: 'Sports and Physical Development',
    items: ['Football', 'Athletics', 'Physical Fitness Activities', 'Inter-House Sports'],
  },
]

const levels = ['Pre-Nursery', 'Nursery', 'Basic Education', 'Junior Secondary School', 'Senior Secondary School']

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
          style={{ background: 'radial-gradient(circle at 50% 45%, rgba(8,36,22,0.42) 0%, rgba(8,36,22,0.92) 80%)' }}
        />
        <div className="absolute inset-0 hidden lg:block"
          style={{ background: 'linear-gradient(100deg, rgba(8,36,22,0.96) 0%, rgba(8,36,22,0.85) 45%, rgba(8,36,22,0.48) 72%, rgba(8,36,22,0.25) 100%)' }}
        />
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:py-24">
          <div>
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-gold-400 backdrop-blur">
              <Sparkles size={14} /> Since {school.established} • Old Jebba Road, Ilorin
            </motion.span>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
              Welcome to<br />Attenweer <span className="text-gold-400">Schools</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="mt-5 max-w-xl text-lg leading-relaxed text-cream-100/80">
              {school.tagline}. A co-educational institution nurturing knowledgeable, morally upright and confident learners.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mt-8 flex flex-wrap gap-4">
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-xl bg-gold-500 px-6 py-3 font-bold text-navy-950 shadow-lg shadow-gold-500/30 transition hover:bg-gold-400 active:scale-95">
                Contact Us <ArrowRight size={18} />
              </Link>
              <Link to="/about" className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3 font-bold text-white backdrop-blur transition hover:bg-white/20 active:scale-95">
                About Us
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-cream-100/70">
              <span className="inline-flex items-center gap-2"><Award size={16} className="text-gold-400" /> Islamic & Western Education</span>
              <span className="inline-flex items-center gap-2"><GraduationCap size={16} className="text-gold-400" /> Nursery to Senior Secondary</span>
              <span className="inline-flex items-center gap-2"><Star size={16} className="text-gold-400" /> {school.motto}</span>
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
              <p className="text-xs font-semibold uppercase tracking-wide">Established</p>
              <p className="text-sm font-extrabold">{school.founded}</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <motion.div {...blaze()} className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-gold-600">Welcome to Attenweer Schools</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">Knowledge Guided by Sound Morals</h2>
          <p className="mx-auto mt-4 max-w-3xl leading-relaxed text-slate-600">
            Attenweer Schools is a co-educational institution committed to nurturing knowledgeable, morally upright,
            and confident learners through a balanced blend of Islamic and Western education. The school is located at
            No. 194, beside Kwara State Television Station, Old Jebba Road, Yakuba, Ilorin East Local Government Area
            of Kwara State.
          </p>
          <p className="mx-auto mt-3 max-w-3xl leading-relaxed text-slate-600">
            The foundation of Attenweer Schools is built on the belief that true success is achieved through knowledge
            guided by sound morals and values. Our educational approach is inspired by the teachings of the Qur&rsquo;an
            and Sunnah, combined with a strong academic curriculum that prepares learners for both worldly excellence
            and responsible citizenship.
          </p>
          <p className="mx-auto mt-3 max-w-3xl leading-relaxed text-slate-600">
            The school was established on 18th September 2023 by the Islamic Enlightenment Foundation of Nigeria, a
            registered non-governmental organization dedicated to educational development and moral reorientation.
            Since inception, the school has remained focused on providing quality education at subsidized fees,
            ensuring accessibility for both the rich and the poor within the society.
          </p>
        </motion.div>

        <motion.blockquote {...blaze(1)} className="mx-auto mt-10 max-w-3xl rounded-3xl border border-navy-100 bg-cream-50 p-8 text-center shadow-card">
          <Quote className="mx-auto text-gold-500" size={30} />
          <p className="mt-4 text-xl font-semibold italic leading-relaxed text-navy-800">
            &ldquo;Seeking knowledge is an obligation upon every Muslim.&rdquo;
          </p>
          <footer className="mt-3 text-sm font-bold uppercase tracking-widest text-gold-600">Prophet Muhammad &#65018;</footer>
        </motion.blockquote>
      </section>

      <section className="bg-cream-100/60 py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
          <motion.div {...blaze()} className="overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-lift">
            <img src={classroomImg} alt="Attenweer Schools students learning in class" className="h-full w-full object-cover" />
          </motion.div>
          <motion.div {...blaze(1)}>
            <p className="text-sm font-bold uppercase tracking-widest text-gold-600">Learning at Attenweer</p>
            <h2 className="mt-2 text-3xl font-extrabold text-navy-900">A Balanced Education for Every Child</h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              Every child is precious and unique. Our learners grow in knowledge, faith and character in a caring
              environment where academic excellence is combined with strong moral and Islamic values.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              {[
                'Qualified and compassionate teachers',
                'Arabic, Islamic studies and quality Western education',
                'Character building and co-curricular activities',
                'A disciplined, safe and nurturing learning environment',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-navy-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/about" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-navy-700 px-6 py-3 font-bold text-white shadow-lg shadow-navy-700/25 transition hover:bg-navy-800 active:scale-95">
              Learn More About Us <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <motion.div {...blaze()} className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-gold-600">Why Choose Us</p>
          <h2 className="mt-2 text-3xl font-extrabold text-navy-900">The Attenweer Advantage</h2>
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
      </section>

      <section className="bg-navy-950 py-20 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div {...blaze()} className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-gold-400">Beyond the Classroom</p>
            <h2 className="mt-2 text-3xl font-extrabold">Our Co-curricular Activities</h2>
          </motion.div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {activities.map((activity, i) => (
              <motion.div key={activity.title} {...blaze(i)} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold-500 text-navy-950">
                  <activity.icon size={22} />
                </span>
                <h3 className="mt-4 text-lg font-bold">{activity.title}</h3>
                <ul className="mt-3 space-y-2 text-sm text-cream-100/70">
                  {activity.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <motion.div {...blaze()} className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-gold-600">Admissions</p>
          <h2 className="mt-2 text-3xl font-extrabold text-navy-900">Our Academic Levels</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Attenweer Schools welcomes pupils and students into various academic levels in a safe, disciplined and
            nurturing environment.
          </p>
        </motion.div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {levels.map((level, i) => (
            <motion.div key={level} {...blaze(i)} className="rounded-2xl border border-navy-100 bg-white p-5 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-navy-50 text-navy-700">
                <SchoolIcon size={22} />
              </span>
              <h3 className="mt-4 text-sm font-bold text-navy-900">{level}</h3>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/admission" className="inline-flex items-center gap-2 rounded-xl bg-gold-500 px-6 py-3 font-bold text-navy-950 shadow-lg shadow-gold-500/30 transition hover:bg-gold-400 active:scale-95">
            View Admission Details <ArrowRight size={18} />
          </Link>
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

      <section id="contact" className="mx-auto max-w-7xl px-6 py-20">
        <motion.div {...blaze()} className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-gold-600">Get in Touch</p>
          <h2 className="mt-2 text-3xl font-extrabold text-navy-900">Contact Us</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            For enquiries, admissions or further information, please contact us using the details below.
          </p>
        </motion.div>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {[
            { icon: MapPin, label: 'Address', value: school.location },
            { icon: Phone, label: 'Phone', value: school.phones.join(' or ') },
            { icon: Mail, label: 'Email', value: school.email },
          ].map((c, i) => (
            <motion.div key={c.label} {...blaze(i)} className="rounded-2xl border border-navy-100 bg-white p-6 text-center shadow-card">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-navy-800 text-gold-400">
                <c.icon size={22} />
              </span>
              <h3 className="mt-4 font-bold text-navy-900">{c.label}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{c.value}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href="https://wa.me/23470636179685" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500 active:scale-95">
            Chat on WhatsApp
          </a>
          <a href={`tel:${school.phones[0]}`} className="inline-flex items-center gap-2 rounded-xl bg-navy-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-navy-700/25 transition hover:bg-navy-800 active:scale-95">
            <Phone size={16} /> Call Us {school.phones[0]}
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <motion.div {...blaze()} className="rounded-3xl border border-navy-100 bg-gradient-to-br from-cream-50 to-cream-100 p-10 text-center shadow-card">
          <h2 className="text-2xl font-extrabold text-navy-900 sm:text-3xl">Ready to Give Your Child the Attenweer Advantage?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Join a school where faith and scholarship flourish together. Admissions are open for the {school.session} session.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/register" className="inline-flex items-center gap-2 rounded-xl bg-navy-800 px-7 py-3 font-bold text-white shadow-lg shadow-navy-800/25 transition hover:bg-navy-900 active:scale-95">
              Register Now <ArrowRight size={18} />
            </Link>
            <div className="inline-flex flex-wrap items-center justify-center gap-6 rounded-xl border border-navy-100 bg-white px-6 py-3 text-sm text-navy-800">
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
