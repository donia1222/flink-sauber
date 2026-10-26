// Datos de DF Flink Sauber. La dirección es la actual (la de su web antigua ya no vale).
export const firma = {
  name: 'DF Flink Sauber',
  strasse: 'Poskahalda 3',
  ort: '9495 Triesen',
  land: 'Liechtenstein',
  telefon: '079 759 19 83',
  telefonLink: 'tel:+41797591983',
  // El WhatsApp de la web antigua estaba incompleto (wa.me/764834787, sin el prefijo del país).
  // Estos dos son los buenos y los dieron ellos: son móviles personales, distintos del teléfono de la empresa.
  whatsapp: 'https://wa.me/41796981975?text=Gr%C3%BCezi%2C%20ich%20interessiere%20mich%20f%C3%BCr%20eine%20Reinigung.',
  email: 'info@flink-sauber.li',
  karte: 'https://www.google.com/maps/search/?api=1&query=DF+Flink+Sauber+Poskahalda+3+9495+Triesen',
  bewertung: '4,8',
};

/**
 * Los dos WhatsApp, con nombre.
 *
 * Un solo botón de WhatsApp obliga a quien escribe a esperar a que conteste
 * esa persona; con dos, el cliente elige y la respuesta llega antes. El texto
 * va preparado en el enlace para que no tenga que escribir el saludo.
 */
const SALUDO = 'Gr%C3%BCezi%2C%20ich%20interessiere%20mich%20f%C3%BCr%20eine%20Reinigung.';

export const whatsapps = [
  // El idioma va al lado del nombre: quien escribe sabe de antemano en qué
  // lengua le van a contestar, y no tiene que probar suerte.
  { name: 'Doris', sprache: 'Deutsch', nummer: '+41 79 698 19 75', link: `https://wa.me/41796981975?text=${SALUDO}` },
  { name: 'Díaz', sprache: 'Spanisch', nummer: '+41 76 483 47 87', link: `https://wa.me/41764834787?text=${SALUDO}` },
];

export const zeiten = [
  ['Mo – Fr', '08:00 – 18:00'],
  ['Sa & So', 'geschlossen'],
];
