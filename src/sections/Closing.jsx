import { Link } from 'react-router-dom'
import { useUi } from '../i18n/ui'

/** Cierre: disponibilidad y una sola invitación directa; el correo está justo debajo, en el pie. */
export default function Closing() {
  const t = useUi()
  return (
    <section aria-labelledby="cierre" className="grid gap-x-6 gap-y-2 px-4 py-14 sm:px-8 sm:py-20 md:grid-cols-3 md:items-end">
      <h2 id="cierre" className="md:col-span-2">
        <Link to="/contacto" className="closing-cta">
          {t.escribeme} <span aria-hidden="true">→</span>
        </Link>
      </h2>
      <p className="text-base font-medium leading-snug text-ink/85">{t.heroUbicacion}</p>
    </section>
  )
}
