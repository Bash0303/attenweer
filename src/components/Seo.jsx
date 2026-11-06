import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const base = 'Attenweer Schools'
const site = 'https://attenweerschools.com'
const logo = `${site}/logo.png`

const metas = {
  '/': { title: `${base} | Islamic & Western Education — Ilorin`, description: 'Attenweer Schools — Knowledge is Success. A co-educational Islamic and Western institution at Old Jebba Road, Yakuba, Ilorin, Kwara State.' },
  '/about': { title: `About Us | ${base}`, description: 'Established 18th September 2023, Attenweer Schools nurtures knowledgeable, morally upright and confident learners through Islamic and Western education.' },
  '/admission': { title: `Admission | ${base}`, description: 'Admissions are open for the 2025/2026 session. Learn about our admission process, available classes and requirements at Attenweer Schools, Ilorin.' },
  '/gallery': { title: `Gallery | ${base}`, description: 'Explore moments of learning, faith and growth at Attenweer Schools, Ilorin.' },
  '/contact': { title: `Contact Us | ${base}`, description: 'Contact Attenweer Schools at No. 194, beside Kwara State Television Station, Old Jebba Road, Yakuba, Ilorin, Kwara State.' },
  '/register': { title: `Admission Registration | ${base}`, description: 'Admissions are open for the 2025/2026 session. Register your ward at Attenweer Schools, Ilorin.' },
  '/login': { title: `Portal Login | ${base}`, description: 'Students, parents and staff sign in to the Attenweer Schools portal.' },
  '/e-exam': { title: `e-Exam Portal | ${base}`, description: 'Sign in to the Attenweer Schools e-Exam portal.' },
  '/forgot-password': { title: `Reset Password | ${base}`, description: 'Reset your Attenweer Schools portal password using a 6-digit email verification code.' },
  '/admin': { title: `Admin Portal | ${base}`, description: 'Welcome to the Attenweer Schools administration dashboard.' },
  '/teacher': { title: `Teacher Portal | ${base}`, description: 'Welcome to the Attenweer Schools teacher portal.' },
  '/student': { title: `Student Portal | ${base}`, description: 'Welcome to the Attenweer Schools student portal.' },
  '/parent': { title: `Parent Portal | ${base}`, description: 'Welcome to the Attenweer Schools parent portal.' },
}

function titleFor(pathname) {
  const exact = metas[pathname]
  if (exact) return exact
  const role = pathname.startsWith('/admin') ? '/admin' : pathname.startsWith('/teacher') ? '/teacher' : pathname.startsWith('/student') ? '/student' : pathname.startsWith('/parent') ? '/parent' : null
  return role ? metas[role] : { title: `${base} | Islamic & Western Education — Ilorin`, description: 'Attenweer Schools — Islamic and Western education in Ilorin.' }
}

export default function Seo() {
  const { pathname } = useLocation()
  useEffect(() => {
    const { title, description } = titleFor(pathname)
    document.title = title
    let el = document.querySelector('meta[name="description"]')
    if (!el) {
      el = document.createElement('meta')
      el.name = 'description'
      document.head.appendChild(el)
    }
    el.content = description

    let og = document.querySelector('meta[property="og:url"]')
    if (og) og.content = `${site}${pathname}`
    let canonical = document.querySelector('link[rel="canonical"]')
    if (canonical) canonical.href = `${site}${pathname}`

    const setMeta = (selector, prop, value) => {
      const el = document.querySelector(selector)
      if (el) el[prop] = value
    }
    setMeta('meta[property="og:image"]', 'content', logo)
    setMeta('meta[name="twitter:image"]', 'content', logo)
    setMeta('meta[property="og:title"]', 'content', title)
    setMeta('meta[name="twitter:title"]', 'content', title)
    setMeta('meta[property="og:description"]', 'content', description)
    setMeta('meta[name="twitter:description"]', 'content', description)
  }, [pathname])
  return null
}
