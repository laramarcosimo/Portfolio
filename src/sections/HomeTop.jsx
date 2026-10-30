import { useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import FolderThreads from '../components/FolderThreads'
import ProjectFolders from '../components/ProjectFolders'
import Reveal from '../components/Reveal'
import { useContent } from '../data/useContent'
import { useUi } from '../i18n/ui'
import { EASE_EXPO } from '../lib/motion'

/** Portada: quién, qué y el trabajo en la primera pantalla. Nombre, luego los hilos y las carpetas subiendo. */
export default function HomeTop() {
  const { about, img, site } = useContent()
  const t = useUi()
  const reduce = useReducedMotion()
  const rootRef = useRef(null)
  const nameRef = useRef(null)
  const introRef = useRef(null)
  const enter = (delay, y = 16) => (reduce ? {} : { initial: { opacity: 0, y }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay, ease: EASE_EXPO } })

  return (
    <>
      <section
        ref={rootRef}
        id="inicio"
        className="home-top relative isolate px-4 pb-10 pt-3 sm:px-8 lg:pb-14 lg:pt-4"
      >
        <FolderThreads rootRef={rootRef} nameRef={nameRef} blockRef={introRef} />

        <div className="home-head">
          <div ref={introRef} className="lg:col-span-2">
            <motion.h1 ref={nameRef} {...enter(0)} className="home-name">{site.name}</motion.h1>
            <motion.p {...enter(0.1)} className="home-statement">{t.statement}</motion.p>
          </div>
          <motion.div {...enter(0.2)} className="home-brief">
            <figure className="portrait home-photo">
              <img src={img('about/retrato')} alt={site.name} />
            </figure>
            <div className="min-w-0">
              <p className="text-base font-bold leading-snug text-ink">{about.lead}</p>
              <p className="mt-1 text-sm font-medium leading-snug text-ink/85">{t.heroUbicacion}</p>
              <a href="#sobre-mi" className="text-link text-sm">{about.title}</a>
            </div>
          </motion.div>
        </div>

        <h2 id="destacados" className="sr-only">{t.proyectos}</h2>
        <div className="home-folders">
          <ProjectFolders />
        </div>
      </section>

      <section id="sobre-mi" aria-labelledby="sobre-mi-titulo" className="px-4 py-10 sm:px-8 lg:py-16">
        <Reveal className="grid gap-x-6 gap-y-3 lg:grid-cols-3">
          <h2 id="sobre-mi-titulo" className="text-3xl font-bold tracking-[-0.025em] lg:text-[2.5rem] lg:leading-[1.1]">{about.title}</h2>
          <div className="lg:col-span-2">
            <p className="max-w-[62ch] text-lg leading-[1.6] text-ink/90">{t.sobreMiCorto}</p>
            <Link to="/curriculum" className="text-link mt-2">{t.verCurriculum}</Link>
          </div>
        </Reveal>
      </section>
    </>
  )
}
