import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const BASE = "https://kereztour.com";

type Meta = { title: string; description: string; noindex?: boolean; trip?: { name: string; price?: number; image: string } };

const META: Record<string, Meta> = {
  "/": {
    title: "Kirgistan Reise | Ihr lokaler Veranstalter | Kereztour",
    description: "Erleben Sie eine unvergessliche Kirgistan Reise mit Kereztour. Wir organisieren persönliche Rundreisen & Trekking in kleinen Gruppen mit lokalen Gastgebern.",
  },
  "/reisen/kultur": {
    title: "Kirgistan Rundreise: 10 Tage Kultur & Highlights | Kereztour",
    description: "Unsere 10-tägige Kirgistan Rundreise führt Sie von Bischkek bis zum Issyk-Kul-See. Entdecken Sie Kultur, Nomadenleben und atemberaubende Natur hautnah!",
    trip: { name: "Kultur Tour Kirgisistan – 10 Tage", price: 990, image: "/tour-kultur.jpg" },
  },
  "/reisen/trekking": {
    title: "Kirgistan Trekking & Wanderreise: 11 Tage Tian-Shan | Kereztour",
    description: "Aktiv durch Kirgistan wandern: Erleben Sie ein intensives 11-Tage-Trekking im Tian-Shan-Gebirge. Kleine Gruppen, unberührte Natur & lokale Guides.",
    trip: { name: "Intensiv-Trekking Kirgisistan – 11 Tage", price: 1490, image: "/tour-trekking.jpg" },
  },
  "/buchen": {
    title: "Kirgisistan Reise buchen | Kereztour",
    description: "Kirgisistan Reise buchen: Tour, Termin und Tarif auswählen und deine Reise nach Kirgisistan unverbindlich bei Kereztour anfragen.",
  },
  "/registrierung": {
    title: "Registrierung & Zertifikat | Kereztour",
    description: "Offizielle Registrierung und Zertifikat von Kereztour als Reiseveranstalter für Kirgisistan.",
  },
  "/impressum": {
    title: "Impressum | Kereztour",
    description: "Impressum und rechtliche Angaben von Kereztour – Reisen nach Kirgisistan.",
  },
  "/datenschutz": {
    title: "Datenschutz | Kereztour",
    description: "Datenschutzerklärung von Kereztour: Informationen zum Umgang mit personenbezogenen Daten.",
    noindex: true,
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

  const breadcrumbItems = [
    { "@type": "ListItem", position: 1, name: "Startseite", item: BASE },
    ...(path !== "/" ? [{ "@type": "ListItem", position: 2, name: m.title.split(" | ")[0], item: url }] : []),
  ];

  const breadcrumbLd = !m.noindex && {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
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
      {breadcrumbLd && <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>}
    </Helmet>
  );
};

export default RouteSeo;
