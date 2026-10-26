import { zigzag } from './ribbonGeometry'

/** Ids que necesita `homeRoute` (se miden en el DOM real). */
export const HOME_IDS = ['inicio', 'about-content', 'trabajo-index']

/**
 * Hilo conductor de la portada: las tres líneas cruzan bajo la declaración (de izquierda a derecha),
 * giran fuera de pantalla, vuelven bajo Sobre mí (de derecha a izquierda) y, si hay margen, bajan
 * por el lateral izquierdo del índice de proyectos antes de salir por el borde.
 */
export function homeRoute(W, r) {
  const H = r.inicio
  const C = r['about-content']
  const I = r['trabajo-index']
  const narrow = W < 700
  const gapTop = (H.b + C.t) / 2
  const gapBottom = C.b + (I.t - C.b) / 2 + 8

  const pts = narrow
    ? zigzag(W, [
        { y: gapTop, amp: 12, drift: -18 },
        { y: gapBottom, amp: 12, drift: 16 },
      ])
    : zigzag(W, [
        { y: gapTop, amp: 30, drift: -48 },
        { y: gapBottom, amp: 30, drift: 40 },
      ])

  // Margen libre a la izquierda del índice (max-w-6xl = 1152 px + padding 32 px)
  const contentLeft = Math.max(0, (W - 1152) / 2) + 32
  if (narrow || contentLeft < 80) return pts

  // Sustituye la salida del segundo barrido por una bajada por el margen izquierdo del índice
  pts.pop()
  const L = contentLeft * 0.35
  const yEnd = Math.min(I.b - 80, I.t + 620)
  const [, yLast] = pts[pts.length - 1]
  // Se queda pegada al borde del margen para no cruzar el titular ni las portadas
  pts.push([L + 10, yLast + 50], [L, I.t + 140], [L, yEnd - 120], [L - 30, yEnd], [-0.15 * W, yEnd + 140])
  return pts
}

/** La primera travesía (bajo la declaración) se ve dibujada desde el principio. */
export const homeReveal = (r) => (r.inicio.b + r['about-content'].t) / 2 + 60
