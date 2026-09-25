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
import videoLola from '../assets/video/video-lola.mp4'

export { projectFonts }

const alphabet = ['Aa', 'Bb', 'Cc', 'Dd', 'Ee', 'Ff', 'Gg', 'Hh', 'Ii', 'Jj', 'Kk', 'Ll', 'Mm', 'Nn', 'Oo', 'Pp', 'Qq', 'Rr', 'Ss', 'Tt', 'Uu', 'Vv', 'Ww', 'Xx', 'Yy', 'Zz']

const ph = (path, alt) => ({ src: img(path), alt })

export const projectPages = {
  'marca-personal': {
    title: 'Personal Brand',
    cover: { desktop: img('marca-personal/portadas'), mobile: img('marca-personal/portada'), alt: 'Personal Brand cover' },
    explanation:
      'My visual identity is the meeting point between who I am and what I do. The logo is born from the organic fusion of my initials (L, M and S), interwoven in a stroke that pays homage to my two great passions: the depth of reading and my passion for design. It is a design that seeks the perfect balance between dynamism and elegance, where every line flows to represent communication with purpose, soul and technical rigor.',
    videos: { single: marcaExplicacion, wide: marcaFondo, pair: [marcaLogoBlanco, marcaLogoAzul] },
    colors: [
      {
        name: 'Periwinkle Lavender',
        lines: ['HEX     #9690E4', 'RGB     150, 144, 228', 'CMYK    40, 38, 0, 0'],
        bg: '#9690E4',
        dark: true,
        logos: [ph('marca-personal/logo-blanco', 'White Logo'), ph('marca-personal/logo-azul', 'Blue Logo')],
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
        logos: [ph('marca-personal/logo-blanco', 'White Logo'), ph('marca-personal/logo-azul', 'Blue Logo')],
      },
    ],
    typography: {
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
    },
    photos: [ph('marca-personal/riendo', 'Laughing'), ph('marca-personal/sentada', 'Sitting'), ph('marca-personal/depie', 'Standing')],
    stationery: [
      { pair: [ph('marca-personal/libretas', 'Notebooks'), ph('marca-personal/boligrafos', 'Pens')] },
      { main: ph('marca-personal/tarjeta', 'Business Card') },
      { pair: [ph('marca-personal/carpeta', 'Folder'), ph('marca-personal/sobre', 'Envelope')] },
    ],
    tools: ['illustrator', 'photoshop', 'after-effects'],
  },

  'identidad-visual': {
    title: 'Visual Identity',
    cover: { desktop: img('identidad-visual/portada-interior'), mobile: img('identidad-visual/portada-interior'), alt: 'Visual Identity inner cover' },
    explanation:
      "This identity is born from the integration of the engineer's initials, designed under a concept of interconnectivity. The result is a minimalist, structured monogram that reflects the ability to solve complex problems through clean solutions, giving his personal brand a solid, professional visual foundation.",
    videos: { pair: [jaimeLogoBlanco, jaimeLogoNegro], pairTones: ['#000', '#fff'] },
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
    typography: {
      title: 'Fieldwork',
      chars: alphabet,
      extra: '1234567890!@#$%*',
      weights: [
        { label: 'Geo Bold', weight: 600, family: "'Fieldwork Geo'" },
        { label: 'Hum Regular', weight: 400, family: "'Fieldwork Hum'" },
        { label: 'Hum Light', weight: 300, family: "'Fieldwork Hum'" },
        { label: 'Hum Hair', weight: 100, family: "'Fieldwork Hum'" },
      ],
    },
    stationery: [
      { main: ph('identidad-visual/tarjeta', 'Business Card') },
      { pair: [ph('identidad-visual/boligrafo', 'Mug'), ph('identidad-visual/agenda', 'Notebook')] },
      { main: ph('identidad-visual/web', 'Jaime Website'), href: 'https://jaimemartglez.vercel.app' },
    ],
    tools: ['illustrator', 'photoshop', 'after-effects'],
    webTools: ['UI', 'UX', 'AI'],
    link: 'https://jaimemartglez.vercel.app',
  },

  'casa-ricardo': {
    title: 'Casa Ricardo',
    cover: { desktop: img('casa-ricardo/logo'), mobile: img('casa-ricardo/logo'), alt: 'Casa Ricardo cover', contain: true },
    explanation:
      "During my internship I worked on redesigning the visual identity of Casa Ricardo, a candy and nut shop. The goal was to modernize the logo without losing the brand's close, traditional essence. Legibility, composition and adaptation to different formats were improved. The result was a more current, cleaner image while keeping the business's recognizable personality.",
    comparison: [ph('casa-ricardo/logo', 'New Casa Ricardo Logo'), ph('casa-ricardo/logo-viejo', 'Old Casa Ricardo Logo')],
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
    stationery: [
      { pair: [ph('casa-ricardo/packaging-delante', 'Packaging 1'), ph('casa-ricardo/packaging-detras', 'Packaging 2')] },
      { pair: [ph('casa-ricardo/bolsas', 'Casa Ricardo Bags'), ph('casa-ricardo/tarjeta', 'Business Card')] },
      { pair: [ph('casa-ricardo/valla', 'Casa Ricardo Billboard'), ph('casa-ricardo/mupi', 'Casa Ricardo Street Poster')] },
    ],
    tools: ['illustrator', 'photoshop'],
    typekit: 'https://use.typekit.net/sjx7ptx.css',
  },

  'proyecto-video': {
    title: 'Video Project',
    intro: { lead: 'SloMo × Lola Índigo.', text: "Audiovisual reinterpretation born from the union of Chanel's music and Lola Índigo's visual universe to create a new music video." },
    video: videoLola,
    poster: img('video/portada'),
    tools: ['premiere'],
  },
}
