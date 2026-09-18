import { useRef } from 'react'
import { motion } from 'framer-motion'
import { User } from 'lucide-react'
import RibbonTrack from '../components/Ribbon'
import useRibbonProgress from '../hooks/useRibbonProgress'
import SectionDots from '../components/SectionDots'
import Button from '../components/Button'
import Reveal from '../components/Reveal'
import { about, site } from '../data/content'

export default function About() {
  const ref = useRef(null)
  const progress = useRibbonProgress(ref)

  return (
    <section id="sobre-mi" ref={ref} className="relative bg-white py-32 sm:py-44">
      <SectionDots current="sobre-mi" className="absolute inset-x-0 top-6" />

      {/* Las cintas rodean la foto: navy y cielo por detrás, lavanda por delante */}
      <RibbonTrack name="about" progress={progress} layers={[0, 1]} glow className="inset-0 z-[1]" />

      <div className="relative z-10 mx-auto grid max-w-4xl items-center gap-14 px-5 sm:px-8 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto w-full max-w-[19rem]"
        >
          <div className="absolute -bottom-4 -right-4 h-full w-full bg-lilac/40" aria-hidden="true" />
          <div className="relative">
            {/* Sustituye por <img src="/lara.jpg" alt="Lara Marcos Simó" className="aspect-[4/5] w-full object-cover grayscale" /> */}
            <div
              role="img"
              aria-label={`Foto de ${site.name}`}
              className="grid aspect-[4/5] place-items-center bg-gradient-to-b from-slate-200 to-slate-400 text-white"
            >
              <User size={96} strokeWidth={1} />
            </div>
          </div>
        </motion.div>

        <div className="relative z-30">
          <Reveal>
            <p className="mb-2 text-xs font-semibold text-lilac">{about.kicker}</p>
            <h2 className="text-4xl tracking-tight text-navy">{about.title}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-5 space-y-3 text-sm leading-relaxed text-navy/75">
              {about.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <Button href="#contacto" className="mt-7">
              Contactar
            </Button>
          </Reveal>
        </div>
      </div>

      <RibbonTrack name="about" progress={progress} layers={[2]} glow className="inset-0 z-20" />
    </section>
  )
}
