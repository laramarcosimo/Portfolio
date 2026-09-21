import { useState } from 'react'
import { motion } from 'framer-motion'
import { Cake, Car, Flag, GraduationCap, Briefcase, Star, UserPen, Wrench } from 'lucide-react'
import RibbonBanner from '../components/RibbonBanner'
import useActiveSection from '../hooks/useActiveSection'
import { about, cv, img, site, skills } from '../data/content'

const nav = [
  ['sobre-mi', 'Sobre mí'],
  ['formacion', 'Educación'],
  ['experiencia', 'Experiencia'],
  ['skills', 'Habilidades'],
  ['aficiones', 'Intereses'],
]
const ids = nav.map(([id]) => id)

const Heading = ({ icon: Icon, children }) => (
  <h2 className="flex items-center gap-2.5 text-sm font-bold tracking-[0.14em] text-navy">
    <Icon size={18} className="text-lilac" /> {children}
  </h2>
)

function SkillCard({ tool, label, text }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <div className="flip h-44" data-flipped={flipped}>
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-label={`${label}: ${text}`}
        aria-pressed={flipped}
        className="flip-inner block h-full w-full text-left"
      >
        <span className="flip-face grid place-items-center rounded-2xl bg-fog shadow-sm">
          <img src={img(`tools/${tool}`)} alt={`Logo ${label}`} className="h-16 w-16" />
        </span>
        <span className="flip-face flip-back flex items-center rounded-2xl bg-navy p-4 text-xs leading-relaxed text-white">“{text}”</span>
      </button>
    </div>
  )
}

function Bar({ name, value, desc }) {
  return (
    <div>
      <div className="flex items-baseline justify-between text-[13px] font-semibold text-navy">
        <span>{name}</span>
        <span>{value}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-fog" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={name}>
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-navy to-lilac"
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
        />
      </div>
      <p className="mt-1.5 text-xs text-navy/65">{desc}</p>
    </div>
  )
}

/** Página de currículum: la información ampliada de la web original. */
export default function Curriculum() {
  const active = useActiveSection(ids)

  return (
    <main>
      <RibbonBanner height={190} />

      <header className="mx-auto max-w-3xl px-5 pt-14 text-center sm:px-8">
        <img src={img('about/retrato')} alt={site.name} className="mx-auto h-32 w-32 rounded-full object-cover object-top shadow-lg ring-4 ring-white" />
        <h1 className="mt-5 font-serif text-4xl font-medium tracking-tight text-navy">{site.name}</h1>
        <p className="mt-2 text-sm font-medium text-navy/70">{cv.subtitle}</p>
      </header>

      {/* Navegación interna en móvil: chips que se quedan fijos bajo la barra superior */}
      <nav aria-label="Secciones del currículum" className="sticky top-16 z-40 mt-10 border-y border-navy/5 bg-white/90 backdrop-blur-md lg:hidden">
        <ul className="no-scrollbar mx-auto flex max-w-4xl gap-2 overflow-x-auto px-5 py-2.5">
          {nav.map(([id, label]) => (
            <li key={id} className="shrink-0">
              <a
                href={`#${id}`}
                aria-current={active === id}
                className={`block rounded-full px-4 py-2.5 text-xs font-semibold transition ${active === id ? 'bg-navy text-white' : 'bg-fog text-navy'}`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mx-auto grid max-w-4xl gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[9rem_1fr] lg:py-16">
        <aside className="hidden lg:block">
          <ul className="sticky top-28 space-y-1 text-[13px] font-medium">
            {nav.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`} className={`block border-l-2 py-1 pl-3 transition ${active === id ? 'border-navy text-navy' : 'border-transparent text-navy/55 hover:text-navy'}`}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <div className="space-y-16">
          <section id="sobre-mi">
            <Heading icon={UserPen}>SOBRE MÍ</Heading>
            <p className="mt-4 text-sm leading-relaxed text-navy/80">{about.bio}</p>
            <ul className="mt-5 grid gap-2 sm:grid-cols-3">
              {cv.personal.map(({ label, value }, i) => {
                const Icon = [Cake, Flag, Car][i]
                return (
                  <li key={label} className="flex items-center gap-2 rounded-xl bg-fog px-4 py-3 text-xs text-navy">
                    <Icon size={16} className="text-lilac" />
                    <span>
                      <strong>{label}:</strong> {value}
                    </span>
                  </li>
                )
              })}
            </ul>
          </section>

          <section id="formacion">
            <Heading icon={GraduationCap}>EDUCACIÓN</Heading>
            <ol className="mt-5 space-y-3 border-l-2 border-sky/60 pl-5">
              {cv.education.map((e) => (
                <li key={e.title} className="rounded-xl bg-fog px-5 py-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h3 className="text-[13px] font-bold text-navy">{e.title}</h3>
                    <span className="text-xs font-semibold text-lilac">{e.date}</span>
                  </div>
                  <p className="mt-1 text-xs text-navy/70">{e.role}</p>
                </li>
              ))}
            </ol>
          </section>

          <section id="experiencia">
            <Heading icon={Briefcase}>EXPERIENCIA LABORAL</Heading>
            <ol className="mt-5 space-y-3 border-l-2 border-sky/60 pl-5">
              {cv.experience.map((e) => (
                <li key={e.title} className="rounded-xl bg-fog px-5 py-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h3 className="text-[13px] font-bold text-navy">
                      <a href={e.href} target="_blank" rel="noreferrer" className="underline decoration-sky decoration-2 underline-offset-4 hover:text-lilac">
                        {e.title}
                      </a>
                    </h3>
                    <span className="text-xs font-semibold text-lilac">{e.date}</span>
                  </div>
                  <p className="mt-1 text-xs font-medium text-navy/80">{e.role}</p>
                  <p className="mt-1 text-xs text-navy/65">{e.desc}</p>
                </li>
              ))}
            </ol>
          </section>

          <section id="skills">
            <Heading icon={Wrench}>HABILIDADES</Heading>
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {skills.map((s) => (
                <SkillCard key={s.tool} {...s} />
              ))}
            </div>

            <h3 className="mt-12 text-sm font-bold text-navy">Habilidades Estratégicas</h3>
            <div className="mt-5 space-y-6">
              {cv.strategic.map((s) => (
                <Bar key={s.name} {...s} />
              ))}
            </div>
          </section>

          <section id="aficiones">
            <Heading icon={Star}>INTERESES</Heading>
            <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {cv.interests.map(({ icon: Icon, label }) => (
                <li key={label} className="flex flex-col items-center gap-2 rounded-2xl bg-fog px-3 py-6 text-center text-xs font-semibold text-navy">
                  <Icon size={24} strokeWidth={1.5} className="text-lilac" />
                  {label}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  )
}
