import { Link } from 'react-router-dom'
import { useContent } from '../data/useContent'
import { useUi } from '../i18n/ui'

/** Contacto: los cuatro enlaces de la web original (correo, WhatsApp, LinkedIn e Instagram) como filas de texto. */
export default function Contact() {
  const { contactItems } = useContent()
  const t = useUi()
  const names = { mail: t.correoElectronico, phone: 'WhatsApp', linkedin: 'LinkedIn', instagram: 'Instagram' }
  return (
    <section id="contacto" className="mx-auto max-w-6xl px-4 pb-24 pt-16 sm:px-8 sm:pb-32 sm:pt-24">
      <h1 className="headline text-5xl text-ink sm:text-7xl">{t.contacto}</h1>
      <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-ink/75 sm:text-xl">{t.contactoIntro}</p>
      <Link
        to="/curriculum"
        className="mt-6 inline-block text-[15px] font-semibold text-ink underline decoration-lilac decoration-2 underline-offset-[6px] transition-colors hover:text-lilac-ink sm:text-base"
      >
        {t.contactoCv} →
      </Link>
      <ul className="mt-12 border-t border-ink/15 sm:mt-14">
        {contactItems.map((c) => (
          <li key={c.kind} className="border-b border-ink/15">
            <a
              href={c.href}
              target={c.kind === 'mail' ? undefined : '_blank'}
              rel="noreferrer"
              className="group grid gap-1 py-6 sm:grid-cols-[12rem_1fr] sm:items-baseline sm:gap-8 sm:py-8"
            >
              <span className="eyebrow text-ink/75">{names[c.kind]}</span>
              <span className="break-words text-2xl font-semibold tracking-tight text-ink transition-colors group-hover:text-lilac-ink sm:text-4xl">
                {c.label}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
