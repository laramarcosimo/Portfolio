/*
 * Contenido de cada página de proyecto. Textos tomados de las páginas de la web original
 * (marca-personal, identidad-visual, casa-ricardo y Proyecto-video); no reescribir.
 */
import { img } from './content'
import marcaExplicacion from '../assets/video/marca-explicacion.mp4'
import marcaFondo from '../assets/video/marca-fondo.mp4'
import marcaLogoBlanco from '../assets/video/marca-logo-blanco.mp4'
import marcaLogoAzul from '../assets/video/marca-logo-azul.mp4'
import jaimeLogoBlanco from '../assets/video/jaime-logo-blanco.mp4'
import jaimeLogoNegro from '../assets/video/jaime-logo-negro.mp4'
import patronAzul from '../assets/marca-personal/patron-azul.png'
import patronBlanco from '../assets/marca-personal/patron-blanco.png'
import videoLola from '../assets/video/video-lola.mp4'

const alphabet = ['Aa', 'Bb', 'Cc', 'Dd', 'Ee', 'Ff', 'Gg', 'Hh', 'Ii', 'Jj', 'Kk', 'Ll', 'Mm', 'Nn', 'Oo', 'Pp', 'Qq', 'Rr', 'Ss', 'Tt', 'Uu', 'Vv', 'Ww', 'Xx', 'Yy', 'Zz']

const ph = (path, alt) => ({ src: img(path), alt })

// Etiquetas de la plantilla común de los casos de estudio.
const labels = { story: 'Historia', brand: 'Sistema de marca', logo: 'Logotipo', pattern: 'Patrón', applications: 'Mockups', primary: 'Principal', secondary: 'Secundaria', styles: 'Estilos de' }

// Tipografía de cada página de proyecto: `body` para el texto y `heading` para los títulos.
// Toda la web usa Quicksand salvo estas páginas, que usan la tipografía del propio proyecto.
const Q = "'Quicksand', sans-serif"
const S = "'Cormorant Garamond', 'Quicksand', sans-serif" // titulares de la marca de Lara
export const projectFonts = {
  'marca-personal': { body: Q, heading: S },
  'identidad-visual': { body: "'Fieldwork Hum', 'Quicksand', sans-serif", heading: "'Fieldwork Geo', 'Quicksand', sans-serif" },
  'casa-ricardo': { body: "'depot-new-condensed-web', 'Quicksand', sans-serif", heading: "'ella-roman', 'Quicksand', serif" },
  'proyecto-video': { body: Q, heading: S },
}

export const projectPages = {
  'marca-personal': {
    labels,
    title: 'Marca Personal',
    cover: { desktop: img('marca-personal/portadas'), mobile: img('marca-personal/portada'), alt: 'Portada Marca Personal' },
    context: 'Proyecto personal',
    story: [
      { key: 'partida', text: "Quería una marca que hablara de mí antes de leer mi nombre." },
      { key: 'concepto', text: "Mis iniciales L, M y S en un solo trazo, como una ola y como la página de un libro: lectura y diseño, mis dos pasiones." },
      { key: 'resultado', text: "Un símbolo que funciona solo, en movimiento y en papel, con una paleta de azules y lavanda que ya uso en todo, incluida esta web." },
    ],
    videos: { single: marcaExplicacion, wide: marcaFondo, pair: [marcaLogoBlanco, marcaLogoAzul] },
    colors: [
      {
        name: 'Lavanda Pervinca',
        lines: ['HEX     #9690E4', 'RGB     150, 144, 228', 'CMYK    40, 38, 0, 0'],
        bg: '#9690E4',
        dark: true,
        logos: [ph('marca-personal/logo-azul', 'Logo Azul'), ph('marca-personal/logo-blanco', 'Logo Blanco')],
      },
      {
        name: 'Azul Medianoche Profundo',
        lines: ['HEX     #192A56', 'RGB     25, 42, 86', 'CMYK    100, 88, 37, 31'],
        bg: '#192A56',
        logos: [ph('marca-personal/logo-blanco', 'Logo Blanco')],
      },
      {
        name: 'Azul Pastel Vibrante',
        lines: ['HEX     #96C9FF', 'RGB     150, 201, 255', 'CMYK    40, 15, 0, 0'],
        bg: '#96C9FF',
        dark: true,
        logos: [ph('marca-personal/logo-azul', 'Logo Azul'), ph('marca-personal/logo-blanco', 'Logo Blanco')],
      },
    ],
    typographyPair: [
      {
        title: 'Quicksand',
        chars: alphabet,
        extra: '1234567890!@#$%*',
        weights: [
          { label: 'Bold', weight: 700, family: "'Quicksand'" },
          { label: 'SemiBold', weight: 600, family: "'Quicksand'" },
          { label: 'Medium', weight: 500, family: "'Quicksand'" },
          { label: 'Regular', weight: 400, family: "'Quicksand'" },
          { label: 'Light', weight: 300, family: "'Quicksand'" },
        ],
      },      {
        title: 'Cormorant Garamond',
        chars: alphabet,
        extra: '1234567890!@#$%*',
        weights: [
          { label: 'SemiBold Italic', weight: 600, style: 'italic', family: "'Cormorant Garamond'" },
          { label: 'Bold Italic', weight: 700, style: 'italic', family: "'Cormorant Garamond'" },
        ],
      }
    ],
    typeGuide: {
      rows: [
        { use: 'Titulares', sample: 'Idea y corazón', font: 'Cormorant Garamond Italic', detail: 'SemiBold en los grandes · Bold en los pequeños', face: { fontFamily: "'Cormorant Garamond'", fontStyle: 'italic', fontWeight: 600 } },
        { use: 'Texto', sample: 'Claridad en cada dato', font: 'Quicksand', detail: 'Párrafos, botones y datos', face: { fontFamily: "'Quicksand'", fontWeight: 600 } },
      ],
      why: 'Contrastan en el trazo y comparten la suavidad de las curvas, como el símbolo.',
    },
    shots: {
      libretas: ph('marca-personal/libretas', 'Libretas'),
      boligrafos: ph('marca-personal/boligrafos', 'Bolígrafos'),
      tarjeta: ph('marca-personal/tarjeta', 'Tarjeta de Visita'),
      carpeta: ph('marca-personal/carpeta', 'Carpeta'),
      sobre: ph('marca-personal/sobre', 'Sobre'),
      patronAzul: { src: patronAzul, alt: 'Patrón azul de la marca', tile: '#FFFFFF' },
      patronBlanco: { src: patronBlanco, alt: 'Patrón blanco de la marca', tile: '#192A56' },
    },
    usage: { main: img('marca-personal/logo-azul-trim'), versions: [
      { kind: 'positivo', bg: '#FFFFFF', src: img('marca-personal/logo-azul-trim') },
      { kind: 'negativo', bg: '#192A56', src: img('marca-personal/logo-blanco-trim') },
      { kind: 'color', bg: '#9690E4', src: img('marca-personal/logo-blanco-trim') },
      { kind: 'tinta', bg: '#FFFFFF', ink: '#192A56', src: img('marca-personal/logo-azul-trim') },
    ] },
    tools: ['illustrator', 'photoshop', 'after-effects'],
  },

  'identidad-visual': {
    labels,
    title: 'Identidad Visual',
    cover: { desktop: img('identidad-visual/portada-interior'), mobile: img('identidad-visual/portada-interior'), alt: 'Portada Interior Identidad Visual' },
    context: 'Encargo · Marca personal de un ingeniero',
    story: [
      { key: 'reto', text: "Un ingeniero necesitaba una marca personal seria, que transmitiera precisión sin parecer fría." },
      { key: 'concepto', text: "Sus iniciales conectadas como piezas de un sistema, cada trazo apoyado en el anterior." },
      { key: 'resultado', text: "Un monograma limpio que funciona desde una taza hasta su web, en negro, blanco y un verde que le da carácter." },
    ],
    videos: { pair: [jaimeLogoBlanco, jaimeLogoNegro] },
    colors: [
      {
        name: 'Negro',
        lines: ['HEX: #000000', 'RGB 0, 0, 0', 'CMYK 0, 0,0,  100'],
        bg: '#000000',
        logos: [ph('identidad-visual/logotipo-blanco', 'Logotipo Blanco')],
      },
      {
        name: 'Caribbean Green',
        lines: ['HEX: #00C896', 'RGB 0, 200, 150', 'CMYK 75, 0, 60, 0'],
        bg: '#00C896',
        dark: true,
        logos: [ph('identidad-visual/logotipo-negro', 'Logotipo Negro'), ph('identidad-visual/logotipo-blanco', 'Logotipo Blanco')],
      },
      {
        name: 'Blanco',
        lines: ['HEX: #FFFFFF', 'RGB 255, 255, 255', 'CMYK 0, 0,0, 0'],
        bg: '#FFFFFF',
        dark: true,
        bordered: true,
        logos: [ph('identidad-visual/logotipo-negro', 'Logotipo Negro')],
      },
    ],
    typographyPair: [
      {
        title: 'Fieldwork Geo',
        chars: alphabet,
        extra: '1234567890!@#$%*',
        weights: [
          { label: 'Bold', weight: 600, family: "'Fieldwork Geo'" },
        ],
      },
      {
        title: 'Fieldwork Hum',
        chars: alphabet,
        extra: '1234567890!@#$%*',
        weights: [
          { label: 'Regular', weight: 400, family: "'Fieldwork Hum'" },
          { label: 'Light', weight: 300, family: "'Fieldwork Hum'" },
          { label: 'Hair', weight: 100, family: "'Fieldwork Hum'" },
        ],
      },
    ],
    shots: {
      tarjeta: ph('identidad-visual/tarjeta', 'Tarjeta de Visita'),
      boligrafo: ph('identidad-visual/boligrafo', 'Bolígrafo'),
      agenda: ph('identidad-visual/agenda', 'Libreta'),
      taza: ph('identidad-visual/taza', 'Taza'),
      web: ph('identidad-visual/web', 'Web Jaime'),
    },
    usage: { main: img('identidad-visual/logotipo-negro-trim'), versions: [
      { kind: 'positivo', bg: '#FFFFFF', src: img('identidad-visual/logotipo-negro-trim') },
      { kind: 'negativo', bg: '#000000', src: img('identidad-visual/logotipo-blanco-trim') },
      { kind: 'color', bg: '#00C896', src: img('identidad-visual/logotipo-negro-trim') },
      { kind: 'tinta', bg: '#FFFFFF', ink: '#00A07A', src: img('identidad-visual/logotipo-negro-trim') },
    ] },
    tools: ['illustrator', 'photoshop', 'after-effects'],
    webTools: ['UI', 'UX', 'AI'],
    link: 'https://jaimemartglez.vercel.app',
  },

  'casa-ricardo': {
    labels,
    title: 'Casa Ricardo',
    cover: { desktop: img('casa-ricardo/logo'), mobile: img('casa-ricardo/logo'), alt: 'Portada Casa Ricardo', contain: true },
    context: 'Prácticas en Arco Comunicación · 2025',
    story: [
      { key: 'reto', text: "En mis prácticas en Arco me encargaron modernizar el logo de Casa Ricardo, una tienda de chuches y frutos secos, sin que sus clientes de siempre dejaran de reconocerla." },
      { key: 'proceso', text: "Simplifiqué la composición, mejoré la legibilidad y lo adapté a todo: bolsas, pegatinas, valla y mupi." },
      { key: 'resultado', text: "Una imagen más actual y limpia que sigue siendo «la de siempre»." },
    ],
    comparison: { old: ph('casa-ricardo/logo-viejo', 'Logo Viejo Casa Ricardo'), new: ph('casa-ricardo/logo', 'Logo Nuevo Casa Ricardo'), before: 'Antes', after: 'Después' },
    colors: [
      {
        name: 'Rojo Casa Ricardo',
        lines: ['HEX     #DB251E', 'RGB     219, 37, 30', 'CMYK    0, 95, 95, 0'],
        bg: '#DB251E',
        logos: [ph('casa-ricardo/logo', 'LOGO SF')],
      },
      {
        name: 'Azul Tradición',
        lines: ['HEX     #0032A0', 'RGB     0, 50, 160', 'CMYK    100, 80, 0, 0'],
        bg: '#0032A0',
        logos: [ph('casa-ricardo/logo', 'LOGO SF')],
      },
      {
        name: 'Dorado Tostado',
        lines: ['HEX     #DDAA55', 'RGB     221, 170, 85', 'CMYK    10, 30, 70, 0'],
        bg: '#DDAA55',
        dark: true,
        logos: [ph('casa-ricardo/logo', 'LOGO SF')],
      },
    ],
    typographyPair: [
      {
        title: 'Ella Roman',
        chars: alphabet,
        extra: ['1234567890', '! @ # $ % *'],
        weights: [
          { label: 'Bold', weight: 700, family: "'ella-roman'" },
          { label: 'Regular', weight: 400, family: "'ella-roman'" },
        ],
      },
      {
        title: 'Depot New',
        chars: alphabet,
        extra: ['1234567890', '! @ # $ % *'],
        weights: [
          { label: 'Regular', weight: 400, family: "'depot-new-condensed-web'" },
          { label: 'Bold', weight: 700, family: "'depot-new-condensed-web'" },
        ],
      },
    ],
    stickers: ph('casa-ricardo/pegatinas', '4 pegatinas'),
    shots: {
      packagingDelante: ph('casa-ricardo/packaging-delante', 'Packaging 1'),
      packagingDetras: ph('casa-ricardo/packaging-detras', 'Packaging 2'),
      bolsas: ph('casa-ricardo/bolsas', 'Bolsas Casa Ricardo'),
      tarjeta: ph('casa-ricardo/tarjeta-fondo', 'Tarjeta Visita'),
      valla: ph('casa-ricardo/valla', 'Valla Casa Ricardo'),
      mupi: ph('casa-ricardo/mupi', 'MUPI Casa Ricardo'),
    },
    usage: { main: img('casa-ricardo/logo-trim'), versions: [
      { kind: 'positivo', bg: '#FFFFFF', src: img('casa-ricardo/logo-trim') },
      { kind: 'color', bg: '#DB251E', src: img('casa-ricardo/logo-trim') },
      { kind: 'color', bg: '#0032A0', src: img('casa-ricardo/logo-trim') },
      { kind: 'color', bg: '#DDAA55', src: img('casa-ricardo/logo-trim') },
    ] },
    tools: ['illustrator', 'photoshop'],
    typekit: 'https://use.typekit.net/sjx7ptx.css',
  },

  'proyecto-video': {
    labels,
    title: 'SloMo × Lola Índigo',
    context: 'Proyecto audiovisual',
    intro: { lead: 'SloMo × Lola Índigo.', text: 'Reinterpretación audiovisual nacida de la unión entre la música de Chanel y el universo visual de Lola Índigo para crear un nuevo videoclip.' },
    video: videoLola,
    poster: img('video/portada'),
    tools: ['premiere'],
  },
}
