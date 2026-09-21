import { useSyncExternalStore } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import RibbonBanner from '../components/RibbonBanner'
import { projects } from '../data/content'

// ¿Pantalla de móvil? (menos de 768 px)
const mq = '(max-width: 767px)'
const subscribe = (cb) => {
  const m = window.matchMedia(mq)
  m.addEventListener('change', cb)
  return () => m.removeEventListener('change', cb)
}
const useIsMobile = () => useSyncExternalStore(subscribe, () => window.matchMedia(mq).matches, () => false)

/**
 * Listado de proyectos de la web original: número, nombre y portada; cada uno abre su página.
 * En móvil las cuatro portadas se muestran a la vez en una cuadrícula 2×2 que cabe en la pantalla.
 */
export default function Projects() {
  const mobile = useIsMobile()

  if (mobile) {
    return (
      <main>
        <RibbonBanner height={84} />
        <h1 className="sr-only">Proyectos</h1>

        {/* Una portada tras otra. La altura de cada fila se calcula con el alto de pantalla
            ((pantalla − barra − banner − márgenes) / 4) para que las cuatro quepan siempre de una vez. */}
        <ul className="mx-auto flex max-w-md flex-col gap-3 px-6 pb-6 pt-5">
          {projects.map((p, i) => (
            <motion.li key={p.slug} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.08 }}>
              <Link to={`/proyectos/${p.slug}`} aria-label={`Ver ${p.name}`} className="group flex items-center gap-5">
                <img
                  src={p.cover}
                  alt={`Portada de ${p.name}`}
                  style={{ height: 'min(9.5rem, calc((100svh - 12rem) / 4 - 0.75rem))' }}
                  className="aspect-[3/4] shrink-0 rounded-lg object-cover object-top shadow-md shadow-slate-200/80 ring-1 ring-slate-100 transition group-active:scale-[0.97]"
                />
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold tracking-[0.18em] text-lilac">{p.number}</p>
                  <h2 className="mt-0.5 text-base font-semibold leading-tight tracking-tight text-navy">{p.name}</h2>
                  <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-navy/60">
                    VER <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>
      </main>
    )
  }

  return (
    <main>
      <RibbonBanner height={190} />
      <h1 className="sr-only">Proyectos</h1>

      <div className="mx-auto max-w-4xl space-y-28 px-8 py-28">
        {projects.map((p, i) => (
          <motion.section
            key={p.slug}
            id={`proyecto-${p.slug}`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7 }}
            className={`grid grid-cols-2 items-center gap-14 ${i % 2 ? '[&>*:first-child]:order-2' : ''}`}
          >
            <div className={i % 2 ? 'text-left' : 'text-right'}>
              <span className="text-5xl font-light text-lilac">{p.number}</span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-navy">{p.name}</h2>
              <Link
                to={`/proyectos/${p.slug}`}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-navy px-7 py-2.5 text-xs font-semibold text-white shadow-md shadow-navy/20 transition hover:-translate-y-0.5"
              >
                VER <ArrowRight size={14} />
              </Link>
            </div>
            <Link to={`/proyectos/${p.slug}`} aria-label={`Ver ${p.name}`} className="group block overflow-hidden rounded-[3px] shadow-lg shadow-navy/15">
              <img src={p.cover} alt={p.name} loading="lazy" className="w-full transition duration-500 group-hover:scale-[1.03]" />
            </Link>
          </motion.section>
        ))}
      </div>
    </main>
  )
}
