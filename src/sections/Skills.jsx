import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import { img, skills } from '../data/content'

/** Habilidades: las seis tarjetas de la web original (logotipo + texto). */
export default function Skills() {
  return (
    <section id="habilidades" className="relative overflow-hidden pb-44 pt-20 sm:pb-52 sm:pt-24">
      <div className="absolute inset-0 -z-10 bg-white" aria-hidden="true" />

      {/* Marca de agua con el monograma */}
      <img
        src={img('brand/monograma')}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-[5] w-[28rem] max-w-none -translate-x-1/2 -translate-y-[60%] select-none opacity-[0.05] sm:w-[36rem]"
      />

      <div className="relative z-10 mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-navy">Habilidades</h2>
        </Reveal>

        <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map(({ tool, label, text }, i) => (
            <motion.div
              key={tool}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
            >
              <img src={img(`tools/${tool}`)} alt={`Logo ${label}`} className="h-9 w-9" />
              <h3 className="mt-3 text-[13px] font-bold text-navy">{label}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-navy/65">“{text}”</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/curriculum#skills" className="text-xs font-semibold text-navy underline underline-offset-4 hover:text-lilac">
            Currículum
          </Link>
        </div>
      </div>
    </section>
  )
}
