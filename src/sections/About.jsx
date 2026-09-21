import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import { about, img, site } from '../data/content'

const pill =
  'inline-flex items-center gap-2 rounded-full bg-navy px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-navy/20 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-navy/30'

export default function About() {
  return (
    <section id="sobre-mi" className="relative pb-64 pt-72 sm:pt-80">
      <div id="about-content" className="relative z-10 mx-auto max-w-3xl px-5 sm:px-8">
        <div className="grid items-center gap-12 md:grid-cols-[15rem_1fr] md:gap-14">
          {/* Retrato real en blanco y negro, con el bloque lavanda desplazado detrás */}
          <motion.div
            id="about-photo"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="relative mx-auto w-full max-w-[15rem]"
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
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-4 space-y-3 text-[13px] leading-relaxed text-navy/75">
                <p className="font-semibold text-navy">{about.lead}</p>
                <p>{about.text}</p>
                <p>{about.bio}</p>
              </div>
              <Link to="/curriculum" className={`${pill} mt-6`}>
                Currículum
              </Link>
            </Reveal>
          </div>
        </div>

      </div>
    </section>
  )
}
