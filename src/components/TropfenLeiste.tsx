import type { CSSProperties } from 'react';
import type { Escena } from '../data/escenas';

export const TROPFEN = 'M12 2C12 2 21 14 21 21a9 9 0 0 1-18 0C3 14 12 2 12 2Z';

// Indicador de progreso: una gota por escena. Se llenan de agua una a una con el scroll (la variable --f la pone portal.ts).
export default function TropfenLeiste({ escenas }: { escenas: Escena[] }) {
  return (
    <div className="pointer-events-none absolute right-5 bottom-6 flex items-end gap-4 md:right-8 md:bottom-8">
      <p data-tropfen-label className="hidden pb-1 text-xs font-medium tracking-[0.2em] text-frost/75 uppercase md:block">
        {escenas[0].lugar}
      </p>
      <div className="flex items-end gap-1.5">
        {escenas.map((e, i) => (
          <svg key={e.id} viewBox="0 0 24 32" className="h-6 w-[18px] md:h-7 md:w-5" aria-hidden="true">
            <defs>
              <clipPath id={`tropfen-${i}`}>
                <path d={TROPFEN} />
              </clipPath>
            </defs>
            <path d={TROPFEN} fill="rgb(243 247 250 / 0.1)" stroke="rgb(243 247 250 / 0.55)" strokeWidth="1.2" />
            <g clipPath={`url(#tropfen-${i})`}>
              <rect data-tropfen x="0" y="0" width="24" height="32" className="tropfen-wasser" style={{ '--f': i === 0 ? 1 : 0 } as CSSProperties} />
              <path d="M8 19a5 5 0 0 0 2 5" stroke="#fff" strokeOpacity="0.7" strokeWidth="1.6" strokeLinecap="round" fill="none" />
            </g>
          </svg>
        ))}
      </div>
    </div>
  );
}
