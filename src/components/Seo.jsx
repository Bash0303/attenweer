import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const base = 'Witty Group of Schools'
const site = 'https://wittyacademy.com'
const logo = `${site}/logo.jpeg`

const metas = {
  '/': { title: `${base} | Secondary School Portal — Ilorin`, description: 'Islamic and Western academy — Success in both Worlds. Basin Road, Beside NHIS, Ilorin, Kwara State.' },
  '/about': { title: `About Us | ${base}`, description: 'Established 2023, Witty Group of Schools unites Qur\'anic excellence with the Nigerian curriculum. Learn about our mission and vision.' },
  '/register': { title: `Admission Registration | ${base}`, description: 'Admissions are open for the 2025/2026 session. Register your ward at Witty Group of Schools, Ilorin.' },
  '/login': { title: `Portal Login | ${base}`, description: 'Students, parents and staff sign in to the Witty Group of Schools portal.' },
  '/admin': { title: `Admin Portal | ${base}`, description: 'Welcome to the Witty Group of Schools administration dashboard.' },
  '/teacher': { title: `Teacher Portal | ${base}`, description: 'Welcome to the Witty Group of Schools teacher portal.' },
  '/student': { title: `Student Portal | ${base}`, description: 'Welcome to the Witty Group of Schools student portal.' },
  '/parent': { title: `Parent Portal | ${base}`, description: 'Welcome to the Witty Group of Schools parent portal.' },
}

function titleFor(pathname) {
  const exact = metas[pathname]
  if (exact) return exact
  const role = pathname.startsWith('/admin') ? '/admin' : pathname.startsWith('/teacher') ? '/teacher' : pathname.startsWith('/student') ? '/student' : pathname.startsWith('/parent') ? '/parent' : null
  return role ? metas[role] : { title: `${base} | Secondary School Portal — Ilorin`, description: 'Witty Group of Schools — Islamic and Western education in Ilorin.' }
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