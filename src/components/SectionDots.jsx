import { sectionIds } from '../data/content'

/** Indicadores de paginación de página: un punto por sección, el activo en navy. */
export default function SectionDots({ current, className = '' }) {
  return (
    <nav aria-label="Secciones" className={`z-10 flex items-center justify-center gap-1 ${className}`}>
      {sectionIds.map((id) => (
        <a key={id} href={`#${id}`} aria-label={id} className="grid h-5 w-5 place-items-center">
          <span
            className={`block rounded-full transition-all ${
              id === current ? 'h-2 w-2 bg-navy' : 'h-1.5 w-1.5 bg-navy/20 hover:bg-sky'
            }`}
          />
        </a>
      ))}
    </nav>
  )
}
