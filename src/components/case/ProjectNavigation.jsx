import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

/** Cierre sobrio: proyecto anterior y siguiente, dando la vuelta en los extremos. */
export default function ProjectNavigation({ slug, projects, t }) {
  const i = projects.findIndex((p) => p.slug === slug)
  const prev = projects[(i - 1 + projects.length) % projects.length]
  const next = projects[(i + 1) % projects.length]
  return (
    <nav aria-label={t.otrosProyectos} className="cs-wrap">
      <div className="cs-pager">
        <Link to={`/proyectos/${prev.slug}`} className="cs-pager-link">
          <span className="cs-pager-label"><ArrowLeft size={14} strokeWidth={1.5} /> {t.proyectoAnterior}</span>
          <span className="cs-pager-name">{prev.name}</span>
        </Link>
        <Link to={`/proyectos/${next.slug}`} className="cs-pager-link cs-pager-link--next">
          <span className="cs-pager-label">{t.proyectoSiguiente} <ArrowRight size={14} strokeWidth={1.5} /></span>
          <span className="cs-pager-name">{next.name}</span>
        </Link>
      </div>
    </nav>
  )
}
