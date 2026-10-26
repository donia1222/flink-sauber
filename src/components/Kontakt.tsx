import type { CSSProperties, ReactNode } from 'react';
import { firma, whatsapps, zeiten } from '../data/firma';
import { OfferteKnopf } from './Offerte';

// "Kontakt": los cuatro pasos de su web unidos por un hilo de agua que baja con el scroll, con una gota en la punta,
// y enciende cada paso al llegar. Al lado, la tarjeta de contacto con la dirección actual y el horario.

const LARGO = 1000;
// Un hilo de agua que baja ondulando suavemente.
const agua = (() => {
  let d = '';
  for (let y = 0; y <= LARGO; y += 5) d += `${y ? 'L' : 'M'}${(30 + 9 * Math.sin((y / 260) * Math.PI * 2)).toFixed(1)} ${y}`;
  return d;
})();

const schritte = [
  { titel: 'Beratung', text: 'Wir besprechen Ihre Wünsche und erstellen einen massgeschneiderten Reinigungsplan. Kostenlos.' },
  { titel: 'Reinigung', text: 'Unser geschultes Team reinigt mit höchster Sorgfalt und umweltfreundlichen Mitteln.' },
  { titel: 'Kontrolle', text: 'Wir prüfen jeden Bereich selbst, damit alles unseren hohen Standards entspricht.' },
  { titel: 'Ihre Zufriedenheit', text: 'Wir sind erst zufrieden, wenn Sie es sind. Bei der Umzugsreinigung mit Abgabegarantie.' },
];

const orte = ['Vaduz', 'Schaan', 'Triesen', 'Balzers', 'Triesenberg', 'Eschen', 'Mauren', 'Ruggell'];

const Icono = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" className="size-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

const Zeile = ({ icono, titel, children }: { icono: string; titel: string; children: ReactNode }) => (
  <div className="flex gap-4">
    <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-full bg-frost/8 text-gold ring-1 ring-frost/12">
      <Icono d={icono} />
    </span>
    <div className="min-w-0">
      <p className="text-[11px] font-semibold tracking-[0.25em] text-frost/55 uppercase">{titel}</p>
      <div className="mt-1 text-[15px]">{children}</div>
    </div>
  </div>
);

export default function Kontakt() {
  return (
    <section id="kontakt" aria-labelledby="kontakt-titel" className="relative bg-nacht px-6 py-24 text-frost md:px-16 md:py-40">
      <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-[1.1fr_1fr] md:gap-20">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.32em] text-wasser uppercase" data-reveal>
            So arbeiten wir
          </p>
          <h2 id="kontakt-titel" className="mt-3 text-5xl leading-[0.95] md:text-7xl" data-reveal style={{ '--d': '80ms' } as CSSProperties}>
            In vier Schritten zu <em>makellos</em>
          </h2>

          <div data-wasser-bereich className="relative mt-14 pl-16 md:pl-20">
            <svg viewBox={`0 0 60 ${LARGO}`} preserveAspectRatio="none" className="absolute top-0 left-0 h-full w-10 md:w-12" aria-hidden="true">
              <path d={agua} fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              <path
                data-wasser
                d={agua}
                pathLength={1}
                fill="none"
                stroke="url(#wasser-verlauf)"
                strokeWidth="3"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
              />
              <defs>
                <linearGradient id="wasser-verlauf" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#d4ae6a" />
                  <stop offset="1" stopColor="#8fd0ea" />
                </linearGradient>
              </defs>
            </svg>
            {/* La gota que baja en la punta del hilo. */}
            <span data-wasser-tropfen className="wasser-tropfen" aria-hidden="true">
              <svg viewBox="0 0 24 32">
                <path d="M12 2C12 2 21 14 21 21a9 9 0 0 1-18 0C3 14 12 2 12 2Z" />
              </svg>
            </span>
            <ol className="flex flex-col gap-14 md:gap-20">
              {schritte.map((s, i) => (
                <li key={s.titel} data-schritt className="schritt">
                  <p className="font-serif text-6xl leading-none font-semibold text-wasser md:text-7xl">0{i + 1}</p>
                  <h3 className="mt-2 text-3xl md:text-4xl">{s.titel}</h3>
                  <p className="mt-2 max-w-sm text-base text-frost/70">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <aside className="md:sticky md:top-28 md:self-start" data-reveal>
          <div className="rounded-[2rem] bg-frost/[0.05] p-7 ring-1 ring-frost/12 md:p-9">
            <p className="font-serif text-4xl">
              Kostenlose <em>Offerte</em>
            </p>
            <p className="mt-2 text-sm text-frost/65">Rufen Sie an oder schreiben Sie uns. Wir melden uns innerhalb von 24 Stunden.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
              <OfferteKnopf className="btn btn-gold justify-center">
                <Icono d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M9 15l2 2 4-4" />
                Offerte anfragen
              </OfferteKnopf>
              <a href={firma.telefonLink} className="btn btn-glas justify-center">
                <Icono d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
                Jetzt anrufen
              </a>
              {/* Dos WhatsApp y no uno: cada botón abre el chat de una persona
                  concreta y con el saludo ya escrito. Quien mire la web elige
                  a quién escribe, y no espera a que conteste justo esa. */}
              {whatsapps.map((w) => (
                <a
                  key={w.link}
                  href={w.link}
                  target="_blank"
                  rel="noopener"
                  className="btn btn-glas justify-center"
                  aria-label={`WhatsApp an ${w.name}, ${w.sprache}, ${w.nummer}`}
                >
                  <Icono d="M3 21l1.7-4.6A8.5 8.5 0 1 1 8 19.6L3 21Z M9 9.5c0 3 2.5 5.5 5.5 5.5" />
                  <span className="text-left leading-tight">
                    WhatsApp · {w.name}
                    <span className="block text-[11px] font-normal tracking-wide opacity-65">{w.sprache}</span>
                  </span>
                </a>
              ))}
            </div>

            <div className="mt-8 grid gap-5 border-t border-frost/12 pt-7">
              <Zeile icono="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" titel="Telefon">
                <a href={firma.telefonLink} className="hover:text-gold">
                  {firma.telefon}
                </a>
              </Zeile>
              <Zeile icono="M3 21l1.7-4.6A8.5 8.5 0 1 1 8 19.6L3 21Z M9 9.5c0 3 2.5 5.5 5.5 5.5" titel="WhatsApp">
                <ul className="grid gap-1">
                  {whatsapps.map((w) => (
                    <li key={w.link} className="flex flex-wrap items-baseline gap-x-2">
                      <span className="text-frost/65">
                        {w.name} <span className="text-frost/40">· {w.sprache}</span>
                      </span>
                      <a href={w.link} target="_blank" rel="noopener" className="hover:text-gold">
                        {w.nummer}
                      </a>
                    </li>
                  ))}
                </ul>
              </Zeile>
              <Zeile icono="M3 6h18v12H3V6Z M3 7l9 6 9-6" titel="E-Mail">
                <a href={`mailto:${firma.email}`} className="break-all hover:text-gold">
                  {firma.email}
                </a>
              </Zeile>
              <Zeile icono="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z M12 7a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" titel="Adresse">
                <p>
                  {firma.strasse}, {firma.ort}
                  <br />
                  {firma.land}
                </p>
                <a href={firma.karte} target="_blank" rel="noopener" className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-gold hover:text-frost">
                  Route planen
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M7 17L17 7M9 7h8v8" />
                  </svg>
                </a>
              </Zeile>
              <Zeile icono="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z M12 7v5l3 2" titel="Öffnungszeiten">
                <dl className="grid gap-1">
                  {zeiten.map(([tag, zeit]) => (
                    <div key={tag} className="flex justify-between gap-4">
                      <dt className="text-frost/65">{tag}</dt>
                      <dd>{zeit}</dd>
                    </div>
                  ))}
                </dl>
              </Zeile>
            </div>

            <div className="mt-8 border-t border-frost/12 pt-7">
              <p className="text-[11px] font-semibold tracking-[0.25em] text-frost/55 uppercase">Im ganzen Land, ohne Anfahrtskosten</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {orte.map((o) => (
                  <li key={o} className="rounded-full bg-frost/6 px-3 py-1 text-xs ring-1 ring-frost/12">
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
