import { leistungen } from '../data/leistungen';

// "Leistungen": las cinco tarjetas pasan de lado con el scroll. Cada una llega sucia (velada, gris, con manchas) y,
// al ponerse en el centro, una rasqueta la limpia de izquierda a derecha. La animación está en secciones.ts.
export default function Leistungen() {
  return (
    <section id="leistungen" data-leistungen aria-labelledby="leistungen-titel" className="relative h-[560svh] bg-frost text-nacht">
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden pt-16 pb-4">
        <div className="px-6 text-center">
          <p className="text-[11px] font-semibold tracking-[0.32em] text-schiefer uppercase">Leistungen</p>
          <h2 id="leistungen-titel" className="mt-2 text-[clamp(2.3rem,6svh,2.9rem)] leading-[0.95] md:mt-3 md:text-7xl">
            Fünf Wege zu <em>makellos</em>
          </h2>
        </div>

        <div data-spur className="mt-[3svh] flex w-max items-start gap-5 md:mt-10 md:gap-10">
          {leistungen.map((l, i) => (
            <article key={l.id} data-karte className="karte w-[min(74vw,330px,38svh)] shrink-0 md:w-[min(28vw,360px,42svh)]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-eis shadow-[0_30px_60px_-30px_rgb(10_22_40/0.55)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={l.bild} alt={l.alt} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
                {/* La misma foto, sucia: se recorta desde la izquierda a medida que pasa la rasqueta. */}
                <div data-schmutz className="schmutz absolute inset-0" aria-hidden="true">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={l.bild} alt="" loading="lazy" decoding="async" className="schmutz-bild absolute inset-0 size-full object-cover" />
                  <span className="schmutz-flecken absolute inset-0" />
                </div>
                <div data-abzieher className="abzieher" aria-hidden="true">
                  <span className="abzieher-griff" />
                </div>
                <span data-glanz className="karte-glanz" aria-hidden="true" />
                <p className="absolute top-4 left-4 rounded-full bg-nacht/70 px-3 py-1 text-[11px] font-semibold tracking-[0.2em] text-frost backdrop-blur-sm">
                  0{i + 1}
                </p>
              </div>
              <div data-karte-text className="px-1 pt-[min(1.1rem,2svh)]">
                <h3 className="text-[clamp(1.6rem,4svh,2rem)] leading-none md:text-4xl">{l.name}</h3>
                <p className="mt-2 text-sm leading-snug text-nacht/70 max-md:[@media(max-height:700px)]:hidden">{l.text}</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {l.punkte.map((p) => (
                    <li key={p} className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold ring-1 ring-nacht/10">
                      <svg viewBox="0 0 24 24" className="size-3.5 text-gold-tief" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12.5l4.5 4.5L19 7.5" />
                      </svg>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        {/* Avance: una línea que se llena y un punto por servicio. */}
        <div className="mx-auto mt-[3svh] flex w-[min(70vw,320px)] items-center gap-3 md:mt-10" aria-hidden="true">
          <div className="relative h-px flex-1 bg-nacht/15">
            <span data-leiste className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-gold-tief" />
          </div>
          <span data-zaehler className="w-10 text-right text-xs font-semibold tabular-nums text-nacht/60">
            1/{leistungen.length}
          </span>
        </div>
      </div>
    </section>
  );
}
