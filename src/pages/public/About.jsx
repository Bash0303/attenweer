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

const leadership = [
  {
    name: 'Abdullah Ibrahim Shege',
    role: 'Director General, Attenweer Schools',
    quote: 'All children are precious and unique, and education is the best way to ensure each and every one of them achieves the very best that they are capable of.',
  },
  {
    name: 'Islamic Enlightenment Foundation of Nigeria',
    role: 'Founding Organisation',
    quote: 'A registered non-governmental organization dedicated to educational development and moral reorientation.',
  },
  {
    name: 'Attenweer Schools',
    role: 'Established 18th September 2023',
    quote: 'Providing quality education at subsidized fees, ensuring accessibility for both the rich and the poor within the society.',
  },
]

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <SiteNav />

      <section className="relative overflow-hidden bg-navy-950 py-20 text-white">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #e67f39 0%, transparent 40%), radial-gradient(circle at 80% 20%, #4faa70 0%, transparent 45%)' }}
        />
        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="font-arabic text-3xl text-gold-400">
            {school.mottoArabic}
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            About Attenweer Schools
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="mx-auto mt-4 max-w-3xl text-lg text-cream-100/80">
            A co-educational institution committed to nurturing knowledgeable, morally upright and confident learners
            through a balanced blend of Islamic and Western education.
          </motion.p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div {...fadeUp()}>
            <p className="text-sm font-bold uppercase tracking-widest text-gold-600">Who We Are</p>
            <h2 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-navy-900">
              A Balanced Blend of Faith<br /> and Scholarship
            </h2>
            <div className="mt-6 space-y-4 leading-relaxed text-slate-600">
              <p>
                Attenweer Schools is a co-educational institution committed to nurturing knowledgeable, morally
                upright, and confident learners through a balanced blend of Islamic and Western education. The school
                is located at No. 194, beside Kwara State Television Station, Old Jebba Road, Yakuba, Ilorin East
                Local Government Area of Kwara State.
              </p>
              <p>
                The foundation of Attenweer Schools is built on the belief that true success is achieved through
                knowledge guided by sound morals and values. Our educational approach is inspired by the teachings of
                the Qur&rsquo;an and Sunnah, combined with a strong academic curriculum that prepares learners for
                both worldly excellence and responsible citizenship.
              </p>
              <p>
                The school was established on 18th September 2023 by the Islamic Enlightenment Foundation of Nigeria,
                a registered non-governmental organization dedicated to educational development and moral
                reorientation. Since inception, the school has remained focused on providing quality education at
                subsidized fees, ensuring accessibility for both the rich and the poor within the society.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {['Islamic', 'Western', 'Faith-based', 'Disciplined'].map((t) => (
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
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{school.mission}</p>
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
              <h3 className="mt-3 text-lg font-bold text-navy-900">Our Philosophy</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{school.philosophy}</p>
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
          <p className="text-sm font-bold uppercase tracking-widest text-gold-600">Our Story</p>
          <h2 className="mt-2 text-3xl font-extrabold text-navy-900">Leadership & Foundation</h2>
        </motion.div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {leadership.map((m, i) => (
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
              <p className="mt-3 text-sm italic leading-relaxed text-slate-500">&ldquo;{m.quote}&rdquo;</p>
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
