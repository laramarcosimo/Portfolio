import { motion } from 'framer-motion'
import Button from '../components/Button'
import Reveal from '../components/Reveal'
import { about, img, site } from '../data/content'

export default function About() {
  return (
    <section id="sobre-mi" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 -z-10 bg-white" aria-hidden="true" />

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-8 md:grid-cols-2 md:gap-20">
        {/* Retrato real. Las cintas pasan por detrás y abrazan su esquina inferior derecha por delante. */}
        <motion.div
          id="about-photo"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="mx-auto w-full max-w-sm rounded-[2rem] bg-white p-3 shadow-2xl shadow-navy/15 ring-1 ring-navy/5"
        >
          <img
            src={img('about/retrato')}
            alt={`Retrato de ${site.name}`}
            className="aspect-[4/5] w-full rounded-3xl object-cover object-top"
          />
        </motion.div>

        <div>
          <Reveal>
            <p className="mb-3 text-sm font-bold text-lilac">{about.kicker}</p>
            <h2 className="text-3xl font-bold leading-tight tracking-tight text-navy sm:text-4xl">{about.title}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-navy/80">
              {about.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <ul className="mt-6 space-y-2">
              {about.facts.map((f) => (
                <li key={f} className="flex gap-2.5 text-sm font-semibold text-navy/85">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky" aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
            <Button href="#contacto" className="mt-8">
              Contactar
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
