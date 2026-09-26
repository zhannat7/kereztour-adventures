import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const BASE = "https://kereztour.com";

type Meta = { title: string; description: string; noindex?: boolean; trip?: { name: string; price?: number; image: string } };

const META: Record<string, Meta> = {
  "/": {
    title: "Kirgisistan Reise & Kyrgyzstan Reisen | Kereztour",
    description: "Kirgisistan Reise, Kirgistan Reise und Kyrgyzstan Reisen: Rundreisen, Kultur, Trekking und Nomadenreisen in kleinen Gruppen mit lokalen Gastgebern.",
  },
  "/reisen/kultur": {
    title: "Kirgisistan Rundreise – Kultur Tour 10 Tage | Kereztour",
    description: "Kirgisistan Rundreise mit Bischkek, Burana-Turm, Issyk-Kul, Karakol, Jurtencamps und Adlerjägern – 10 Tage ab 990 € in kleiner Gruppe.",
    trip: { name: "Kultur Tour Kirgisistan – 10 Tage", price: 990, image: "/tour-kultur.jpg" },
  },
  "/reisen/trekking": {
    title: "Kirgisistan Trekking – 10 Tage im Tian-Shan | Kereztour",
    description: "Kirgisistan Trekking zu Hochgebirgsseen, Gletschern und Jurtencamps im Tian-Shan – 10 Tage mit lokalen Guides für 1.200 € pro Person.",
    trip: { name: "Intensiv-Trekking Kirgisistan – 10 Tage", price: 1200, image: "/tour-trekking.jpg" },
  },
  "/reisen/kyrchyn": {
    title: "Kirgisistan Reise – Kyrchyn Tour & Nomadenkultur | Kereztour",
    description: "Kirgisistan Reise zur Kyrchyn Jailoo: Jurtenleben, Nomadenkultur und traditionelle Pferdespiele hautnah erleben – 1.300 € pro Person.",
    trip: { name: "Kyrchyn Tour Kirgisistan", price: 1300, image: "/tour-kyrchyn.jpg" },
  },
  "/reisen/nomaden": {
    title: "Kirgisistan Reise – Welt der Nomaden 2026 | Kereztour",
    description: "Reise nach Kirgisistan zur Welt der Nomaden 2026: traditionelle Nomadenkultur, Pferdespiele und Jurtenleben mit Kereztour.",
    trip: { name: "Welt der Nomaden 2026", image: "/tour-nomaden.jpg" },
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
