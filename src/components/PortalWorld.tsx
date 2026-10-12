import Stop from './Stop';
import TropfenLeiste from './TropfenLeiste';
import type { ReactNode } from 'react';
import { recorrido } from '../data/escenas';
import { firma } from '../data/firma';

const title = 'mt-3 [text-shadow:0_2px_28px_rgb(10_22_40/0.65)] text-[clamp(2.4rem,7svh,3.4rem)] leading-[0.95] md:mt-4 md:text-8xl';
const body = 'mt-[min(1.25rem,2svh)] [text-shadow:0_1px_14px_rgb(10_22_40/0.8)] max-w-lg text-[15px] text-frost/80 md:mt-5 md:text-lg';

// Texto de cada parada, por id de escena.
const textos: Record<string, { eyebrow: string; inhalt: ReactNode }> = {
  start: {
    eyebrow: 'Reinigung in Liechtenstein',
    inhalt: (
      <>
        <h1 className={title}>
          Makellose Räume für Ihr <em>Wohlbefinden</em>
        </h1>
        <p className={body}>DF Flink Sauber aus Triesen. Scrollen Sie hinein: Wir machen den ersten Wisch.</p>
      </>
    ),
  },
  bad: {
    eyebrow: 'Bad & Küche',
    inhalt: (
      <>
        <h2 className={title}>
          Glanz, den man <em>sieht</em>
        </h2>
        <p className={body}>Kalk, Wasserflecken, Fingerabdrücke: Wir entfernen alles, streifenfrei und hygienisch.</p>
      </>
    ),
  },
  detail: {
    eyebrow: 'Das Detail',
    inhalt: (
      <>
        <h2 className={title}>
          Bis zum <em>letzten Tropfen</em>
        </h2>
        <p className={body}>Armaturen, Fugen, Griffe: Wir polieren auch dort, wo andere aufhören. Und kontrollieren alles selbst.</p>
      </>
    ),
  },
  team: {
    eyebrow: 'Ihr Team in Liechtenstein',
    inhalt: (
      <>
        <h2 className={title}>
          Flink. Sauber. <em>Zuverlässig.</em>
        </h2>
        <p className={body}>Wohnung, Büro oder Umzug: Wir kommen in ganz Liechtenstein, ohne Anfahrtskosten. Die Beratung ist kostenlos.</p>
      </>
    ),
  },
};

const botones = (
  <div className="mt-[min(2rem,3.5svh)] flex flex-wrap justify-center gap-3">
    <a href="#kontakt" className="btn btn-gold">
      Kostenlose Offerte
    </a>
    <a href={firma.telefonLink} className="btn btn-glas">
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
      </svg>
      {firma.telefon}
    </a>
  </div>
);

export default function PortalWorld() {
  const { escenas } = recorrido;
  return (
    <section data-world aria-label="Vom ersten Wisch bis zur fertigen Wohnung" className="relative">
      <div data-stage className="sticky top-0 h-lvh overflow-hidden bg-nacht">
        {/* Primera escena como imagen normal: se ve al instante mientras el canvas carga las demás. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-poster
          src={escenas[0].src}
          alt=""
          aria-hidden="true"
          width={1672}
          height={941}
          fetchPriority="high"
          className="absolute inset-0 size-full scale-[1.04] object-cover transition-opacity duration-700"
        />
        <canvas data-portal aria-hidden="true" className="absolute inset-0 size-full opacity-0 transition-opacity duration-700" />

        {/* Viñeta suave y degradado inferior azul noche para leer el texto. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgb(10_22_40/0.45)_100%)]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-nacht/90 via-nacht/50 to-transparent" />

        <div data-hint aria-hidden="true" className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
          <span className="text-[10px] font-semibold tracking-[0.3em] text-frost/60 uppercase">Scroll</span>
          <span className="hint-line block h-10 w-px bg-frost/50" />
        </div>

        <TropfenLeiste escenas={escenas} />
      </div>

      <div className="relative z-10 -mt-[100lvh]">
        {escenas.map((e, i) => (
          <Stop key={e.id} escena={e} eyebrow={textos[e.id].eyebrow}>
            {textos[e.id].inhalt}
            {/* La última parada lleva los botones. */}
            {i === escenas.length - 1 && botones}
          </Stop>
        ))}
      </div>
    </section>
  );
}
