import { AtSign } from 'lucide-react'
import RibbonBanner from '../components/RibbonBanner'
import WhatsAppIcon from '../components/WhatsAppIcon'
import { useContent } from '../data/useContent'
import { useUi } from '../i18n/ui'

// lucide-react ya no incluye iconos de marcas: SVG propios.
const brandPaths = {
  instagram:
    'M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3Zm4.5 5.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm5-2.25a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z',
  linkedin:
    'M4.5 9h3.5v11H4.5V9Zm1.75-5.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM10 9h3.3v1.6h.05C13.8 9.7 15 9 16.6 9c3.4 0 4 2.2 4 5.1V20h-3.5v-5.2c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8V20H10V9Z',
}
const Brand = ({ kind }) => (
  <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor" aria-hidden="true">
    <path d={brandPaths[kind]} />
  </svg>
)

/** Pie de página: las tres líneas de la marca, iconos de contacto y copyright, sobre fondo blanco como el resto de la web. */
export default function Footer() {
  const { site } = useContent()
  const t = useUi()
  // Solo iconos (cada enlace lleva su nombre accesible para lectores de pantalla)
  const links = [
    { label: t.correoElectronico, href: `mailto:${site.email}`, icon: <AtSign size={19} /> },
    { label: 'WhatsApp', href: site.whatsapp, icon: <WhatsAppIcon size={19} />, external: true },
    { label: 'LinkedIn', href: site.linkedin, icon: <Brand kind="linkedin" />, external: true },
    { label: 'Instagram', href: site.instagram, icon: <Brand kind="instagram" />, external: true },
  ]
  return (
    <footer id="site-footer" className="relative z-10">
      <RibbonBanner height={84} />
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-5 pb-10 pt-4 text-center sm:px-8">
        <ul className="flex items-center gap-3">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                {...(l.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                aria-label={l.label}
                className="grid h-11 w-11 place-items-center rounded-full border border-ink/15 text-ink transition hover:-translate-y-0.5 hover:border-navy hover:bg-navy hover:text-white"
              >
                {l.icon}
              </a>
            </li>
          ))}
        </ul>
        <p className="text-[11px] font-medium text-ink/55">{site.copyright}</p>
      </div>
    </footer>
  )
}
