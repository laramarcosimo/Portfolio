export default function Button({ as: Tag = 'a', className = '', children, ...props }) {
  return (
    <Tag
      className={`inline-flex items-center gap-2 rounded-full bg-navy px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-navy/20 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-navy/30 ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}
