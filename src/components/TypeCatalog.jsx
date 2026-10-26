/** Muestra tipográfica compacta: nombre de la fuente, "Aa" grande y sus pesos en una línea. */
export default function TypeCatalog({ title, weights, className = '' }) {
  const main = weights[0]
  return (
    <figure className={className}>
      <p className="text-[7rem] leading-none text-ink sm:text-[9rem]" style={{ fontFamily: main.family, fontWeight: main.weight }} aria-hidden="true">
        Aa
      </p>
      <figcaption className="mt-4">
        <p className="text-xl text-ink" style={{ fontFamily: main.family, fontWeight: main.weight }}>
          {title}
        </p>
        <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[15px] text-ink">
          {weights.map((w) => (
            <span key={w.label} style={{ fontFamily: w.family, fontWeight: w.weight }}>
              {w.label}
            </span>
          ))}
        </p>
      </figcaption>
    </figure>
  )
}
