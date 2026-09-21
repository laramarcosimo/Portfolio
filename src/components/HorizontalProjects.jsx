import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { featuredProjects } from '../data/content'

const COLORS = ['#192a56', '#96c9ff', '#9690e4']

// Tres hilos finos que derivan en sentido contrario al de las tarjetas (parallax con el scroll).
function DriftLines({ progress }) {
  const x = useTransform(progress, [0, 1], ['0%', '-42%'])
  const draw = useTransform(progress, [0, 0.12], [0, 1])
  const d = 'M0 120 C 260 40 480 210 780 130 S 1330 30 1640 120 S 2130 210 2400 110'
  return (
    <motion.svg
      viewBox="0 0 2400 260"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="pointer-events-none absolute bottom-0 left-0 h-[16vh] w-[240%]"
      style={{ x }}
    >
      {COLORS.map((c, i) => (
        <motion.path
          key={c}
          d={d}
          transform={`translate(${i * -60} ${i * 22})`}
          fill="none"
          stroke={c}
          strokeWidth={[3.5, 2.5, 3][i]}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: draw }}
        />
      ))}
    </motion.svg>
  )
}

function ProjectCard({ p, cardW }) {
  return (
    <motion.article className="group shrink-0" style={{ width: cardW }} whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
      <Link to={`/proyectos/${p.slug}`} aria-label={`Ver ${p.name}`} className="block overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/70 ring-1 ring-slate-100">
        <img src={p.image} alt={p.name} draggable="false" className="aspect-[3/2] w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
      </Link>
      <div className="mt-5 flex items-start justify-between gap-4 px-1">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-lilac">{p.number}</p>
          <h3 className="mt-1 text-xl font-semibold tracking-tight text-navy sm:text-2xl">{p.name}</h3>
          <p className="mt-0.5 text-sm text-navy/60">{p.category}</p>
        </div>
        <Link
          to={`/proyectos/${p.slug}`}
          className="mt-1 inline-flex shrink-0 items-center gap-1.5 rounded-full border border-navy/20 px-4 py-2 text-xs font-semibold text-navy transition hover:border-navy hover:bg-navy hover:text-white"
        >
          Ver <ArrowRight size={13} />
        </Link>
      </div>
    </motion.article>
  )
}

/**
 * Proyectos con scroll horizontal anclado (sticky): al llegar a la sección la pantalla se queda
 * fija y la rueda desplaza las tarjetas hacia la izquierda; al terminar, la página continúa.
 * Con "reducir movimiento" se muestra un carril horizontal desplazable normal.
 */
export default function HorizontalProjects() {
  const reduce = useReducedMotion()
  const targetRef = useRef(null)
  const trackRef = useRef(null)
  const [dims, setDims] = useState({ dist: 0, vh: 0, vw: 0 })

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

  // Mide otra vez cuando cargan las imágenes (cambian la altura de las tarjetas, no el ancho, pero por seguridad)
  useEffect(() => {
    const t = setTimeout(() => window.dispatchEvent(new Event('resize')), 600)
    return () => clearTimeout(t)
  }, [])

  const { scrollYProgress } = useScroll({ target: targetRef, offset: ['start start', 'end end'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 110, damping: 26, mass: 0.4 })
  const x = useTransform(smooth, [0, 1], [0, -dims.dist])
  const bar = useTransform(smooth, [0, 1], [0, 1])

  // Ancho de tarjeta: limitado por el ancho y por el alto de pantalla para que siempre quepa entera
  const cardW = `min(80vw, 46rem, calc((100svh - 16rem) * 1.5))`

  const heading = (
    <div className="flex shrink-0 flex-col justify-center pr-6" style={{ width: 'min(70vw, 22rem)' }}>
      <h2 className="font-serif text-5xl font-medium tracking-tight text-navy sm:text-6xl">Proyectos</h2>
      <span className="mt-6 block h-px w-24 bg-gradient-to-r from-navy via-sky to-lilac" aria-hidden="true" />
    </div>
  )

  const end = (
    <div className="flex shrink-0 items-center pr-[10vw]" style={{ width: 'min(70vw, 20rem)' }}>
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
        <div className="no-scrollbar flex snap-x gap-8 overflow-x-auto px-[8vw] py-6">
          {heading}
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
      <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden pb-[10vh] pt-16">
        <DriftLines progress={smooth} />

        <motion.div ref={trackRef} className="relative z-10 flex items-center gap-10 pl-[8vw] pr-[6vw] sm:gap-14" style={{ x }}>
          {heading}
          {featuredProjects.map((p) => (
            <ProjectCard key={p.slug} p={p} cardW={cardW} />
          ))}
          {end}
        </motion.div>

        {/* Línea de progreso discreta (no son puntos de paginación) */}
        <div className="absolute inset-x-[8vw] bottom-[6vh] z-10 h-px bg-navy/10" aria-hidden="true">
          <motion.div className="h-full origin-left bg-navy" style={{ scaleX: bar }} />
        </div>
      </div>
    </section>
  )
}
