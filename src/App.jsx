import { useRef } from 'react'
import './styles/global.css'
import Navbar from './components/Navbar'
import FloatingAction from './components/FloatingAction'
import RibbonWave from './components/RibbonWave'
import Hero from './sections/Hero'
import About from './sections/About'
import Portfolio from './sections/Portfolio'
import Services from './sections/Services'
import Contact from './sections/Contact'
import Footer from './sections/Footer'
import useActiveSection from './hooks/useActiveSection'
import { sectionIds } from './data/content'

export default function App() {
  const active = useActiveSection(sectionIds)
  const mainRef = useRef(null)

  return (
    <>
      <Navbar active={active} />
      {/* Contenedor único: las cintas se pintan en un lienzo global que cruza todas las secciones */}
      <main ref={mainRef} className="relative isolate">
        <RibbonWave containerRef={mainRef} />
        <Hero active={active} />
        <About />
        <Portfolio />
        <Services />
        <Contact />
      </main>
      <Footer />
      <FloatingAction active={active} />
    </>
  )
}
