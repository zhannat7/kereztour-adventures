import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const BASE = "https://kereztour.com";

type Meta = { title: string; description: string; noindex?: boolean; trip?: { name: string; price?: number; image: string } };

const META: Record<string, Meta> = {
  "/": {
    title: "Kereztour – Reisen nach Kirgisistan | Kyrgyzstan",
    description: "Persönliche Reisen nach Kirgisistan (Kyrgyzstan): Kultur Tour, Intensiv-Trekking und Kyrchyn Tour in kleinen Gruppen mit lokalen Gastgebern.",
  },
  "/reisen/kultur": {
    title: "Kultur Tour Kirgisistan – 10 Tage Rundreise | Kereztour",
    description: "10 Tage Kultur Tour durch Kirgisistan: Bischkek, Burana-Turm, Issyk-Kul, Karakol, Jurtencamps und Adlerjäger – ab 990 € in kleinen Gruppen.",
    trip: { name: "Kultur Tour Kirgisistan – 10 Tage", price: 990, image: "/tour-kultur.jpg" },
  },
  "/reisen/trekking": {
    title: "Intensiv-Trekking Kirgisistan – 10 Tage Bergseen | Kereztour",
    description: "10 Tage Intensiv-Trekking in Kirgisistan zu Hochgebirgsseen, Gletschern und Jurtencamps im Tian-Shan – 1.200 € pro Person mit lokalen Guides.",
    trip: { name: "Intensiv-Trekking Kirgisistan – 10 Tage", price: 1200, image: "/tour-trekking.jpg" },
  },
  "/reisen/kyrchyn": {
    title: "Kyrchyn Tour – Weltnomadenspiele Kirgisistan | Kereztour",
    description: "Kyrchyn Tour zu den Weltnomadenspielen in Kirgisistan: Reiterspiele, Jurtenleben und Nomadenkultur hautnah – 1.300 € pro Person.",
    trip: { name: "Kyrchyn Tour Kirgisistan", price: 1300, image: "/tour-kyrchyn.jpg" },
  },
  "/reisen/nomaden": {
    title: "Welt der Nomaden 2026 – Reise nach Kirgisistan | Kereztour",
    description: "Welt der Nomaden 2026: Erlebe traditionelle Nomadenkultur, Pferdespiele und Jurtenleben in Kirgisistan mit Kereztour.",
    trip: { name: "Welt der Nomaden 2026", image: "/tour-nomaden.jpg" },
  },
  "/buchen": {
    title: "Reise nach Kirgisistan buchen | Kereztour",
    description: "Buche deine Kirgisistan-Reise mit Kereztour: Tour, Termin und Tarif wählen, Preis sofort sehen und unverbindlich anfragen.",
  },
  "/registrierung": {
    title: "Registrierung & Zertifikat | Kereztour",
    description: "Offizielle Registrierung und Zertifikat von Kereztour als Reiseveranstalter für Kirgisistan.",
  },
  "/impressum": {
    title: "Impressum | Kereztour",
    description: "Impressum und rechtliche Angaben von Kereztour – Reisen nach Kirgisistan.",
  },
  "/zahlung": { title: "Zahlung | Kereztour", description: "Zahlungsinformationen zu deiner Kereztour-Buchung.", noindex: true },
  "/admin": { title: "Admin | Kereztour", description: "Admin-Bereich.", noindex: true },
};

const FALLBACK: Meta = { title: "Seite nicht gefunden | Kereztour", description: "Diese Seite existiert nicht.", noindex: true };

const RouteSeo = () => {
  const { pathname } = useLocation();
  const path = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  const m = META[path] ?? FALLBACK;
  const url = `${BASE}${path}`;
  const image = `${BASE}${m.trip?.image ?? "/og-image.jpg"}`;

  const tripLd = m.trip && {
    "@context": "https://schema.org",
    "@type": "Trip",
    name: m.trip.name,
    description: m.description,
    url,
    image,
    provider: { "@type": "Organization", name: "Kereztour", url: BASE },
    ...(m.trip.price && {
      offers: { "@type": "Offer", price: m.trip.price, priceCurrency: "EUR", url: `${BASE}/buchen` },
    }),
  };

  return (
    <Helmet>
      <title>{m.title}</title>
      <meta name="description" content={m.description} />
      {m.noindex && <meta name="robots" content="noindex, follow" />}
      {!m.noindex && <link rel="canonical" href={url} />}
      <meta property="og:title" content={m.title} />
      <meta property="og:description" content={m.description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta name="twitter:title" content={m.title} />
      <meta name="twitter:description" content={m.description} />
      <meta name="twitter:image" content={image} />
      {tripLd && <script type="application/ld+json">{JSON.stringify(tripLd)}</script>}
    </Helmet>
  );
};

export default RouteSeo;
