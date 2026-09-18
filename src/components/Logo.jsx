import { img, site } from '../data/content'

/** Logotipo real (monograma L·M·S en ola + nombre). `variant`: azul (fondo claro) o blanco. */
export default function Logo({ variant = 'azul', className = 'h-10' }) {
  return (
    <a href="#inicio" aria-label={`${site.name} — inicio`} className="inline-block">
      <img src={img(`brand/logo-${variant}`)} alt={site.name} className={`w-auto ${className}`} />
    </a>
  )
}
