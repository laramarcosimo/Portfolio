// Cada tramo es un recorrido Bézier que entra y sale por los bordes de su sección
// (el de una sección continúa en la siguiente). Las tres cintas comparten trazado
// y se separan con un desplazamiento fijo, como en la referencia.
export const RIBBON_COLORS = ['#192a56', '#96c9ff', '#9690e4'] // navy, cielo, lavanda

export const ribbonPaths = {
  hero: {
    viewH: 420,
    d: 'M-60 170 C250 235 450 300 720 268 C950 240 1150 130 1500 70',
    offsets: [[0, 0], [0, 46], [0, 92]],
  },
  about: {
    viewH: 1000,
    d: 'M1500 0 C1250 -30 1050 70 850 130 C600 210 330 150 262 400 C215 570 90 820 90 1040',
    offsets: [[0, 0], [42, 46], [84, 92]],
  },
  portfolio: {
    viewH: 1000,
    d: 'M90 -40 C90 120 200 190 420 150 C700 100 1000 80 1200 165 C1400 250 1340 430 1150 445 C900 470 520 420 300 560 C110 690 130 880 262 1040',
    offsets: [[0, 0], [42, 46], [84, 92]],
  },
  services: {
    viewH: 260,
    d: 'M262 -10 C250 60 330 115 520 122 C760 130 900 85 1100 115 C1300 145 1400 135 1500 95',
    offsets: [[0, 0], [42, 46], [84, 92]],
  },
  contact: {
    viewH: 420,
    d: 'M1500 10 C1250 10 1050 60 1000 140 C950 230 1050 270 880 290 C640 315 420 200 330 330 C270 420 330 470 360 520',
    offsets: [[0, 0], [42, 46], [84, 92]],
  },
}
