import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, AtSign, Menu, X } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { navLinks, site } from '../data/content'
import Logo from './Logo'
import RibbonBanner from './RibbonBanner'
import WhatsAppIcon from './WhatsAppIcon'

export default function Navbar() {
  // El menú está abierto solo mientras la página no cambie (así se cierra solo al navegar, sin efectos)
  const { pathname } = useLocation()
  const [openAt, setOpenAt] = useState(null)
  const open = openAt === pathname
  const setOpen = (v) => setOpenAt(v ? pathname : null)
  // "/proyectos/xyz" cuenta como Proyectos
  const isActive = (to) => (to === '/' ? pathname === '/' : pathname.startsWith(to))

  // Con el menú abierto: sin scroll de fondo y Escape lo cierra
  useEffect(() => {
    if (!open) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && setOpenAt(null)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      {/* Con el menú abierto la barra se vuelve sólida para fundirse con el panel */}
      <header
        className={`sticky top-0 z-50 shadow-[0_1px_0_rgba(25,42,86,0.06)] transition-colors duration-300 ${
          open ? 'bg-white' : 'bg-white/80 backdrop-blur-md'
        }`}
      >
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
            className="relative grid h-11 w-11 place-items-center rounded-full text-navy transition-colors hover:bg-navy/5 md:hidden"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? 'x' : 'menu'}
                initial={{ rotate: -80, opacity: 0, scale: 0.7 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 80, opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.18 }}
                className="grid place-items-center"
              >
                {open ? <X size={22} /> : <Menu size={22} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </nav>
      </header>

      {/* Panel a pantalla completa bajo la barra: una extensión de la propia cabecera */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col overflow-y-auto bg-white md:hidden"
          >
            <nav aria-label="Menú móvil" className="flex-1 px-7 pt-4">
              <ul>
                {navLinks.map((l, i) => (
                  <motion.li
                    key={l.to}
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.1 + i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="border-b border-navy/10"
                  >
                    <NavLink to={l.to} end={l.to === '/'} className="group flex min-h-[4.5rem] items-center gap-5 py-3">
                      <span className="w-6 text-xs font-semibold tabular-nums text-lilac">{String(i + 1).padStart(2, '0')}</span>
                      <span className={`text-[1.75rem] font-semibold tracking-tight transition-colors ${isActive(l.to) ? 'text-navy' : 'text-navy/55 group-active:text-navy'}`}>
                        {l.label}
                      </span>
                      {isActive(l.to) ? (
                        <span className="ml-auto h-2 w-2 rounded-full bg-sky" aria-label="Página actual" />
                      ) : (
                        <ArrowRight size={18} className="ml-auto text-navy/30 transition group-active:translate-x-1 group-active:text-navy" />
                      )}
                    </NavLink>
                  </motion.li>
                ))}
              </ul>

              {/* Contacto rápido */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + navLinks.length * 0.07, duration: 0.45 }}
                className="mt-8 flex flex-col gap-3"
              >
                <a href={`mailto:${site.email}`} className="flex min-h-11 items-center gap-3 text-sm font-semibold text-navy">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-sky/30">
                    <AtSign size={18} />
                  </span>
                  {site.email}
                </a>
                <a href={site.whatsapp} target="_blank" rel="noreferrer" className="flex min-h-11 items-center gap-3 text-sm font-semibold text-navy">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-sky/30">
                    <WhatsAppIcon size={18} />
                  </span>
                  {site.phoneIntl}
                </a>
              </motion.div>
            </nav>

            {/* Las tres líneas de la marca cierran el panel, con el mismo remate que en el resto de la web */}
            <div className="mt-8 shrink-0" aria-hidden="true">
              <RibbonBanner height={110} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
