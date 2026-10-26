// Prepara las imágenes: las de ChatGPT que haya en imagenes/ pasan a WebP en public/escenas.
// Las que aún faltan se sustituyen por una provisional con su nombre y el portal marcado, para que la web funcione
// mientras se generan. Las fotos propias de Flink Sauber (imagenes/eigene) se recortan y se comprimen.
import sharp from 'sharp';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';

const OUT = 'public/escenas';
const HERO = [1672, 941];
const BODY = [1080, 1350];

// nombre (sin extensión) → [tamaño, portal provisional: forma y tamaño en fracciones del ancho y del alto]
const imagenes = {
  'hero/1-fenster': [HERO, ['kreis', 0.18, 0.32]],
  'hero/2-bad': [HERO, ['kreis', 0.16, 0.284]],
  'hero/3-armatur': [HERO, ['kreis', 0.1, 0.178]],
  'hero/4-team': [HERO, null],
  'body/fenster': [BODY, null],
  'body/wohnung': [BODY, null],
  'body/buero': [BODY, null],
  'body/hauswartung': [BODY, null],
  'body/teppich': [BODY, null],
};

const figura = (portal, W, H) => {
  if (!portal) return '';
  const [forma, fw, fh] = portal;
  const cx = W / 2;
  const cy = H / 2;
  const w = fw * W;
  const h = fh * H;
  const trazo = 'fill="#dbe9f2" stroke="#d4ae6a" stroke-width="3" stroke-dasharray="14 10"';
  if (forma === 'kreis') return `<ellipse cx="${cx}" cy="${cy}" rx="${w / 2}" ry="${h / 2}" ${trazo}/>`;
  const x = cx - w / 2;
  const y = cy - h / 2;
  return `<path d="M${x} ${y + h}V${y + w / 2}A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2}V${y + h}Z" ${trazo}/>`;
};

const provisional = (nombre, [W, H], portal) =>
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs><radialGradient id="g" cx="50%" cy="45%" r="75%"><stop offset="0" stop-color="#eaf2f7"/><stop offset="0.6" stop-color="#8fa9c0"/><stop offset="1" stop-color="#13294a"/></radialGradient></defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  ${figura(portal, W, H)}
  <text x="50%" y="${H * 0.86}" fill="#0a1628" font-family="Helvetica, Arial" font-size="${W / 44}" text-anchor="middle">${nombre}</text>
  <text x="50%" y="${H * 0.86 + W / 30}" fill="#13294a" font-family="Helvetica, Arial" font-size="${W / 70}" text-anchor="middle">imagen pendiente · imagenes/${nombre}.png</text>
</svg>`);

// Mientras no haya imagen de ChatGPT, estas tarjetas usan la foto de su web actual en vez de una provisional.
const deSuWeb = {
  'body/wohnung': 'imagenes/eigene/wohnung-web.png',
  'body/teppich': 'imagenes/eigene/teppich-web.png',
};

let reales = 0;
let web = 0;
for (const [nombre, [[W, H], portal]] of Object.entries(imagenes)) {
  const destino = `${OUT}/${nombre}.webp`;
  await mkdir(destino.slice(0, destino.lastIndexOf('/')), { recursive: true });
  const fuente = ['png', 'jpg', 'jpeg', 'webp'].map((ext) => `imagenes/${nombre}.${ext}`).find(existsSync) ?? (existsSync(deSuWeb[nombre] ?? '') ? deSuWeb[nombre] : undefined);
  if (fuente) {
    if (fuente.startsWith('imagenes/eigene')) web++;
    else reales++;
    await sharp(fuente).resize(W, H, { fit: 'cover', kernel: 'lanczos3' }).sharpen({ sigma: 0.6 }).webp({ quality: 84 }).toFile(destino);
  } else {
    await sharp(provisional(nombre, [W, H], portal)).webp({ quality: 80 }).toFile(destino);
  }
}
console.log(`escenas: ${reales} de ${Object.keys(imagenes).length} imágenes de ChatGPT, ${web} de su web, el resto provisionales`);

// El limpiacristales con la mano (PNG transparente de ChatGPT): se recorta el borde vacío y se guarda con transparencia.
if (existsSync('imagenes/hero/abzieher.png')) {
  await sharp('imagenes/hero/abzieher.png').trim({ threshold: 10 }).resize({ height: 1400, withoutEnlargement: true }).webp({ quality: 88, alphaQuality: 90 }).toFile(`${OUT}/hero/abzieher.webp`);
}

// Fotos propias de su web actual.
await mkdir(`${OUT}/eigene`, { recursive: true });
const E = 'imagenes/eigene';
// Antes y después del horno: la de después está más lejos y desplazada. Se escala y se recorta para que el eje del
// ventilador y el anillo coincidan con la de antes, así el comparador no "salta" al deslizar.
await sharp(`${E}/vorher.png`).webp({ quality: 82 }).toFile(`${OUT}/eigene/vorher.webp`);
await sharp(`${E}/nachher.png`).resize(1536, 1020).extract({ left: 427, top: 191, width: 1024, height: 593 }).webp({ quality: 82 }).toFile(`${OUT}/eigene/nachher.webp`);
// Polaroids: la escalera en la fachada y el invernadero de cristal.
await sharp(`${E}/fenster-leiter.png`).resize(900, 1100, { fit: 'cover' }).webp({ quality: 82 }).toFile(`${OUT}/eigene/fenster-leiter.webp`);
for (const f of ['balkon-klein.jpg', 'fenster-innen-klein.jpg']) {
  await sharp(`${E}/${f}`).resize(600, 733, { fit: 'cover' }).webp({ quality: 84 }).toFile(`${OUT}/eigene/${f.replace(/\.jpg$/, '.webp')}`);
}
await sharp(`${E}/wintergarten.jpeg`).rotate().resize(900, 1100, { fit: 'cover' }).webp({ quality: 82 }).toFile(`${OUT}/eigene/wintergarten.webp`);
// Retrato del equipo con las montañas detrás, y el valle del Rin para el pie.
// 27/10/2026: la foto es ahora la de los dos en el banco. Se recorta por el
// CENTRO y no por arriba: en esta las personas están en el medio, y con
// `top` el recorte se comía los pies (en la anterior era al revés, la cara
// estaba arriba y había que conservarla).
await sharp(`${E}/team-doris-diaz.jpg`).rotate().resize(960, 1200, { fit: 'cover', position: 'centre' }).webp({ quality: 84 }).toFile(`${OUT}/eigene/team-portrait.webp`);
await sharp(`${E}/rheintal.jpeg`).rotate().resize(1600, 1600, { fit: 'cover', position: 'top' }).webp({ quality: 78 }).toFile(`${OUT}/eigene/rheintal.webp`);
await sharp(`${E}/logo.png`).webp({ quality: 90, alphaQuality: 100 }).toFile(`${OUT}/eigene/logo.webp`);
