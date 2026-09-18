import { sectionIds } from '../data/content'

/** Paginación de página: un punto por sección, el activo en navy (como en la referencia). */
export default function SectionDots({ current, className = '' }) {
  return (
    <nav aria-label="Secciones" className={`flex items-center justify-center gap-0.5 ${className}`}>
      {sectionIds.map((id) => (
        <a key={id} href={`#${id}`} aria-label={id} aria-current={id === current} className="grid h-5 w-5 place-items-center">
          <span className={`block h-1.5 w-1.5 rounded-full transition-colors ${id === current ? 'bg-navy' : 'bg-navy/20 hover:bg-sky'}`} />
        </a>
      ))}
    </nav>
  )
}
