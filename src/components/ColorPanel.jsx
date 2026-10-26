// "HEX     #9690E4" / "HEX: #000000" → ['HEX', '#9690E4']
const parse = (line) => {
  const m = line.match(/^(\w+):?\s+(.*)$/)
  return m ? [m[1], m[2].replace(/\s*,\s*/g, ', ')] : ['', line]
}

/** Muestra de color: bloque de color, nombre y HEX; RGB y CMYK como texto pequeño. */
export default function ColorPanel({ color }) {
  const values = Object.fromEntries(color.lines.map(parse))
  return (
    <figure>
      <div className={`aspect-[4/3] w-full ${color.bordered ? 'ring-1 ring-inset ring-ink/15' : ''}`} style={{ background: color.bg }} />
      <figcaption className="mt-3">
        <p className="text-[15px] font-semibold text-ink">{color.name}</p>
        <p className="mt-1 text-[15px] tabular-nums text-ink/75">{values.HEX}</p>
        <p className="mt-1 text-xs tabular-nums text-ink/75">
          RGB {values.RGB} · CMYK {values.CMYK}
        </p>
      </figcaption>
    </figure>
  )
}
