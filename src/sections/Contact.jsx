import { AtSign } from 'lucide-react'
import WhatsAppIcon from '../components/WhatsAppIcon'
import Reveal from '../components/Reveal'
import { contactItems } from '../data/content'

// Iconos de los enlaces de contacto (la web original: correo, WhatsApp, LinkedIn e Instagram)
const brandPaths = {
  instagram:
    'M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3Zm4.5 5.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm5-2.25a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z',
  linkedin:
    'M4.5 9h3.5v11H4.5V9Zm1.75-5.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM10 9h3.3v1.6h.05C13.8 9.7 15 9 16.6 9c3.4 0 4 2.2 4 5.1V20h-3.5v-5.2c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8V20H10V9Z',
}

function ContactIcon({ kind }) {
  if (kind === 'mail') return <AtSign size={18} />
  if (kind === 'phone') return <WhatsAppIcon size={18} />
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d={brandPaths[kind]} />
    </svg>
  )
}

/** Contacto: los cuatro enlaces de la web original (correo, WhatsApp, LinkedIn e Instagram). */
export default function Contact() {
  return (
    <section id="contacto" className="relative py-16 sm:py-20">
      <Reveal className="mx-auto max-w-3xl px-5 sm:px-8">
        <h2 className="text-3xl font-medium tracking-tight text-navy">Contacto</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {contactItems.map((c) => (
            <li key={c.kind}>
              <a
                href={c.href}
                target={c.kind === 'mail' ? undefined : '_blank'}
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-navy/10 px-4 py-3.5 text-[13px] font-semibold text-navy transition hover:border-lilac hover:text-lilac"
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-sky/30">
                  <ContactIcon kind={c.kind} />
                </span>
                {c.label}
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}
