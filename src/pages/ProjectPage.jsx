import { useEffect, useRef } from 'react'
import { useInView } from 'framer-motion'
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import ColorPanel from '../components/ColorPanel'
import RibbonBanner from '../components/RibbonBanner'
import TypeCatalog from '../components/TypeCatalog'
import Reveal from '../components/Reveal'
import { useContent, useProjectPages } from '../data/useContent'
import { useUi } from '../i18n/ui'

// Vídeo en bucle que se reproduce solo mientras está a la vista.
function LoopVideo({ src, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.4 })
  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (inView) v.play().catch(() => {})
    else v.pause()
  }, [inView])
  return <video ref={ref} src={src} muted loop playsInline preload="metadata" className={className} />
}

const Photo = ({ g, className = '' }) => <img src={g.src} alt={g.alt} loading="lazy" className={`w-full ${className}`} />

function Stationery({ rows }) {
  return (
    <div className="mx-auto max-w-5xl space-y-4 px-5 sm:px-8">
      {rows.map((row, i) =>
        row.pair ? (
          <div key={i} className="grid gap-4 sm:grid-cols-2">
            {row.pair.map((g) => (
              <Photo key={g.src} g={g} className="rounded-[3px] bg-fog object-cover" />
            ))}
          </div>
        ) : row.href ? (
          <a key={i} href={row.href} target="_blank" rel="noreferrer" className="block">
            <Photo g={row.main} className="rounded-[3px] bg-fog" />
          </a>
        ) : (
          <Photo key={i} g={row.main} className="rounded-[3px] bg-fog" />
        ),
      )}
    </div>
  )
}

function ToolsFooter({ page, img, toolLabels, t }) {
  return (
    <div className="mx-auto mt-20 flex max-w-4xl flex-wrap items-start justify-center gap-x-16 gap-y-8 border-t border-ink/10 px-5 pt-10 text-center sm:px-8">
      <div>
        <p className="text-sm font-bold text-ink">{t.hechoCon}</p>
        <div className="mt-3 flex justify-center gap-3">
          {page.tools.map((tool) => (
            <img key={tool} src={img(`tools/${tool}`)} alt={toolLabels[tool]} title={toolLabels[tool]} className="h-10 w-10" />
          ))}
        </div>
      </div>
      {page.webTools && (
        <div>
          <p className="text-sm font-bold text-ink">
            <a href={page.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 underline decoration-sky decoration-2 underline-offset-4 hover:text-lilac">
              {t.webHechaCon} <ExternalLink size={13} />
            </a>
          </p>
          <div className="mt-3 flex justify-center gap-3">
            {page.webTools.map((t) => (
              <span key={t} className="grid h-10 w-10 place-items-center rounded-lg bg-navy text-xs font-bold text-white">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Navegación al final de cada proyecto: anterior / siguiente (según el orden del listado de proyectos)
function ProjectNav({ slug, projects, t }) {
  const i = projects.findIndex((p) => p.slug === slug)
  const prev = projects[i - 1]
  const next = projects[i + 1]

  // Función de renderizado (no un componente definido dentro del render)
  const renderCard = (p, dir) => (
    <Link
      to={`/proyectos/${p.slug}`}
      className={`group flex items-center gap-3 rounded-2xl border border-ink/10 p-2.5 transition hover:border-lilac hover:shadow-lg hover:shadow-edge/70 sm:gap-4 sm:p-3 ${
        dir === 'next' ? 'flex-row-reverse text-right' : ''
      }`}
    >
      <img src={p.cover} alt="" loading="lazy" className="aspect-[3/4] h-16 shrink-0 rounded-lg object-cover object-top ring-1 ring-edge sm:h-20" />
      <span className="min-w-0 flex-1">
        <span className={`flex items-center gap-1 text-[11px] font-semibold text-ink/55 ${dir === 'next' ? 'justify-end' : ''}`}>
          {dir === 'prev' && <ArrowLeft size={13} />}
          {dir === 'prev' ? t.proyectoAnterior : t.proyectoSiguiente}
          {dir === 'next' && <ArrowRight size={13} />}
        </span>
        <span className="mt-0.5 block truncate text-sm font-semibold tracking-tight text-ink group-hover:text-lilac sm:text-base">{p.name}</span>
      </span>
    </Link>
  )

  // En los extremos (no hay anterior o siguiente) se ofrece volver al listado de proyectos
  const renderBack = (dir) => (
    <Link
      to="/proyectos"
      className={`group flex min-h-[5.5rem] items-center gap-3 rounded-2xl border border-ink/10 px-4 transition hover:border-lilac hover:shadow-lg hover:shadow-edge/70 sm:gap-4 ${
        dir === 'next' ? 'flex-row-reverse text-right' : ''
      }`}
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-fog text-ink transition group-hover:bg-navy group-hover:text-white">
        {dir === 'next' ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
      </span>
      <span className="text-sm font-semibold tracking-tight text-ink group-hover:text-lilac sm:text-base">{t.volverAProyectos}</span>
    </Link>
  )

  return (
    <nav aria-label={t.otrosProyectos} className="mx-auto mt-16 max-w-5xl px-5 sm:px-8">
      <div className="h-px w-full bg-gradient-to-r from-ink/20 via-sky/60 to-lilac/50" aria-hidden="true" />
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {prev ? renderCard(prev, 'prev') : renderBack('prev')}
        {next ? renderCard(next, 'next') : renderBack('next')}
      </div>
    </nav>
  )
}

/** Página de un proyecto: portada, explicación, vídeos, identidad de color, tipografía y mockups. */
export default function ProjectPage() {
  const { slug } = useParams()
  const { img, projects, toolLabels } = useContent()
  const { projectPages, projectFonts } = useProjectPages()
  const t = useUi()
  const page = projectPages[slug]

  // Casa Ricardo usa fuentes de Adobe Fonts (Typekit), como en la web original
  useEffect(() => {
    if (!page?.typekit) return undefined
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = page.typekit
    document.head.appendChild(link)
    return () => link.remove()
  }, [page])

  if (!page) return <Navigate to="/proyectos" replace />

  // Las variables de fuente de Tailwind se redefinen solo dentro de esta página
  const fonts = projectFonts[slug]

  return (
    <main className="font-sans" style={{ '--font-sans': fonts.body, '--font-serif': fonts.heading, '--font-display': fonts.heading }}>
      <RibbonBanner height={150} />

      <div className="mx-auto max-w-5xl px-5 pt-8 sm:px-8">
        <Link to="/proyectos" className="inline-flex items-center gap-2 text-xs font-semibold text-ink hover:text-lilac" title={t.volverAProyectos}>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-fog">
            <ArrowLeft size={16} />
          </span>
          {t.proyectos}
        </Link>
        <h1 className="mt-4 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">{page.title}</h1>
      </div>

      {/* Proyecto de vídeo */}
      {page.video && (
        <section className="mx-auto max-w-4xl px-5 py-14 sm:px-8">
          <Reveal>
            <p className="max-w-2xl text-base leading-relaxed text-ink/85">
              <strong className="text-ink">{page.intro.lead}</strong>
              <br />
              {page.intro.text}
            </p>
          </Reveal>
          <video src={page.video} poster={page.poster} controls playsInline preload="metadata" className="mt-10 w-full rounded-[3px] bg-navy shadow-xl shadow-navy/20" />
          <ToolsFooter page={page} img={img} toolLabels={toolLabels} t={t} />
        </section>
      )}

      {!page.video && (
        <>
          {/* Portada */}
          <section className="mx-auto mt-8 max-w-5xl px-5 sm:px-8">
            <picture>
              <source media="(max-width: 768px)" srcSet={page.cover.mobile} />
              <img
                src={page.cover.desktop}
                alt={page.cover.alt}
                className={`w-full rounded-[3px] ${page.cover.contain ? 'bg-fog object-contain p-10 sm:p-16' : ''}`}
              />
            </picture>
          </section>

          {/* Explicación */}
          <Reveal className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
            <p className="text-base leading-relaxed text-ink/85">{page.explanation}</p>
          </Reveal>

          {/* Vídeos del logotipo */}
          {page.videos?.single && (
            <div className="mx-auto max-w-4xl px-5 sm:px-8">
              <LoopVideo src={page.videos.single} className="w-full rounded-[3px]" />
            </div>
          )}
          {page.videos?.wide && <LoopVideo src={page.videos.wide} className="mt-8 w-full" />}
          {page.videos?.pair && (
            <div className="mx-auto mt-8 grid max-w-5xl gap-4 px-5 sm:grid-cols-2 sm:px-8">
              {page.videos.pair.map((v, i) => (
                <div key={v} className="overflow-hidden rounded-[3px]" style={{ background: page.videos.pairTones?.[i] }}>
                  <LoopVideo src={v} className="w-full" />
                </div>
              ))}
            </div>
          )}

          {/* Comparación de logotipos (Casa Ricardo) */}
          {page.comparison && (
            <div className="mx-auto grid max-w-5xl gap-4 px-5 pt-4 sm:grid-cols-2 sm:px-8">
              {page.comparison.map((g) => (
                <div key={g.src} className="grid place-items-center rounded-[3px] bg-fog p-10">
                  <img src={g.src} alt={g.alt} className="max-h-48 w-auto object-contain" />
                </div>
              ))}
            </div>
          )}

          {/* Identidad de color */}
          <section className="mx-auto mt-14 grid max-w-5xl px-5 sm:px-8 md:grid-cols-3" aria-label="Paleta de color">
            {page.colors.map((c) => (
              <ColorPanel key={c.name} color={c} />
            ))}
          </section>

          {/* Tipografía */}
          <section className="mx-auto mt-14 max-w-5xl px-5 sm:px-8" aria-label="Tipografía">
            {page.typography && <TypeCatalog {...page.typography} />}
            {page.typographyPair && (
              <div className="grid gap-4 md:grid-cols-2">
                {page.typographyPair.map((t) => (
                  <TypeCatalog key={t.title} {...t} />
                ))}
              </div>
            )}
          </section>

          {/* Fotos (Marca Personal) */}
          {page.photos && (
            <div className="mx-auto mt-14 grid max-w-5xl grid-cols-3 gap-2 px-5 sm:gap-4 sm:px-8">
              {page.photos.map((g) => (
                <Photo key={g.src} g={g} className="aspect-[3/4] rounded-[3px] object-cover" />
              ))}
            </div>
          )}

          {/* Pegatinas (Casa Ricardo) */}
          {page.stickers && (
            <div className="mx-auto mt-14 max-w-5xl px-5 sm:px-8">
              <Photo g={page.stickers} className="rounded-[3px] bg-fog" />
            </div>
          )}

          {/* Mockups */}
          <div className="mt-14">
            <Stationery rows={page.stationery} />
          </div>

          <ToolsFooter page={page} img={img} toolLabels={toolLabels} t={t} />
        </>
      )}

      <ProjectNav slug={slug} projects={projects} t={t} />
      <div className="pb-20" />
    </main>
  )
}
