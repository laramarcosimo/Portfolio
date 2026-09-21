import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { navLinks } from '../data/content'
import Logo from './Logo'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  // "/proyectos/xyz" cuenta como Proyectos
  const isActive = (to) => (to === '/' ? pathname === '/' : pathname.startsWith(to))

  return (
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
          className="grid h-11 w-11 place-items-center rounded-full text-navy md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-navy/5 bg-white/95 px-5 md:hidden"
          >
            {navLinks.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.to === '/'} onClick={() => setOpen(false)} className="block py-3.5 text-lg font-semibold text-navy">
                  {l.label}
                </NavLink>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  )
}
