import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn, Images } from 'lucide-react'
import SiteNav from '../../components/layout/SiteNav'
import SiteFooter from '../../components/layout/SiteFooter'

const imageModules = import.meta.glob('../../assets/images/*.{png,jpg,jpeg}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const prettyName = (path) => {
  const file = path.split('/').pop() || ''
  return file
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const images = Object.entries(imageModules)
  .map(([path, url]) => ({ url, name: prettyName(path) }))
  .sort((a, b) => a.name.localeCompare(b.name))

export default function Gallery() {
  const [selected, setSelected] = useState(null)

  return (
    <div className="min-h-screen bg-white">
      <SiteNav />

      <section className="relative overflow-hidden bg-navy-950 py-20 text-white">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #e67f39 0%, transparent 40%), radial-gradient(circle at 80% 20%, #4faa70 0%, transparent 45%)' }}
        />
        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-gold-400 backdrop-blur">
            <Images size={14} /> Our Campus Life
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Gallery
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="mx-auto mt-4 max-w-2xl text-lg text-cream-100/80">
            Moments of learning, faith and growth at Attenweer Schools.
          </motion.p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        {images.length === 0 ? (
          <p className="rounded-2xl border border-navy-100 bg-cream-50 p-8 text-center text-slate-600">
            Gallery images will be available soon.
          </p>
        ) : (
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {images.map((image, i) => (
              <motion.button
                key={image.url}
                type="button"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}
                onClick={() => setSelected(image)}
                className="group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl border border-navy-100 bg-cream-50 text-left shadow-card"
              >
                <img
                  src={image.url}
                  alt={image.name}
                  loading="lazy"
                  className="w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <span className="absolute inset-0 flex items-end bg-gradient-to-t from-navy-950/70 via-navy-950/0 to-transparent p-4 opacity-0 transition group-hover:opacity-100">
                  <span className="flex items-center gap-2 text-sm font-semibold text-white">
                    <ZoomIn size={16} /> {image.name}
                  </span>
                </span>
              </motion.button>
            ))}
          </div>
        )}
      </section>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/95 p-4"
            onClick={() => setSelected(null)}
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Close image"
            >
              <X size={22} />
            </button>
            <motion.figure
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              onClick={(event) => event.stopPropagation()}
              className="max-w-5xl"
            >
              <img src={selected.url} alt={selected.name} className="max-h-[82vh] w-auto rounded-2xl object-contain" />
              <figcaption className="mt-3 text-center text-sm font-semibold text-cream-100/80">{selected.name}</figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>

      <SiteFooter />
    </div>
  )
}
