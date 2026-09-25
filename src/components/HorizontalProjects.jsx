import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useContent } from '../data/useContent'
import { RIBBON_COLORS, RIBBON_COLORS_DARK, buildCurve, ribbonPath, ribbonWidth } from '../lib/ribbonGeometry'
import { useTheme } from '../theme/ThemeContext'
import { useUi } from '../i18n/ui'

const LINES_H = 84

// Las tres líneas de la marca: a la vez adorno y progreso. Usan el mismo motor que el resto de líneas de la
// web (nacen como un hilo por el lateral izquierdo y terminan en punta afilada), se miden al ancho real de la
// pantalla y se dibujan de izquierda a derecha según avanza el scroll, cada una con distinta inercia.
function ProgressLines({ progress }) {
  const reduce = useReducedMotion()
  const { resolved } = useTheme()
  const colors = resolved === 'dark' ? RIBBON_COLORS_DARK : RIBBON_COLORS
  const ref = useRef(null)
  const paths = useRef([])
  const geo = useRef(null)
  const [w, setW] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const measure = () => {
      const W = el.getBoundingClientRect().width
      const narrow = W < 700
      const mid = LINES_H / 2
      const a = narrow ? 5 : 11 // ondulación de la curva base
      const width = ribbonWidth(W)
      const pts = [
        [-0.06 * W, mid + a],
        [0.22 * W, mid - a],
        [0.5 * W, mid + a * 0.6],
        [0.78 * W, mid - a * 0.8],
        [1.06 * W, mid + a * 0.4],
      ]
      geo.current = { ...buildCurve(pts, 16, 12), width, spacing: width * 2.6 + 6, birth: 420, amp: narrow ? 4 : 8, lambda: narrow ? 300 : 430 }
      setW(W)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useAnimationFrame((time) => {
    const g = geo.current
    if (!g) return
    const total = (g.base.length - 1) * g.step
    for (let r = 0; r < 3; r++) {
      const p = reduce ? 1 : Math.min(1, Math.max(0, progress[r].get()))
      const sEnd = p >= 0.995 ? Infinity : Math.max(2, p * total)
      paths.current[r]?.setAttribute('d', p <= 0.002 ? '' : ribbonPath(g, r, time, 0, sEnd, reduce))
    }
  })

  return (
    <div ref={ref} className="pointer-events-none absolute inset-x-0 bottom-[3svh] z-10" style={{ height: LINES_H }} aria-hidden="true">
      <svg width={w} height={LINES_H} viewBox={`0 0 ${w || 1} ${LINES_H}`} className="absolute inset-0 overflow-hidden">
        {colors.map((c, i) => (
          <path key={c} ref={(el) => (paths.current[i] = el)} fill={c} />
        ))}
      </svg>
    </div>
  )
}

function ProjectCard({ p, cardW, t }) {
  return (
    <motion.article className="group shrink-0" style={{ width: cardW }} whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
      <Link to={`/proyectos/${p.slug}`} aria-label={t.verNombre(p.name)} className="block overflow-hidden rounded-2xl bg-surface shadow-lg shadow-edge/70 ring-1 ring-edge">
        <img src={p.cover} alt={t.portadaDe(p.name)} draggable="false" className="aspect-[3/4] w-full object-cover object-top transition duration-700 group-hover:scale-[1.04]" />
      </Link>
      <div className="mt-4 flex items-start justify-between gap-3 px-0.5">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-lilac">{p.number}</p>
          <h3 className="mt-0.5 text-sm font-semibold tracking-tight text-ink">{p.name}</h3>
          <p className="mt-0.5 text-xs text-ink/60">{p.category}</p>
        </div>
        <Link
          to={`/proyectos/${p.slug}`}
          className="mt-0.5 inline-flex min-h-9 shrink-0 items-center gap-1 rounded-full border border-ink/20 px-3.5 text-[11px] font-semibold text-ink transition hover:border-navy hover:bg-navy hover:text-white"
        >
          {t.ver} <ArrowRight size={13} />
        </Link>
      </div>
    </motion.article>
  )
}

const Heading = ({ className = '', t }) => (
  <h2 className={`text-3xl font-bold tracking-tight text-ink sm:text-5xl ${className}`}>{t.proyectos}</h2>
)

/**
 * Proyectos con scroll horizontal anclado (sticky): al llegar a la sección la pantalla se queda
 * fija y la rueda desplaza las portadas hacia la izquierda; al terminar, la página continúa.
 * Con "reducir movimiento" se muestra un carril horizontal desplazable normal.
 */
export default function HorizontalProjects() {
  const { featuredProjects } = useContent()
  const t = useUi()
  const reduce = useReducedMotion()
  const targetRef = useRef(null)
  const trackRef = useRef(null)
  const [dims, setDims] = useState({ dist: 0, vh: 0, vw: 1200 })

  // Recorrido horizontal = ancho del carril − ancho de pantalla; altura de la sección = recorrido + pantalla
  useLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current
      if (!track) return
      setDims({ dist: Math.max(0, track.scrollWidth - window.innerWidth), vh: window.innerHeight, vw: window.innerWidth })
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (trackRef.current) ro.observe(trackRef.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  // Vuelve a medir cuando terminan de cargar las imágenes
  useEffect(() => {
    const t = setTimeout(() => window.dispatchEvent(new Event('resize')), 600)
    return () => clearTimeout(t)
  }, [])

  // Progreso (0→1) de la sección anclada, calculado a partir de su posición real: funciona igual en todos los navegadores
  const scrollYProgress = useMotionValue(0)
  useEffect(() => {
    const update = () => {
      const el = targetRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const range = r.height - window.innerHeight
      scrollYProgress.set(range > 0 ? Math.min(1, Math.max(0, -r.top / range)) : 0)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [scrollYProgress, dims.dist])

  const smooth = useSpring(scrollYProgress, { stiffness: 110, damping: 26, mass: 0.4 })
  // La marino va delante y las otras dos la siguen con más inercia
  const lines = [
    useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 }),
    useSpring(scrollYProgress, { stiffness: 70, damping: 22, mass: 0.6 }),
    useSpring(scrollYProgress, { stiffness: 38, damping: 18, mass: 0.8 }),
  ]
  const x = useTransform(smooth, [0, 1], [0, -dims.dist])

  // Portadas pequeñas (3:4): limitadas también por el alto de pantalla
  const cardW = `min(64vw, 14rem, calc((100svh - 22rem) * 0.75))`

  const end = (
    <div className="flex shrink-0 items-center pr-[10vw]" style={{ width: 'min(70vw, 16rem)' }}>
      <Link
        to="/proyectos"
        className="inline-flex items-center gap-2 rounded-full bg-navy px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-navy/20 transition hover:-translate-y-0.5"
      >
        {t.proyectos} <ArrowRight size={15} />
      </Link>
    </div>
  )

  // Movimiento reducido: carril con scroll horizontal nativo, sin anclaje
  if (reduce) {
    return (
      <section id="portafolio" aria-label={t.proyectos} className="py-24">
        <Heading className="px-[8vw]" t={t} />
        <div className="no-scrollbar mt-8 flex snap-x gap-10 overflow-x-auto px-[8vw] py-6">
          {featuredProjects.map((p) => (
            <div key={p.slug} className="snap-start">
              <ProjectCard p={p} cardW={cardW} t={t} />
            </div>
          ))}
          {end}
        </div>
      </section>
    )
  }

  return (
    <section id="portafolio" ref={targetRef} aria-label={t.proyectos} className="relative" style={{ height: dims.dist ? dims.dist + dims.vh : '300vh' }}>
      <div className="sticky top-0 flex h-[100svh] w-full items-center overflow-hidden pb-[14svh] pt-24">
        {/* Título encima del carrusel */}
        <Heading className="absolute left-[8vw] top-[calc(4rem+4svh)] z-10" t={t} />

        <motion.div ref={trackRef} className="relative z-10 flex items-center gap-14 pl-[8vw] pr-[6vw] sm:gap-24" style={{ x }}>
          {featuredProjects.map((p) => (
            <ProjectCard key={p.slug} p={p} cardW={cardW} t={t} />
          ))}
          {end}
        </motion.div>

        <ProgressLines progress={lines} />
      </div>
    </section>
  )
}
