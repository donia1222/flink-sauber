import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Animaciones del cuerpo. Cada una va ligada al scroll y se puede recorrer hacia atrás; ninguna se repite.

// Leistungen: las tarjetas pasan de lado y una rasqueta limpia cada una al llegar al centro.
function leistungen(reduceMotion: boolean) {
  const seccion = document.querySelector<HTMLElement>('[data-leistungen]');
  const spur = seccion?.querySelector<HTMLElement>('[data-spur]');
  if (!seccion || !spur) return;
  const karten = gsap.utils.toArray<HTMLElement>('[data-karte]', seccion);
  const schmutz = karten.map((k) => k.querySelector<HTMLElement>('[data-schmutz]'));
  const abzieher = karten.map((k) => k.querySelector<HTMLElement>('[data-abzieher]'));
  const glanz = karten.map((k) => k.querySelector<HTMLElement>('[data-glanz]'));
  const leiste = seccion.querySelector<HTMLElement>('[data-leiste]');
  const zaehler = seccion.querySelector<HTMLElement>('[data-zaehler]');
  const n = karten.length;

  // La rasqueta va inclinada: el borde de lo limpio está en `x` arriba y 6 puntos más a la izquierda abajo.
  const wischen = (i: number, w: number) => {
    const x = -8 + w * 116;
    const s = schmutz[i];
    const a = abzieher[i];
    if (s) s.style.clipPath = `polygon(${x}% 0, 110% 0, 110% 100%, ${x - 6}% 100%)`;
    if (a) {
      a.style.left = `${x - 3}%`;
      a.style.opacity = w > 0.005 && w < 0.995 ? '1' : '0';
    }
    // Un destello recorre la foto justo al terminar de limpiarla.
    glanz[i]?.classList.toggle('is-on', w >= 0.995);
  };

  // Centra la primera tarjeta; el resto queda a su derecha.
  const centrar = () => {
    const primera = karten[0];
    spur.style.paddingLeft = `${(innerWidth - primera.offsetWidth) / 2}px`;
    spur.style.paddingRight = `${(innerWidth - primera.offsetWidth) / 2}px`;
  };
  centrar();
  const distancia = () => karten[n - 1].offsetLeft - karten[0].offsetLeft;

  if (reduceMotion) {
    karten.forEach((_, i) => wischen(i, 1));
    seccion.style.height = 'auto';
    spur.parentElement?.classList.remove('sticky', 'h-svh');
    spur.style.overflowX = 'auto';
    spur.style.width = '100%';
    return;
  }

  karten.forEach((_, i) => wischen(i, 0));
  const estado = karten.map(() => ({ w: 0 }));
  // Escala de cada tarjeta según lo lejos que está del centro: la del centro, entera; las demás, algo más pequeñas.
  const escalar = () => {
    const centro = innerWidth / 2;
    for (const k of karten) {
      const r = k.getBoundingClientRect();
      const d = Math.min(1, Math.abs(r.left + r.width / 2 - centro) / (r.width * 1.2));
      k.style.transform = `scale(${1 - d * 0.1})`;
      k.style.opacity = String(1 - d * 0.35);
    }
  };

  const INICIO = 0.7;
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: seccion,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      invalidateOnRefresh: true,
      onRefresh: () => {
        centrar();
        escalar();
      },
    },
    onUpdate: () => {
      escalar();
      const p = tl.progress();
      if (leiste) leiste.style.transform = `scaleX(${p})`;
      if (zaehler) zaehler.textContent = `${Math.min(n, 1 + Math.round(Math.max(0, tl.time() - INICIO)))}/${n}`;
    },
  });
  // La primera se limpia antes de que empiece a moverse la fila.
  tl.to(estado[0], { w: 1, duration: INICIO, ease: 'power1.inOut', onUpdate: () => wischen(0, estado[0].w) }, 0);
  tl.to(spur, { x: () => -distancia(), duration: n - 1, ease: 'none' }, INICIO);
  for (let i = 1; i < n; i++) {
    // Cada una se limpia en el último tramo de su llegada al centro.
    tl.to(estado[i], { w: 1, duration: 0.7, ease: 'power1.inOut', onUpdate: () => wischen(i, estado[i].w) }, INICIO + i - 0.75);
  }
  tl.to({}, { duration: 0.35 });
}

// Comparador antes/después: el scroll lo desliza de "todo antes" a "casi todo después" hasta que alguien lo arrastra.
function vergleich(reduceMotion: boolean) {
  const v = document.querySelector<HTMLElement>('[data-vergleich]');
  if (!v) return;
  let tocado = false;
  const poner = (p: number) => {
    const pos = Math.max(0, Math.min(100, p));
    v.style.setProperty('--pos', `${pos}%`);
    v.setAttribute('aria-valuenow', String(Math.round(pos)));
  };
  poner(reduceMotion ? 50 : 100);
  const desdePuntero = (e: PointerEvent) => {
    const r = v.getBoundingClientRect();
    poner(((e.clientX - r.left) / r.width) * 100);
  };
  let arrastrando = false;
  v.addEventListener('pointerdown', (e) => {
    tocado = true;
    arrastrando = true;
    v.setPointerCapture(e.pointerId);
    v.classList.add('is-aktiv');
    desdePuntero(e);
  });
  v.addEventListener('pointermove', (e) => arrastrando && desdePuntero(e));
  const soltar = () => {
    arrastrando = false;
    v.classList.remove('is-aktiv');
  };
  v.addEventListener('pointerup', soltar);
  v.addEventListener('pointercancel', soltar);
  v.addEventListener('keydown', (e) => {
    const actual = Number(v.getAttribute('aria-valuenow'));
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      tocado = true;
      poner(actual + (e.key === 'ArrowLeft' ? -5 : 5));
    }
  });
  if (reduceMotion) return;
  ScrollTrigger.create({
    trigger: v,
    start: 'top 85%',
    end: 'center 40%',
    onUpdate: (self) => {
      if (!tocado) poner(100 - self.progress * 70);
    },
  });
}

// Fotos reales: llegan desde abajo, giradas, y se "revelan" como una Polaroid (de velada a nítida).
function polaroids(reduceMotion: boolean) {
  const fotos = gsap.utils.toArray<HTMLElement>('[data-polaroid]');
  if (!fotos.length || reduceMotion) return;
  fotos.forEach((f, i) => {
    const img = f.querySelector('img');
    gsap
      .timeline({ scrollTrigger: { trigger: f, start: 'top 98%', end: 'top 62%', scrub: 0.6 } })
      .fromTo(f, { y: 140, rotation: i ? 10 : -12, scale: 0.9 }, { y: 0, rotation: 0, scale: 1, ease: 'power2.out' }, 0)
      .fromTo(img, { filter: 'brightness(1.9) saturate(0) contrast(0.6) blur(3px)' }, { filter: 'brightness(1) saturate(1) contrast(1) blur(0px)', ease: 'power1.in' }, 0);
  });
}

// Retrato del equipo: se abre desde el centro en círculo, como una gota que se expande.
function retrato(reduceMotion: boolean) {
  const el = document.querySelector<HTMLElement>('[data-portrait]');
  if (!el || reduceMotion) return;
  const img = el.querySelector('img');
  gsap
    .timeline({ scrollTrigger: { trigger: el, start: 'top 90%', end: 'center 55%', scrub: 0.6 } })
    .fromTo(el, { clipPath: 'circle(8% at 50% 45%)' }, { clipPath: 'circle(75% at 50% 45%)', ease: 'power2.inOut' }, 0)
    .fromTo(img, { scale: 1.35 }, { scale: 1, ease: 'power2.out' }, 0);
}

// Pie: el valle del Rin se desplaza más despacio que la página.
function rheintal(reduceMotion: boolean) {
  const img = document.querySelector<HTMLElement>('[data-rheintal]');
  if (!img || reduceMotion) return;
  gsap.fromTo(img, { yPercent: -12 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '[data-fuss]', start: 'top bottom', end: 'bottom bottom', scrub: true } });
}

// Cifras: cuentan desde cero la primera vez que aparecen.
function zahlen(reduceMotion: boolean) {
  const els = gsap.utils.toArray<HTMLElement>('[data-zahl]');
  if (reduceMotion) return;
  els.forEach((el) => {
    const fin = Number(el.dataset.zahl);
    const obj = { v: 0 };
    el.textContent = '0';
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => gsap.to(obj, { v: fin, duration: 1.8, ease: 'power3.out', onUpdate: () => (el.textContent = String(Math.round(obj.v))) }),
    });
  });
}

// Pasos: el hilo de agua baja con el scroll, con la gota en la punta, y enciende cada paso al llegar a él.
function pasos(reduceMotion: boolean) {
  const bereich = document.querySelector<HTMLElement>('[data-wasser-bereich]');
  if (!bereich) return;
  const linea = bereich.querySelector<SVGPathElement>('[data-wasser]');
  const gota = bereich.querySelector<HTMLElement>('[data-wasser-tropfen]');
  const schritte = [...bereich.querySelectorAll<HTMLElement>('[data-schritt]')];
  if (!linea) return;
  if (reduceMotion) {
    linea.style.strokeDashoffset = '0';
    schritte.forEach((s) => s.classList.add('is-on'));
    return;
  }
  const largo = linea.getTotalLength();
  ScrollTrigger.create({
    trigger: bereich,
    start: 'top 70%',
    end: 'bottom 55%',
    onUpdate: (self) => {
      const p = self.progress;
      linea.style.strokeDashoffset = String(1 - p);
      const alto = bereich.offsetHeight;
      schritte.forEach((s) => s.classList.toggle('is-on', p * alto >= s.offsetTop + 24));
      if (gota) {
        // El SVG se estira sin conservar proporción: x en % de su ancho (60) e y en % del alto (1000).
        const pt = linea.getPointAtLength(largo * p);
        gota.style.left = `${(pt.x / 60) * 100}%`;
        gota.style.top = `${(pt.y / 1000) * 100}%`;
        gota.style.opacity = p > 0.01 && p < 0.995 ? '1' : '0';
      }
    },
  });
}

// Pie: la rasqueta recorre el nombre empañado y lo deja limpio en oro mientras se baja hasta el final.
function fuss(reduceMotion: boolean) {
  const svg = document.querySelector<SVGSVGElement>('[data-wortmarke]');
  const flaeche = svg?.querySelector<SVGRectElement>('[data-wisch-flaeche]');
  const abzieher = svg?.querySelector<SVGGElement>('[data-wisch-abzieher]');
  if (!svg || !flaeche || !abzieher) return;
  const limpiar = (p: number) => {
    const x = p * 1000;
    flaeche.setAttribute('width', String(x));
    abzieher.setAttribute('transform', `translate(${x} 0)`);
    abzieher.style.opacity = p > 0.005 && p < 0.995 ? '1' : '0';
    svg.classList.toggle('is-sauber', p > 0.995);
  };
  if (reduceMotion) return limpiar(1);
  // El pie es corto: no hay scroll suficiente para ligarlo al scroll. La rasqueta pasa una vez, sola, al aparecer.
  limpiar(0);
  const estado = { p: 0 };
  ScrollTrigger.create({
    trigger: svg,
    start: 'top 80%',
    once: true,
    onEnter: () => gsap.to(estado, { p: 1, duration: 1.8, ease: 'power2.inOut', onUpdate: () => limpiar(estado.p) }),
  });
}

/**
 * Galería: cada foto se limpia al entrar, y las filas se mueven a distinta
 * velocidad mientras pasa el scroll.
 *
 * Va aparte de `initSecciones` y se exporta porque esta sección NO existe
 * cuando el resto se monta: sus fotos llegan del servidor. El componente la
 * llama cada vez que vuelve a pintar (también al cambiar de filtro), así que
 * lo primero es tirar los disparadores de la pasada anterior — si no, cada
 * cambio de filtro dejaría otro juego encima y acabarían peleándose.
 *
 * El gesto es el de la casa: la foto entra velada y gris, y una pasada de
 * izquierda a derecha —la misma dirección que la rasqueta de Leistungen— la
 * deja nítida. Lo que cambia respecto a las Polaroids de «Echte Arbeit» es
 * que aquí no hay giro ni caída: son muchas y juntas, y moverlas todas sería
 * ruido. Se limpian, y ya.
 */
export function animarGalerie(reduceMotion: boolean) {
  ScrollTrigger.getAll().forEach((t) => {
    if (typeof t.vars.id === 'string' && t.vars.id.startsWith('galerie')) t.kill();
  });

  /* Lo PRIMERO: encender los textos de la sección.
     `[data-reveal]` nace invisible (opacity 0) y lo enciende un observador
     que motion.ts crea al cargar la página — cuando aquí todavía no hay
     nada. Resultado: el rótulo y el título de la galería quedaban puestos,
     ocupando su sitio, pero sin verse nunca; en el móvil se veía un hueco
     en blanco de media pantalla entre «Über uns» y las fotos. En el
     escritorio salía bien de pura suerte: allí las fotos llegan antes de
     que el observador arranque y sí las pilla.
     Observador propio, y no `is-in` a secas, para que el texto entre
     animado como en el resto de la página y no de golpe. */
  const textos = document.querySelectorAll<HTMLElement>('#galerie [data-reveal]:not(.is-in)');
  if (textos.length) {
    const ojo = new IntersectionObserver((entradas) => {
      for (const e of entradas) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('is-in');
        ojo.unobserve(e.target);
      }
    }, { rootMargin: '0px 0px -10% 0px' });
    textos.forEach((t) => ojo.observe(t));
  }

  const fotos = gsap.utils.toArray<HTMLElement>('[data-galerie-bild]');
  if (!fotos.length) return;

  if (reduceMotion) {
    // Sin animación, pero visibles: lo que no se puede quedar es a medias.
    fotos.forEach((f) => gsap.set(f, { clearProps: 'all' }));
    return;
  }

  fotos.forEach((f, i) => {
    const img = f.querySelector('img');
    // El retardo va por COLUMNA y no por orden: en una rejilla de tres, las
    // tres de una fila entran a la vez y se lee como una pasada, no como una
    // cola de fotos.
    const columna = i % 3;

    gsap
      .timeline({
        scrollTrigger: {
          id: 'galerie-' + i,
          trigger: f,
          start: 'top 96%',
          end: 'top 64%',
          scrub: 0.5,
        },
      })
      .fromTo(
        f,
        { clipPath: 'inset(0% 100% 0% 0%)', y: 26 },
        { clipPath: 'inset(0% 0% 0% 0%)', y: 0, ease: 'power2.out', duration: 1 },
        columna * 0.08,
      )
      .fromTo(
        img,
        { filter: 'saturate(0.15) brightness(1.35) blur(5px)', scale: 1.12 },
        { filter: 'saturate(1) brightness(1) blur(0px)', scale: 1, ease: 'power1.inOut', duration: 1 },
        columna * 0.08,
      );

    // Y un desplazamiento suave mientras la sección pasa: las columnas de los
    // lados van un pelín más despacio que la del medio. Es poco —doce
    // píxeles— y es justo lo que hace que el bloque no parezca una foto fija.
    gsap.fromTo(
      f,
      { yPercent: columna === 1 ? 0 : 2.2 },
      {
        yPercent: columna === 1 ? 2.2 : 0,
        ease: 'none',
        scrollTrigger: {
          id: 'galerie-p' + i,
          trigger: f,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    );
  });

  ScrollTrigger.refresh();
}

export function initSecciones(reduceMotion: boolean) {
  leistungen(reduceMotion);
  vergleich(reduceMotion);
  polaroids(reduceMotion);
  retrato(reduceMotion);
  rheintal(reduceMotion);
  zahlen(reduceMotion);
  pasos(reduceMotion);
  fuss(reduceMotion);
  // Los pins y alturas ya están: recalcular en orden.
  ScrollTrigger.sort();
  requestAnimationFrame(() => ScrollTrigger.refresh());
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}
