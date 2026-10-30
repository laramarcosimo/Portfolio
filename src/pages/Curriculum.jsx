import { useEffect, useRef, useState } from 'react'
import { Car, Mail, MapPin, Phone, Printer, RotateCw } from 'lucide-react'
import { InstagramIcon, LinkedInIcon } from '../components/BrandIcons'
import RibbonBanner from '../components/RibbonBanner'
import { useContent } from '../data/useContent'
import { useUi } from '../i18n/ui'

/* Marcador de sección: filete lavanda + título en versalitas */
const Heading = ({ children, as: Tag = 'h2' }) => (
  <Tag className="flex items-center gap-3 eyebrow text-ink">
    <span className="h-px w-6 bg-lilac" aria-hidden="true" />
    {children}
  </Tag>
)

const FLIP_READ_MS = 6000

function SkillCard({ tool, label, text, img }) {
  const [flipped, setFlipped] = useState(false)
  const timerRef = useRef(null)

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }
  const revert = () => {
    clearTimer()
    setFlipped(false)
  }
  const reveal = () => {
    clearTimer()
    setFlipped(true)
    timerRef.current = setTimeout(revert, FLIP_READ_MS)
  }
  useEffect(() => clearTimer, [])

  return (
    <div className="flip h-36" data-flipped={flipped}>
      <button
        type="button"
        onClick={() => (flipped ? revert() : reveal())}
        aria-label={`${label}: ${text}`}
        aria-pressed={flipped}
        className="flip-inner block h-full w-full text-left"
      >
        <span className="flip-face flex flex-col items-center justify-center gap-2 bg-fog ring-1 ring-edge">
          <img src={img(`tools/${tool}`)} alt="" className="h-11 w-11" />
          <span className="text-[13px] font-semibold text-ink">{label}</span>
          <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center bg-surface text-ink/75 ring-1 ring-edge" aria-hidden="true">
            <RotateCw size={12} />
          </span>
        </span>
        <span className="flip-face flip-back flex items-center bg-brand p-3.5 text-xs leading-relaxed text-white">{text}</span>
      </button>
    </div>
  )
}

/* Entrada de la línea temporal: punto lavanda sobre una línea vertical */
function Entry({ date, title, href, role, desc }) {
  return (
    <li className="relative pb-7 pl-6 last:pb-0">
      <span className="absolute left-[1px] top-1.5 h-[7px] w-[7px] bg-lilac ring-4 ring-surface" aria-hidden="true" />
      <p className="text-xs font-semibold tabular-nums text-ink/75">{date}</p>
      <h3 className="mt-1 text-base font-bold leading-snug text-ink">
        {href ? (
          <a href={href} target="_blank" rel="noreferrer" className="underline decoration-lilac decoration-2 underline-offset-4 hover:text-ink">
            {title}
          </a>
        ) : (
          title
        )}
      </h3>
      <p className="mt-0.5 text-[13px] font-medium text-ink/75">{role}</p>
      {desc && <p className="mt-2 max-w-[60ch] text-[15px] leading-relaxed text-ink/75">{desc}</p>}
    </li>
  )
}

const Timeline = ({ items }) => (
  <ol className="relative mt-5 before:absolute before:bottom-2 before:left-[4px] before:top-2 before:w-px before:bg-ink/15">
    {items.map((e) => (
      <Entry key={e.title} {...e} />
    ))}
  </ol>
)

/** Currículum como documento: hoja con banda de cintas, barra lateral (datos) y columna principal. */
export default function Curriculum() {
  const { cv, img, site, skills } = useContent()
  const t = useUi()
  const [loc, lic] = cv.personal

  const contact = [
    { icon: Mail, label: site.email, href: `mailto:${site.email}` },
    { icon: Phone, label: site.phoneIntl, href: `tel:${site.phoneIntl.replace(/\s/g, '')}` },
    { icon: LinkedInIcon, label: 'LinkedIn', href: site.linkedin },
    { icon: InstagramIcon, label: site.instagramHandle, href: site.instagram },
  ]

  return (
    <main className="cv-page mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-8 sm:pb-28 sm:pt-12">
      <div className="no-print mb-6 flex justify-end">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex min-h-11 items-center gap-2 border border-ink/25 px-5 text-sm font-semibold text-ink transition-colors hover:border-ink hover:text-ink"
        >
          <Printer size={16} aria-hidden="true" /> {t.imprimir}
        </button>
      </div>

      <article className="cv-sheet overflow-hidden bg-surface ring-1 ring-edge">
        <RibbonBanner height={64} />

        <div className="grid md:grid-cols-[17rem_1fr]">
          {/* Barra lateral */}
          <aside className="bg-ink/[0.03] px-6 py-8 sm:px-8 md:py-10">
            <img
              src={img('about/retrato')}
              alt={site.name}
              className="bw h-28 w-28 object-cover object-top md:h-36 md:w-36"
            />
            <h1 className="headline mt-6 text-3xl text-ink sm:text-4xl">{site.name}</h1>
            <p className="mt-2 text-[15px] font-semibold text-ink/75">{t.rolLinea}</p>

            <section className="mt-8">
              <Heading>{t.contactoCvTitulo}</Heading>
              <ul className="mt-2 text-[14px] print:mt-4 print:space-y-2.5">
                {contact.map(({ icon: Icon, label, href }) => (
                  <li key={href}>
                    <a
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel="noreferrer"
                      className="flex min-h-11 items-center gap-2.5 break-all text-ink hover:text-ink print:min-h-0"
                    >
                      <Icon size={15} className="shrink-0 text-ink/75" aria-hidden="true" /> {label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-8">
              <Heading>{t.datos}</Heading>
              <ul className="mt-4 space-y-2.5 text-[14px] text-ink">
                <li className="flex items-center gap-2.5">
                  <MapPin size={15} className="shrink-0 text-ink/75" aria-hidden="true" /> {loc.value}
                </li>
                <li className="flex items-center gap-2.5">
                  <Car size={15} className="shrink-0 text-ink/75" aria-hidden="true" /> {t.carnet}: {lic.value}
                </li>
              </ul>
            </section>

            <section className="mt-8">
              <Heading>{t.software}</Heading>
              <ul className="mt-4 flex flex-wrap gap-2">
                {skills.map((s) => (
                  <li key={s.tool} className="flex items-center gap-1.5 bg-surface py-1 pl-1 pr-3 text-[13px] font-medium text-ink ring-1 ring-edge">
                    <img src={img(`tools/${s.tool}`)} alt="" className="h-5 w-5" />
                    {s.label}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-8">
              <Heading>{t.habilidadesEstrategicas}</Heading>
              <ul className="mt-4 space-y-3">
                {cv.strategic.map((s) => (
                  <li key={s.name}>
                    <p className="text-[14px] font-bold text-ink">{s.name}</p>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-ink/75">{s.desc}</p>
                  </li>
                ))}
              </ul>
            </section>

            <img src={img('brand/monograma')} alt="" className="cv-mono mt-10 h-10 w-auto opacity-80" />
          </aside>

          {/* Columna principal */}
          <div className="space-y-10 px-6 py-8 sm:px-10 md:py-10">
            <section>
              <Heading>{t.perfil}</Heading>
              <p className="mt-4 max-w-[60ch] text-[17px] leading-relaxed text-ink">{t.perfilCv}</p>
              <p className="mt-2 text-[14px] text-ink/75">{cv.subtitle}</p>
            </section>

            <section>
              <Heading>{t.experienciaLaboral}</Heading>
              <Timeline items={cv.experience} />
            </section>

            <section>
              <Heading>{t.educacion}</Heading>
              <Timeline items={cv.education} />
            </section>

            <section className="cv-tools">
              <Heading>{t.herramientasCv}</Heading>
              <p className="no-print mt-2 text-[13px] text-ink/75">{t.pulsaTarjeta}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {skills.map((s) => (
                  <SkillCard key={s.tool} {...s} img={img} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </article>
    </main>
  )
}
