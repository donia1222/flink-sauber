import PortalWorld from '../components/PortalWorld';
import Leistungen from '../components/Leistungen';
import EchteArbeit from '../components/EchteArbeit';
import Vertrauen from '../components/Vertrauen';
import Kontakt from '../components/Kontakt';
import Fuss from '../components/Fuss';

// Cada parte con su propio efecto: recorrido por aberturas (cristal, puerta, gota) · tarjetas que una rasqueta limpia
// · comparador antes/después con fotos reales · cifras que cuentan y reseñas · línea de agua que enciende los pasos ·
// el nombre que se limpia al final.
export default function Home() {
  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 pt-4 md:px-8 md:pt-6">
        <a href="#start" className="kopf-pille pointer-events-auto" aria-label="DF Flink Sauber, zum Anfang">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/escenas/eigene/logo.webp" alt="" width={198} height={106} className="h-7 w-auto md:h-8" />
          <span className="font-semibold tracking-[0.18em] uppercase">
            Flink <span className="text-gold">Sauber</span>
          </span>
        </a>
        <a href="#kontakt" className="btn btn-gold pointer-events-auto">
          Offerte
          <span className="hidden md:inline">anfragen</span>
        </a>
      </header>
      <main>
        <PortalWorld />
        <Leistungen />
        <EchteArbeit />
        <Vertrauen />
        <Kontakt />
      </main>
      <Fuss />
    </>
  );
}
