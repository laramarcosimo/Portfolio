import './styles/global.css'
import Navbar from './components/Navbar'
import FloatingAction from './components/FloatingAction'
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

  return (
    <>
      <Navbar active={active} />
      <main>
        <Hero />
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
