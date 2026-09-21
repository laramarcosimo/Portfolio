import Typewriter from './Typewriter'

/**
 * Cuadro de color de la identidad: nombre + HEX/RGB/CMYK escritos a máquina y logotipos.
 * `compact`: versión pequeña y cuidada (tarjeta redondeada, tipografía y logos reducidos).
 */
export default function ColorPanel({ color, compact = false }) {
  const text = color.dark ? 'text-navy' : 'text-white'

  if (compact) {
    return (
      <div
        className={`relative flex min-h-[9.5rem] flex-col justify-between overflow-hidden rounded-2xl p-4 shadow-lg shadow-slate-200/70 ${text} ${
          color.bordered ? 'ring-1 ring-navy/15 ring-inset' : ''
        }`}
        style={{ background: color.bg }}
      >
        <Typewriter lines={[color.name, ...color.lines]} compact />
        <div className="mt-3 flex items-center gap-3">
          {color.logos.map((l) => (
            <img key={l.src} src={l.src} alt={l.alt} className="h-6 w-auto max-w-[45%] object-contain opacity-90" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      className={`relative flex min-h-[12.5rem] flex-col justify-between overflow-hidden p-6 sm:min-h-[18rem] sm:p-7 ${text} ${color.bordered ? 'ring-1 ring-navy/15 ring-inset' : ''}`}
      style={{ background: color.bg }}
    >
      <Typewriter lines={[color.name, ...color.lines]} />
      <div className="mt-6 flex flex-wrap items-center gap-4">
        {color.logos.map((l) => (
          <img key={l.src} src={l.src} alt={l.alt} className="h-14 w-auto max-w-[45%] object-contain" />
        ))}
      </div>
    </div>
  )
}
