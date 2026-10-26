/**
 * Lo que se puede pedir en el formulario de oferta.
 *
 * Los cinco primeros son los servicios de su tarjeta; el resto son los que
 * hace cualquier empresa de limpieza y que la gente busca.
 *
 * OJO: esta lista existe DOS VECES. La otra mitad está en el servidor
 * (api/web-offerte.php), porque el correo solo escribe los servicios que
 * reconoce y así nadie puede colar texto suyo en el asunto. Si se añade uno
 * aquí, hay que añadirlo allí con el mismo `id`.
 */
export const dienste = [
  { id: 'fenster', name: 'Fenster & Jalousien' },
  { id: 'haus', name: 'Hausreinigung' },
  { id: 'wohnung', name: 'Wohnungs- & Büroreinigung' },
  { id: 'hauswartung', name: 'Hauswartung' },
  { id: 'winter', name: 'Winterreinigung' },
  { id: 'umzug', name: 'Umzug mit Abgabegarantie' },
  { id: 'grund', name: 'Grundreinigung' },
  { id: 'teppich', name: 'Teppich & Polster' },
  { id: 'bau', name: 'Nach Umbau' },
  { id: 'treppenhaus', name: 'Treppenhaus' },
  { id: 'fassade', name: 'Balkon & Terrasse' },
];

/** Tamaños habituales, para no tener que escribirlo. */
export const groessen = [
  '1–2 Zimmer',
  '3–4 Zimmer',
  '5+ Zimmer / Haus',
  'Büro / Gewerbe',
];

/* El de siempre, salvo que se diga otro con NEXT_PUBLIC_OFFERTE (para probar
   contra un servidor local sin tocar esta línea). */
export const OFFERTE_ENDPUNKT =
  process.env.NEXT_PUBLIC_OFFERTE || 'https://web.lweb.ch/flink/panel/api/web-offerte.php';
