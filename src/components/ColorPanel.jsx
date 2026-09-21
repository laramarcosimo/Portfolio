import Typewriter from './Typewriter'

/** Cuadro de color de la identidad: nombre + HEX/RGB/CMYK escritos a máquina y logotipos. */
export default function ColorPanel({ color }) {
  const text = color.dark ? 'text-navy' : 'text-white'
  return (
    <div
      className={`relative flex min-h-[18rem] flex-col justify-between overflow-hidden p-7 ${text} ${color.bordered ? 'ring-1 ring-navy/15 ring-inset' : ''}`}
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
