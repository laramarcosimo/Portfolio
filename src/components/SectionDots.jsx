import { sectionIds } from '../data/content'

/** Indicadores de paginación de página: un punto por sección, el activo en navy. */
export default function SectionDots({ current, className = '' }) {
  return (
    <nav aria-label="Secciones" className={`flex items-center justify-center gap-1 ${className}`}>
      {sectionIds.map((id) => (
        <a key={id} href={`#${id}`} aria-label={id} aria-current={id === current} className="grid h-6 w-6 place-items-center">
          <span
            className={`block rounded-full transition-all ${
              id === current ? 'h-2.5 w-6 bg-navy' : 'h-2 w-2 bg-navy/25 hover:bg-sky'
            }`}
          />
        </a>
      ))}
    </nav>
  )
}
