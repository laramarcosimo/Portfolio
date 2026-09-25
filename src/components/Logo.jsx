import { Link } from 'react-router-dom'
import { useContent } from '../data/useContent'
import { useTheme } from '../theme/ThemeContext'

/**
 * Logotipo real. `mono`: solo el monograma L·M·S (barra de navegación); si no, monograma + nombre.
 * `variant="auto"` (por defecto en la navbar) sigue el tema: blanco en fondo oscuro, azul en claro.
 * El monograma no tiene variante blanca propia, así que se invierte con un filtro CSS.
 */
export default function Logo({ variant = 'azul', mono = false, className = 'h-10' }) {
  const { img, site } = useContent()
  const { resolved } = useTheme()
  const isDark = variant === 'auto' ? resolved === 'dark' : variant === 'blanco'
  const src = mono ? img('brand/monograma') : img(`brand/logo-${isDark ? 'blanco' : 'azul'}`)
  return (
    <Link to="/" aria-label={`${site.name} — inicio`} className="inline-block">
      <img
        src={src}
        alt={site.name}
        className={`w-auto ${className}`}
        style={mono && isDark ? { filter: 'brightness(0) invert(1)' } : undefined}
      />
    </Link>
  )
}
