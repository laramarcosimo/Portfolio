import { useEffect, useRef } from 'react'
import { MotionConfig, motion } from 'framer-motion'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from '../sections/Footer'
import { useLanguage } from '../i18n/LanguageContext'
import { EASE_EXPO } from '../lib/motion'

const TITLES = {
  es: 'Lara Marco Simó — Portafolio',
  en: 'Lara Marco Simó — Portfolio',
}
const DESCRIPTIONS = {
  es: 'Portafolio de Lara Marco Simó: publicista y diseñadora gráfica digital. Identidad visual, diseño, motion y estrategia.',
  en: 'Portfolio of Lara Marco Simó: advertiser and digital graphic designer. Visual identity, design, motion and strategy.',
}

// Actualiza el título y la meta descripción de la página según el idioma activo.
function DocumentMeta() {
  const { lang } = useLanguage()
  useEffect(() => {
    document.title = TITLES[lang]
    document.documentElement.lang = lang
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', DESCRIPTIONS[lang])
  }, [lang])
  return null
}

// Al cambiar de página vuelve arriba (o va al ancla si la URL la trae).
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
    else window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])
  return null
}

/** Paso entre páginas: la nueva entra con un fundido y una subida corta. La primera carga no se anima (ya tiene su entrada). */
function PageTransition({ children }) {
  const { pathname } = useLocation()
  const first = useRef(true)
  useEffect(() => {
    first.current = false
  }, [])
  return (
    <motion.div
      key={pathname}
      initial={first.current ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE_EXPO }}
    >
      {children}
    </motion.div>
  )
}

// Al abrir o recargar la web, siempre se empieza en Inicio y arriba del todo.
function StartAtHome() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
    if (pathname !== '/') navigate('/', { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}

export default function Layout() {
  const { pathname } = useLocation()
  const isContact = pathname.replace(/\/$/, '') === '/contacto' // el cartel ya es el contacto
  return (
    <MotionConfig reducedMotion="user">
      <StartAtHome />
      <ScrollToTop />
      <DocumentMeta />
      <Navbar />
      <PageTransition>
        <Outlet />
        {!isContact && <Footer />}
      </PageTransition>
    </MotionConfig>
  )
}
