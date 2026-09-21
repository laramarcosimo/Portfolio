import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { featuredProjects } from '../data/content'

const COLORS = ['#192a56', '#96c9ff', '#9690e4']

// Las tres líneas onduladas de la marca: a la vez adorno y progreso. Se dibujan de izquierda a derecha
// según avanza el scroll (cada una con distinta inercia) y flotan con un vaivén continuo.
function ProgressLines({ progress }) {
  const d = 'M0 34 C 120 6 240 62 380 34 S 640 6 780 34 S 1040 62 1200 30'
  const springs = [progress[0], progress[1], progress[2]]
  return (
    <svg viewBox="0 0 1200 96" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-x-[8vw] bottom-[4vh] z-10 h-[10vh] w-[84vw]">
      {COLORS.map((c, i) => (
        <motion.g key={c} animate={{ y: [0, i % 2 ? 5 : -5, 0] }} transition={{ duration: 5 + i * 1.3, repeat: Infinity, ease: 'easeInOut' }}>
          <motion.path
            d={d}
            transform={`translate(0 ${i * 14})`}
            fill="none"
            stroke={c}
            strokeWidth={[3.5, 3, 3.5][i]}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            style={{ pathLength: springs[i] }}
          />
        </motion.g>
      ))}
    </svg>
  )
}

function ProjectCard({ p, cardW }) {
  return (
    <motion.article className="group shrink-0" style={{ width: cardW }} whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
      <Link to={`/proyectos/${p.slug}`} aria-label={`Ver ${p.name}`} className="block overflow-hidden rounded-2xl bg-white shadow-lg shadow-slate-200/70 ring-1 ring-slate-100">
        <img src={p.cover} alt={`Portada de ${p.name}`} draggable="false" className="aspect-[3/4] w-full object-cover object-top transition duration-700 group-hover:scale-[1.04]" />
      </Link>
      <div className="mt-4 flex items-start justify-between gap-3 px-0.5">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-lilac">{p.number}</p>
          <h3 className="mt-0.5 text-sm font-semibold tracking-tight text-navy">{p.name}</h3>
          <p className="mt-0.5 text-xs text-navy/60">{p.category}</p>
        </div>
        <Link
          to={`/proyectos/${p.slug}`}
          className="mt-0.5 inline-flex min-h-9 shrink-0 items-center gap-1 rounded-full border border-navy/20 px-3.5 text-[11px] font-semibold text-navy transition hover:border-navy hover:bg-navy hover:text-white"
        >
          Ver <ArrowRight size={13} />
        </Link>
      </div>
    </motion.article>
  )
}

const Heading = ({ className = '' }) => (
  <h2 className={`text-3xl font-bold tracking-tight text-navy sm:text-5xl ${className}`}>Proyectos</h2>
)

/**
 * Proyectos con scroll horizontal anclado (sticky): al llegar a la sección la pantalla se queda
 * fija y la rueda desplaza las portadas hacia la izquierda; al terminar, la página continúa.
 * Con "reducir movimiento" se muestra un carril horizontal desplazable normal.
 */
export default function HorizontalProjects() {
  const reduce = useReducedMotion()
  const targetRef = useRef(null)
  const trackRef = useRef(null)
  const [dims, setDims] = useState({ dist: 0, vh: 0 })

  // Recorrido horizontal = ancho del carril − ancho de pantalla; altura de la sección = recorrido + pantalla
  useLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current
      if (!track) return
      setDims({ dist: Math.max(0, track.scrollWidth - window.innerWidth), vh: window.innerHeight })
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
        Proyectos <ArrowRight size={15} />
      </Link>
    </div>
  )

  // Movimiento reducido: carril con scroll horizontal nativo, sin anclaje
  if (reduce) {
    return (
      <section id="portafolio" aria-label="Proyectos" className="py-24">
        <Heading className="px-[8vw]" />
        <div className="no-scrollbar mt-8 flex snap-x gap-10 overflow-x-auto px-[8vw] py-6">
          {featuredProjects.map((p) => (
            <div key={p.slug} className="snap-start">
              <ProjectCard p={p} cardW={cardW} />
            </div>
          ))}
          {end}
        </div>
      </section>
    )
  }

  return (
    <section id="portafolio" ref={targetRef} aria-label="Proyectos" className="relative bg-white" style={{ height: dims.dist ? dims.dist + dims.vh : '300vh' }}>
      <div className="sticky top-0 flex h-[100svh] w-full items-center overflow-hidden pb-[12svh] pt-24">
        {/* Título encima del carrusel */}
        <Heading className="absolute left-[8vw] top-[calc(4rem+4svh)] z-10" />

        <motion.div ref={trackRef} className="relative z-10 flex items-center gap-14 pl-[8vw] pr-[6vw] sm:gap-24" style={{ x }}>
          {featuredProjects.map((p) => (
            <ProjectCard key={p.slug} p={p} cardW={cardW} />
          ))}
          {end}
        </motion.div>

        <ProgressLines progress={lines} />
      </div>
    </section>
  )
}
