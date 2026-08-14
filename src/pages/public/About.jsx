import { motion } from 'framer-motion'
import { Target, Eye, MapPin, Phone, Mail, Star, Shield, BookOpen } from 'lucide-react'
import SiteNav from '../../components/layout/SiteNav'
import SiteFooter from '../../components/layout/SiteFooter'
import { school, coreValues } from '../../data/mock'

const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, delay: i * 0.08 },
})

const management = [
  { name: 'Alhaji Abdul Kareem', role: 'Proprietor', quote: 'Education is the bridge between faith and the future.' },
  { name: 'Mrs. Aisha Adebayo', role: 'Principal, Secondary School', quote: 'Every child carries a unique gift; we help it shine.' },
  { name: 'Alhaja Safiyyah Bello', role: 'Head of Administration', quote: 'Order, discipline and care — the heartbeat of our school.' },
  { name: 'Mr. Oluwaseun Adeyemi', role: 'Director of Studies', quote: 'We teach minds today, and build leaders for tomorrow.' },
]

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <SiteNav />

      <section className="relative overflow-hidden bg-navy-950 py-20 text-white">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #d9a62e 0%, transparent 40%), radial-gradient(circle at 80% 20%, #2a478e 0%, transparent 45%)' }}
        />
        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="font-arabic text-3xl text-gold-400">
            {school.mottoArabic}
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            About Witty Group of Schools
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="mx-auto mt-4 max-w-2xl text-lg text-cream-100/80">
            An Islamic and Western model of learning — where timeless faith meets world-class academics.
          </motion.p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div {...fadeUp()}>
            <p className="text-sm font-bold uppercase tracking-widest text-gold-600">Who We Are</p>
            <h2 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-navy-900">
              A Twin Heritage of Faith<br /> and Scholarship
            </h2>
            <div className="mt-6 space-y-4 leading-relaxed text-slate-600">
              <p>
                Witty Group of Schools is a distinguished community of learners nestled along Basin Road,
                beside NHIS, Ilorin, Kwara State. We are proud to offer a distinctive blend of an{' '}
                <strong className="text-navy-800">Islamic upbringing</strong> and a{' '}
                <strong className="text-navy-800">Western-standard education</strong> — two streams that
                flow together to cultivate children who are intellectually brilliant, morally upright,
                and spiritually grounded.
              </p>
              <p>
                Guided by our motto, <em className="font-semibold text-navy-800">"Success in Both Worlds"</em>{' '}
                (الفلاح في الدارين — <em>Al-Falah fi al-Darayn</em>), our learners are taught that true
                excellence is measured not only in grades, but in character, worship, integrity, and
                service to humanity. From hafiz to engineer, from poet to scientist — every dream is
                nurtured here.
              </p>
              <p>
                Our competent and caring staff blend modern teaching methods with time-honoured values,
                giving each child tailored guidance that matches their unique academic and moral
                background. We partner closely with parents and guardians, providing the counselling and
                insights they need to support their children at every stage.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {['Nurturing', 'Faith-based', 'Modern', 'Disciplined'].map((t) => (
                <span key={t} className="rounded-full bg-cream-100 px-4 py-1.5 text-sm font-semibold text-navy-800">
                  {t}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div {...fadeUp(1)} className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-navy-100 bg-navy-50/40 p-6">
              <Target className="text-gold-500" size={28} />
              <h3 className="mt-3 text-lg font-bold text-navy-900">Our Mission</h3>
              {school.mission && (
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{school.mission}</p>
              )}
            </div>
            <div className="rounded-2xl border border-navy-100 bg-cream-50 p-6">
              <Eye className="text-gold-500" size={28} />
              <h3 className="mt-3 text-lg font-bold text-navy-900">Our Vision</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{school.vision}</p>
            </div>
            <div className="rounded-2xl border border-navy-100 bg-gold-500/10 p-6">
              <Star className="text-gold-500" size={28} />
              <h3 className="mt-3 text-lg font-bold text-navy-900">Our Motto</h3>
              <p className="mt-2 text-sm font-semibold text-navy-800">{school.motto}</p>
              <p className="mt-1 font-arabic text-lg text-navy-700">{school.mottoArabic}</p>
            </div>
            <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
              <Shield className="text-gold-500" size={28} />
              <h3 className="mt-3 text-lg font-bold text-navy-900">Our Heritage</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Serving families in Ilorin and beyond since {school.established}, uniting Qur'anic excellence with Nigerian curriculum standards.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-cream-100/60 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div {...fadeUp()} className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-gold-600">What We Stand For</p>
            <h2 className="mt-2 text-3xl font-extrabold text-navy-900">Core Values</h2>
          </motion.div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((v, i) => (
              <motion.div
                key={v.title}
                {...fadeUp(i)}
                className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-navy-800 text-gold-400">
                  {i === 0 && <Star size={22} />}
                  {i === 1 && <BookOpen size={22} />}
                  {i === 2 && <Shield size={22} />}
                  {i === 3 && <Target size={22} />}
                </span>
                <p className="mt-4 font-arabic text-2xl text-gold-500">{v.ar}</p>
                <h3 className="text-lg font-bold text-navy-900">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <motion.div {...fadeUp()} className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-gold-600">Our Leaders</p>
          <h2 className="mt-2 text-3xl font-extrabold text-navy-900">Management Team</h2>
        </motion.div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {management.map((m, i) => (
            <motion.div
              key={m.name}
              {...fadeUp(i)}
              className="rounded-2xl border border-navy-100 bg-white p-6 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-navy-700 to-navy-900 font-bold text-white">
                {m.name.split(' ').slice(0, 2).map((x) => x[0]).join('')}
              </span>
              <h3 className="mt-4 font-bold text-navy-900">{m.name}</h3>
              <p className="text-sm font-medium text-gold-600">{m.role}</p>
              <p className="mt-3 text-sm italic leading-relaxed text-slate-500">"{m.quote}"</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-navy-950 py-20 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div {...fadeUp()} className="text-center">
            <h2 className="text-3xl font-extrabold">Visit Us Today</h2>
            <p className="mt-2 text-cream-100/70">We would be delighted to welcome you to our campus.</p>
          </motion.div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { icon: MapPin, label: 'Our Address', value: school.location },
              { icon: Phone, label: 'Call Us', value: school.phones.join(' • ') },
              { icon: Mail, label: 'Email Us', value: school.email },
            ].map((c, i) => (
              <motion.div key={c.label} {...fadeUp(i)} className="rounded-2xl bg-white/5 p-6 text-center backdrop-blur">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-gold-500 text-navy-950">
                  <c.icon size={22} />
                </span>
                <h3 className="mt-4 font-bold">{c.label}</h3>
                <p className="mt-1 text-sm text-cream-100/70">{c.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}