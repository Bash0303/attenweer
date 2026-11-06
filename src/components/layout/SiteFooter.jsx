import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin } from 'lucide-react'
import { school } from '../../data/mock'
import logo from '../../assets/atenweer logo .png'

export default function SiteFooter() {
  return (
    <footer className="bg-navy-950 text-cream-100">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-xl bg-white/10">
              <img src={logo} alt={`${school.name} logo`} className="h-9 w-9 object-contain" />
            </span>
            <span className="text-lg font-extrabold">Attenweer Schools</span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-cream-100/70">
            {school.mission}
          </p>
          <p className="mt-4 font-arabic text-xl text-gold-400">{school.mottoArabic}</p>
          <p className="text-sm italic text-cream-100/70">{school.mottoArabicPlain}</p>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-gold-400">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              ['Home', '/'],
              ['About Us', '/about'],
              ['Admission', '/admission'],
              ['Portal', '/login'],
              ['e-Exam', '/e-exam'],
              ['Gallery', '/gallery'],
              ['Contact', '/contact'],
            ].map(([label, to]) => (
              <li key={label}>
                <Link to={to} className="text-cream-100/70 transition hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-gold-400">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm text-cream-100/70">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-gold-400" /> {school.location}
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="shrink-0 text-gold-400" /> {school.phones.join(' • ')}
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="shrink-0 text-gold-400" /> {school.email}
            </li>
          </ul>
          <div className="mt-4 flex items-center gap-3 text-xs">
            <span className="rounded-full bg-white/10 px-3 py-1.5 font-semibold">Shirt: {school.uniform.shirt}</span>
            <span className="rounded-full bg-white/10 px-3 py-1.5 font-semibold">Trouser: {school.uniform.trouser}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-cream-100/50">
        © {new Date().getFullYear()} {school.name}. All rights reserved. {school.shortName} • {school.motto}
      </div>
    </footer>
  )
}