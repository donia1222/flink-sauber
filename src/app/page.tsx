import PortalWorld from '../components/PortalWorld';
import Leistungen from '../components/Leistungen';
import EchteArbeit from '../components/EchteArbeit';
import Galerie from '../components/Galerie';
import Offerte, { OfferteKnopf } from '../components/Offerte';
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
        <OfferteKnopf className="btn btn-gold pointer-events-auto">
          Offerte
          <span className="hidden md:inline">anfragen</span>
        </OfferteKnopf>
      </header>
      <main>
        <PortalWorld />
        <Leistungen />
        <EchteArbeit />
        {/* Las fotos que Doris sube desde su panel. Van detras de «Vorher.
            Nachher.» porque son lo mismo —trabajo de verdad— pero con mas
            sitio y sin comparador. */}
        <Galerie />
        <Vertrauen />
        <Kontakt />
      </main>
      <Fuss />
      {/* La ventana de la oferta, UNA sola para toda la página: cualquiera de
          los botones la abre con un evento. */}
      <Offerte />
    </>
  );
}
