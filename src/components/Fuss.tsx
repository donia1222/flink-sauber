import { firma } from '../data/firma';

// Pie: una última llamada a pedir oferta y el nombre en grande. Primero está empañado, como un cristal sucio; al bajar,
// una rasqueta lo recorre de izquierda a derecha y deja las letras limpias en oro. Limpio, un brillo lo cruza de vez
// en cuando.
const NAME = 'FLINK SAUBER';

export default function Fuss() {
  return (
    <footer data-fuss className="relative overflow-hidden bg-nacht px-6 pt-16 pb-8 text-frost md:px-16 md:pt-24">
      {/* El valle del Rin (foto real), muy oscurecido y con un poco de paralaje. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[115%] overflow-hidden" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img data-rheintal src="/escenas/eigene/rheintal.webp" alt="" loading="lazy" className="size-full object-cover object-top opacity-45" />
        <div className="absolute inset-0 bg-linear-to-b from-nacht via-nacht/55 to-nacht" />
      </div>
      <div className="relative mx-auto max-w-6xl">
        <div className="flex flex-col items-start gap-6 pt-24 md:flex-row md:items-end md:justify-between md:pt-40" data-reveal>
          <h2 className="text-5xl leading-[0.95] md:text-7xl">
            Bereit für <em>makellos?</em>
          </h2>
          <div className="flex flex-wrap gap-3">
            <a href="#kontakt" className="btn btn-gold">
              Offerte anfragen
            </a>
            <a href={firma.telefonLink} className="btn btn-glas">
              {firma.telefon}
            </a>
          </div>
        </div>

        <svg data-wortmarke viewBox="0 0 1000 170" className="mt-14 block w-full md:mt-20" role="img" aria-label={NAME}>
          <defs>
            <linearGradient id="gold-verlauf" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f3dfae" />
              <stop offset="0.5" stopColor="#d4ae6a" />
              <stop offset="1" stopColor="#a87f3c" />
            </linearGradient>
            <linearGradient id="name-glanz" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="0.75" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <filter id="beschlagen" x="-5%" y="-20%" width="110%" height="140%">
              <feGaussianBlur stdDeviation="5" />
            </filter>
            <clipPath id="name-sauber">
              <rect data-wisch-flaeche x="0" y="0" width="0" height="170" />
            </clipPath>
            <clipPath id="name-form">
              <text x="500" y="140" textAnchor="middle" textLength="920" lengthAdjust="spacingAndGlyphs" className="wortmarke-text">
                {NAME}
              </text>
            </clipPath>
          </defs>
          {/* Empañado: las letras borrosas y apagadas, como detrás de un cristal sucio. */}
          <text x="500" y="140" textAnchor="middle" textLength="920" lengthAdjust="spacingAndGlyphs" className="wortmarke-text" fill="rgb(243 247 250 / 0.16)" filter="url(#beschlagen)">
            {NAME}
          </text>
          {/* Limpio: en oro, solo hasta donde ha pasado la rasqueta. */}
          <g clipPath="url(#name-sauber)">
            <text x="500" y="140" textAnchor="middle" textLength="920" lengthAdjust="spacingAndGlyphs" className="wortmarke-text" fill="url(#gold-verlauf)">
              {NAME}
            </text>
          </g>
          <g clipPath="url(#name-form)">
            <rect className="name-glanz" x="-300" y="0" width="200" height="170" fill="url(#name-glanz)" transform="skewX(-20)" />
          </g>
          {/* La rasqueta: una barra con goma dorada en el borde de lo limpio. */}
          <g data-wisch-abzieher className="wisch-abzieher" style={{ opacity: 0 }}>
            <rect x="-3" y="4" width="6" height="162" rx="3" fill="#f3f7fa" />
            <rect x="-1" y="4" width="2" height="162" fill="#d4ae6a" />
          </g>
        </svg>

        <div className="mt-10 flex flex-col gap-4 border-t border-frost/12 pt-6 text-sm text-frost/60 md:flex-row md:items-center md:justify-between">
          <p>
            {firma.name} · {firma.strasse}, {firma.ort} · {firma.land}
          </p>
          <nav className="flex gap-6" aria-label="Fusszeile">
            <a href="#leistungen" className="hover:text-frost">
              Leistungen
            </a>
            <a href="#kontakt" className="hover:text-frost">
              Kontakt
            </a>
            <a href="#start" className="hover:text-frost">
              Nach oben
            </a>
          </nav>
          <p>© 2026 flink-sauber.li · Website von Lweb</p>
        </div>
      </div>
    </footer>
  );
}
