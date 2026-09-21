export default function Button({ as: Tag = 'a', className = '', children, ...props }) {
  return (
    <Tag
      className={`inline-flex items-center gap-2 rounded-full bg-navy min-h-11 px-6 text-xs font-semibold sm:min-h-0 sm:py-2.5 text-white shadow-md shadow-navy/20 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-navy/30 ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}
