import { useRef } from 'react'
import RibbonWave from '../components/RibbonWave'
import Hero from '../sections/Hero'
import About from '../sections/About'
import Portfolio from '../sections/Portfolio'
import Skills from '../sections/Skills'
import Contact from '../sections/Contact'
import useActiveSection from '../hooks/useActiveSection'
import { homeSections } from '../data/content'

/** Portada: cada bloque enlaza con su página (Currículum, Proyectos, Contacto) para ampliar la información. */
export default function Home() {
  const active = useActiveSection(homeSections)
  const mainRef = useRef(null)

  return (
    // Contenedor único: las cintas se pintan en un lienzo global que cruza todas las secciones
    <main ref={mainRef} className="relative isolate">
      <RibbonWave containerRef={mainRef} />
      <Hero active={active} />
      <About active={active} />
      <Portfolio />
      <Skills />
      <Contact active={active} band />
    </main>
  )
}
