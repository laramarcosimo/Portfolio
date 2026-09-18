import { motion } from 'framer-motion'
import Button from '../components/Button'
import Reveal from '../components/Reveal'
import SectionDots from '../components/SectionDots'
import { about, img, site } from '../data/content'

export default function About({ active }) {
  return (
    <section id="sobre-mi" className="relative pb-44 pt-72 sm:pt-80">
      <div className="absolute inset-0 -z-10 bg-white" aria-hidden="true" />
      <SectionDots current={active} className="absolute inset-x-0 top-6 z-10" />

      <div className="relative z-10 mx-auto grid max-w-3xl items-center gap-12 px-5 sm:px-8 md:grid-cols-[15rem_1fr] md:gap-14">
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
            <p className="mb-2 text-[11px] font-semibold text-lilac">{about.kicker}</p>
            <h2 className="font-serif text-3xl font-medium leading-tight tracking-tight text-navy">Sobre Mí</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-4 space-y-3 text-[13px] leading-relaxed text-navy/75">
              <p className="font-semibold text-navy">{about.title}</p>
              {about.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <ul className="mt-4 space-y-1.5">
              {about.facts.map((f) => (
                <li key={f} className="flex gap-2 text-xs font-medium text-navy/80">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-lilac" aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
            <Button href="#contacto" className="mt-6">
              Contactar
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
