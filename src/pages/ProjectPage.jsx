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

/** Cada pieza con su propia proporción, sin marco ni fondo añadido; `fill` es solo el fondo propio de un arte transparente. */
function Media({ item, eager = false }) {
  const { g, video, film, size, label, fill } = item
  const shared = {
    width: size[0],
    height: size[1],
    className: `cs-media${film ? ' cs-media--film' : ''}`,
    style: { '--r': size[0] / size[1], aspectRatio: `${size[0]} / ${size[1]}`, background: fill },
  }
  if (film) return <video {...shared} src={film} controls playsInline preload="metadata" aria-label={label} />
  if (video) return <Loop {...shared} src={video} label={label} />
  return <img {...shared} src={g.src} alt={g.alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />
}

function Cell({ item }) {
  return (
    <Rise className="cs-cell">
      {item.href ? (
        <a href={item.href} target="_blank" rel="noreferrer" className="block">
          <Media item={item} />
          <span className="cs-caption cs-caption--link">{item.caption} <ArrowUpRight size={16} strokeWidth={1.5} /></span>
        </a>
      ) : (
        <>
          <Media item={item} />
          {item.caption && <p className="cs-caption">{item.caption}</p>}
        </>
      )}
    </Rise>
  )
}

const full = (item) => ({ items: [item] })
const two = (a, b) => ({ items: [a, b] })
// Columnas proporcionales a cada pieza: la pareja comparte altura sin recortar nada.
const columns = (items) => items.map((x) => `minmax(0, ${x.size[0] / x.size[1]}fr)`).join(' ')

function Rows({ rows }) {
  return (
    <div className="cs-rows">
      {rows.map((r, i) => (
        <div key={i} className={r.items.length > 1 ? 'cs-pair' : 'cs-single'} style={r.items.length > 1 ? { '--cols': columns(r.items) } : undefined}>
          {r.items.map((item, k) => <Cell key={k} item={item} />)}
        </div>
      ))}
    </div>
  )
}

/** Qué pieza va en cada hueco de la plantilla. El orden y las disposiciones son comunes a todos los proyectos. */
function compose(slug, page, project, t) {
  const name = project?.name ?? page.title
  const shot = (g, size, fill) => ({ g, size, fill })
  const loop = (video, size) => ({ video, size, label: name })
  if (slug === 'marca-personal') {
    const s = page.shots
    const v = page.videos
    return {
      hero: shot(s.libretas, SIZE.libretas),
      logo: [full(loop(v.single, [2000, 1000])), two(loop(v.pair[0], [1920, 1642]), loop(v.pair[1], [1920, 1646]))],
      logoSize: SIZE.logoMarca,
      patterns: [two(shot(s.patronAzul, SIZE.patron, s.patronAzul.tile), shot(s.patronBlanco, SIZE.patron, s.patronBlanco.tile))],
      applications: [two(shot(s.boligrafos, SIZE.boligrafos), shot(s.tarjeta, SIZE.tarjetaMarca)), two(shot(s.carpeta, SIZE.carpeta), shot(s.sobre, SIZE.sobre)), full(loop(v.wide, [4000, 1000]))],
    }
  }
  if (slug === 'identidad-visual') {
    const s = page.shots
    return {
      hero: shot(s.tarjeta, SIZE.tarjetaJaime),
      logo: [two(loop(page.videos.pair[0], [1080, 964]), loop(page.videos.pair[1], [1080, 964]))],
      logoSize: SIZE.logoJaime,
      applications: [
        two(shot(s.agenda, SIZE.agenda), shot(s.boligrafo, SIZE.boligrafo)),
        full(shot(s.taza, SIZE.taza)),
        full({ ...shot(s.web, SIZE.web), href: page.link, caption: `${t.webHechaCon.replace(/:$/, '')} ${page.webTools.join(' · ')}` }),
      ],
    }
  }
  if (slug === 'casa-ricardo') {
    const s = page.shots
    const cmp = page.comparison
    return {
      hero: shot(s.tarjeta, SIZE.tarjetaCasa),
      logo: [
        two({ ...shot(cmp.old, SIZE.logoViejo, '#FFFFFF'), caption: cmp.before }, { ...shot(cmp.new, SIZE.logoCasa, '#DB251E'), caption: cmp.after }),
        full(shot(page.stickers, SIZE.pegatinas)),
      ],
      logoSize: SIZE.logoCasa,
      applications: [
        two(shot(s.packagingDelante, SIZE.packaging), shot(s.packagingDetras, SIZE.packaging)),
        full(shot(s.bolsas, SIZE.bolsas)),
        two(shot(s.valla, SIZE.valla), shot(s.mupi, SIZE.mupi)),
      ],
    }
  }
  // Proyecto de vídeo: no tiene sistema de marca propio, así que esa sección no aparece.
  return {
    hero: shot({ src: page.poster, alt: name }, SIZE.poster),
    applications: [full({ film: page.video, size: SIZE.film, label: name })],
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

/** Cierre discreto: proyecto anterior y siguiente, dando la vuelta en los extremos. */
function Pager({ slug, projects, t }) {
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
  const parts = compose(slug, page, project, t)
  const paragraphs = page.video ? [page.intro.lead, page.intro.text] : page.story.map((s) => s.text)
  const specimens = page.typographyPair ?? (page.typography ? [page.typography] : [])
  const L = page.labels

  return (
    <MotionConfig reducedMotion="user">
      <main className="cs" style={vars} data-project={slug}>
        <header className="cs-hero">
          <div className="cs-wrap cs-grid">
            <div className="cs-col-6 cs-hero-copy">
              <Link to="/proyectos" className="cs-back"><ArrowLeft size={14} strokeWidth={1.5} /> {t.proyectos}</Link>
              <div>
                <h1 className="cs-title">{name}</h1>
                {project?.concept && <p className="cs-concept">{project.concept}</p>}
              </div>
            </div>
            <div className="cs-col-6"><Media item={parts.hero} eager /></div>
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

        <Pager slug={slug} projects={projects} t={t} />
      </main>
    </MotionConfig>
  )
}
