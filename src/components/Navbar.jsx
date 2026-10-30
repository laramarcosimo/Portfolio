import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { Menu, Monitor, Moon, Settings2, Sun, X } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { useContent } from '../data/useContent'
import { useTheme } from '../theme/ThemeContext'
import { useLanguage } from '../i18n/LanguageContext'
import { useUi } from '../i18n/ui'
import Logo from './Logo'

const THEMES = [['light', Sun], ['dark', Moon], ['system', Monitor]]

/** Tema: las tres opciones a la vista; la activa, rellena. */
function ThemeToggle() {
  const { mode, setMode } = useTheme()
  const t = useUi()
  return (
    <div role="group" aria-label={t.tema} className="theme-switch">
      {THEMES.map(([m, Icon]) => (
        <button key={m} type="button" onClick={() => setMode(m)} aria-pressed={mode === m} aria-label={`${t.tema}: ${t.temaModo[m]}`} title={`${t.tema}: ${t.temaModo[m]}`}>
          <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
        </button>
      ))}
    </div>
  )
}

/** Idioma: dos palabras de texto, la activa con una marca fina. */
function LanguageToggle() {
  const { lang, setLang } = useLanguage()
  return (
    <div role="group" aria-label="Idioma / Language" className="inline-flex items-center gap-3">
      {['es', 'en'].map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          aria-label={l === 'es' ? 'Español' : 'English'}
          className={`caps quiet-mark min-h-11 min-w-6 transition-colors duration-300 ${lang === l ? 'is-active text-ink' : 'text-ink/75 hover:text-ink'}`}
        >
          {l}
        </button>
      ))}
    </div>
  )
}

const DESKTOP = '(min-width: 768px)'
const subscribeDesktop = (cb) => {
  const mq = window.matchMedia(DESKTOP)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}
const isDesktopNow = () => window.matchMedia(DESKTOP).matches

export default function Navbar() {
  const { navLinks } = useContent()
  const desktop = useSyncExternalStore(subscribeDesktop, isDesktopNow)
  const RibbonBody = desktop ? 'div' : 'nav'
  const t = useUi()
  // El menú está abierto solo mientras la página no cambie (así se cierra solo al navegar, sin efectos)
  const { pathname } = useLocation()
  const [openAt, setOpenAt] = useState(null)
  const open = openAt === pathname
  const setOpen = (v) => setOpenAt(v ? pathname : null)
  // "/proyectos/xyz" cuenta como Proyectos
  const isActive = (to) => (to === '/' ? pathname === '/' : pathname.startsWith(to))

  const ribbonRef = useRef(null)
  const toggleRef = useRef(null)
  const close = () => {
    setOpenAt(null)
    toggleRef.current?.focus({ preventScroll: true })
  }

  // Al abrir, el foco pasa al primer control; Escape o un clic fuera cierran y Tab da la vuelta dentro de la cinta
  useEffect(() => {
    if (!open) return undefined
    ribbonRef.current.querySelector('.ribbon-body a[href], .ribbon-body button')?.focus({ preventScroll: true })
    const onOutside = (e) => {
      if (ribbonRef.current.contains(e.target)) return
      const inside = ribbonRef.current.contains(document.activeElement)
      setOpenAt(null)
      if (inside) toggleRef.current?.focus({ preventScroll: true })
    }
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpenAt(null)
        toggleRef.current?.focus({ preventScroll: true })
      }
      if (e.key !== 'Tab') return
      const items = [...ribbonRef.current.querySelectorAll('a[href], button')]
      const [first, last] = [items[0], items[items.length - 1]]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onOutside)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onOutside)
    }
  }, [open])

  return (
    <>
      <header
        className="sticky top-0 z-50 bg-page"
      >
        <nav className="flex h-16 items-center justify-between px-4 sm:px-8 md:pr-24" aria-label={t.navPrincipal}>
          <Logo mono variant="auto" className="h-9" />

          <ul className="hidden items-center gap-10 md:flex">
            {navLinks.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === '/'}
                  className={`eyebrow quiet-mark inline-flex min-h-11 min-w-6 items-center transition-colors duration-300 hover:text-ink ${isActive(l.to) ? 'is-active text-ink' : 'text-ink/75'}`}
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

        </nav>
      </header>

      {/* Un marcapáginas que cuelga arriba a la derecha; al pulsarlo, la misma cinta crece. En móvil lleva el menú; en escritorio, idioma y tema */}
      <div className="ribbon-scrim md:hidden" data-open={open} aria-hidden="true" onClick={close} />
      <div ref={ribbonRef} className="ribbon" data-open={open}>
        <button
          ref={toggleRef}
          type="button"
          className="ribbon-toggle"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="ribbon-body"
          aria-label={desktop ? (open ? t.cerrarAjustes : t.abrirAjustes) : open ? t.cerrarMenu : t.abrirMenu}
        >
          {open ? <X size={22} strokeWidth={1.75} aria-hidden="true" /> : desktop ? <Settings2 size={22} strokeWidth={1.75} aria-hidden="true" /> : <Menu size={22} strokeWidth={1.75} aria-hidden="true" />}
        </button>
        <RibbonBody id="ribbon-body" aria-label={desktop ? t.ajustes : t.menuMovil} {...(desktop && { role: 'group' })} className="ribbon-body" inert={!open}>
          {!desktop && (
            <ul>
              {navLinks.map((l) => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    end={l.to === '/'}
                    aria-current={isActive(l.to) ? 'page' : undefined}
                    onClick={() => setOpenAt(null)}
                    className={`ribbon-link quiet-mark ${isActive(l.to) ? 'is-active' : ''}`}
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
          <div className="ribbon-controls">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </RibbonBody>
      </div>
    </>
  )
}
