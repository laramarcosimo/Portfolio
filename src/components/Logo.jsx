import { site } from '../data/content'

// Monograma con degradado navy → lavanda. Sustituye por tu logotipo SVG cuando lo tengas.
export default function Logo({ className = '' }) {
  return (
    <a href="#inicio" aria-label={site.name} className={`inline-block ${className}`}>
      <svg viewBox="0 0 64 40" className="h-9 w-auto" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="logo-g" x1="0" x2="1">
            <stop offset="0" stopColor="#192a56" />
            <stop offset="1" stopColor="#9690e4" />
          </linearGradient>
        </defs>
        <text x="32" y="32" textAnchor="middle" fontSize="34" fontWeight="800" fontStyle="italic" fill="url(#logo-g)" fontFamily="Plus Jakarta Sans, sans-serif" letterSpacing="-2">
          LM
        </text>
      </svg>
    </a>
  )
}
