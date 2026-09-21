import { zigzag } from './ribbonGeometry'

/** Ids que necesita `heroAboutRoute` (se miden en el DOM real). */
export const HERO_ABOUT_IDS = ['inicio', 'sobre-mi', 'about-content']

/**
 * Recorrido de Hero + Sobre Mí: tres barridos suaves de borde a borde por las zonas vacías
 * (bajo el titular, sobre el retrato y bajo la galería). Los giros ocurren fuera de pantalla.
 */
export function heroAboutRoute(W, r) {
  const H = r.inicio
  const A = r['sobre-mi']
  const C = r['about-content']
  const k = W < 700 ? 0.55 : 1
  // Móvil: un único juego de tres líneas, justo entre el titular y el retrato (sin huecos)
  if (W < 700) return zigzag(W, [{ y: H.b - 6, amp: 15, drift: -22 }])
  return zigzag(W, [
    { y: H.t + 0.7 * (H.b - H.t), amp: 64 * k, drift: -130 * k }, // Hero: nace a la izquierda y asciende
    { y: A.t + (W < 700 ? 84 : 150), amp: 38 * k, drift: 70 * k }, // Sobre Mí: por encima del retrato
    { y: C.b + (W < 700 ? 78 : 120), amp: 34 * k, drift: -50 * k }, // Bajo la galería, camino de los proyectos
  ])
}

/** Siempre queda dibujado el barrido del hero. */
export const heroAboutMin = (r) => r.inicio.b + 40

