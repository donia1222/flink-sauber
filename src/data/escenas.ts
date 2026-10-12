// El recorrido del hero. Imágenes generadas con ChatGPT (originales en imagenes/hero, ver PROMPTS.md), preparadas
// con scripts/escenas.mjs.
//
// Coordenadas en fracciones de la imagen 16:9: `x` del ancho, `y` del alto. `portal` es la abertura por la que se
// entra a la escena siguiente; `llegada` es el punto de la escena siguiente que queda dentro de ese portal, y `zoom`
// cuánto se acerca la cámara en el tramo. Medidas sobre las imágenes de ChatGPT (1672 × 941).

export type Punto = { x: number; y: number };

export type Escena = {
  id: string;
  src: string;
  alt: string;
  lugar: string;
  /** Punto (fracción del ancho) que queda centrado en pantallas estrechas, donde la imagen se recorta a los lados. */
  foco?: number;
};

export type Tramo = {
  portal: Punto;
  llegada: Punto;
  zoom: number;
  /** Forma de la abertura: círculo (el cristal limpio, el espejo, la gota) o arco. */
  forma: 'kreis' | 'bogen';
  /** Tamaño de la abertura: `w` en fracciones del ancho y `h` del alto. */
  w: number;
  h: number;
  /** Tramo de `t` en el que la escena siguiente aparece dentro de la abertura. Por defecto [0.12, 0.4]. */
  fundido?: [number, number];
};

export type Recorrido = { escenas: Escena[]; tramos: Tramo[] };

// Cristal sucio (la rasqueta lo limpia al empezar) → por el círculo limpio, un baño que se está limpiando → por su espejo
// redondo, el grifo de cromo con una gota → por la gota, el equipo terminando un piso impecable.
export const recorrido: Recorrido = {
  escenas: [
    {
      id: 'start',
      src: '/escenas/hero/1-fenster.webp',
      alt: 'Eine nasse, staubige Fensterscheibe mit einem frisch geputzten, kristallklaren Kreis in der Mitte',
      lugar: 'Der erste Wisch',
    },
    {
      id: 'bad',
      src: '/escenas/hero/2-bad.webp',
      alt: 'Ein helles Marmorbad mit rundem Spiegel; eine Reinigungskraft zieht die Duschwand streifenfrei ab',
      lugar: 'Bad & Küche',
    },
    {
      id: 'detail',
      src: '/escenas/hero/3-armatur.webp',
      alt: 'Eine Chromarmatur wird mit einem Mikrofasertuch poliert, ein klarer Wassertropfen hängt am Auslauf',
      lugar: 'Das Detail',
    },
    {
      id: 'team',
      src: '/escenas/hero/4-team.webp',
      alt: 'Zwei Reinigungskräfte in dunkelblauer Arbeitskleidung reinigen eine helle Wohnung, dazwischen ein Reinigungswagen',
      lugar: 'Ihr Team',
    },
  ],
  tramos: [
    // Por el círculo recién limpiado del cristal: detrás está el baño, con el espejo redondo en el centro.
    { portal: { x: 0.4982, y: 0.449 }, llegada: { x: 0.5033, y: 0.271 }, zoom: 4, forma: 'kreis', w: 0.269, h: 0.473 },
    // Por el espejo redondo del baño: dentro, el grifo con la gota.
    { portal: { x: 0.5033, y: 0.271 }, llegada: { x: 0.4878, y: 0.436 }, zoom: 4.5, forma: 'kreis', w: 0.2075, h: 0.361 },
    // A través de la gota (la parte redonda, abajo): dentro aparece el equipo terminando el piso.
    { portal: { x: 0.4878, y: 0.436 }, llegada: { x: 0.5, y: 0.45 }, zoom: 12, forma: 'kreis', w: 0.038, h: 0.0744 },
  ],
};
