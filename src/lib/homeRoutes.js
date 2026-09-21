import { zigzag } from './ribbonGeometry'

/** Ids que necesita `heroAboutRoute` (se miden en el DOM real). */
export const HERO_ABOUT_IDS = ['inicio', 'about-content']

/**
 * Recorrido de la portada: UN solo juego de tres líneas, entre el titular y "Sobre Mí".
 * Cruza de borde a borde y los giros ocurren fuera de pantalla.
 */
export function heroAboutRoute(W, r) {
  const H = r.inicio
  const C = r['about-content']

  // Móvil: justo entre el titular y el retrato (sin huecos)
  if (W < 700) return zigzag(W, [{ y: H.b - 6, amp: 15, drift: -22 }])

  // Escritorio: a medio camino entre el pie del titular y el inicio de "Sobre Mí"
  const y = (H.t + 190 + C.t) / 2
  return zigzag(W, [{ y, amp: 64, drift: -130 }])
}

/** Siempre queda dibujado el barrido, aunque aún no se haya hecho scroll. */
export const heroAboutMin = (r) => r['about-content'].t
