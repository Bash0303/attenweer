const tones = {
  primary: 'bg-navy-700 text-white hover:bg-navy-800 shadow-lg shadow-navy-700/20',
  gold: 'bg-gold-500 text-white hover:bg-gold-600 shadow-lg shadow-gold-500/25',
  outline: 'border border-navy-200 bg-white text-navy-700 hover:bg-navy-50',
  ghost: 'text-navy-600 hover:bg-navy-50',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-600/20',
  emerald: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20',
  white: 'bg-white text-navy-800 hover:bg-cream-100 shadow-lg shadow-navy-900/10',
}

export default function Button({ children, tone = 'primary', size = 'md', className = '', ...props }) {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  }
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 active:scale-95 ${tones[tone]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}