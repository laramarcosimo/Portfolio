import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Monitor, Moon, Sun, X } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { useContent } from '../data/useContent'
import { useTheme } from '../theme/ThemeContext'
import { useLanguage } from '../i18n/LanguageContext'
import { useUi } from '../i18n/ui'
import Logo from './Logo'

const THEME_OPTIONS = [
  { mode: 'light', label: 'Claro', icon: Sun },
  { mode: 'dark', label: 'Oscuro', icon: Moon },
  { mode: 'system', label: 'Sistema', icon: Monitor },
]

/** Interruptor de tema (claro/oscuro/sistema): tres botones icono, el activo resaltado. */
function ThemeToggle({ className = '' }) {
  const { mode, setMode, resolved } = useTheme()
  return (
    <div role="group" aria-label={`Tema: ${resolved === 'dark' ? 'oscuro' : 'claro'}`} className={`inline-flex items-center gap-0.5 rounded-full bg-ink/5 p-1 ${className}`}>
      {THEME_OPTIONS.map(({ mode: m, label, icon: Icon }) => (
        <button
          key={m}
          type="button"
          onClick={() => setMode(m)}
          aria-pressed={mode === m}
          aria-label={`Tema ${label.toLowerCase()}`}
          title={`Tema ${label.toLowerCase()}`}
          className={`grid h-8 w-8 place-items-center rounded-full transition-colors ${
            mode === m ? 'bg-navy text-white' : 'text-ink/60 hover:text-ink'
          }`}
        >
          <Icon size={15} strokeWidth={2.2} />
        </button>
      ))}
    </div>
  )
}

/** Selector de idioma (ES/EN): dos botones de texto, el activo resaltado, a juego con ThemeToggle. */
function LanguageToggle({ className = '' }) {
  const { lang, setLang } = useLanguage()
  return (
    <div role="group" aria-label="Idioma / Language" className={`inline-flex items-center gap-0.5 rounded-full bg-ink/5 p-1 ${className}`}>
      {['es', 'en'].map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          aria-label={l === 'es' ? 'Español' : 'English'}
          title={l === 'es' ? 'Español' : 'English'}
          className={`grid h-8 w-9 place-items-center rounded-full text-[11px] font-bold uppercase transition-colors ${
            lang === l ? 'bg-navy text-white' : 'text-ink/60 hover:text-ink'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  )
}

export default function Navbar() {
  const { navLinks } = useContent()
  const t = useUi()
  // El menú está abierto solo mientras la página no cambie (así se cierra solo al navegar, sin efectos)
  const { pathname } = useLocation()
  const [openAt, setOpenAt] = useState(null)
  const open = openAt === pathname
  const setOpen = (v) => setOpenAt(v ? pathname : null)
  // "/proyectos/xyz" cuenta como Proyectos
  const isActive = (to) => (to === '/' ? pathname === '/' : pathname.startsWith(to))

  // Con el menú abierto, Escape lo cierra
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && setOpenAt(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-ink/[0.06] bg-surface/80 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-4xl items-center justify-between px-5 sm:px-8" aria-label={t.navPrincipal}>
          <Logo mono variant="auto" className="h-10" />

          <ul className="hidden items-center gap-8 md:flex">
            {navLinks.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === '/'}
                  className={`relative py-1.5 text-[13px] font-medium text-ink transition-opacity hover:opacity-100 ${
                    isActive(l.to) ? 'opacity-100' : 'opacity-75'
                  }`}
                >
                  {l.label}
                  {isActive(l.to) && (
                    <motion.span layoutId="nav-underline" className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-navy" />
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-2 md:flex">
            <LanguageToggle />
            <ThemeToggle />
          </div>

          <button
            className="relative -mr-2 grid h-11 w-11 place-items-center rounded-full text-ink transition-colors hover:bg-ink/5 md:hidden"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.cerrarMenu : t.abrirMenu}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? 'x' : 'menu'}
                initial={{ rotate: -60, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 60, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="grid place-items-center"
              >
                {open ? <X size={21} /> : <Menu size={21} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </nav>
      </header>

      {/* Menú compacto: una tarjeta pequeña anclada al botón, sin tapar la página */}
      <AnimatePresence>
        {open && (
          <>
            <motion.button
              aria-label={t.cerrarMenu}
              tabIndex={-1}
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-0 bottom-0 top-16 z-40 cursor-default bg-ink/10 md:hidden"
            />
            <motion.nav
              id="mobile-menu"
              aria-label={t.menuMovil}
              initial={{ opacity: 0, scale: 0.94, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: -8 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'top right' }}
              className="fixed right-4 top-[4.25rem] z-50 w-[min(15rem,calc(100vw-2rem))] rounded-2xl bg-surface p-1.5 shadow-xl shadow-navy/15 ring-1 ring-ink/5 md:hidden"
            >
              <ul>
                {navLinks.map((l) => (
                  <li key={l.to}>
                    <NavLink
                      to={l.to}
                      end={l.to === '/'}
                      className={`flex min-h-11 items-center justify-between rounded-xl px-4 text-[15px] font-semibold transition-colors active:bg-ink/5 ${
                        isActive(l.to) ? 'text-ink' : 'text-ink/65'
                      }`}
                    >
                      {l.label}
                      {isActive(l.to) && <span className="h-1.5 w-1.5 rounded-full bg-lilac" aria-label={t.paginaActual} />}
                    </NavLink>
                  </li>
                ))}
              </ul>
              <div className="mt-1 flex items-center justify-between gap-2 border-t border-ink/10 px-3 py-2.5">
                <span className="text-xs font-semibold text-ink/55">{t.tema}</span>
                <ThemeToggle />
              </div>
              <div className="flex items-center justify-between gap-2 px-3 py-2.5">
                <span className="text-xs font-semibold text-ink/55">{t.idioma}</span>
                <LanguageToggle />
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
