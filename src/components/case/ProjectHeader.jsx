import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Media } from './ShowcaseGrid'

function Credits({ project, page, toolLabels, t }) {
  const rows = [
    project?.category && [t.categoria, project.category],
    page.context && [t.contexto, page.context],
    [t.herramientas, page.tools.map((x) => toolLabels[x]).join(', ')],
  ].filter(Boolean)
  return (
    <dl className="cs-credits">
      {rows.map(([k, v]) => (
        <div key={k}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  )
}

/** Cabecera: título, frase y ficha técnica centrados, la imagen principal debajo. */
export default function ProjectHeader({ name, project, page, hero, toolLabels, t }) {
  return (
    <header className="cs-hero">
      {page.cover && (
        <div className={`cs-cover${page.cover.contain ? ' cs-cover--logo' : ''}`}>
          <img src={page.cover.desktop} alt={page.cover.alt} />
        </div>
      )}
      <div className="cs-wrap">
        <Link to="/proyectos" className="cs-back"><ArrowLeft size={14} strokeWidth={1.5} /> {t.proyectos}</Link>
        <div className="cs-hero-copy">
          <h1 className="cs-title">{name}</h1>
          {project?.concept && <p className="cs-concept">{project.concept}</p>}
          <Credits project={project} page={page} toolLabels={toolLabels} t={t} />
        </div>
        </div>
      {hero && !page.cover && <div className="cs-wrap cs-hero-media"><Media item={hero} eager /></div>}
    </header>
  )
}
