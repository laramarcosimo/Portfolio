import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { navLinks } from '../data/content'
import Logo from './Logo'

export default function Navbar({ active }) {
  const [open, setOpen] = useState(false)
  // "Servicios" no está en el menú: cuenta como parte de Portafolio.
  const current = active === 'servicios' ? 'portafolio' : active

  return (
    <header className="sticky top-0 z-50 border-b border-navy/5 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5 sm:px-8" aria-label="Principal">
        <Logo />

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                className={`relative py-1 text-sm font-medium transition-colors hover:text-navy ${
                  current === l.id ? 'text-navy' : 'text-navy/70'
                }`}
              >
                {l.label}
                {current === l.id && (
                  <motion.span layoutId="nav-underline" className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-sky" />
                )}
              </a>
            </li>
          ))}
        </ul>

        <button
          className="grid h-10 w-10 place-items-center rounded-full text-navy md:hidden"
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
              <li key={l.id}>
                <a href={`#${l.id}`} onClick={() => setOpen(false)} className="block py-3 text-base font-medium text-navy">
                  {l.label}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  )
}
