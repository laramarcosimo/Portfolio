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
import videoLola from '../assets/video/video-lola.mp4'

const alphabet = ['Aa', 'Bb', 'Cc', 'Dd', 'Ee', 'Ff', 'Gg', 'Hh', 'Ii', 'Jj', 'Kk', 'Ll', 'Mm', 'Nn', 'Oo', 'Pp', 'Qq', 'Rr', 'Ss', 'Tt', 'Uu', 'Vv', 'Ww', 'Xx', 'Yy', 'Zz']

const ph = (path, alt) => ({ src: img(path), alt })

export const projectPages = {
  'marca-personal': {
    title: 'Marca Personal',
    cover: { desktop: img('marca-personal/portadas'), mobile: img('marca-personal/portada'), alt: 'Portada Marca Personal' },
    explanation:
      'Mi identidad visual es el punto de encuentro entre quién soy y lo que hago. El logotipo nace de la fusión orgánica de mis iniciales (L, M y S), entrelazadas en un trazo que rinde homenaje a mis dos grandes pasiones: la profundidad de la lectura y la pasión por el diseño. Es un diseño que busca el equilibrio perfecto entre dinamismo y elegancia, donde cada línea fluye para representar una comunicación con propósito, alma y rigor técnico.',
    videos: { single: marcaExplicacion, wide: marcaFondo, pair: [marcaLogoBlanco, marcaLogoAzul] },
    colors: [
      {
        name: 'Lavanda Pervinca',
        lines: ['HEX     #9690E4', 'RGB     150, 144, 228', 'CMYK    40, 38, 0, 0'],
        bg: '#9690E4',
        dark: true,
        logos: [ph('marca-personal/logo-blanco', 'Logo Blanco'), ph('marca-personal/logo-azul', 'Logo Azul')],
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
        logos: [ph('marca-personal/logo-blanco', 'Logo Blanco'), ph('marca-personal/logo-azul', 'Logo Azul')],
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
    photos: [ph('marca-personal/riendo', 'Riendo'), ph('marca-personal/sentada', 'Sentada'), ph('marca-personal/depie', 'De pie')],
    stationery: [
      { pair: [ph('marca-personal/libretas', 'Libretas'), ph('marca-personal/boligrafos', 'Bolígrafos')] },
      { main: ph('marca-personal/tarjeta', 'Tarjeta de Visita') },
      { pair: [ph('marca-personal/carpeta', 'Carpeta'), ph('marca-personal/sobre', 'Sobre')] },
    ],
    tools: ['illustrator', 'photoshop', 'after-effects'],
  },

  'identidad-visual': {
    title: 'Identidad Visual',
    cover: { desktop: img('identidad-visual/portada-interior'), mobile: img('identidad-visual/portada-interior'), alt: 'Portada Interior Identidad Visual' },
    explanation:
      'Esta identidad nace de la integración de las iniciales del ingeniero, diseñadas bajo un concepto de interconectividad. El resultado es un monograma minimalista y estructurado que refleja la capacidad de resolver problemas complejos a través de soluciones limpias, aportando una base visual sólida y profesional a su marca personal.',
    videos: { pair: [jaimeLogoBlanco, jaimeLogoNegro], pairTones: ['#000', '#fff'] },
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
      { main: ph('identidad-visual/tarjeta', 'Tarjeta de Visita') },
      { pair: [ph('identidad-visual/boligrafo', 'Taza'), ph('identidad-visual/agenda', 'Libreta')] },
      { main: ph('identidad-visual/web', 'Web Jaime'), href: 'https://jaimemartglez.vercel.app' },
    ],
    tools: ['illustrator', 'photoshop', 'after-effects'],
    webTools: ['UI', 'UX', 'AI'],
    link: 'https://jaimemartglez.vercel.app',
  },

  'casa-ricardo': {
    title: 'Casa Ricardo',
    cover: { desktop: img('casa-ricardo/logo'), mobile: img('casa-ricardo/logo'), alt: 'Portada Casa Ricardo', contain: true },
    explanation:
      'Durante mis prácticas trabajé en el rediseño de la identidad visual de Casa Ricardo, una tienda de chuches y frutos secos. El objetivo era modernizar el logotipo sin perder la esencia cercana y tradicional de la marca. Se mejoró la legibilidad, la composición y su adaptación a distintos formatos. El resultado fue una imagen más actual y limpia, manteniendo la personalidad reconocible del negocio.',
    comparison: [ph('casa-ricardo/logo', 'Logo Nuevo Casa Ricardo'), ph('casa-ricardo/logo-viejo', 'Logo Viejo Casa Ricardo')],
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
    stationery: [
      { pair: [ph('casa-ricardo/packaging-delante', 'Packaging 1'), ph('casa-ricardo/packaging-detras', 'Packaging 2')] },
      { pair: [ph('casa-ricardo/bolsas', 'Bolsas Casa Ricardo'), ph('casa-ricardo/tarjeta', 'Tarjeta Visita')] },
      { pair: [ph('casa-ricardo/valla', 'Valla Casa Ricardo'), ph('casa-ricardo/mupi', 'MUPI Casa Ricardo')] },
    ],
    tools: ['illustrator', 'photoshop'],
    typekit: 'https://use.typekit.net/sjx7ptx.css',
  },

  'proyecto-video': {
    title: 'Proyecto Video',
    intro: { lead: 'SloMo × Lola Índigo.', text: 'Reinterpretación audiovisual nacida de la unión entre la música de Chanel y el universo visual de Lola Índigo para crear un nuevo videoclip.' },
    video: videoLola,
    poster: img('video/portada'),
    tools: ['premiere'],
  },
}
