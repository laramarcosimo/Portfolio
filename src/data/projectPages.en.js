/*
 * English mirror of projectPages.js. Only descriptive/narrative text is translated;
 * factual data (hex/RGB/CMYK values, dates, links, font names) stays identical.
 */
import { img } from './content'
import { projectFonts } from './projectPages'
import marcaExplicacion from '../assets/video/marca-explicacion.mp4'
import marcaFondo from '../assets/video/marca-fondo.mp4'
import marcaLogoBlanco from '../assets/video/marca-logo-blanco.mp4'
import marcaLogoAzul from '../assets/video/marca-logo-azul.mp4'
import jaimeLogoBlanco from '../assets/video/jaime-logo-blanco.mp4'
import jaimeLogoNegro from '../assets/video/jaime-logo-negro.mp4'
import patronAzul from '../assets/marca-personal/patron-azul.png'
import patronBlanco from '../assets/marca-personal/patron-blanco.png'
import videoLola from '../assets/video/video-lola.mp4'

export { projectFonts }

const alphabet = ['Aa', 'Bb', 'Cc', 'Dd', 'Ee', 'Ff', 'Gg', 'Hh', 'Ii', 'Jj', 'Kk', 'Ll', 'Mm', 'Nn', 'Oo', 'Pp', 'Qq', 'Rr', 'Ss', 'Tt', 'Uu', 'Vv', 'Ww', 'Xx', 'Yy', 'Zz']

const ph = (path, alt) => ({ src: img(path), alt })

// Labels of the shared case-study template.
const labels = { story: 'Story', brand: 'Brand system', logo: 'Logo', pattern: 'Pattern', applications: 'Mockups', primary: 'Primary', secondary: 'Secondary', styles: 'Styles of' }

export const projectPages = {
  'marca-personal': {
    labels,
    title: 'Personal Brand',
    cover: { desktop: img('marca-personal/portadas'), mobile: img('marca-personal/portada'), alt: 'Personal Brand cover' },
    context: 'Personal project',
    story: [
      { key: 'partida', text: "I wanted a brand that spoke about me before anyone read my name." },
      { key: 'concepto', text: "My initials L, M and S in a single stroke, like a wave and like the page of a book: reading and design, my two passions." },
      { key: 'resultado', text: "A symbol that works on its own, in motion and on paper, with a palette of blues and lavender I now use everywhere, this website included." },
    ],
    videos: { single: marcaExplicacion, wide: marcaFondo, pair: [marcaLogoBlanco, marcaLogoAzul] },
    colors: [
      {
        name: 'Periwinkle Lavender',
        lines: ['HEX     #9690E4', 'RGB     150, 144, 228', 'CMYK    40, 38, 0, 0'],
        bg: '#9690E4',
        dark: true,
        logos: [ph('marca-personal/logo-azul', 'Blue Logo'), ph('marca-personal/logo-blanco', 'White Logo')],
      },
      {
        name: 'Deep Midnight Blue',
        lines: ['HEX     #192A56', 'RGB     25, 42, 86', 'CMYK    100, 88, 37, 31'],
        bg: '#192A56',
        logos: [ph('marca-personal/logo-blanco', 'White Logo')],
      },
      {
        name: 'Vibrant Pastel Blue',
        lines: ['HEX     #96C9FF', 'RGB     150, 201, 255', 'CMYK    40, 15, 0, 0'],
        bg: '#96C9FF',
        dark: true,
        logos: [ph('marca-personal/logo-azul', 'Blue Logo'), ph('marca-personal/logo-blanco', 'White Logo')],
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
        { use: 'Headlines', sample: 'Idea and heart', font: 'Cormorant Garamond Italic', detail: 'SemiBold for large · Bold for small', face: { fontFamily: "'Cormorant Garamond'", fontStyle: 'italic', fontWeight: 600 } },
        { use: 'Text', sample: 'Clarity in every detail', font: 'Quicksand', detail: 'Paragraphs, buttons and details', face: { fontFamily: "'Quicksand'", fontWeight: 600 } },
      ],
      why: 'They contrast in stroke and share the softness of their curves, like the symbol.',
    },
    shots: {
      libretas: ph('marca-personal/libretas', 'Notebooks'),
      boligrafos: ph('marca-personal/boligrafos', 'Pens'),
      tarjeta: ph('marca-personal/tarjeta', 'Business Card'),
      carpeta: ph('marca-personal/carpeta', 'Folder'),
      sobre: ph('marca-personal/sobre', 'Envelope'),
      patronAzul: { src: patronAzul, alt: 'Blue brand pattern', tile: '#FFFFFF' },
      patronBlanco: { src: patronBlanco, alt: 'White brand pattern', tile: '#192A56' },
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
    title: 'Visual Identity',
    cover: { desktop: img('identidad-visual/portada-interior'), mobile: img('identidad-visual/portada-interior'), alt: 'Visual Identity inner cover' },
    context: 'Commission · Personal brand for an engineer',
    story: [
      { key: 'reto', text: "An engineer needed a serious personal brand that conveyed precision without feeling cold." },
      { key: 'concepto', text: "His initials connected like parts of a system, each stroke resting on the one before." },
      { key: 'resultado', text: "A clean monogram that works from a mug to his website, in black, white and a green that gives it character." },
    ],
    videos: { pair: [jaimeLogoBlanco, jaimeLogoNegro] },
    colors: [
      {
        name: 'Black',
        lines: ['HEX: #000000', 'RGB 0, 0, 0', 'CMYK 0, 0,0,  100'],
        bg: '#000000',
        logos: [ph('identidad-visual/logotipo-blanco', 'White Logo')],
      },
      {
        name: 'Caribbean Green',
        lines: ['HEX: #00C896', 'RGB 0, 200, 150', 'CMYK 75, 0, 60, 0'],
        bg: '#00C896',
        dark: true,
        logos: [ph('identidad-visual/logotipo-negro', 'Black Logo'), ph('identidad-visual/logotipo-blanco', 'White Logo')],
      },
      {
        name: 'White',
        lines: ['HEX: #FFFFFF', 'RGB 255, 255, 255', 'CMYK 0, 0,0, 0'],
        bg: '#FFFFFF',
        dark: true,
        bordered: true,
        logos: [ph('identidad-visual/logotipo-negro', 'Black Logo')],
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
      tarjeta: ph('identidad-visual/tarjeta', 'Business Card'),
      boligrafo: ph('identidad-visual/boligrafo', 'Pen'),
      agenda: ph('identidad-visual/agenda', 'Notebook'),
      taza: ph('identidad-visual/taza', 'Mug'),
      web: ph('identidad-visual/web', 'Jaime Website'),
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
    cover: { desktop: img('casa-ricardo/logo'), mobile: img('casa-ricardo/logo'), alt: 'Casa Ricardo cover', contain: true },
    context: 'Internship at Arco Comunicación · 2025',
    story: [
      { key: 'reto', text: "During my internship at Arco I was asked to modernise the logo of Casa Ricardo, a sweets and nuts shop, without its regular customers losing sight of it." },
      { key: 'proceso', text: "I simplified the composition, improved legibility and adapted it to everything: bags, stickers, billboard and street poster." },
      { key: 'resultado', text: "A cleaner, more current image that still feels like the one they have always known." },
    ],
    comparison: { old: ph('casa-ricardo/logo-viejo', 'Old Casa Ricardo Logo'), new: ph('casa-ricardo/logo', 'New Casa Ricardo Logo'), before: 'Before', after: 'After' },
    colors: [
      {
        name: 'Casa Ricardo Red',
        lines: ['HEX     #DB251E', 'RGB     219, 37, 30', 'CMYK    0, 95, 95, 0'],
        bg: '#DB251E',
        logos: [ph('casa-ricardo/logo', 'LOGO SF')],
      },
      {
        name: 'Tradition Blue',
        lines: ['HEX     #0032A0', 'RGB     0, 50, 160', 'CMYK    100, 80, 0, 0'],
        bg: '#0032A0',
        logos: [ph('casa-ricardo/logo', 'LOGO SF')],
      },
      {
        name: 'Toasted Gold',
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
    stickers: ph('casa-ricardo/pegatinas', '4 stickers'),
    shots: {
      packagingDelante: ph('casa-ricardo/packaging-delante', 'Packaging 1'),
      packagingDetras: ph('casa-ricardo/packaging-detras', 'Packaging 2'),
      bolsas: ph('casa-ricardo/bolsas', 'Casa Ricardo Bags'),
      tarjeta: ph('casa-ricardo/tarjeta-fondo', 'Business Card'),
      valla: ph('casa-ricardo/valla', 'Casa Ricardo Billboard'),
      mupi: ph('casa-ricardo/mupi', 'Casa Ricardo Street Poster'),
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
    context: 'Audiovisual project',
    intro: { lead: 'SloMo × Lola Índigo.', text: "Audiovisual reinterpretation born from the union of Chanel's music and Lola Índigo's visual universe to create a new music video." },
    video: videoLola,
    poster: img('video/portada'),
    tools: ['premiere'],
  },
}
