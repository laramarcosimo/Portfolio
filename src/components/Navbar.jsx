import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { navLinks } from '../data/content'
import Logo from './Logo'

// La referencia muestra cuatro enlaces; "Servicios" cuenta como parte de Portafolio.
const links = navLinks.filter((l) => l.id !== 'servicios')

export default function Navbar({ active }) {
  const [open, setOpen] = useState(false)
  const current = active === 'servicios' ? 'portafolio' : active

  return (
    <header className="sticky top-0 z-50 bg-white/80 shadow-[0_1px_0_rgba(25,42,86,0.06)] backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-4xl items-center justify-between px-5 sm:px-8" aria-label="Principal">
        <Logo mono className="h-10" />

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                className={`relative py-1.5 text-[13px] font-medium text-navy transition-opacity hover:opacity-100 ${
                  current === l.id ? 'opacity-100' : 'opacity-75'
                }`}
              >
                {l.label}
                {current === l.id && (
                  <motion.span layoutId="nav-underline" className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-navy" />
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
            {links.map((l) => (
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
