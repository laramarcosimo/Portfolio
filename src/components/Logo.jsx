import { Link } from 'react-router-dom'
import { useContent } from '../data/useContent'

/** Logotipo real. `mono`: solo el monograma L·M·S (barra de navegación); si no, monograma + nombre. */
export default function Logo({ variant = 'azul', mono = false, className = 'h-10' }) {
  const { img, site } = useContent()
  const src = mono ? img('brand/monograma') : img(`brand/logo-${variant}`)
  return (
    <Link to="/" aria-label={`${site.name} — inicio`} className="inline-block">
      <img src={src} alt={site.name} className={`w-auto ${className}`} />
    </Link>
  )
}
