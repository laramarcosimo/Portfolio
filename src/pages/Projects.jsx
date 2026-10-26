import { useState } from 'react'
import ProjectCard from '../components/ProjectCard'
import Reveal from '../components/Reveal'
import RibbonBanner from '../components/RibbonBanner'
import { useContent } from '../data/useContent'
import { useUi } from '../i18n/ui'

/**
 * Proyectos: titular breve y una sección por categoría (Identidad visual, Audiovisual),
 * cada una con su cuadrícula de portadas. Unos chips permiten ver solo una categoría.
 */
export default function Projects() {
  const { featuredProjects, projectGroups } = useContent()
  const t = useUi()
  const [filter, setFilter] = useState('all')
  const groups = projectGroups
    .filter((g) => filter === 'all' || g.id === filter)
    .map((g) => ({ ...g, items: g.slugs.map((s) => featuredProjects.find((p) => p.slug === s)) }))

  const chips = [{ id: 'all', label: t.todos }, ...projectGroups.map((g) => ({ id: g.id, label: g.label }))]

  return (
    <main className="pb-20 sm:pb-28">
      <RibbonBanner height={84} />
      <header className="mx-auto max-w-6xl px-4 pb-8 pt-10 sm:px-8 sm:pb-10 sm:pt-14">
        <h1 className="headline text-5xl text-ink sm:text-7xl">{t.proyectos}</h1>
        <p className="mt-5 max-w-[44ch] text-lg leading-relaxed text-ink/75 sm:text-xl">{t.proyectosClaim}</p>
        <div role="group" aria-label={t.filtrar} className="mt-8 flex flex-wrap gap-2">
          {chips.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={filter === c.id}
              onClick={() => setFilter(c.id)}
              className={`min-h-10 rounded-full border px-4 text-sm font-semibold transition-colors ${
                filter === c.id ? 'border-navy bg-navy text-white' : 'border-ink/20 text-ink hover:border-lilac-ink hover:text-lilac-ink'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-20 px-4 sm:space-y-28 sm:px-8">
        {groups.map((g) => (
          <section key={g.id} aria-labelledby={`cat-${g.id}`}>
            <div className="flex items-baseline justify-between gap-4 border-t border-ink/15 pt-5">
              <h2 id={`cat-${g.id}`} className="headline text-2xl text-ink sm:text-4xl">{g.label}</h2>
              <p className="eyebrow shrink-0 text-ink/75">{t.nProyectos(g.items.length)}</p>
            </div>
            <ul className="mt-8 grid gap-x-8 gap-y-14 sm:mt-10 sm:grid-cols-2 sm:gap-x-10">
              {g.items.map((p) => (
                <li key={p.slug}>
                  <Reveal>
                    <ProjectCard project={p} />
                  </Reveal>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  )
}
