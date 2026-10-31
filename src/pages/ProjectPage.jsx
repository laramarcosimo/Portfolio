import { useEffect, useRef, useState } from 'react'
import { MotionConfig, motion, useInView } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useContent, useProjectPages } from '../data/useContent'
import { useUi } from '../i18n/ui'

const EASE = [0.22, 1, 0.36, 1]
const TYPEKIT_SLUG = 'casa-ricardo'
// Peso de los títulos cuando la tipografía del proyecto no es Quicksand Bold.
const HEADING_WEIGHT = { 'identidad-visual': 600, 'casa-ricardo': 400 }

// Tamaños naturales: reservan el hueco antes de cargar para que nada salte.
const SIZE = {
  libretas: [1200, 900], boligrafos: [1200, 900], tarjetaMarca: [1200, 676], carpeta: [1200, 900], sobre: [1200, 900], patron: [596, 842],
  tarjetaJaime: [1200, 800], agenda: [1200, 900], boligrafo: [1200, 1200], taza: [1200, 576], web: [1400, 940],
  packaging: [1200, 960], pegatinas: [1200, 676], bolsas: [1200, 1066], tarjetaCasa: [1200, 900], valla: [1400, 1050], mupi: [1200, 900],
  logoCasa: [900, 506], logoMarca: [900, 506], poster: [1080, 1350], film: [640, 360], logoViejo: [900, 744], logoJaime: [600, 288],
}

// Color de cada proyecto: portada y cierre ("siguiente proyecto").
const THEME = {
  'marca-personal': { hero: '#192A56', heroInk: '#FFFFFF', accent: '#96C9FF', next: '#192A56', nextInk: '#FFFFFF' },
  'identidad-visual': { hero: '#000000', heroInk: '#FFFFFF', accent: '#00C896', next: '#00C896', nextInk: '#000000' },
  'casa-ricardo': { hero: '#0032A0', heroInk: '#FFFFFF', accent: '#DDAA55', next: '#DB251E', nextInk: '#FFFFFF' },
  'proyecto-video': { hero: '#0B1416', heroInk: '#F5F5F2', accent: '#7FD6C8', next: '#0B1416', nextInk: '#F5F5F2' },
}

function Rise({ children, className = '', delay = 0, style }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.01 }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

// Proporción común de cada disposición: ancho completo o dos mitades iguales.
const RATIO = { full: 16 / 9, two: 4 / 3 }

// Bucle mudo que solo se descarga y reproduce cuando está a la vista.
function Loop({ src, label, className, style, width, height }) {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.15 })
  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (inView) v.play().catch(() => {})
    else v.pause()
  }, [inView])
  return <video ref={ref} src={src} muted loop playsInline preload="none" aria-label={label} width={width} height={height} className={className} style={style} />
}

/** Único marco de la plantilla: se ve la pieza entera, centrada y con las esquinas redondeadas. */
function Frame({ item, layout = 'two', eager = false }) {
  const { g, video, film, poster, size, label, tone, cover } = item
  const fit = cover ? 'cs-media--cover' : size[0] / size[1] >= RATIO[layout] ? 'cs-media--w' : 'cs-media--h'
  const shared = { width: size[0], height: size[1], className: `cs-media ${fit}`, style: { aspectRatio: `${size[0]} / ${size[1]}` } }
  return (
    <div className={`cs-frame cs-frame--${layout}`} style={tone ? { background: tone } : undefined}>
      {film ? <video {...shared} src={film} poster={poster} controls playsInline preload="metadata" aria-label={label} />
        : video ? <Loop {...shared} src={video} label={label} />
        : <img {...shared} src={g.src} alt={g.alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />}
    </div>
  )
}

function Cell({ item, layout }) {
  const frame = <Frame item={item} layout={layout} />
  return (
    <Rise className={layout === 'full' ? 'cs-col-12' : 'cs-col-6'}>
      {item.href ? (
        <a href={item.href} target="_blank" rel="noreferrer" className="block">
          {frame}
          <span className="cs-caption cs-caption--link">{item.caption} <ArrowUpRight size={16} strokeWidth={1.5} /></span>
        </a>
      ) : (
        <>
          {frame}
          {item.caption && <p className="cs-caption">{item.caption}</p>}
        </>
      )}
    </Rise>
  )
}

const full = (item) => ({ layout: 'full', items: [item] })
const two = (a, b) => ({ layout: 'two', items: [a, b] })

function Rows({ rows }) {
  return (
    <div className="cs-rows">
      {rows.map((r, i) => (
        <div key={i} className="cs-grid">
          {r.items.map((item, k) => <Cell key={k} item={item} layout={r.layout} />)}
        </div>
      ))}
    </div>
  )
}

/** Qué pieza va en cada hueco de la plantilla. El orden y las disposiciones son comunes a todos los proyectos. */
function compose(slug, page, project, t) {
  const name = project?.name ?? page.title
  const shot = (g, size, tone, cover) => ({ g, size, tone, cover })
  const loop = (video, size, tone) => ({ video, size, tone, label: name })
  if (slug === 'marca-personal') {
    const s = page.shots
    const v = page.videos
    return {
      hero: shot(s.libretas, SIZE.libretas),
      logo: [full(loop(v.single, [2000, 1000], '#FFFFFF')), two(loop(v.pair[0], [1920, 1642], '#192A56'), loop(v.pair[1], [1920, 1646], '#DCDCDC'))],
      logoSize: SIZE.logoMarca,
      patterns: [two(shot(s.patronAzul, SIZE.patron, s.patronAzul.tile, true), shot(s.patronBlanco, SIZE.patron, s.patronBlanco.tile, true))],
      applications: [two(shot(s.boligrafos, SIZE.boligrafos), shot(s.tarjeta, SIZE.tarjetaMarca, '#9690E4')), two(shot(s.carpeta, SIZE.carpeta), shot(s.sobre, SIZE.sobre)), full(loop(v.wide, [4000, 1000], '#DCDCDC'))],
    }
  }
  if (slug === 'identidad-visual') {
    const s = page.shots
    return {
      hero: shot(s.tarjeta, SIZE.tarjetaJaime),
      logo: [two(loop(page.videos.pair[0], [1080, 964], page.videos.pairTones[0]), loop(page.videos.pair[1], [1080, 964], page.videos.pairTones[1]))],
      logoSize: SIZE.logoJaime,
      applications: [
        two(shot(s.agenda, SIZE.agenda), shot(s.boligrafo, SIZE.boligrafo)),
        full(shot(s.taza, SIZE.taza, '#2B2B2B')),
        full({ ...shot(s.web, SIZE.web), href: page.link, caption: `${t.webHechaCon.replace(/:$/, '')} ${page.webTools.join(' · ')}` }),
      ],
    }
  }
  if (slug === 'casa-ricardo') {
    const s = page.shots
    const cmp = page.comparison
    return {
      hero: shot({ src: project.hero, alt: project.heroAlt }, SIZE.packaging),
      logo: [
        two({ ...shot(cmp.old, SIZE.logoViejo, '#FFFFFF'), caption: cmp.before }, { ...shot(cmp.new, SIZE.logoCasa, '#DB251E'), caption: cmp.after }),
        full(shot(page.stickers, SIZE.pegatinas, '#FFFFFF')),
      ],
      logoSize: SIZE.logoCasa,
      applications: [
        two(shot(s.packagingDetras, SIZE.packaging, '#DDAA55'), shot(s.bolsas, SIZE.bolsas, '#DDAA55')),
        full(shot(s.valla, SIZE.valla)),
        two(shot(s.mupi, SIZE.mupi), shot(s.tarjeta, SIZE.tarjetaCasa, '#FFFFFF')),
      ],
    }
  }
  // Proyecto de vídeo: no tiene sistema de marca propio, así que esa sección no aparece.
  return {
    hero: shot({ src: page.poster, alt: name }, SIZE.poster),
    applications: [full({ film: page.video, poster: page.poster, size: SIZE.film, tone: '#000000', label: name })],
  }
}

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

function Swatch({ color, logoSize }) {
  const ink = color.dark ? '#10131A' : '#FFFFFF'
  const logo = color.logos?.[0]
  return (
    <div className={`cs-swatch ${color.bordered ? 'cs-swatch--edge' : ''}`} style={{ background: color.bg, color: ink }}>
      <div className="cs-swatch-logo">
        {logo && <img src={logo.src} alt={logo.alt} width={logoSize[0]} height={logoSize[1]} loading="lazy" decoding="async" />}
      </div>
      <div>
        <p className="cs-swatch-name">{color.name}</p>
        <p className="cs-swatch-hex">{color.bg.toUpperCase()}</p>
      </div>
    </div>
  )
}

/** Muestra tipográfica: cada estilo es un botón que aplica su familia y su peso al texto de ejemplo. */
function Specimen({ ty, stylesLabel }) {
  const [active, setActive] = useState(0)
  const w = ty.weights[active] ?? ty.weights[0]
  const extra = Array.isArray(ty.extra) ? ty.extra.join(' ') : ty.extra
  const faceOf = (x) => ({ fontFamily: `${x.family}, sans-serif`, fontWeight: x.weight })
  return (
    <div className="cs-specimen">
      <div className="cs-specimen-styles" role="group" aria-label={`${stylesLabel} ${ty.title}`}>
        {ty.weights.map((x, i) => (
          <button key={x.label} type="button" className="cs-style" style={faceOf(x)} aria-pressed={i === active} onClick={() => setActive(i)}>
            {x.label}
          </button>
        ))}
      </div>
      <div className="cs-specimen-sample" style={faceOf(w)}>
        <div className="cs-specimen-head">
          <p className="cs-specimen-name">{ty.title}</p>
          <p className="cs-specimen-aa" aria-hidden="true">Aa</p>
        </div>
        <p className="cs-specimen-chars">{ty.chars.join(' ')}</p>
        <p className="cs-specimen-chars">{extra}</p>
      </div>
    </div>
  )
}

function NextProject({ slug, projects, t }) {
  const { projectFonts } = useProjectPages()
  const i = projects.findIndex((p) => p.slug === slug)
  const next = projects[(i + 1) % projects.length]
  const theme = THEME[next.slug]
  return (
    <nav aria-label={t.otrosProyectos}>
      <Link to={`/proyectos/${next.slug}`} className="cs-next" style={{ background: theme.next, color: theme.nextInk }}>
        <span className="cs-wrap block">
          <span className="cs-next-label">{t.proyectoSiguiente} <ArrowRight size={16} strokeWidth={1.5} /></span>
          <span className="cs-next-name" style={{ fontFamily: projectFonts[next.slug].heading }}>{next.name}</span>
        </span>
      </Link>
      <div className="cs-wrap"><Link to="/proyectos" className="cs-return"><ArrowLeft size={14} strokeWidth={1.5} /> {t.volverAProyectos}</Link></div>
    </nav>
  )
}

/** Caso de estudio de cada proyecto: una sola plantilla (portada, historia, sistema de marca, aplicaciones, siguiente), con su color y su tipografía. */
export default function ProjectPage() {
  const { slug } = useParams()
  const { projects, featuredProjects, toolLabels } = useContent()
  const { projectPages, projectFonts } = useProjectPages()
  const t = useUi()
  const page = projectPages[slug]

  const i = projects.findIndex((p) => p.slug === slug)
  const nextSlug = projects[(i + 1) % projects.length]?.slug
  const typekit = slug === TYPEKIT_SLUG || nextSlug === TYPEKIT_SLUG ? projectPages[TYPEKIT_SLUG].typekit : null

  // Ella Roman y Depot New vienen de Adobe Fonts; también hacen falta en el enlace al proyecto siguiente.
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
  const theme = THEME[slug]
  const vars = { '--font-sans': fonts.body, '--font-serif': fonts.heading, '--font-display': fonts.heading, '--cs-heading': fonts.heading, '--cs-heading-weight': HEADING_WEIGHT[slug] ?? 700 }
  const name = project?.name ?? page.title
  const parts = compose(slug, page, project, t)
  const paragraphs = page.video ? [page.intro.lead, page.intro.text] : page.story.map((s) => s.text)
  const specimens = page.typographyPair ?? (page.typography ? [page.typography] : [])
  const L = page.labels

  return (
    <MotionConfig reducedMotion="user">
      <main className="cs" style={vars} data-project={slug}>
        <header className="cs-hero" style={{ background: theme.hero, color: theme.heroInk }}>
          <div className="cs-wrap cs-grid">
            <div className="cs-col-6 cs-hero-copy">
              <Link to="/proyectos" className="cs-back"><ArrowLeft size={14} strokeWidth={1.5} /> {t.proyectos}</Link>
              <div>
                <h1 className="cs-title">{name}</h1>
                {project?.concept && <p className="cs-concept">{project.concept}</p>}
              </div>
            </div>
            <div className="cs-col-6"><Frame item={parts.hero} eager /></div>
          </div>
        </header>

        <section className="cs-section">
          <div className="cs-wrap cs-grid">
            <h2 className="cs-col-6 cs-heading">{L.story}</h2>
            <Rise className="cs-col-6">
              {paragraphs.map((text) => <p key={text} className="cs-text">{text}</p>)}
              <Credits project={project} page={page} toolLabels={toolLabels} t={t} />
            </Rise>
          </div>
        </section>

        {parts.logo && (
          <section className="cs-section">
            <div className="cs-wrap">
              <h2 className="cs-heading">{L.brand}</h2>
              <div className="cs-block">
                <h3 className="cs-label">{L.logo}</h3>
                <Rows rows={parts.logo} />
              </div>
              <div className="cs-block">
                <h3 className="cs-label">{t.color}</h3>
                <Rise className="cs-swatches">{page.colors.map((c) => <Swatch key={c.bg} color={c} logoSize={parts.logoSize} />)}</Rise>
              </div>
              <div className="cs-block" key={slug}>
                <h3 className="cs-label">{t.tipografia}</h3>
                {specimens.map((ty) => <Specimen key={ty.title} ty={ty} stylesLabel={L.styles} />)}
              </div>
              {parts.patterns && (
                <div className="cs-block">
                  <h3 className="cs-label">{L.pattern}</h3>
                  <Rows rows={parts.patterns} />
                </div>
              )}
            </div>
          </section>
        )}

        <section className="cs-section">
          <div className="cs-wrap">
            <h2 className="cs-heading">{L.applications}</h2>
            <div className="cs-block"><Rows rows={parts.applications} /></div>
          </div>
        </section>

        <NextProject slug={slug} projects={projects} t={t} />
      </main>
    </MotionConfig>
  )
}
