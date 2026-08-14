export default function Card({ children, className = '', hover = false }) {
  return (
    <div
      className={`rounded-2xl border border-navy-100 bg-white shadow-card ${hover ? 'transition-all duration-300 hover:shadow-lift hover:-translate-y-1' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
