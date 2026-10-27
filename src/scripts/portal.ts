import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { recorrido, type Tramo } from '../data/escenas';

// Recorrido por portales. Cada tramo lleva de una escena a la siguiente: la cámara se acerca a la abertura de la
// escena actual (el círculo limpio del cristal, la puerta de cristal, la gota) y la escena siguiente, que ya se ve
// dentro, crece hasta ocupar la pantalla. La abertura tiene la forma del objeto y un borde de luz clara, como cristal.
//
// Todo se calcula en fracciones del marco 16:9 de cada escena. Un punto `x` de una escena se pinta en `c + k · (x − p)`,
// donde `p` es el portal, `k` el zoom y `c` el punto de la pantalla hacia el que viaja la cámara (del portal de esta
// escena al punto de llegada de la siguiente). La escena siguiente usa la misma cámara con zoom `k / K`, así que al
// final del tramo (k = K) queda exactamente en su sitio y sin escalar.
//
// Se pinta en un único canvas del tamaño de la pantalla y de cada escena solo se dibuja el trozo visible: con capas
// del DOM, cada escena sería una textura enorme y en iOS se acaba la memoria gráfica.

type Key = { y: number; v: number };
type Fuente = ImageBitmap | HTMLImageElement;
type Plano = { tx: number; ty: number; k: number; alpha: number };

const piecewise = (y: number, keys: Key[]) => {
  if (y <= keys[0].y) return keys[0].v;
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1];
    const b = keys[i];
    if (y <= b.y) return a.v + (b.v - a.v) * ((y - a.y) / (b.y - a.y || 1));
  }
  return keys[keys.length - 1].v;
};

const clamp01 = gsap.utils.clamp(0, 1);
const smooth = (t: number) => t * t * (3 - 2 * t);
const range = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const RATIO = 16 / 9;
const FONDO = '#0a1628';

async function cargar(src: string): Promise<Fuente> {
  const img = new Image();
  img.src = src;
  await img.decode();
  // ImageBitmap queda decodificada en memoria: dibujarla no vuelve a decodificar el WebP.
  if ('createImageBitmap' in window) {
    try {
      return await createImageBitmap(img);
    } catch {
      return img;
    }
  }
  return img;
}

// Traza la abertura centrada en (cx, cy) con ancho w y alto h, en píxeles.
function trazar(c: CanvasRenderingContext2D, forma: Tramo['forma'], cx: number, cy: number, w: number, h: number) {
  c.beginPath();
  if (forma === 'kreis') {
    c.ellipse(cx, cy, w / 2, h / 2, 0, 0, Math.PI * 2);
  } else {
    // Puerta: rectángulo con medio círculo arriba.
    const r = w / 2;
    const top = cy - h / 2;
    c.moveTo(cx - r, cy + h / 2);
    c.lineTo(cx - r, top + r);
    c.arc(cx, top + r, r, Math.PI, 0);
    c.lineTo(cx + r, cy + h / 2);
    c.closePath();
  }
}

export function initPortal(world: HTMLElement, reduceMotion: boolean) {
  const { escenas, tramos } = recorrido;
  const stage = world.querySelector<HTMLElement>('[data-stage]');
  const canvas = stage?.querySelector<HTMLCanvasElement>('[data-portal]');
  const ctx = canvas?.getContext('2d', { alpha: false });
  if (!stage || !canvas || !ctx) return;
  const poster = stage.querySelector<HTMLElement>('[data-poster]');
  const stops = [...world.querySelectorAll<HTMLElement>('[data-stop]')];
  const tropfen = [...document.querySelectorAll<HTMLElement>('[data-tropfen]')];
  const label = document.querySelector<HTMLElement>('[data-tropfen-label]');
  const hint = stage.querySelector<HTMLElement>('[data-hint]');
  const last = stops.length - 1;
  const marks = stops.map((stop) => ScrollTrigger.create({ trigger: stop, start: 'top top' }));

  // Hay que volver a pintar (en movimiento reducido solo se pinta cuando cambia algo).
  let sucio = true;
  const fuentes: (Fuente | null)[] = escenas.map(() => null);
  (async () => {
    for (let i = 0; i < escenas.length; i++) {
      try {
        fuentes[i] = await cargar(escenas[i].src);
      } catch {
        fuentes[i] = null;
      }
      if (i === 0) {
        canvas.style.opacity = '1';
        if (poster) {
          poster.style.opacity = '0';
          // Fuera del todo tras el fundido: una imagen invisible a pantalla completa sigue gastando memoria gráfica.
          setTimeout(() => (poster.style.display = 'none'), 800);
        }
      }
      sucio = true;
    }
  })();

  let current = -2;
  const setCurrent = (index: number) => {
    if (index === current) return;
    current = index;
    stops.forEach((stop, i) => stop.classList.toggle('is-current', i === index));
    if (index >= 0 && label) label.textContent = stops[index].dataset.lugar ?? '';
  };

  let tramo = 0;
  let t = 0;
  /* Limpieza inicial.
     Antes empezaba en 0: el hero se veía sucio entero y la rasqueta solo
     aparecía al mover el scroll, así que quien llegaba veía una foto velada
     y no entendía qué tenía delante. Ahora arranca con un tercio ya limpio
     —la rasqueta a la vista, con su franja clara detrás— y el scroll la
     empuja desde ahí hasta el final. Es la misma animación: lo que cambia
     es dónde empieza. */
  const LIMPIO_AL_LLEGAR = 0.34;
  let limpio = LIMPIO_AL_LLEGAR;

  const render = (self: ScrollTrigger) => {
    const y = self.scroll();
    const w = piecewise(y, [...marks.map((mark, i) => ({ y: mark.start, v: i })), { y: self.end, v: last + 0.5 }]);
    const at = Math.min(w, last);
    // El scroll reparte lo que QUEDA por limpiar, no el total: así no hay
    // salto al primer movimiento del dedo.
    limpio = LIMPIO_AL_LLEGAR + (1 - LIMPIO_AL_LLEGAR) * range(w, 0.015, 0.3);
    // Las gotas del indicador se llenan una a una.
    tropfen.forEach((n, i) => n.style.setProperty('--f', String(clamp01(at - i + 1))));
    if (hint) hint.style.opacity = String(clamp01(1 - w * 5));
    tramo = Math.min(Math.floor(at), last - 1);
    // Cada tramo deja quietas las escenas al principio y al final para que se pueda leer el texto.
    // En el primero la cámara espera más: antes pasa el limpiacristales.
    t = at >= last ? 1 : range(at - tramo, tramo === 0 ? 0.32 : 0.18, 0.88);
    setCurrent(t < 0.06 ? tramo : t > 0.94 ? tramo + 1 : -1);
    sucio = true;
  };

  const span = ScrollTrigger.create({
    trigger: world,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: render,
    onRefresh: render,
  });
  render(span);

  let W = 0;
  let H = 0;
  let dpr = 1;
  const medir = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = stage.clientWidth;
    H = stage.clientHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    sucio = true;
  };
  medir();
  new ResizeObserver(medir).observe(stage);

  // Dibuja solo la parte visible de una escena colocada en (x0, y0) con tamaño (w, h) en píxeles CSS.
  const dibujar = (img: Fuente, x0: number, y0: number, w: number, h: number) => {
    const ax = Math.max(x0, -W * 0.06);
    const ay = Math.max(y0, -H * 0.06);
    const bx = Math.min(x0 + w, W * 1.06);
    const by = Math.min(y0 + h, H * 1.06);
    if (bx <= ax || by <= ay) return;
    const sx = ((ax - x0) / w) * img.width;
    const sy = ((ay - y0) / h) * img.height;
    const sw = ((bx - ax) / w) * img.width;
    const sh = ((by - ay) / h) * img.height;
    ctx.drawImage(img, sx, sy, sw, sh, ax, ay, bx - ax, by - ay);
  };

  // Movimiento ambiente: el escenario respira un poco y sigue al puntero.
  const objetivo = { x: 0, y: 0 };
  const puntero = { x: 0, y: 0 };
  if (!reduceMotion) {
    window.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse') return;
      objetivo.x = event.clientX / innerWidth - 0.5;
      objetivo.y = event.clientY / innerHeight - 0.5;
    });
  }

  const glanz = reduceMotion ? null : crearGlanz();
  const schmutz = reduceMotion ? null : crearSchmutz();
  // Foto del limpiacristales con la mano: si existe, sustituye a la rasqueta dibujada.
  let abzieherFoto: Fuente | null = null;
  if (!reduceMotion) cargar('/escenas/hero/abzieher.webp').then((f) => ((abzieherFoto = f), (sucio = true))).catch(() => {});

  let visible = true;
  new IntersectionObserver(([entry]) => (visible = entry.isIntersecting)).observe(world);

  let prev = 0;
  gsap.ticker.add((time) => {
    const dt = Math.min(time - prev, 0.05);
    prev = time;
    if (!visible) return;
    if (!sucio && reduceMotion) return;
    void dt;

    puntero.x += (objetivo.x - puntero.x) * 0.04;
    puntero.y += (objetivo.y - puntero.y) * 0.04;
    const respira = reduceMotion ? 1.02 : 1.04 + Math.sin(time * 0.35) * 0.012;

    // Marco 16:9 que cubre la pantalla, como object-fit: cover.
    const boxW = Math.max(W, H * RATIO);
    const boxH = boxW / RATIO;
    const oy = (H - boxH) / 2;
    let ox = (W - boxW) / 2;

    const { portal: p, llegada: q, zoom: K, forma, w: fw, h: fh, fundido = [0.12, 0.4] } = tramos[tramo];
    const a = fuentes[tramo];
    const b = fuentes[tramo + 1];

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = FONDO;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.translate(W / 2 - puntero.x * 18, H / 2 - puntero.y * 12);
    ctx.scale(respira, respira);
    ctx.translate(-W / 2, -H / 2);

    const pintar = (img: Fuente | null, plano: Plano) => {
      if (!img || plano.alpha <= 0.002) return;
      ctx.globalAlpha = plano.alpha;
      dibujar(img, ox + plano.tx * boxW, oy + plano.ty * boxH, plano.k * boxW, plano.k * boxH);
      ctx.globalAlpha = 1;
    };

    if (reduceMotion) {
      ox = Math.min(0, Math.max(W - boxW, W / 2 - (escenas[t > 0.5 ? tramo + 1 : tramo].foco ?? 0.5) * boxW));
      pintar(a, { tx: 0, ty: 0, k: 1, alpha: 1 });
      pintar(b, { tx: 0, ty: 0, k: 1, alpha: smooth(range(t, 0.3, 0.7)) });
      sucio = false;
      return;
    }

    const e = smooth(t);
    const k = Math.pow(K, e);
    // En pantallas estrechas el marco se desplaza hacia el punto de interés de cada escena (en escritorio no cambia).
    const foco = (escenas[tramo].foco ?? 0.5) + ((escenas[tramo + 1].foco ?? 0.5) - (escenas[tramo].foco ?? 0.5)) * e;
    ox = Math.min(0, Math.max(W - boxW, W / 2 - foco * boxW));
    const cx = p.x + (q.x - p.x) * e;
    const cy = p.y + (q.y - p.y) * e;

    // Escena actual: se acerca a la abertura y al final pasa junto a la cámara.
    const ko = k * (1 + 0.6 * smooth(range(t, 0.6, 1)));
    pintar(a, { tx: cx - ko * p.x, ty: cy - ko * p.y, k: ko, alpha: 1 - smooth(range(t, 0.86, 1)) });

    // Escena siguiente, recortada por la abertura. Primero se ve el objeto real (el cristal, la puerta, la gota);
    // después la escena siguiente aparece dentro y, al final del tramo, la abertura se abre hasta cubrir la vista.
    const alphaB = smooth(range(t, fundido[0], fundido[1]));
    // Al empezar, la escena siguiente se ve algo más grande de lo que le toca para que llene la abertura sin dejar
    // bordes vacíos; llega a su tamaño exacto al final del tramo.
    const llena = 1.06 * Math.max(1, (fh * K) / (2 * Math.min(q.y, 1 - q.y)), (fw * K) / (2 * Math.min(q.x, 1 - q.x)));
    const ki = (k / K) * (1 + (llena - 1) * (1 - smooth(range(t, 0.2, 1))));
    const plano = { tx: cx - ki * q.x, ty: cy - ki * q.y, k: ki, alpha: alphaB };
    const gx = ox + cx * boxW;
    const gy = oy + cy * boxH;
    if (t >= 1) {
      pintar(b, plano);
    } else if (b && alphaB > 0.002) {
      // La abertura sigue al objeto de la escena actual, que al final del tramo se acerca algo más deprisa (ko).
      const pw = ko * fw * boxW;
      const ph = ko * fh * boxH;
      const abre = smooth(range(t, 0.5, 1));
      // Escala a la que la abertura cubre toda la pantalla.
      const cubre = (2.4 * Math.hypot(W, H)) / Math.min(K * fw * boxW, K * fh * boxH);
      const s = 1 + (cubre - 1) * abre * abre;
      ctx.save();
      trazar(ctx, forma, gx, gy, pw * s, ph * s);
      ctx.clip();
      pintar(b, plano);
      ctx.restore();
      // Borde de cristal: una línea clara con halo azul agua, que se apaga al abrirse.
      const brillo = alphaB * (1 - range(t, 0.55, 0.85));
      if (brillo > 0.01) {
        ctx.save();
        trazar(ctx, forma, gx, gy, pw * s, ph * s);
        ctx.strokeStyle = `rgba(240, 250, 255, ${0.9 * brillo})`;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = `rgba(143, 208, 234, ${brillo})`;
        ctx.shadowBlur = 30;
        ctx.stroke();
        ctx.restore();
      }
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Suciedad sobre la primera escena: polvo, manchas de agua y huellas. La rasqueta la retira con el scroll.
    if (schmutz && tramo === 0 && limpio < 1) schmutz(ctx, W, H, limpio, abzieherFoto);
    // Destellos de limpio: brillan donde ya está limpio y se apartan al atravesar la abertura.
    if (glanz) glanz(ctx, W, H, time, (0.35 + 0.65 * Math.sin(Math.PI * t)) * (tramo === 0 ? limpio : 1), k, gx, gy);
    sucio = false;
  });
}

// Posición de la goma en la foto del limpiacristales (fracción del ancho de la imagen recortada).
const ABZIEHER_GOMA = 0.985;

// Capa de suciedad: se dibuja una vez en un lienzo aparte (polvo fino, manchas de agua secas, huellas y velo gris) y
// se pinta encima de la escena solo a la derecha de la rasqueta, que va algo inclinada.
function crearSchmutz() {
  const AW = 1280;
  const AH = 720;
  const capa = document.createElement('canvas');
  capa.width = AW;
  capa.height = AH;
  const c = capa.getContext('2d');
  if (!c) return null;
  const azar = (a: number, b: number) => a + Math.random() * (b - a);
  // Velo gris cálido, más denso en los bordes.
  c.fillStyle = 'rgba(128, 118, 100, 0.46)';
  c.fillRect(0, 0, AW, AH);
  const borde = c.createRadialGradient(AW / 2, AH / 2, AH * 0.2, AW / 2, AH / 2, AW * 0.7);
  borde.addColorStop(0, 'rgba(90, 80, 65, 0)');
  borde.addColorStop(1, 'rgba(90, 80, 65, 0.35)');
  c.fillStyle = borde;
  c.fillRect(0, 0, AW, AH);
  // Huellas y pasadas de trapo sucio: arcos anchos y muy suaves.
  for (let i = 0; i < 9; i++) {
    c.strokeStyle = `rgba(255, 250, 240, ${azar(0.05, 0.1)})`;
    c.lineWidth = azar(30, 70);
    c.lineCap = 'round';
    c.beginPath();
    c.arc(azar(0, AW), azar(0, AH), azar(80, 220), azar(0, 6), azar(0, 6) + azar(0.8, 1.8));
    c.stroke();
  }
  // Polvo fino.
  for (let i = 0; i < 2600; i++) {
    c.fillStyle = Math.random() < 0.7 ? `rgba(70, 60, 45, ${azar(0.12, 0.4)})` : `rgba(255, 255, 255, ${azar(0.15, 0.4)})`;
    c.beginPath();
    c.arc(azar(0, AW), azar(0, AH), azar(0.4, 1.8), 0, Math.PI * 2);
    c.fill();
  }
  // Manchas de agua secas: anillos claros con el centro algo más oscuro.
  for (let i = 0; i < 90; i++) {
    const x = azar(0, AW);
    const y = azar(0, AH);
    const r = azar(3, 12);
    c.fillStyle = `rgba(110, 100, 85, ${azar(0.06, 0.14)})`;
    c.beginPath();
    c.arc(x, y, r, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = `rgba(255, 255, 255, ${azar(0.25, 0.5)})`;
    c.lineWidth = azar(0.8, 1.6);
    c.stroke();
  }
  return (ctx: CanvasRenderingContext2D, W: number, H: number, p: number, foto: Fuente | null) => {
    // Borde de lo limpio: arriba en `e`, abajo un poco más a la izquierda.
    const inclina = W * 0.08;
    const e = -inclina + p * (W + inclina * 2);
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(e, -10);
    ctx.lineTo(W + 10, -10);
    ctx.lineTo(W + 10, H + 10);
    ctx.lineTo(e - inclina, H + 10);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(capa, 0, 0, W, H);
    ctx.restore();
    if (p <= 0.002) return;
    if (foto) {
      // La foto: la goma (vertical, en el borde derecho de la imagen recortada) sobre el borde de lo limpio, de arriba
      // abajo de la pantalla, inclinada igual que él. La mano queda detrás, en el lado ya limpio.
      const alto = H * 1.1;
      const ancho = (alto * foto.width) / foto.height;
      ctx.save();
      ctx.translate((e + e - inclina) / 2, H / 2);
      ctx.rotate(Math.atan2(inclina, H));
      ctx.shadowColor = 'rgba(10, 22, 40, 0.35)';
      ctx.shadowBlur = 30;
      ctx.shadowOffsetX = -12;
      ctx.drawImage(foto, -ancho * ABZIEHER_GOMA, -alto / 2, ancho, alto);
      ctx.restore();
      return;
    }
    // La rasqueta: goma blanca con filo dorado y halo de agua, y el mango azul noche detrás, en el lado limpio.
    const x0 = e;
    const x1 = e - inclina;
    const mx = (x0 + x1) / 2;
    const my = H / 2;
    ctx.save();
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(143, 208, 234, 0.55)';
    ctx.lineWidth = 22;
    ctx.shadowColor = 'rgba(143, 208, 234, 0.9)';
    ctx.shadowBlur = 30;
    ctx.beginPath();
    ctx.moveTo(x0, -10);
    ctx.lineTo(x1, H + 10);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#f3f7fa';
    ctx.lineWidth = 7;
    ctx.stroke();
    ctx.strokeStyle = '#d4ae6a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x0 + 4, -10);
    ctx.lineTo(x1 + 4, H + 10);
    ctx.stroke();
    // Mango.
    const largo = Math.min(W, H) * 0.32;
    ctx.strokeStyle = '#0a1628';
    ctx.lineWidth = 16;
    ctx.beginPath();
    ctx.moveTo(mx - 6, my);
    ctx.lineTo(mx - largo, my + largo * 0.35);
    ctx.stroke();
    ctx.strokeStyle = '#d4ae6a';
    ctx.lineWidth = 16;
    ctx.beginPath();
    ctx.moveTo(mx - largo * 0.55, my + largo * 0.35 * 0.55);
    ctx.lineTo(mx - largo * 0.62, my + largo * 0.35 * 0.62);
    ctx.stroke();
    // Gotitas que quedan justo detrás de la goma.
    ctx.fillStyle = 'rgba(240, 250, 255, 0.85)';
    for (let i = 0; i < 14; i++) {
      const f = ((i * 0.618) % 1);
      const y = f * H;
      const x = x0 + (x1 - x0) * f - 10 - ((i * 37) % 23);
      ctx.beginPath();
      ctx.arc(x, y, 1.5 + (i % 3), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  };
}

type Destello = { x: number; y: number; z: number; fase: number; ritmo: number };

// Destellos de limpio: estrellas de cuatro puntas, blancas y azul agua, que se encienden y se apagan.
function crearGlanz() {
  const cantidad = innerWidth < 768 ? 14 : 24;
  const destellos: Destello[] = Array.from({ length: cantidad }, () => ({
    x: Math.random(),
    y: Math.random() * 0.85,
    z: 0.3 + Math.random() * 0.7,
    fase: Math.random() * Math.PI * 2,
    ritmo: 0.6 + Math.random() * 0.9,
  }));
  return (ctx: CanvasRenderingContext2D, W: number, H: number, time: number, intensidad: number, zoom: number, ox: number, oy: number) => {
    if (intensidad <= 0.01) return;
    const base = Math.min(W, H) / 70;
    for (const d of destellos) {
      // Cada destello vive un ciclo corto: aparece, brilla y se apaga; luego vuelve a nacer en otro sitio.
      const ciclo = time * d.ritmo * 0.35 + d.fase;
      const vida = ciclo % 1;
      if (vida < 0.02) {
        d.x = Math.random();
        d.y = Math.random() * 0.85;
      }
      const brillo = Math.pow(Math.sin(Math.PI * vida), 4);
      const s = Math.pow(zoom, 0.3 + d.z * 0.8);
      const x = ox + (d.x * W - ox) * s;
      const y = oy + (d.y * H - oy) * s;
      const r = base * (0.6 + d.z) * (0.4 + brillo * 0.8) * Math.min(s, 2.5);
      if (x < -r * 3 || x > W + r * 3 || y < -r * 3 || y > H + r * 3) continue;
      ctx.globalAlpha = intensidad * brillo * (0.5 + d.z * 0.5);
      // Halo suave.
      const halo = ctx.createRadialGradient(x, y, 0, x, y, r * 1.6);
      halo.addColorStop(0, 'rgba(220, 242, 255, 0.7)');
      halo.addColorStop(1, 'rgba(220, 242, 255, 0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(x, y, r * 1.6, 0, Math.PI * 2);
      ctx.fill();
      // Estrella de cuatro puntas, girada un poco.
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(0.2 + vida * 0.6);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(0, -r * 2.4);
      ctx.quadraticCurveTo(0, 0, r * 2.4, 0);
      ctx.quadraticCurveTo(0, 0, 0, r * 2.4);
      ctx.quadraticCurveTo(0, 0, -r * 2.4, 0);
      ctx.quadraticCurveTo(0, 0, 0, -r * 2.4);
      ctx.fill();
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  };
}
