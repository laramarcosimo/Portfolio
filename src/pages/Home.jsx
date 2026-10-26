import { useRef } from 'react'
import { Link } from 'react-router-dom'
import FluidLines from '../components/FluidLines'
import ProjectCard from '../components/ProjectCard'
import Reveal from '../components/Reveal'
import Hero from '../sections/Hero'
import About from '../sections/About'
import { useContent } from '../data/useContent'
import { useUi } from '../i18n/ui'
import { HOME_IDS, homeReveal, homeRoute } from '../lib/homeRoutes'

/**
 * Portada: declaración → Sobre mí (retrato grande) → proyectos destacados → cierre con contacto.
 * Las tres líneas de la marca hacen de hilo conductor entre los tres primeros bloques.
 */
export default function Home() {
  const wrapRef = useRef(null)
  const t = useUi()
  const { featuredProjects } = useContent()

  return (
    <main>
      <div ref={wrapRef} className="relative isolate">
        <FluidLines containerRef={wrapRef} ids={HOME_IDS} build={homeRoute} minReveal={homeReveal} />
        <Hero />
        <About />
        <section id="trabajo-index" aria-labelledby="destacados" className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-4 sm:px-8 sm:pb-28 sm:pt-6">
          <h2 id="destacados" className="headline text-3xl text-ink sm:text-5xl">{t.destacados}</h2>
          <ul className="mt-10 grid gap-x-10 gap-y-14 sm:mt-14 md:grid-cols-2 md:gap-y-20">
            {featuredProjects.map((p) => (
              <li key={p.slug}>
                <Reveal>
                  <ProjectCard project={p} />
                </Reveal>
              </li>
            ))}
          </ul>
          <Link
            to="/proyectos"
            className="mt-14 inline-block text-[15px] font-semibold text-ink underline decoration-lilac decoration-2 underline-offset-[6px] transition-colors hover:text-lilac-ink sm:text-base"
          >
            {t.verTodos} →
          </Link>
        </section>
      </div>

      <section aria-labelledby="cierre" className="mx-auto max-w-6xl px-4 pb-16 sm:px-8 sm:pb-24">
        <div className="rounded-[2rem] bg-lilac/15 px-6 py-12 sm:px-12 sm:py-16">
          <h2 id="cierre" className="headline max-w-[20ch] text-3xl text-ink sm:text-5xl">{t.cierreTitulo}</h2>
          <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-ink/75 sm:text-lg">{t.cierreTexto}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/contacto"
              className="inline-flex min-h-11 items-center rounded-full bg-navy px-7 text-sm font-semibold text-white shadow-md shadow-navy/20 transition hover:-translate-y-0.5"
            >
              {t.cierreBoton} →
            </Link>
            <Link
              to="/curriculum"
              className="inline-flex min-h-11 items-center rounded-full border border-ink/25 px-7 text-sm font-semibold text-ink transition-colors hover:border-lilac-ink hover:text-lilac-ink"
            >
              {t.cierreCv}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
