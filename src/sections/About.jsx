import { Link } from 'react-router-dom'
import { useContent } from '../data/useContent'
import { useUi } from '../i18n/ui'

/** Sobre mí con presencia: retrato grande (con el bloque lavanda desplazado detrás) y texto breve y concreto. */
export default function About() {
  const { about, img, site } = useContent()
  const t = useUi()
  return (
    <section id="sobre-mi" className="relative z-10 mx-auto max-w-6xl px-4 pb-24 pt-20 sm:px-8 sm:pb-44 sm:pt-28">
      <div id="about-content" className="grid items-center gap-10 md:grid-cols-[2fr_3fr] md:gap-16">
        <div className="relative mx-auto w-[70%] max-w-[22rem] md:mx-0 md:w-full md:max-w-none">
          <div className="absolute -bottom-4 -right-4 h-full w-full rounded-[2rem] bg-lilac/30" aria-hidden="true" />
          <img
            src={img('about/retrato')}
            alt={`${site.name}`}
            loading="lazy"
            className="relative aspect-[4/5] w-full rounded-[2rem] object-cover object-top grayscale"
          />
        </div>
        <div className="max-w-[52ch]">
          <h2 className="headline text-4xl text-ink sm:text-5xl lg:text-6xl">{about.title}</h2>
          <p className="mt-6 text-lg leading-relaxed text-ink sm:text-xl">{t.sobreMiCorto}</p>
          <Link
            to="/curriculum"
            className="mt-8 inline-block text-[15px] font-semibold text-ink underline decoration-lilac decoration-2 underline-offset-[6px] transition-colors hover:text-lilac-ink sm:text-base"
          >
            {t.verCurriculum} →
          </Link>
        </div>
      </div>
    </section>
  )
}
