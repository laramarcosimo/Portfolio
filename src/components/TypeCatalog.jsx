import { useState } from 'react'

/**
 * Catálogo tipográfico: abecedario y muestra "Aa" que cambia con cada peso/variante.
 * `centered`: composición centrada (título, variantes, "Aa" y abecedario alineados en el mismo eje).
 */
export default function TypeCatalog({ title, chars, extra, weights, centered = false, className = '' }) {
  const [active, setActive] = useState(0)
  const w = weights[active]
  const style = { fontFamily: w.family, fontWeight: w.weight }
  const extras = Array.isArray(extra) ? extra : [extra]

  const variants = (
    <div className={`flex flex-wrap gap-2 ${centered ? 'justify-center' : ''}`} role="group" aria-label={`Variantes de ${title}`}>
      {weights.map((v, i) => (
        <button
          key={v.label}
          onClick={() => setActive(i)}
          aria-pressed={i === active}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${i === active ? 'bg-navy text-white' : 'bg-white text-navy hover:bg-sky/30'}`}
        >
          {v.label}
        </button>
      ))}
    </div>
  )

  if (centered) {
    return (
      <div className={`rounded-3xl bg-fog px-6 py-10 text-center sm:px-10 ${className}`}>
        <h3 className="text-2xl text-navy sm:text-3xl" style={style}>
          {title}
        </h3>
        <div className="mt-5">{variants}</div>

        {/* La "Aa" y el abecedario comparten eje central */}
        <p className="mt-6 text-[8rem] leading-none text-navy sm:text-[10rem]" style={style} aria-hidden="true">
          Aa
        </p>
        <div className="mx-auto mt-6 grid max-w-xs grid-cols-6 justify-items-center gap-x-2 gap-y-1 text-lg text-navy sm:max-w-sm" style={style} aria-hidden="true">
          {chars.map((c) => (
            <span key={c}>{c}</span>
          ))}
        </div>
        {extras.map((e) => (
          <p key={e} className="mt-2 text-lg text-navy" style={style} aria-hidden="true">
            {e}
          </p>
        ))}
      </div>
    )
  }

  return (
    <div className={`rounded-3xl bg-fog p-6 sm:p-8 ${className}`}>
      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <h3 className="text-3xl text-navy sm:text-4xl" style={style}>
            {title}
          </h3>
          <div className="mt-5 grid grid-cols-6 gap-x-2 gap-y-1 text-lg text-navy" style={style} aria-hidden="true">
            {chars.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
          {extras.map((e) => (
            <p key={e} className="mt-2 text-lg text-navy" style={style} aria-hidden="true">
              {e}
            </p>
          ))}
        </div>
        <div className="flex flex-col justify-between gap-6">
          {variants}
          <p className="text-[7rem] leading-none text-navy sm:text-[9rem]" style={style} aria-hidden="true">
            Aa
          </p>
        </div>
      </div>
    </div>
  )
}
