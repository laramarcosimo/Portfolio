import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import RibbonBanner from '../components/RibbonBanner'
import { projects } from '../data/content'

/** Listado de proyectos de la web original: nombre, número, "VER" y portada; cada uno abre su página. */
export default function Projects() {
  return (
    <main>
      <RibbonBanner height={190} />
      <h1 className="sr-only">Proyectos</h1>

      <div className="mx-auto max-w-4xl space-y-20 px-5 py-20 sm:space-y-28 sm:px-8 sm:py-28">
        {projects.map((p, i) => (
          <motion.section
            key={p.slug}
            id={`proyecto-${p.slug}`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7 }}
            className={`grid items-center gap-8 md:grid-cols-2 md:gap-14 ${i % 2 ? 'md:[&>*:first-child]:order-2' : ''}`}
          >
            <div className={i % 2 ? 'md:text-left' : 'md:text-right'}>
              <span className="text-5xl font-light text-lilac">{p.number}</span>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-navy sm:text-3xl">{p.name}</h2>
              <Link
                to={`/proyectos/${p.slug}`}
                className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-navy px-7 text-xs font-semibold text-white shadow-md shadow-navy/20 transition hover:-translate-y-0.5"
              >
                VER <ArrowRight size={14} />
              </Link>
            </div>
            <Link to={`/proyectos/${p.slug}`} aria-label={`Ver ${p.name}`} className="group block overflow-hidden rounded-[3px] shadow-lg shadow-navy/15">
              <img
                src={p.cover}
                alt={p.name}
                loading="lazy"
                className="w-full transition duration-500 group-hover:scale-[1.03]"
              />
            </Link>
          </motion.section>
        ))}
      </div>
    </main>
  )
}
