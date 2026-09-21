// Geometría compartida de las cintas: spline suave → remuestreo → bandas rellenas con puntas afinadas.

export const RIBBON_COLORS = ['#192a56', '#96c9ff', '#9690e4'] // marino, cielo, lavanda
export const TAPER = 170 // longitud (px) de afinado de la punta

// Spline Catmull-Rom centrípeta (sin lazos ni sobreimpulsos) muestreada cada ~`step` px.
function sampleSpline(pts, step) {
  const out = []
  const dist = (a, b) => Math.max(Math.hypot(a[0] - b[0], a[1] - b[1]), 1e-3)
  const mix = (a, b, ka, kb) => [a[0] * ka + b[0] * kb, a[1] * ka + b[1] * kb]
  for (let i = 0; i < pts.length - 1; i++) {
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p0 = pts[i - 1] ?? [2 * p1[0] - p2[0], 2 * p1[1] - p2[1]]
    const p3 = pts[i + 2] ?? [2 * p2[0] - p1[0], 2 * p2[1] - p1[1]]
    const t0 = 0
    const t1 = t0 + Math.sqrt(dist(p0, p1))
    const t2 = t1 + Math.sqrt(dist(p1, p2))
    const t3 = t2 + Math.sqrt(dist(p2, p3))
    const n = Math.max(2, Math.ceil(dist(p1, p2) / step))
    for (let k = 0; k < n; k++) {
      const t = t1 + ((t2 - t1) * k) / n
      const a1 = mix(p0, p1, (t1 - t) / (t1 - t0), (t - t0) / (t1 - t0))
      const a2 = mix(p1, p2, (t2 - t) / (t2 - t1), (t - t1) / (t2 - t1))
      const a3 = mix(p2, p3, (t3 - t) / (t3 - t2), (t - t2) / (t3 - t2))
      const b1 = mix(a1, a2, (t2 - t) / (t2 - t0), (t - t0) / (t2 - t0))
      const b2 = mix(a2, a3, (t3 - t) / (t3 - t1), (t - t1) / (t3 - t1))
      out.push(mix(b1, b2, (t2 - t) / (t2 - t1), (t - t1) / (t2 - t1)))
    }
  }
  out.push(pts[pts.length - 1])
  return out
}

// Suavizado por media móvil (extremos fijos): redondea giros y quiebros.
function smooth(pts, radius, passes) {
  let cur = pts
  for (let p = 0; p < passes; p++) {
    const src = cur
    cur = src.map((pt, i) => {
      const w = Math.min(radius, i, src.length - 1 - i)
      if (w === 0) return pt
      let x = 0
      let y = 0
      for (let k = -w; k <= w; k++) {
        x += src[i + k][0]
        y += src[i + k][1]
      }
      return [x / (2 * w + 1), y / (2 * w + 1)]
    })
  }
  return cur
}

// Remuestreo a distancia uniforme: la longitud de arco guía la onda y el dibujado.
function resample(pts, step) {
  const out = [pts[0]]
  let carry = 0
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1]
    const b = pts[i]
    const seg = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (seg === 0) continue
    let d = step - carry
    while (d <= seg) {
      const k = d / seg
      out.push([a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k])
      d += step
    }
    carry = seg - (d - step)
  }
  out.push(pts[pts.length - 1])
  return out
}

// `radius`: semiventana de suavizado en muestras de 8 px (mayor = curvas más amplias).
export function buildCurve(waypoints, radius = 14, step = 26) {
  const base = resample(smooth(sampleSpline(waypoints, 8), radius, 4), step)
  const norm = base.map((_, i) => {
    const a = base[i - 1] ?? base[i]
    const b = base[i + 1] ?? base[i]
    const dx = b[0] - a[0]
    const dy = b[1] - a[1]
    const len = Math.hypot(dx, dy) || 1
    return [-dy / len, dx / len]
  })
  // y máxima acumulada: indica hasta dónde está "dibujado" el recorrido según el scroll
  let max = -Infinity
  const maxY = base.map(([, y]) => (max = Math.max(max, y)))
  return { base, norm, maxY, step }
}

// Segmentos Bézier cúbicos Catmull-Rom (sin el "M" inicial).
function curve(pts) {
  const f = (n) => n.toFixed(1)
  let d = ''
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] ?? p2
    d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`
  }
  return d
}

const smoothstep = (t) => t * t * (3 - 2 * t)

/**
 * Trazo (relleno) de la cinta `r` (0-2): banda plana de ancho `g.width` desplazada de las otras,
 * con olas que viajan por longitud de arco. Si `sEnd` es finito, la punta se afina hasta cero.
 * g = { base, norm, step, width, spacing, amp, lambda }
 */
export function ribbonPath(g, r, time, scroll, sEnd = Infinity, reduce = false) {
  const off = (r - 1) * g.spacing
  const left = []
  const right = []
  for (let i = 0; i < g.base.length; i++) {
    const s = i * g.step
    if (s > sEnd) break
    const wave = reduce
      ? 0
      : (Math.sin(s / g.lambda + time / 3000 + r * 0.9 + scroll / 800) + 0.5 * Math.sin(s / (g.lambda * 1.7) - time / 4300 + r * 1.7)) *
        g.amp *
        0.7
    const k = off + wave
    const nx = g.norm[i][0]
    const ny = g.norm[i][1]
    const x = g.base[i][0] + nx * k
    const y = g.base[i][1] + ny * k
    const t = sEnd === Infinity ? 1 : smoothstep(Math.min(1, Math.max(0, (sEnd - s) / TAPER)))
    const hw = (g.width / 2) * Math.max(t, 0.02)
    left.push([x + nx * hw, y + ny * hw])
    right.push([x - nx * hw, y - ny * hw])
  }
  if (left.length < 2) return ''
  right.reverse()
  return `M${left[0][0].toFixed(1)} ${left[0][1].toFixed(1)}${curve(left)} L${right[0][0].toFixed(1)} ${right[0][1].toFixed(1)}${curve(right)}Z`
}

// Ancho de cada cinta para un contenedor de ancho W (≈ 2,47 % del ancho, entre 9,5 y 38 px).
export const ribbonWidth = (W) => Math.max(9.5, Math.min(38, W * 0.0247))

/**
 * Zigzag con TODOS los giros fuera de pantalla.
 * `zones`: [{ y, amp, drift }] de arriba abajo; la primera va de izquierda a derecha y las
 * siguientes alternan. Cada zona es un barrido ondulado de borde a borde; entre barridos, un
 * arco elíptico fuera del viewport (a la derecha o a la izquierda) devuelve la cinta.
 */
export function zigzag(W, zones) {
  const xs = [-0.12, 0.2, 0.5, 0.8, 1.12]
  const shape = [0, -1, 0.7, -0.8, 0.3]
  const sweeps = zones.map((z, zi) => {
    const sign = zi % 2 ? -1 : 1
    const pts = xs.map((x, i) => [x * W, z.y + (z.drift ?? 0) * (i / 4 - 0.5) + sign * (z.amp ?? 40) * shape[i]])
    return zi % 2 ? pts.reverse() : pts // pares: izquierda→derecha; impares: derecha→izquierda
  })

  const out = []
  sweeps.forEach((pts, zi) => {
    out.push(...pts)
    const next = sweeps[zi + 1]
    if (!next) return
    // Arco elíptico FUERA de pantalla entre el final de este barrido y el inicio del siguiente
    const [xEdge, yFrom] = pts[pts.length - 1]
    const yTo = next[0][1]
    const b = Math.abs(yTo - yFrom) / 2
    const a = Math.min(b, 0.42 * W) + 40
    const dir = zi % 2 ? -1 : 1
    const ym = (yFrom + yTo) / 2
    for (const deg of [-60, -30, 0, 30, 60]) {
      const th = (deg * Math.PI) / 180
      out.push([xEdge + dir * a * Math.cos(th), ym + b * Math.sin(th)])
    }
  })
  return out
}
