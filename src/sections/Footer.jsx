import { AtSign, MessageCircle } from 'lucide-react'
import { site } from '../data/content'

// lucide-react ya no incluye iconos de marcas: SVG propios.
const brandIcons = [
  {
    label: 'Instagram',
    href: site.instagram,
    path: 'M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3Zm4.5 5.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm5-2.25a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z',
  },
  {
    label: 'LinkedIn',
    href: site.linkedin,
    path: 'M4.5 9h3.5v11H4.5V9Zm1.75-5.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM10 9h3.3v1.6h.05C13.8 9.7 15 9 16.6 9c3.4 0 4 2.2 4 5.1V20h-3.5v-5.2c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8V20H10V9Z',
  },
]

const iconClass = 'grid h-9 w-9 place-items-center rounded-full text-white transition hover:bg-white/10 hover:text-sky'
const linkClass = 'underline-offset-4 hover:text-white hover:underline'

/** Pie de la web original: contacto resumido, redes y copyright. `phone`: 'phone' (608 350 840) o 'phoneIntl' (+34 …). */
export default function Footer({ phone = 'phone' }) {
  return (
    <footer id="site-footer" className="relative z-10 bg-navy text-white">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-5 py-9 text-center sm:px-8">
        <ul className="flex gap-1">
          {brandIcons.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className={iconClass}>
                <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor" aria-hidden="true">
                  <path d={s.path} />
                </svg>
              </a>
            </li>
          ))}
          <li>
            <a href={site.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp" className={iconClass}>
              <MessageCircle size={19} />
            </a>
          </li>
          <li>
            <a href={`mailto:${site.email}`} aria-label="Correo electrónico" className={iconClass}>
              <AtSign size={19} />
            </a>
          </li>
        </ul>

        <div className="space-y-1.5 text-xs font-medium text-white/85">
          <p>
            <a href={`mailto:${site.email}`} className={linkClass}>{site.email}</a> |{' '}
            <a href={site.whatsapp} target="_blank" rel="noreferrer" className={linkClass}>{site[phone]}</a> | {site.city}
          </p>
          <p>
            <a href={site.linkedin} target="_blank" rel="noreferrer" className={linkClass}>LinkedIn</a> |{' '}
            <a href={site.instagram} target="_blank" rel="noreferrer" className={linkClass}>Instagram</a>
          </p>
        </div>
        <hr className="w-full max-w-sm border-white/15" />
        <p className="text-[11px] text-white/70">{site.copyright}</p>
      </div>
    </footer>
  )
}
