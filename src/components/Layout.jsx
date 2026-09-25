import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from '../sections/Footer'
import { useLanguage } from '../i18n/LanguageContext'

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
    else window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function Layout() {
  return (
    <>
      <ScrollToTop />
      <DocumentMeta />
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}
