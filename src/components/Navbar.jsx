import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { navLinks } from '../data/content'
import Logo from './Logo'

export default function Navbar() {
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
      <header className="sticky top-0 z-50 bg-white/80 shadow-[0_1px_0_rgba(25,42,86,0.06)] backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-4xl items-center justify-between px-5 sm:px-8" aria-label="Principal">
          <Logo mono className="h-10" />

          <ul className="hidden items-center gap-8 md:flex">
            {navLinks.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === '/'}
                  className={`relative py-1.5 text-[13px] font-medium text-navy transition-opacity hover:opacity-100 ${
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

          <button
            className="relative -mr-2 grid h-11 w-11 place-items-center rounded-full text-navy transition-colors hover:bg-navy/5 md:hidden"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
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
              aria-label="Cerrar menú"
              tabIndex={-1}
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-0 bottom-0 top-16 z-40 cursor-default bg-navy/10 md:hidden"
            />
            <motion.nav
              id="mobile-menu"
              aria-label="Menú móvil"
              initial={{ opacity: 0, scale: 0.94, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: -8 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'top right' }}
              className="fixed right-4 top-[4.25rem] z-50 w-[min(15rem,calc(100vw-2rem))] rounded-2xl bg-white p-1.5 shadow-xl shadow-navy/15 ring-1 ring-navy/5 md:hidden"
            >
              <ul>
                {navLinks.map((l) => (
                  <li key={l.to}>
                    <NavLink
                      to={l.to}
                      end={l.to === '/'}
                      className={`flex min-h-11 items-center justify-between rounded-xl px-4 text-[15px] font-semibold transition-colors active:bg-navy/5 ${
                        isActive(l.to) ? 'text-navy' : 'text-navy/65'
                      }`}
                    >
                      {l.label}
                      {isActive(l.to) && <span className="h-1.5 w-1.5 rounded-full bg-lilac" aria-label="Página actual" />}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
