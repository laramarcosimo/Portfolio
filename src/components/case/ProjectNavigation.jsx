import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

// Color de cada proyecto para la tarjeta "siguiente": invita a seguir con su propia identidad
const ACCENT = {
  'marca-personal': { bg: '#9690E4', ink: '#10131A' },
  'identidad-visual': { bg: '#00C896', ink: '#10131A' },
  'casa-ricardo': { bg: '#DB251E', ink: '#FFFFFF' },
  'proyecto-video': { bg: '#192A56', ink: '#FFFFFF' },
}

/** Cierre: proyecto anterior (discreto) y siguiente (con el color de su marca), dando la vuelta en los extremos. */
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
        <Link to={`/proyectos/${next.slug}`} className="cs-pager-link cs-pager-link--next" style={ACCENT[next.slug] && { background: ACCENT[next.slug].bg, color: ACCENT[next.slug].ink }}>
          <span className="cs-pager-label">{t.proyectoSiguiente} <ArrowRight size={14} strokeWidth={1.5} /></span>
          <span className="cs-pager-name">{next.name}</span>
        </Link>
      </div>
    </nav>
  )
}
