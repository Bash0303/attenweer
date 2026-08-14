import { motion } from 'framer-motion'

export default function StatCard({ icon: Icon, label, value, sub, tone = 'navy', index = 0 }) {
  const tones = {
    navy: 'bg-navy-50 text-navy-700',
    gold: 'bg-cream-100 text-gold-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    sky: 'bg-sky-50 text-sky-600',
    rose: 'bg-rose-50 text-rose-600',
    violet: 'bg-violet-50 text-violet-600',
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card"
    >
      <div className="flex items-start justify-between gap-3">
        <div className={`grid h-11 w-11 place-items-center rounded-xl ${tones[tone]}`}>
          <Icon size={22} strokeWidth={2} />
        </div>
        {sub && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600">
            {sub}
          </span>
        )}
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight text-navy-900">{value}</p>
      <p className="mt-0.5 text-sm font-medium text-slate-500">{label}</p>
    </motion.div>
  )
}
