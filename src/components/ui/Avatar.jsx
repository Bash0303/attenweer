export default function Avatar({ initials, color = 'bg-navy-600', size = 'md' }) {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-lg',
    xl: 'h-20 w-20 text-2xl',
  }
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full font-bold text-white ${color} ${sizes[size]}`}
    >
      {initials}
    </span>
  )
}