import { useState } from 'react'

/** Catálogo tipográfico: abecedario y muestra "Aa" que cambia con cada peso/variante. */
export default function TypeCatalog({ title, chars, extra, weights, className = '' }) {
  const [active, setActive] = useState(0)
  const w = weights[active]
  const style = { fontFamily: w.family, fontWeight: w.weight }
  const extras = Array.isArray(extra) ? extra : [extra]

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
          <div className="flex flex-wrap gap-2" role="group" aria-label={`Variantes de ${title}`}>
            {weights.map((v, i) => (
              <button
                key={v.label}
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  i === active ? 'bg-navy text-white' : 'bg-white text-navy hover:bg-sky/30'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
          <p className="text-[7rem] leading-none text-navy sm:text-[9rem]" style={style} aria-hidden="true">
            Aa
          </p>
        </div>
      </div>
    </div>
  )
}
