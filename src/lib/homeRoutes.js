import { zigzag } from './ribbonGeometry'

/** Secciones de la página de proyectos (escritorio) que recorren las líneas. */
export const PROJECT_IDS = ['proyecto-marca-personal', 'proyecto-identidad-visual', 'proyecto-casa-ricardo', 'proyecto-proyecto-video']

/**
 * Las tres líneas bajan por la página de proyectos guiando de uno a otro: descienden por el margen
 * junto a cada proyecto (alternando izquierda/derecha, como el zigzag de la lista) y cruzan de un lado
 * al otro por el hueco entre proyectos. Nacen arriba a la derecha y salen por el lateral tras el último.
 */
export function projectsRoute(W, r) {
  const rows = PROJECT_IDS.map((id) => r[id])
  // Centro del margen a cada lado del contenido (max-w-4xl = 896 px); si no hay margen, pegadas al borde
  const m = Math.max(0, (W - 896) / 2)
  const L = m > 120 ? m / 2 : W * 0.02
  const R = W - L

  // Un único recorrido continuo: nace en el lado derecho, arriba del todo, cruza en diagonal suave hacia el
  // margen izquierdo (sin banner horizontal aparte) y desde ahí baja guiando de un proyecto al siguiente.
  const top = rows[0].t
  const pts = [
    [1.1 * W, 36],
    [0.8 * W, 70],
    [0.52 * W, 88],
    [0.26 * W, Math.max(112, top - 70)],
    [L, top - 6],
  ]
  const side = (i) => (i % 2 === 0 ? L : R) // alterna: izquierda, derecha, izquierda, derecha
  const ease = (t) => t * t * (3 - 2 * t)
  rows.forEach((row, i) => {
    const x = side(i)
    pts.push([x, row.t + 30], [x, row.b - 40])
    const next = rows[i + 1]
    if (next) {
      // Cruce al otro lado con una curva suave (arranque y llegada progresivos), sin quiebros
      const y0 = row.b - 40
      const y1 = next.t + 30
      const x1 = side(i + 1)
      for (const t of [0.2, 0.4, 0.6, 0.8]) pts.push([x + (x1 - x) * ease(t), y0 + (y1 - y0) * t])
    }
  })
  const last = rows[rows.length - 1]
  pts.push([R + (W - R) * 0.6, last.b + 50], [1.1 * W, last.b + 110])
  return pts
}

/** Ids que necesita `heroAboutRoute` (se miden en el DOM real). */
export const HERO_ABOUT_IDS = ['inicio', 'about-content']

/**
 * Recorrido de la portada: dos juegos de tres líneas, uno entre el titular y "Sobre Mí" y otro
 * entre "Sobre Mí" y "Proyectos". Cruzan de borde a borde y los giros ocurren fuera de pantalla.
 */
export function heroAboutRoute(W, r) {
  const H = r.inicio
  const C = r['about-content']

  if (W < 700) {
    return zigzag(W, [
      { y: H.b - 6, amp: 15, drift: -22 }, // entre el titular y el retrato
      { y: C.b + 58, amp: 14, drift: 20 }, // entre Sobre Mí y Proyectos
    ])
  }

  return zigzag(W, [
    { y: H.b, amp: 36, drift: -56 }, // entre el titular y Sobre Mí (a ras del límite entre ambos)
    { y: C.b + 112, amp: 34, drift: 48 }, // entre Sobre Mí y Proyectos
  ])
}
