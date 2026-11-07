import { useEffect } from 'react'
import { MotionConfig } from 'framer-motion'
import { Navigate, useParams } from 'react-router-dom'
import BrandSystem from '../components/case/BrandSystem'
import ProjectHeader from '../components/case/ProjectHeader'
import ProjectNavigation from '../components/case/ProjectNavigation'
import ProjectStory from '../components/case/ProjectStory'
import ShowcaseGrid from '../components/case/ShowcaseGrid'
import BeforeAfter from '../components/case/BeforeAfter'
import ProcessStrip from '../components/case/ProcessStrip'
import ReadingProgress from '../components/case/ReadingProgress'
import { Link } from 'react-router-dom'
import { composeProject } from '../data/projectsData'
import { useContent, useProjectPages } from '../data/useContent'
import { useUi } from '../i18n/ui'

const TYPEKIT_SLUG = 'casa-ricardo'
// Peso de los títulos cuando la tipografía del proyecto no es Quicksand Bold.
const HEADING_WEIGHT = { 'identidad-visual': 600, 'casa-ricardo': 400 }

/** Caso de estudio de cada proyecto: una sola plantilla (portada, historia, sistema de marca, aplicaciones, navegación), con su tipografía. */
export default function ProjectPage() {
  const { slug } = useParams()
  const { projects, featuredProjects, toolLabels } = useContent()
  const { projectPages, projectFonts } = useProjectPages()
  const t = useUi()
  const page = projectPages[slug]

  const typekit = slug === TYPEKIT_SLUG ? projectPages[TYPEKIT_SLUG].typekit : null

  // Ella Roman y Depot New vienen de Adobe Fonts.
  useEffect(() => {
    if (!typekit) return undefined
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = typekit
    document.head.appendChild(link)
    return () => link.remove()
  }, [typekit])

  if (!page) return <Navigate to="/proyectos" replace />

  const fonts = projectFonts[slug]
  const project = featuredProjects.find((p) => p.slug === slug)
  const vars = { '--font-sans': fonts.body, '--font-serif': fonts.heading, '--font-display': fonts.heading, '--cs-heading': fonts.heading, '--cs-heading-weight': HEADING_WEIGHT[slug] ?? 700 }
  const name = project?.name ?? page.title
  const parts = composeProject(slug, page, project, t)
  const paragraphs = page.video ? [page.intro.lead, page.intro.text] : page.story
  const specimens = page.typographyPair ?? (page.typography ? [page.typography] : [])
  const L = page.labels

  return (
    <MotionConfig reducedMotion="user">
      <main className="cs" style={vars} data-project={slug}>
        <ReadingProgress />
        <ProjectHeader name={name} project={project} page={page} hero={parts.hero} toolLabels={toolLabels} t={t} />
        <ProjectStory title={L.story} paragraphs={paragraphs} band={parts.band} keys={t.storyKeys} />
        {page.process && <ProcessStrip process={page.process} />}
        {page.comparison && <BeforeAfter cmp={page.comparison} label={t.antesDespues} />}
        {parts.logo && <BrandSystem slug={slug} page={page} parts={parts} specimens={specimens} t={t} />}
        <section className="cs-section">
          <div className="cs-wrap"><h2 className="cs-heading">{L.applications}</h2></div>
          <div className="cs-wrap cs-block"><ShowcaseGrid blocks={parts.applications} /></div>
        </section>
        {page.manual && (
          <section className="cs-section">
            <div className="cs-wrap cs-manual">
              <Link to={`/proyectos/${slug}/manual`} className="cs-btn-outline">{t.verManual} <span className="cs-btn-note">({t.manualNota})</span> →</Link>
            </div>
          </section>
        )}
        <section className="cs-cta-band">
          <div className="cs-wrap cs-cta-inner">
            <div>
              <h2 className="cs-cta-title">{t.cierreTitulo}</h2>
              <p className="cs-cta-text">{t.cierreTexto}</p>
            </div>
            <Link to="/contacto" className="cs-cta-btn cs-cta-btn--lilac">{t.cierreBoton} →</Link>
          </div>
        </section>
        <ProjectNavigation slug={slug} projects={projects} t={t} />
      </main>
    </MotionConfig>
  )
}
