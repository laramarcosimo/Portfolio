import { useRef } from 'react'
import FluidLines from '../components/FluidLines'
import HorizontalProjects from '../components/HorizontalProjects'
import Hero from '../sections/Hero'
import About from '../sections/About'
import Contact from '../sections/Contact'
import { HERO_ABOUT_IDS, heroAboutRoute } from '../lib/homeRoutes'

/**
 * Portada: presentación (Hero + Sobre Mí), proyectos destacados con scroll horizontal anclado y contacto.
 * Fondo blanco puro; las líneas fluidas guían la mirada entre los bloques.
 */
export default function Home() {
  const topRef = useRef(null)

  return (
    <main>
      <div ref={topRef} className="relative isolate">
        <FluidLines containerRef={topRef} ids={HERO_ABOUT_IDS} build={heroAboutRoute} />
        <Hero />
        <About />
      </div>
      <HorizontalProjects />
      <Contact />
    </main>
  )
}
