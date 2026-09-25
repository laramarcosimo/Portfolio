import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import { about, img, site } from '../data/content'

const pill =
  'inline-flex min-h-11 items-center gap-2 rounded-full bg-navy px-7 text-xs font-semibold text-white shadow-md shadow-navy/20 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-navy/30 sm:min-h-0 sm:px-6 sm:py-2.5'

export default function About() {
  return (
    // En móvil menos aire vertical (las líneas ocupan esas zonas) y texto algo mayor para leer bien
    <section id="sobre-mi" className="relative pb-28 pt-10 sm:pb-56 sm:pt-16">
      <div id="about-content" className="relative z-10 mx-auto max-w-3xl px-6 sm:px-8">
        <div className="grid items-center gap-10 md:grid-cols-[15rem_1fr] md:gap-14">
          {/* Retrato real en blanco y negro, con el bloque lavanda desplazado detrás */}
          <motion.div
            id="about-photo"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="relative mx-auto w-full max-w-[13rem] md:max-w-[15rem]"
          >
            <div className="absolute -bottom-3 -right-3 h-full w-full bg-lilac/30" aria-hidden="true" />
            <img
              src={img('about/retrato')}
              alt={`Retrato de ${site.name}`}
              className="relative aspect-[4/5] w-full object-cover object-top grayscale"
            />
          </motion.div>

          <div>
            <Reveal>
              <p className="mb-2 text-[11px] font-semibold tracking-[0.16em] text-lilac">{about.kicker}</p>
              <h2 className="font-serif text-3xl font-medium leading-tight tracking-tight text-navy">{about.title}</h2>
              <p className="mt-2 font-display text-lg font-semibold tracking-tight text-navy sm:text-xl">{about.motto}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-navy/75 sm:text-[13px]">
                <p className="font-semibold text-navy">{about.lead}</p>
                <p>{about.text}</p>
                <p>{about.bio}</p>
              </div>
              <Link to="/curriculum" className={`${pill} mt-7 sm:mt-6`}>
                Currículum
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
