'use client';

import { useEffect, useState } from 'react';

/**
 * La galería de trabajos, con las fotos que Doris sube desde su panel.
 *
 * Las fotos NO viven aquí. Llegan de la misma base que ya las guardaba —la
 * del panel— por un endpoint que solo lee: `api/web-galeria.php`. Subirlas y
 * quitarlas se hace en el panel (Webseite · Bilder), que para eso pide la
 * cookie; aquí no hay ninguna puerta que abrir, y por eso esta sección no
 * sabe ni puede escribir.
 *
 * Esta web se publica como export estático, así que la lista se pide desde el
 * navegador al cargar. Si el servidor no contesta, la sección entera no se
 * pinta: antes que un hueco con un error en la página de un cliente, mejor
 * que no esté.
 */

/* El de siempre, salvo que se diga otro con NEXT_PUBLIC_GALERIE: eso es lo
   que permite probar la seccion en local contra un servidor de prueba sin
   tocar esta linea ni acordarse luego de devolverla a su sitio. */
const ORIGEN = process.env.NEXT_PUBLIC_GALERIE
  || 'https://web.lweb.ch/flink/panel/api/web-galeria.php';

type Foto = {
  id: number;
  url: string;
  titulo: string;
  categoria: string;
  descripcion: string;
};

const AREAS = [
  { id: 'all', rotulo: 'Alle' },
  { id: 'wohnung', rotulo: 'Wohnung' },
  { id: 'buero', rotulo: 'Büro' },
  { id: 'spezial', rotulo: 'Spezial' },
] as const;

export default function Galerie() {
  const [fotos, setFotos] = useState<Foto[] | null>(null);
  const [area, setArea] = useState<string>('all');
  const [abierta, setAbierta] = useState<Foto | null>(null);

  useEffect(() => {
    let vivo = true;
    fetch(ORIGEN, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (vivo && d && d.ok) setFotos(d.imagenes as Foto[]);
      })
      .catch(() => {});
    return () => {
      vivo = false;
    };
  }, []);

  /**
   * Llegando con #galerie en la dirección, la página baja sola hasta aquí.
   *
   * El ancla sola no vale: cuando el navegador la busca, esta sección
   * todavía no existe —se pinta cuando contestan las fotos— así que se
   * queda arriba y parece que el enlace no hace nada. Esto es lo que usa el
   * botón «Auf der Webseite ansehen» del panel: Doris sube una foto, pulsa,
   * y aterriza mirando la galería.
   *
   * El respiro deja que Lenis (el scroll suave) termine de montarse; sin él
   * se pelea con el salto y a veces lo deshace.
   */
  useEffect(() => {
    if (!fotos || fotos.length === 0) return;
    if (window.location.hash !== '#galerie') return;
    const reloj = setTimeout(() => {
      document.getElementById('galerie')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 350);
    return () => clearTimeout(reloj);
  }, [fotos]);

  /**
   * Las fotos se animan con el scroll, como el resto de la página.
   *
   * Esto no puede ir en `initSecciones`, que corre una vez al cargar: cuando
   * eso pasa, aquí todavía no hay ni una foto. Se llama al pintar y cada vez
   * que cambia el filtro, porque entonces los elementos son otros.
   *
   * El script de animaciones se trae sólo cuando hace falta (import
   * dinámico): es GSAP, y no tiene por qué pesar en la primera carga de quien
   * nunca baja hasta aquí.
   */
  useEffect(() => {
    if (!fotos || fotos.length === 0) return;
    let vivo = true;
    const parado = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Un fotograma de margen: si se pide antes de que el navegador haya
    // colocado la rejilla, las medidas salen mal y la animación se queda a
    // medio camino.
    const reloj = requestAnimationFrame(() => {
      import('../scripts/secciones')
        .then((m) => { if (vivo) m.animarGalerie(parado); })
        .catch(() => {});
    });
    return () => { vivo = false; cancelAnimationFrame(reloj); };
  }, [fotos, area]);

  // Con la foto ampliada abierta, Escape la cierra: en el móvil se sale
  // tocando fuera, pero con teclado tiene que haber salida.
  useEffect(() => {
    if (!abierta) return;
    const alPulsar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAbierta(null);
    };
    window.addEventListener('keydown', alPulsar);
    return () => window.removeEventListener('keydown', alPulsar);
  }, [abierta]);

  // Mientras no haya nada que enseñar, esta sección no existe.
  if (!fotos || fotos.length === 0) return null;

  // Solo se ofrecen los filtros que de verdad tienen fotos: una pestaña que
  // lleva a una rejilla vacía es peor que no tenerla.
  const areasConFotos = AREAS.filter(
    (a) => a.id === 'all' || fotos.some((f) => f.categoria === a.id),
  );
  const lista = area === 'all' ? fotos : fotos.filter((f) => f.categoria === area);

  return (
    <section
      id="galerie"
      aria-labelledby="galerie-titel"
      className="relative overflow-hidden bg-nacht px-6 py-24 text-frost md:px-16 md:py-36"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold tracking-[0.32em] text-wasser uppercase" data-reveal>
            Aus unseren Aufträgen
          </p>
          <h2 id="galerie-titel" className="mt-3 text-5xl leading-[0.95] md:text-7xl" data-reveal>
            Galerie
          </h2>
          <p className="mt-5 max-w-md text-frost/70 md:text-lg" data-reveal>
            Wohnungen, Büros und Spezialreinigungen — fotografiert nach getaner Arbeit.
          </p>
        </div>

        {areasConFotos.length > 2 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {areasConFotos.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setArea(a.id)}
                aria-pressed={area === a.id}
                className={
                  'rounded-full px-4 py-2 text-[13px] font-semibold tracking-[0.12em] uppercase transition ' +
                  (area === a.id
                    ? 'bg-gold text-nacht'
                    : 'bg-frost/10 text-frost/70 hover:bg-frost/20 hover:text-frost')
                }
              >
                {a.rotulo}
              </button>
            ))}
          </div>
        )}

        <div className="mt-10 grid grid-cols-2 gap-3 md:mt-14 md:grid-cols-3 md:gap-5">
          {lista.map((f) => (
            <button
              key={f.id}
              type="button"
              data-galerie-bild
              onClick={() => setAbierta(f)}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-tinte"
              aria-label={f.titulo ? `${f.titulo} vergrössern` : 'Bild vergrössern'}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={f.url}
                alt={f.titulo || 'Arbeit von DF Flink Sauber'}
                loading="lazy"
                className="size-full object-cover transition duration-500 group-hover:scale-[1.04]"
              />
              {/* Sin rotulo encima de la foto. Casi todas se subieron sin
                  titulo, asi que llevaban el nombre del fichero y en la web
                  salia «772686047_1047503178200387…» cruzando la imagen. El
                  titulo sigue viajando: va en el `alt`, que es donde le
                  sirve a quien no ve la foto y a Google. */}
            </button>
          ))}
        </div>
      </div>

      {/* La foto en grande. Todo el fondo cierra, como en cualquier visor. */}
      {abierta && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={abierta.titulo || 'Bild'}
          onClick={() => setAbierta(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-nacht/90 p-4 backdrop-blur-sm"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={abierta.url}
            alt={abierta.titulo || 'Arbeit von DF Flink Sauber'}
            className="max-h-[86vh] w-auto max-w-full rounded-2xl object-contain"
          />
          {/* Ampliada, solo la descripcion: eso lo escribe ella a proposito
              cuando quiere decir algo de la foto. El titulo no, por lo mismo
              de arriba. */}
          {abierta.descripcion && (
            <p className="absolute inset-x-0 bottom-6 px-6 text-center text-sm text-frost/80">
              {abierta.descripcion}
            </p>
          )}
          <button
            type="button"
            onClick={() => setAbierta(null)}
            aria-label="Schliessen"
            className="absolute top-5 right-5 grid size-11 place-items-center rounded-full bg-frost/15 text-frost backdrop-blur-sm hover:bg-frost/25"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}
