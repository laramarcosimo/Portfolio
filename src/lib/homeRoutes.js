import { zigzag } from './ribbonGeometry'

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

/** Siempre queda dibujado el primer barrido, aunque aún no se haya hecho scroll. */
export const heroAboutMin = (r) => r['about-content'].t
