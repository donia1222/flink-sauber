'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { dienste, groessen, OFFERTE_ENDPUNKT } from '../data/offerte';

/**
 * La solicitud de oferta: un formulario en una ventana, abierto desde
 * cualquiera de los botones «Offerte» de la página.
 *
 * Por qué una ventana y no una página aparte: quien pulsa está mirando algo
 * —un servicio, una foto, el precio— y mandarlo a otra dirección le hace
 * perder el sitio. Aquí rellena, envía y vuelve exactamente a donde estaba.
 *
 * Tres pasos y no uno largo: la primera pregunta es la fácil («¿qué
 * necesita?», a golpe de dedo) y los datos personales van al final, cuando
 * ya ha invertido algo. Un formulario que empieza pidiendo el correo se
 * abandona mucho más.
 *
 * Quien lo abre no importa: cualquier botón dispara `offerte:open` en
 * `window` y esto lo escucha. Así los botones siguen siendo lo que eran y no
 * hay que pasar estado por media página.
 */

type Paso = 1 | 2 | 3;
type Estado = 'editando' | 'enviando' | 'hecho' | 'fallo';

export default function Offerte() {
  const [abierto, setAbierto] = useState(false);
  const [paso, setPaso] = useState<Paso>(1);
  const [estado, setEstado] = useState<Estado>('editando');
  const [fallo, setFallo] = useState('');

  const [elegidos, setElegidos] = useState<string[]>([]);
  const [anderes, setAnderes] = useState('');
  const [datum, setDatum] = useState('');
  const [zeit, setZeit] = useState('');
  const [flexibel, setFlexibel] = useState(false);
  const [groesse, setGroesse] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [telefon, setTelefon] = useState('');
  const [adresse, setAdresse] = useState('');
  const [nachricht, setNachricht] = useState('');
  // El campo trampa: una persona no lo ve, un robot lo rellena.
  const [fuellung, setFuellung] = useState('');

  const caja = useRef<HTMLDivElement>(null);

  const cerrar = useCallback(() => {
    setAbierto(false);
    // Un respiro antes de volver al principio: si se borrara al instante, se
    // vería el formulario vaciarse mientras la ventana se cierra.
    setTimeout(() => {
      if (estado === 'hecho') {
        setPaso(1);
        setElegidos([]); setAnderes(''); setDatum(''); setZeit(''); setFlexibel(false);
        setGroesse(''); setName(''); setEmail(''); setTelefon(''); setAdresse(''); setNachricht('');
        setEstado('editando');
      }
    }, 300);
  }, [estado]);

  useEffect(() => {
    const abrir = () => { setAbierto(true); setFallo(''); };
    window.addEventListener('offerte:open', abrir);
    return () => window.removeEventListener('offerte:open', abrir);
  }, []);

  // Con la ventana abierta, la página de detrás no se mueve y Escape cierra.
  useEffect(() => {
    if (!abierto) return;
    const antes = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const tecla = (e: KeyboardEvent) => { if (e.key === 'Escape') cerrar(); };
    window.addEventListener('keydown', tecla);
    caja.current?.focus();
    return () => {
      document.body.style.overflow = antes;
      window.removeEventListener('keydown', tecla);
    };
  }, [abierto, cerrar]);

  const alternar = (id: string) =>
    setElegidos((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]));

  const hayServicio = elegidos.length > 0 || anderes.trim() !== '';
  const hayContacto = name.trim() !== '' && (email.trim() !== '' || telefon.trim() !== '');

  async function enviar() {
    if (!hayServicio || !hayContacto) return;
    setEstado('enviando');
    setFallo('');
    try {
      const r = await fetch(OFFERTE_ENDPUNKT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leistungen: elegidos, anderes, datum, zeit, flexibel,
          name, email, telefon, adresse, groesse, nachricht, fuellung,
        }),
      });
      const d = await r.json().catch(() => null);
      if (!r.ok || !d || d.ok !== true) throw new Error((d && d.error) || 'fehler');
      setEstado('hecho');
    } catch (e) {
      setEstado('fallo');
      const porque: Record<string, string> = {
        zu_viele_versuche: 'Zu viele Anfragen in kurzer Zeit. Bitte in ein paar Minuten nochmals versuchen.',
        email_ungueltig: 'Diese E-Mail-Adresse stimmt nicht.',
        kontakt_fehlt: 'Bitte E-Mail oder Telefon angeben.',
        name_fehlt: 'Bitte Ihren Namen angeben.',
      };
      setFallo(porque[(e as Error).message] || 'Das hat leider nicht geklappt. Rufen Sie uns an oder schreiben Sie per WhatsApp.');
    }
  }

  if (!abierto) return null;

  const campo = 'w-full rounded-xl border border-frost/15 bg-frost/5 px-4 py-3 text-[15px] text-frost outline-none placeholder:text-frost/35 focus:border-gold/70';

  return (
    <div
      className="fixed inset-0 z-[120] flex items-end justify-center bg-nacht/80 p-0 backdrop-blur-sm md:items-center md:p-6"
      onClick={cerrar}
      role="dialog"
      aria-modal="true"
      aria-label="Kostenlose Offerte anfragen"
    >
      <div
        ref={caja}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="offerte-karte max-h-[92svh] w-full max-w-xl overflow-y-auto rounded-t-[1.75rem] bg-tinte p-6 text-frost shadow-[0_-20px_60px_-20px_rgb(0_0_0/0.7)] outline-none md:rounded-[1.75rem] md:p-8"
      >
        {/* ─── Hecho ─────────────────────────────────────────────── */}
        {estado === 'hecho' ? (
          <div className="py-6 text-center">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-gold/15 text-gold ring-1 ring-gold/30">
              <svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </span>
            <h2 className="mt-5 font-serif text-3xl">Danke, {name.split(' ')[0]}!</h2>
            <p className="mx-auto mt-3 max-w-sm text-frost/70">
              Ihre Anfrage ist bei uns. Wir melden uns innerhalb von 24 Stunden mit einer
              kostenlosen Offerte — meistens schneller.
            </p>
            <button type="button" onClick={cerrar} className="btn btn-gold mt-7">
              Schliessen
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.3em] text-wasser uppercase">
                  Schritt {paso} von 3
                </p>
                <h2 className="mt-2 font-serif text-3xl leading-tight md:text-4xl">
                  {paso === 1 && <>Was dürfen wir <em>reinigen</em>?</>}
                  {paso === 2 && <>Wann passt es <em>Ihnen</em>?</>}
                  {paso === 3 && <>Wohin dürfen wir <em>antworten</em>?</>}
                </h2>
              </div>
              <button
                type="button"
                onClick={cerrar}
                aria-label="Schliessen"
                className="grid size-10 shrink-0 place-items-center rounded-full bg-frost/10 text-frost hover:bg-frost/20"
              >
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            {/* Tres rayas que se van llenando: se ve cuánto queda. */}
            <div className="mt-5 flex gap-1.5" aria-hidden="true">
              {[1, 2, 3].map((n) => (
                <span key={n} className={`h-1 flex-1 rounded-full ${n <= paso ? 'bg-gold' : 'bg-frost/15'}`} />
              ))}
            </div>

            {/* ─── Paso 1 · los servicios ──────────────────────────── */}
            {paso === 1 && (
              <div className="mt-7">
                <p className="text-sm text-frost/65">Mehrfachauswahl — alles, was Sie brauchen.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {dienste.map((d) => {
                    const puesto = elegidos.includes(d.id);
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => alternar(d.id)}
                        aria-pressed={puesto}
                        className={
                          'rounded-full px-4 py-2.5 text-[14px] font-medium transition ' +
                          (puesto
                            ? 'bg-gold text-nacht'
                            : 'bg-frost/8 text-frost/80 ring-1 ring-frost/12 hover:bg-frost/15')
                        }
                      >
                        {puesto && <span className="mr-1.5">✓</span>}
                        {d.name}
                      </button>
                    );
                  })}
                </div>

                <label className="mt-6 block text-sm text-frost/65" htmlFor="o-anderes">
                  Etwas anderes? Schreiben Sie es hier.
                </label>
                <input
                  id="o-anderes"
                  value={anderes}
                  onChange={(e) => setAnderes(e.target.value)}
                  placeholder="z.B. Gartenpflege, Spezialfall …"
                  className={`mt-2 ${campo}`}
                />
              </div>
            )}

            {/* ─── Paso 2 · cuándo ─────────────────────────────────── */}
            {paso === 2 && (
              <div className="mt-7 grid gap-5">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-frost/5 p-4 ring-1 ring-frost/12">
                  <input
                    type="checkbox"
                    checked={flexibel}
                    onChange={(e) => setFlexibel(e.target.checked)}
                    className="size-5 accent-[#d4ae6a]"
                  />
                  <span>
                    <span className="block font-medium">Ich bin flexibel</span>
                    <span className="block text-sm text-frost/60">Wir schlagen Ihnen einen Termin vor.</span>
                  </span>
                </label>

                {!flexibel && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm text-frost/65" htmlFor="o-datum">Wunschdatum</label>
                      <input
                        id="o-datum"
                        type="date"
                        value={datum}
                        min={new Date().toISOString().slice(0, 10)}
                        onChange={(e) => setDatum(e.target.value)}
                        className={`mt-2 ${campo}`}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-frost/65" htmlFor="o-zeit">Ab welcher Zeit</label>
                      <input
                        id="o-zeit"
                        type="time"
                        value={zeit}
                        onChange={(e) => setZeit(e.target.value)}
                        className={`mt-2 ${campo}`}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-sm text-frost/65">Wie gross ist das Objekt?</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {groessen.map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGroesse(groesse === g ? '' : g)}
                        aria-pressed={groesse === g}
                        className={
                          'rounded-full px-4 py-2 text-[14px] transition ' +
                          (groesse === g
                            ? 'bg-gold text-nacht'
                            : 'bg-frost/8 text-frost/80 ring-1 ring-frost/12 hover:bg-frost/15')
                        }
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ─── Paso 3 · quién ──────────────────────────────────── */}
            {paso === 3 && (
              <div className="mt-7 grid gap-4">
                <div>
                  <label className="text-sm text-frost/65" htmlFor="o-name">Name *</label>
                  <input id="o-name" value={name} onChange={(e) => setName(e.target.value)} className={`mt-2 ${campo}`} autoComplete="name" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm text-frost/65" htmlFor="o-email">E-Mail</label>
                    <input id="o-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`mt-2 ${campo}`} autoComplete="email" />
                  </div>
                  <div>
                    <label className="text-sm text-frost/65" htmlFor="o-telefon">Telefon</label>
                    <input id="o-telefon" type="tel" value={telefon} onChange={(e) => setTelefon(e.target.value)} className={`mt-2 ${campo}`} autoComplete="tel" />
                  </div>
                </div>
                <p className="-mt-1 text-xs text-frost/50">Eines von beiden genügt — wie es Ihnen lieber ist.</p>
                <div>
                  <label className="text-sm text-frost/65" htmlFor="o-adresse">Adresse des Objekts</label>
                  <input id="o-adresse" value={adresse} onChange={(e) => setAdresse(e.target.value)} placeholder="Strasse, PLZ Ort" className={`mt-2 ${campo}`} autoComplete="street-address" />
                </div>
                <div>
                  <label className="text-sm text-frost/65" htmlFor="o-nachricht">Noch etwas, das wir wissen sollten?</label>
                  <textarea id="o-nachricht" value={nachricht} onChange={(e) => setNachricht(e.target.value)} rows={3} className={`mt-2 ${campo} resize-none`} />
                </div>

                {/* El campo trampa. Fuera de la vista y fuera del tabulador:
                    quien lo rellena no es una persona. */}
                <input
                  type="text"
                  value={fuellung}
                  onChange={(e) => setFuellung(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-[9999px] size-0 opacity-0"
                />

                {estado === 'fallo' && (
                  <p className="rounded-xl bg-[#b42318]/15 px-4 py-3 text-sm text-[#ffb4a8]">{fallo}</p>
                )}
              </div>
            )}

            {/* ─── Los botones ─────────────────────────────────────── */}
            <div className="mt-8 flex items-center gap-3">
              {paso > 1 && (
                <button type="button" onClick={() => setPaso((p) => (p - 1) as Paso)} className="btn btn-glas">
                  Zurück
                </button>
              )}
              {paso < 3 ? (
                <button
                  type="button"
                  onClick={() => setPaso((p) => (p + 1) as Paso)}
                  disabled={paso === 1 && !hayServicio}
                  className="btn btn-gold ml-auto disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Weiter
                </button>
              ) : (
                <button
                  type="button"
                  onClick={enviar}
                  disabled={!hayContacto || estado === 'enviando'}
                  className="btn btn-gold ml-auto disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {estado === 'enviando' ? 'Wird gesendet …' : 'Offerte anfragen'}
                </button>
              )}
            </div>

            {paso === 1 && !hayServicio && (
              <p className="mt-3 text-right text-xs text-frost/45">Bitte mindestens eine Leistung wählen.</p>
            )}
            {paso === 3 && !hayContacto && (
              <p className="mt-3 text-right text-xs text-frost/45">Name und E-Mail oder Telefon fehlen noch.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/** El botón que la abre. Se usa donde antes había un enlace a #kontakt. */
export function OfferteKnopf({
  children,
  className = 'btn btn-gold',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new CustomEvent('offerte:open'))}>
      {children}
    </button>
  );
}
