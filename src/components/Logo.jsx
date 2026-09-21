import { Link } from 'react-router-dom'
import { img, site } from '../data/content'

/** Logotipo real. `mono`: solo el monograma L·M·S (barra de navegación); si no, monograma + nombre. */
export default function Logo({ variant = 'azul', mono = false, className = 'h-10' }) {
  const src = mono ? img('brand/monograma') : img(`brand/logo-${variant}`)
  return (
    <Link to="/" aria-label={`${site.name} — inicio`} className="inline-block">
      <img src={src} alt={site.name} className={`w-auto ${className}`} />
    </Link>
  )
}
