import { useEffect, useRef } from 'react'
import { MotionConfig, useInView } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import ColorPanel from '../components/ColorPanel'
import TypeCatalog from '../components/TypeCatalog'
import Reveal from '../components/Reveal'
import { useContent, useProjectPages } from '../data/useContent'
import { useUi } from '../i18n/ui'

const WRAP = 'mx-auto w-full max-w-6xl px-4 sm:px-8'
// Imágenes de trabajo: a sangre en móvil, en un contenedor ancho en escritorio
const WIDE = 'mx-auto w-full max-w-7xl sm:px-8'

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

/** Bloque con etiqueta a la izquierda (escritorio) y contenido a la derecha. */
function Section({ label, children, wide = false, className = '' }) {
  return (
    <section className={`mt-20 sm:mt-28 ${className}`} aria-label={label}>
      <div className={WRAP}>
        <h2 className="mb-6 border-t border-ink/15 pt-4 eyebrow text-ink/75 sm:mb-8">{label}</h2>
      </div>
      <div className={wide ? WIDE : WRAP}>{children}</div>
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
      <Link to={p ? `/proyectos/${p.slug}` : '/proyectos'} className={`group flex flex-col gap-3 py-8 sm:py-10 ${isNext ? 'sm:items-end sm:text-right' : ''}`}>
        <span className={`flex items-center gap-2 eyebrow text-ink/75 ${isNext ? 'sm:flex-row-reverse' : ''}`}>
          {isNext ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
          {label}
        </span>
        {p && (
          <span className="flex items-baseline gap-3 font-sans text-2xl font-semibold tracking-tight text-ink transition-colors group-hover:text-lilac-ink sm:text-4xl">
            <span className="text-sm tabular-nums text-lilac-ink">{p.number}</span>
            {p.name}
          </span>
        )}
      </Link>
    )
  }

  return (
    <nav aria-label={t.otrosProyectos} className={`${WRAP} mt-28 sm:mt-36`} style={{ '--font-sans': "'Quicksand', sans-serif" }}>
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
        <a href={page.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline decoration-lilac decoration-2 underline-offset-4 hover:text-lilac-ink">
          {page.webTools.join(' · ')} <ArrowUpRight size={14} />
        </a>
      ),
    },
  ].filter(Boolean)

  return (
    <MotionConfig reducedMotion="user">
      <main className="font-sans" style={{ '--font-sans': fonts.body, '--font-serif': fonts.heading, '--font-display': fonts.heading }}>
        {/* Cabecera */}
        <header className={`${WRAP} pt-10 sm:pt-16`}>
          <Link to="/proyectos" className="inline-flex items-center gap-2 font-[Quicksand] eyebrow text-ink/75 transition-colors hover:text-lilac-ink">
            <ArrowLeft size={14} />
            {t.proyectos}
          </Link>
          <div className="mt-12 grid gap-x-3 sm:mt-16 sm:grid-cols-[4.5rem_1fr]">
            {project && <p className="font-[Quicksand] text-base font-semibold tabular-nums text-lilac-ink">{project.number}</p>}
            <div>
              <h1 className="max-w-4xl font-serif text-5xl font-semibold leading-[1.02] tracking-tight text-ink sm:text-7xl lg:text-8xl">{project?.name ?? page.title}</h1>
              {project?.concept && <p className="mt-5 max-w-[40ch] text-lg leading-snug text-ink/75 sm:text-2xl">{project.concept}</p>}
              <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 font-[Quicksand] sm:mt-12">
                {meta.map((m) => (
                  <div key={m.label}>
                    <dt className="eyebrow text-ink/75">{m.label}</dt>
                    <dd className="mt-1 text-[15px] text-ink">{m.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </header>

        {page.video ? (
          <>
            <div className={`${WIDE} mt-12 sm:mt-16`}>
              <video src={page.video} poster={page.poster} controls playsInline preload="metadata" className="block aspect-video w-full bg-navy object-contain" />
            </div>
            <Section label={t.elProyecto}>
              <div className="max-w-[60ch] sm:ml-[5.25rem]">
                <p className="text-xl font-medium leading-snug text-ink sm:text-2xl">{page.intro.lead}</p>
                <p className="mt-5 text-base leading-relaxed text-ink/75 sm:text-lg">{page.intro.text}</p>
              </div>
            </Section>
          </>
        ) : (
          <>
            {/* Una sola imagen grande del trabajo */}
            <div className={`${WIDE} mt-12 sm:mt-16`}>
              <img src={project.hero} alt={project.heroAlt} className="block h-auto w-full bg-fog" />
            </div>

            {/* El caso */}
            <Section label={t.elProyecto}>
              {page.story ? (
                <dl className="divide-y divide-ink/15">
                  {page.story.map((b) => (
                    <div key={b.key} className="grid gap-2 py-6 first:pt-0 sm:grid-cols-[12rem_1fr] sm:gap-8 sm:py-8">
                      <dt className="font-[Quicksand] text-[15px] font-semibold text-lilac-ink">{t.story[b.key]}</dt>
                      <dd className="max-w-[60ch] text-lg leading-relaxed text-ink sm:text-xl">{b.text}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="max-w-[60ch] text-lg leading-relaxed text-ink sm:text-xl">{page.explanation}</p>
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
                        <div key={v} className="overflow-hidden ring-1 ring-inset ring-ink/10" style={{ background: page.videos.pairTones?.[i] }}>
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
        <div className="pb-24" />
      </main>
    </MotionConfig>
  )
}
