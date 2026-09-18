import { motion } from 'framer-motion'
import RibbonSet from '../components/Ribbon'
import Button from '../components/Button'
import Reveal from '../components/Reveal'
import { about, site } from '../data/content'

// Las cintas se desvanecen hacia la derecha para no invadir el texto.
const FADE = 'linear-gradient(90deg,#000 0%,#000 48%,transparent 62%)'

export default function About() {
  return (
    <section id="sobre-mi" className="relative overflow-hidden bg-mist py-24 sm:py-32">
      {/* Cintas detrás de la foto */}
      <RibbonSet variant="about" layers={['navy', 'sky']} mask={FADE} className="inset-0 z-0" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-8 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 mx-auto w-full max-w-sm"
        >
          <div className="rounded-[2rem] border-8 border-white bg-white shadow-2xl shadow-navy/20">
            {/* Sustituye por <img src="/lara.jpg" alt="Lara Marcos Simó" className="..." /> */}
            <div className="grid aspect-[4/5] place-items-center overflow-hidden rounded-3xl bg-gradient-to-br from-sky via-white to-lilac">
              <span className="text-7xl font-extrabold tracking-tight text-navy/80">{site.monogram}</span>
            </div>
          </div>
        </motion.div>

        {/* Cinta que pasa por delante de la foto */}
        <RibbonSet variant="about" layers={['lilac']} mask={FADE} className="inset-0 z-20" />

        <div className="relative z-10">
          <Reveal>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-lilac">Sobre mí</p>
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-navy sm:text-4xl">{about.title}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-navy/75">
              {about.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <Button href="#contacto" className="mt-8">
              Trabajemos juntas
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
