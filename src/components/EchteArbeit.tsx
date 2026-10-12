import type { CSSProperties } from 'react';

const fotos = [
  { src: '/escenas/eigene/fenster-leiter.webp', alt: 'Fensterreinigung an einer Hausfassade mit Leiter und Teleskopstange', titel: 'Fassade mit Leiter' },
  { src: '/escenas/eigene/wintergarten.webp', alt: 'Ein Mitarbeiter von Flink Sauber reinigt auf der Leiter die Glasfront eines Wintergartens', titel: 'Wintergarten, streifenfrei' },
  { src: '/escenas/eigene/balkon-klein.webp', alt: 'Eine frisch gereinigte Terrasse mit Gartenmöbeln und Pflanzen', titel: 'Terrasse, wie neu' },
  { src: '/escenas/eigene/fenster-innen-klein.webp', alt: 'Saubere Balkontür und Fenster mit Blick auf die Berge', titel: 'Fenster, klar' },
];

// "Echte Arbeit": fotos reales de Flink Sauber. Un comparador antes/después (el scroll lo desliza solo hasta que se
// arrastra) y cuatro fotos de trabajos que se revelan como una Polaroid al pasar.
export default function EchteArbeit() {
  return (
    <section id="arbeit" aria-labelledby="arbeit-titel" className="relative overflow-hidden bg-nacht px-6 py-24 text-frost md:px-16 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold tracking-[0.32em] text-wasser uppercase" data-reveal>
            Echte Arbeit, keine Stockfotos
          </p>
          <h2 id="arbeit-titel" className="mt-3 text-5xl leading-[0.95] md:text-7xl" data-reveal>
            Vorher. <em>Nachher.</em>
          </h2>
          <p className="mt-5 max-w-md text-frost/70 md:text-lg" data-reveal>
            Ein Backofen aus einem unserer Aufträge. Ziehen Sie den Regler und sehen Sie selbst.
          </p>
        </div>

        <div className="mt-12 grid items-center gap-14 md:mt-16 md:grid-cols-[1.45fr_1fr] md:gap-16">
          <div
            data-vergleich
            role="slider"
            tabIndex={0}
            aria-label="Vorher-Nachher-Vergleich"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={100}
            className="vergleich relative aspect-[1024/593] cursor-ew-resize touch-pan-y overflow-hidden rounded-[1.75rem] bg-tinte shadow-[0_40px_80px_-40px_rgb(0_0_0/0.8)] select-none"
            data-reveal
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/escenas/eigene/nachher.webp" alt="Der Ventilator eines Backofens nach der Reinigung, sauber und glänzend" loading="lazy" draggable={false} className="absolute inset-0 size-full object-cover" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/escenas/eigene/vorher.webp" alt="Der gleiche Backofen vorher, voller eingebrannter Fettrückstände" loading="lazy" draggable={false} className="vergleich-vorher absolute inset-0 size-full object-cover" />
            <span className="absolute top-4 left-4 rounded-full bg-nacht/75 px-3 py-1 text-[11px] font-semibold tracking-[0.2em] uppercase backdrop-blur-sm">Vorher</span>
            <span className="absolute top-4 right-4 rounded-full bg-gold px-3 py-1 text-[11px] font-semibold tracking-[0.2em] text-nacht uppercase">Nachher</span>
            <div className="vergleich-linie" aria-hidden="true">
              <span className="vergleich-knopf">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 6l-5 6 5 6M15 6l5 6-5 6" />
                </svg>
              </span>
            </div>
          </div>

          {/* Cuatro fotos reales, como Polaroids sobre la mesa. */}
          <div className="mx-auto grid w-full max-w-md grid-cols-2 gap-x-4 gap-y-6 md:gap-x-6">
            {fotos.map((f, i) => (
              <figure key={f.src} data-polaroid className={`polaroid ${i % 2 ? 'translate-y-8' : ''}`} style={{ rotate: `${[-4, 3, 2.5, -3][i]}deg` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.src} alt={f.alt} loading="lazy" className="aspect-[9/11] w-full object-cover" />
                <figcaption>{f.titel}</figcaption>
              </figure>
            ))}
          </div>
        </div>

        {/* El equipo: el retrato se abre desde el centro como una gota que se expande. */}
        <div className="mt-24 grid items-center gap-10 md:mt-36 md:grid-cols-[0.9fr_1.1fr] md:gap-20">
          <div data-portrait className="portrait relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2rem] bg-tinte md:max-w-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/escenas/eigene/team-portrait.webp" alt="Ein Mitarbeiter von DF Flink Sauber in Arbeitskleidung, hinter ihm das Rheintal und die Berge" loading="lazy" className="size-full object-cover" />
          </div>
          <div>
            <p className="text-[11px] font-semibold tracking-[0.32em] text-wasser uppercase" data-reveal>
              Über uns
            </p>
            <h3 className="mt-3 text-4xl leading-[0.95] md:text-6xl" data-reveal>
              Ihr Partner für <em>makellose Sauberkeit</em>
            </h3>
            <p className="mt-5 max-w-md text-frost/70 md:text-lg" data-reveal>
              Wir reinigen Wohnungen, Häuser und Büros in ganz Liechtenstein. Persönlich, pünktlich und mit einem festen Ansprechpartner, der Ihr Objekt kennt.
            </p>
            <ul className="mt-8 grid gap-3">
              {['Geschulte Reinigungsprofis', 'Pünktlich und zuverlässig', 'Umweltfreundliche Reinigungsmittel'].map((t, i) => (
                <li key={t} className="flex items-center gap-3 text-[15px]" data-reveal style={{ '--d': `${i * 100}ms` } as CSSProperties}>
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-gold/15 text-gold ring-1 ring-gold/30">
                    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
