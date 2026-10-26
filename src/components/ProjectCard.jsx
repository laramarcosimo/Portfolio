import { Link } from 'react-router-dom'
import { useUi } from '../i18n/ui'

/**
 * Tarjeta de proyecto: imagen principal (4:5, esquinas redondeadas) y debajo «Nombre / categoría»
 * con una frase corta. Al pasar el ratón la imagen crece un poco y una línea lavanda se dibuja bajo el nombre.
 */
export default function ProjectCard({ project: p, headingLevel = 'h3' }) {
  const t = useUi()
  const Title = headingLevel
  return (
    <Link to={`/proyectos/${p.slug}`} className="group block" aria-label={t.verNombre(p.name)}>
      <div className="overflow-hidden rounded-2xl bg-fog ring-1 ring-edge">
        <img
          src={p.cover}
          alt={t.portadaDe(p.name)}
          loading="lazy"
          className="aspect-[595/842] w-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
        />
      </div>
      <div className="mt-4">
        <Title className="text-lg font-semibold leading-snug text-ink sm:text-xl">
          <span className="relative">
            {p.name}
            <span
              aria-hidden="true"
              className="absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 rounded-full bg-lilac transition-transform duration-500 group-hover:scale-x-100 group-focus-visible:scale-x-100"
            />
          </span>
          <span className="font-medium text-ink/75"> / {p.category}</span>
        </Title>
        <p className="mt-2 max-w-[42ch] text-[15px] leading-relaxed text-ink/75">{p.concept}</p>
      </div>
    </Link>
  )
}
