import { useEffect, useRef } from 'react'
import { MotionConfig, useInView } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import ColorPanel from '../components/ColorPanel'
import ReaderProgress from '../components/ReaderProgress'
import TypeCatalog from '../components/TypeCatalog'
import Reveal from '../components/Reveal'
import { useContent, useProjectPages } from '../data/useContent'
import { useUi } from '../i18n/ui'

const WRAP = 'w-full px-4 sm:px-8'
// Imágenes de trabajo: a sangre en móvil, en un contenedor ancho en escritorio
const WIDE = 'mx-auto w-full max-w-[1600px] sm:px-8'
// Columna de lectura: el texto arranca siempre en la misma vertical
const COLUMN = 'lg:ml-[33.333%] max-w-[38rem]'

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
  return <video ref={ref} src={src} muted loop playsInline preload="metadata" className={`block w-full ${className}`} />
}

const Photo = ({ g, className = '' }) => <img src={g.src} alt={g.alt} loading="lazy" className={`block h-auto w-full bg-fog ${className}`} />

/** Bloque: etiqueta pequeña encima del contenido. `column` lo sitúa en la columna editorial de texto. */
function Section({ label, children, wide = false, column = false, className = '' }) {
  return (
    <section className={`mt-28 sm:mt-44 ${className}`} aria-label={label}>
      <div className={WRAP}>
        <h2 className={`mb-10 font-[Quicksand] eyebrow text-ink/75 sm:mb-14 ${column ? COLUMN : ''}`}>{label}</h2>
      </div>
      <div className={wide ? WIDE : WRAP}>{column ? <div className={COLUMN}>{children}</div> : children}</div>
    </section>
  )
}

function Applications({ rows }) {
  return (
    <div className="space-y-3 sm:space-y-6">
      {rows.map((row, i) => (
        <Reveal key={i}>
          {row.pair ? (
            <div className="grid items-start gap-3 sm:grid-cols-2 sm:gap-6">
              {row.pair.map((g) => (
                <Photo key={g.src} g={g} />
              ))}
            </div>
          ) : row.href ? (
            <a href={row.href} target="_blank" rel="noreferrer" className="group block">
              <Photo g={row.main} className="transition duration-500 group-hover:opacity-90" />
            </a>
          ) : (
            <Photo g={row.main} />
          )}
        </Reveal>
      ))}
    </div>
  )
}

// Quita de las aplicaciones la imagen que ya se usa como portada; una pareja que se queda con una sola pasa a ancho completo.
function withoutHero(rows, heroSrc) {
  return rows
    .map((row) => {
      if (row.pair) {
        const rest = row.pair.filter((g) => g.src !== heroSrc)
        return rest.length === 2 ? row : rest.length === 1 ? { main: rest[0] } : null
      }
      return row.main?.src === heroSrc ? null : row
    })
    .filter(Boolean)
}

function ProjectNav({ slug, projects, t }) {
  const i = projects.findIndex((p) => p.slug === slug)
  const prev = projects[i - 1]
  const next = projects[i + 1]

  const renderItem = (p, dir) => {
    const isNext = dir === 'next'
    const label = p ? (isNext ? t.proyectoSiguiente : t.proyectoAnterior) : t.volverAProyectos
    return (
      <Link to={p ? `/proyectos/${p.slug}` : '/proyectos'} className={`group flex flex-col gap-4 py-10 sm:py-14 ${isNext ? 'sm:items-end sm:text-right' : ''}`}>
        <span className={`flex items-center gap-2 eyebrow text-ink/75 ${isNext ? 'sm:flex-row-reverse' : ''}`}>
          {isNext ? <ArrowRight size={14} strokeWidth={1.25} /> : <ArrowLeft size={14} strokeWidth={1.25} />}
          {label}
        </span>
        {p && (
          <span className="flex items-baseline gap-4 font-sans text-2xl font-bold tracking-[-0.02em] text-ink transition-opacity duration-500 group-hover:opacity-70 sm:text-[2rem]">
            <span className="eyebrow tabular-nums text-ink/75">{p.number}</span>
            {p.name}
          </span>
        )}
      </Link>
    )
  }

  return (
    <nav aria-label={t.otrosProyectos} className={`${WRAP} mt-32 sm:mt-48`} style={{ '--font-sans': "'Quicksand', sans-serif" }}>
      <div className="grid divide-y divide-ink/15 border-y border-ink/15 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        <div className="sm:pr-8">{renderItem(prev, 'prev')}</div>
        <div className="sm:pl-8">{renderItem(next, 'next')}</div>
      </div>
    </nav>
  )
}

/** Página de un proyecto: cabecera, una imagen grande, el caso, aplicaciones a gran tamaño y el sistema (color y tipografía). */
export default function ProjectPage() {
  const { slug } = useParams()
  const { projects, featuredProjects, toolLabels } = useContent()
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

  const fonts = projectFonts[slug]
  const project = featuredProjects.find((p) => p.slug === slug)

  const meta = [
    { label: t.categoria, value: project?.category },
    page.context && { label: t.contexto, value: page.context },
    { label: t.herramientas, value: page.tools.map((tool) => toolLabels[tool]).join(', ') },
    page.webTools && {
      label: t.webHechaCon.replace(/:$/, ''),
      value: (
        <a href={page.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline decoration-ink/35 decoration-1 underline-offset-4 transition-colors duration-500 hover:decoration-ink">
          {page.webTools.join(' · ')} <ArrowUpRight size={14} strokeWidth={1.25} />
        </a>
      ),
    },
  ].filter(Boolean)

  return (
    <MotionConfig reducedMotion="user">
      <main className="font-sans" style={{ '--font-sans': fonts.body, '--font-serif': fonts.heading, '--font-display': fonts.heading }}>
        {/* Cabecera */}
        <header className={`${WRAP} pt-10 sm:pt-16`}>
          <Link to="/proyectos" className="inline-flex min-h-11 items-center gap-2 font-[Quicksand] eyebrow text-ink/75 transition-colors duration-500 hover:text-ink">
            <ArrowLeft size={14} strokeWidth={1.25} />
            {t.proyectos}
          </Link>
          <div className="mt-16 sm:mt-28">
            {project && <p className="font-[Quicksand] eyebrow tabular-nums text-ink/75">{project.number}</p>}
            <h1 className={`mt-5 max-w-4xl font-serif text-[2.75rem] ${slug === 'casa-ricardo' ? 'font-normal' : 'font-bold'} leading-[1.05] tracking-[-0.02em] text-ink sm:text-6xl lg:text-7xl`}>{project?.name ?? page.title}</h1>
            {project?.concept && <p className="mt-7 max-w-[40ch] text-lg font-medium leading-snug text-ink/85 sm:text-2xl">{project.concept}</p>}
            <dl className="mt-12 flex flex-wrap gap-x-14 gap-y-6 font-[Quicksand] sm:mt-16">
              {meta.map((m) => (
                <div key={m.label}>
                  <dt className="eyebrow text-ink/75">{m.label}</dt>
                  <dd className="mt-2 text-[15px] font-medium text-ink">{m.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </header>

        {page.video ? (
          <>
            <div className={`${WIDE} mt-16 sm:mt-28`}>
              <video src={page.video} poster={page.poster} controls playsInline preload="metadata" className="block aspect-video w-full bg-brand object-contain" />
            </div>
            <Section label={t.elProyecto} column>
              <div>
                <p className="text-xl font-medium leading-snug text-ink sm:text-2xl">{page.intro.lead}</p>
                <p className="mt-6 text-base leading-[1.75] text-ink/85 sm:text-lg">{page.intro.text}</p>
              </div>
            </Section>
          </>
        ) : (
          <>
            {/* Una sola imagen grande del trabajo */}
            <div className={`${WIDE} mt-16 sm:mt-28`}>
              <img src={project.hero} alt={project.heroAlt} className="block h-auto w-full bg-fog" />
            </div>

            {/* El caso */}
            <Section label={t.elProyecto} column>
              {page.story ? (
                <dl className="space-y-12 sm:space-y-16">
                  {page.story.map((b) => (
                    <div key={b.key}>
                      <dt className="font-[Quicksand] eyebrow text-ink/75">{t.story[b.key]}</dt>
                      <dd className="mt-4 text-lg leading-[1.7] text-ink sm:text-xl">{b.text}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="text-lg leading-[1.7] text-ink sm:text-xl">{page.explanation}</p>
              )}
            </Section>

            {/* Comparación de logotipos (Casa Ricardo) */}
            {page.comparison && (
              <Section label={t.evolucionLogo} wide>
                <div className="grid gap-3 sm:grid-cols-2 sm:gap-6">
                  {page.comparison.map((g) => (
                    <figure key={g.src} className="grid aspect-[4/3] place-items-center bg-white p-8 sm:p-14">
                      <img src={g.src} alt={g.alt} loading="lazy" className="max-h-full w-auto max-w-full object-contain" />
                    </figure>
                  ))}
                </div>
              </Section>
            )}

            {/* Aplicaciones, a gran tamaño */}
            <Section label={t.aplicaciones} wide>
              {page.stickers && (
                <Reveal className="mb-3 sm:mb-6">
                  <Photo g={page.stickers} />
                </Reveal>
              )}
              <Applications rows={withoutHero(page.stationery, project.hero)} />
            </Section>

            {/* Vídeos del logotipo */}
            {page.videos && (
              <Section label={t.movimiento} wide>
                <div className="space-y-3 sm:space-y-6">
                  {page.videos.single && (
                    <div className="overflow-hidden bg-fog">
                      <LoopVideo src={page.videos.single} />
                    </div>
                  )}
                  {page.videos.wide && (
                    <div className="overflow-hidden bg-fog">
                      <LoopVideo src={page.videos.wide} />
                    </div>
                  )}
                  {page.videos.pair && (
                    <div className="grid gap-3 sm:grid-cols-2 sm:gap-6">
                      {page.videos.pair.map((v, i) => (
                        <div key={v} className="overflow-hidden" style={{ background: page.videos.pairTones?.[i] }}>
                          <LoopVideo src={v} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Section>
            )}

            {/* Sistema: color y tipografía, en formato compacto */}
            <Section label={t.color}>
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 font-[Quicksand] sm:grid-cols-3 sm:gap-x-6">
                {page.colors.map((c) => (
                  <ColorPanel key={c.name} color={c} />
                ))}
              </div>
            </Section>

            <Section label={t.tipografia}>
              <div className="grid gap-12 sm:grid-cols-2">
                {page.typography && <TypeCatalog {...page.typography} />}
                {page.typographyPair?.map((ty) => (
                  <TypeCatalog key={ty.title} {...ty} />
                ))}
              </div>
            </Section>
          </>
        )}

        <ProjectNav slug={slug} projects={projects} t={t} />
        <ReaderProgress key={slug} />
        <div className="pb-24" />
      </main>
    </MotionConfig>
  )
}
