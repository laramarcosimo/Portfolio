import { Link } from 'react-router-dom'
import { InstagramIcon, LinkedInIcon } from '../components/BrandIcons'
import Logo from '../components/Logo'
import WaveBand from '../components/WaveBand'
import WhatsAppIcon from '../components/WhatsAppIcon'
import { useContent } from '../data/useContent'
import { useUi } from '../i18n/ui'

/** Pie único: la banda de ondas a todo el ancho y, sobre las tres columnas de las carpetas, dos filas alineadas. */
export default function Footer() {
  const { site } = useContent()
  const t = useUi()
  const social = [
    { label: 'LinkedIn', href: site.linkedin, Icon: LinkedInIcon },
    { label: 'Instagram', href: site.instagram, Icon: InstagramIcon },
    { label: 'WhatsApp', href: site.whatsapp, Icon: WhatsAppIcon },
  ]
  return (
    <footer id="site-footer" className="relative z-10 pt-6">
      <WaveBand />
      <div className="footer-grid px-4 pb-6 pt-6 sm:px-8">
        <div className="flex items-center gap-3">
          <Logo mono variant="auto" className="h-10" />
          <p className="text-sm leading-snug">
            <span className="block font-bold text-ink">{site.name}</span>
            <span className="block font-medium text-ink/80">{t.rolLinea}</span>
          </p>
        </div>
        <a href={`mailto:${site.email}`} className="footer-mail">{site.email}</a>
        <ul className="-ml-3 flex items-center gap-1 md:ml-0 md:-mr-3 md:justify-end">
          {social.map(({ label, href, Icon }) => (
            <li key={label}>
              <a href={href} target="_blank" rel="noreferrer" aria-label={label} title={label} className="footer-icon">
                <Icon size={20} />
              </a>
            </li>
          ))}
        </ul>
        <p className="order-last text-xs font-medium text-ink/80 md:order-none">{site.copyright}</p>
        <p className="text-sm font-medium text-ink/80">{t.heroUbicacion}</p>
        <div className="md:text-right">
          <Link to="/curriculum" className="text-link">{t.verCurriculum}</Link>
        </div>
      </div>
    </footer>
  )
}
