import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import SiteNav from '../../components/layout/SiteNav'
import SiteFooter from '../../components/layout/SiteFooter'
import { school } from '../../data/mock'

const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, delay: i * 0.08 },
})

export default function Contact() {
  return (
    <div className="min-h-screen bg-white">
      <SiteNav />

      <section className="relative overflow-hidden bg-navy-950 py-20 text-white">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #e67f39 0%, transparent 40%), radial-gradient(circle at 80% 20%, #4faa70 0%, transparent 45%)' }}
        />
        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Contact Us
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="mx-auto mt-4 max-w-2xl text-lg text-cream-100/80">
            For enquiries, admissions or further information, please contact us using the details below.
          </motion.p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: MapPin, label: 'Address', value: school.location },
            { icon: Phone, label: 'Phone', value: school.phones.join(' or ') },
            { icon: Mail, label: 'Email', value: school.email },
          ].map((item, i) => (
            <motion.div key={item.label} {...fadeUp(i)} className="rounded-2xl border border-navy-100 bg-white p-8 text-center shadow-card">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-navy-800 text-gold-400">
                <item.icon size={24} />
              </span>
              <h2 className="mt-4 text-lg font-bold text-navy-900">{item.label}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.value}</p>
            </motion.div>
          ))}
        </div>

        <motion.div {...fadeUp(1)} className="mt-12 grid gap-8 rounded-3xl border border-navy-100 bg-cream-50 p-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-gold-600">Need Help?</p>
            <h2 className="mt-2 text-3xl font-extrabold text-navy-900">Admission Enquiries</h2>
            <p className="mt-3 leading-relaxed text-slate-600">
              For enquiries and guidance on admission, please contact the school administration. We are happy to help
              you choose the right class for your child.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="https://wa.me/23470636179685" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-500">
                <MessageCircle size={17} /> Chat on WhatsApp
              </a>
              <a href={`tel:${school.phones[0]}`} className="inline-flex items-center gap-2 rounded-xl bg-navy-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-navy-800">
                <Phone size={17} /> Call Us
              </a>
            </div>
          </div>
          <div className="rounded-2xl bg-navy-950 p-6 text-white">
            <h3 className="text-xl font-extrabold">Admissions are open</h3>
            <p className="mt-2 text-sm leading-relaxed text-cream-100/75">
              Give your child the advantage of a balanced Islamic and Western education at Attenweer Schools.
            </p>
            <Link to="/register" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gold-500 px-5 py-3 text-sm font-bold text-navy-950 transition hover:bg-gold-400 active:scale-95">
              Apply Online <ArrowRight size={17} />
            </Link>
            <p className="mt-5 flex items-start gap-2 text-sm text-cream-100/75">
              <MapPin size={16} className="mt-0.5 shrink-0 text-gold-400" /> {school.location}
            </p>
          </div>
        </motion.div>
      </section>

      <SiteFooter />
    </div>
  )
}
