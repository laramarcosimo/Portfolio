import { site } from '../data/content'

// lucide-react ya no incluye iconos de marcas: SVG propios.
const socials = [
  {
    label: 'Facebook',
    href: 'https://facebook.com/',
    path: 'M13.5 21v-8h2.7l.5-3.2h-3.2V7.9c0-.9.3-1.6 1.7-1.6H17V3.4c-.3 0-1.3-.1-2.4-.1-2.5 0-4.1 1.5-4.1 4.2v2.3H7.8V13h2.7v8h3Z',
  },
  {
    label: 'X (Twitter)',
    href: 'https://x.com/',
    path: 'M17.5 3h3l-6.6 7.5L21.7 21h-6l-4.7-6.1L5.5 21h-3l7-8L2.3 3h6.1l4.3 5.6L17.5 3Zm-1 16.2h1.7L7.600 4.700H5.800l10.700 14.500Z',
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/',
    path: 'M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3Zm4.5 5.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm5-2.25a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z',
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com/',
    path: 'M21.600 7.200a2.500 2.500 0 0 0-1.800-1.800C18.200 5 12 5 12 5s-6.200 0-7.800.4A2.500 2.500 0 0 0 2.400 7.200C2 8.800 2 12 2 12s0 3.200.4 4.800a2.500 2.500 0 0 0 1.800 1.800C5.800 19 12 19 12 19s6.200 0 7.800-.4a2.500 2.500 0 0 0 1.800-1.800c.4-1.600.4-4.800.4-4.800s0-3.200-.4-4.800ZM10 15V9l5.200 3-5.200 3Z',
  },
]

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-between gap-6 px-5 py-9 sm:px-8 md:flex-row">
        <ul className="flex gap-4">
          {socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="grid h-9 w-9 place-items-center rounded-full text-white transition hover:bg-white/10 hover:text-sky"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                  <path d={s.path} />
                </svg>
              </a>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/80">
          <a href="#inicio" className="hover:text-white">Inicio</a>
          <a href="#" className="hover:text-white">Política de privacidad</a>
          <a href="#" className="hover:text-white">Términos</a>
          <span>© {new Date().getFullYear()} {site.name}</span>
        </div>
      </div>
    </footer>
  )
}
