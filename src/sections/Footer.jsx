import { FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import { useContactRoutes } from '../components/useContactRoutes'
import { useContent } from '../data/useContent'
import { useUi } from '../i18n/ui'

const TONES = { mail: 'navy', wa: 'sky', li: 'lilac', ig: 'navy' }

function Card({ Icon, name, detail }) {
  return (
    <>
      <span className="folder-waves" aria-hidden="true" />
      <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
      <span className="footer-card-name">{name}</span>
      <span className="footer-card-detail">{detail}</span>
    </>
  )
}

/** Pie: quién firma, en pequeño, y las vías de contacto como pestañas de carpeta que nacen del borde inferior. */
export default function Footer() {
  const { site } = useContent()
  const t = useUi()
  const routes = useContactRoutes()
  return (
    <footer id="site-footer" className="footer">
      <div className="footer-id">
        <div className="flex items-center gap-3">
          <Logo mono variant="auto" className="h-9" />
          <p className="text-sm leading-snug">
            <span className="block font-bold text-ink">{site.name}</span>
            <span className="block font-medium text-ink/80">{t.rolLinea}</span>
          </p>
        </div>
        <p className="footer-legal">
          <span>{t.heroUbicacion}</span>
          <span>{site.copyright}</span>
        </p>
      </div>
      <ul className="footer-cards">
        {routes.map(({ key, Icon, name, detail, href, external }) => (
          <li key={key}>
            <a href={href} aria-label={`${name}: ${detail}`} {...(external && { target: '_blank', rel: 'noreferrer' })} className={`footer-card folder--${TONES[key]}`}>
              <Card Icon={Icon} name={name} detail={detail} />
            </a>
          </li>
        ))}
        <li>
          <Link to="/curriculum" aria-label={t.verCurriculum} className="footer-card folder--sky">
            <Card Icon={FileText} name={t.curriculumLabel} detail={t.verCurriculum} />
          </Link>
        </li>
      </ul>
    </footer>
  )
}
