import type { CSSProperties } from 'react';
import { firma } from '../data/firma';

// "Vertrauen": cifras de su web que cuentan hacia arriba al aparecer y reseñas reales de Google. Cada reseña recibe
// un destello, como un cristal recién limpiado, al entrar en pantalla.

const zahlen = [
  { wert: 172, plus: true, text: 'Wohnungen gereinigt' },
  { wert: 50, plus: true, text: 'Firmenkunden' },
  { wert: 98, suffix: '%', text: 'Kundenzufriedenheit' },
  { wert: 24, suffix: ' h', text: 'Reaktionszeit' },
];

// Reseñas de su ficha de Google (las de otros idiomas, traducidas al alemán).
const stimmen = [
  {
    name: 'Familie Haas',
    text: 'Wir haben DF Flink Sauber unseren Umzug und die Endreinigung der alten Wohnung mit Abnahmegarantie anvertraut und können diese Firma in allen Belangen wärmstens empfehlen. Tadelloser Service, pünktlich.',
  },
  {
    name: 'Triptychon',
    text: 'Sauberer und zuverlässiger Service zum fairen Preis. Wir lassen unsere Bäder und Oberflächen ein- bis zweimal im Monat reinigen und sind seit Tag 1 zufriedene Kunden.',
  },
  {
    name: 'Pau Risa',
    text: 'Ihr Reinigungsservice und ihre Liebe zum Detail sind beeindruckend. Meine Wohnung war nach der Reinigung blitzblank.',
    uebersetzt: true,
  },
  {
    name: 'Abril Villamizar',
    text: 'Der beste Reinigungsservice in Liechtenstein! Beste Servicequalität, 100 % empfehlenswert!',
    uebersetzt: true,
  },
];

const Sterne = ({ className = '' }: { className?: string }) => (
  <span className={`flex gap-0.5 text-gold-tief ${className}`} aria-hidden="true">
    {[0, 1, 2, 3, 4].map((i) => (
      <svg key={i} viewBox="0 0 24 24" className="size-4" fill="currentColor">
        <path d="M12 2.8l2.8 5.8 6.4.9-4.6 4.5 1.1 6.3L12 17.3l-5.7 3 1.1-6.3-4.6-4.5 6.4-.9L12 2.8Z" />
      </svg>
    ))}
  </span>
);

export default function Vertrauen() {
  return (
    <section id="vertrauen" aria-labelledby="vertrauen-titel" className="relative bg-frost px-6 py-24 text-nacht md:px-16 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.32em] text-schiefer uppercase" data-reveal>
              Vertrauen
            </p>
            <h2 id="vertrauen-titel" className="mt-3 text-5xl leading-[0.95] md:text-7xl" data-reveal>
              Zahlen, die <em>glänzen</em>
            </h2>
          </div>
          <div className="flex items-center gap-4 self-start rounded-full bg-white py-2 pr-5 pl-2 shadow-[0_20px_40px_-25px_rgb(10_22_40/0.5)] ring-1 ring-nacht/8 md:self-auto" data-reveal>
            <span className="grid size-12 place-items-center rounded-full bg-nacht font-serif text-2xl text-frost">{firma.bewertung}</span>
            <span>
              <Sterne />
              <span className="mt-1 block text-xs font-semibold text-nacht/60">Bewertung auf Google</span>
            </span>
          </div>
        </div>

        <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 border-y border-nacht/10 py-10 md:mt-20 md:grid-cols-4 md:py-14">
          {zahlen.map((z, i) => (
            <div key={z.text} data-reveal style={{ '--d': `${i * 90}ms` } as CSSProperties}>
              <dt className="sr-only">{z.text}</dt>
              <dd>
                <span className="font-serif text-6xl leading-none md:text-8xl">
                  <span data-zahl={z.wert}>{z.wert}</span>
                  <span className="text-gold-tief">{z.plus ? '+' : z.suffix}</span>
                </span>
                <span className="mt-2 block text-sm font-medium text-nacht/65">{z.text}</span>
              </dd>
            </div>
          ))}
        </dl>

        <ul className="mt-14 grid gap-5 md:mt-20 md:grid-cols-2 md:gap-6">
          {stimmen.map((s, i) => (
            <li
              key={s.name}
              data-reveal
              data-stimme
              className="stimme relative overflow-hidden rounded-[1.75rem] bg-white p-7 shadow-[0_30px_60px_-40px_rgb(10_22_40/0.45)] ring-1 ring-nacht/8 md:p-9"
              style={{ '--d': `${(i % 2) * 120}ms` } as CSSProperties}
            >
              <Sterne />
              <blockquote className="mt-4 font-serif text-xl leading-snug md:text-2xl">«{s.text}»</blockquote>
              <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                <span className="font-semibold">{s.name}</span>
                <span className="text-nacht/50">Google-Rezension{s.uebersetzt ? ', aus dem Englischen übersetzt' : ''}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
