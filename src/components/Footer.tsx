import { Mail, Phone, MessageCircle, Facebook, Instagram, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { openWhatsApp, whatsappUrl } from "@/lib/whatsapp";
import { useLanguage } from "@/i18n/LanguageContext";

const tourLinks = [
  { label: "Kultur Tour", to: "/reisen/kultur" },
  { label: "Intensiv-Trekking", to: "/reisen/trekking" },
  { label: "Kyrchyn Tour", to: "/reisen/kyrchyn" },
];

const serviceLinks = [
  { label: "Über uns", to: "/#ueber-uns" },
  { label: "Preise", to: "/#preise" },
  { label: "Häufige Fragen", to: "/#faq" },
  { label: "Anfrage senden", to: "/buchen" },
];

const legalLinks = [
  { label: "Impressum", to: "/impressum" },
  { label: "Datenschutz", to: "/datenschutz" },
  { label: "Registrierungsnachweis", to: "/registrierung" },
];

const Footer = () => {
  const { t, language } = useLanguage();

  const legalLabel = (label: string) => {
    if (label !== "Datenschutz") return t(label);
    return language === "EN"
      ? "Privacy Policy"
      : language === "IT"
        ? "Informativa sulla privacy"
        : "Datenschutz";
  };

  return (
  <footer id="kontakt" className="bg-primary text-primary-foreground">
    <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 py-14 md:py-16">
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <h2 className="mb-5 font-display text-5xl font-normal">Kereztour</h2>
          <p className="max-w-sm text-sm leading-relaxed text-primary-foreground/60">
            {t("Persönlich geführte Reisen durch Kirgisistan – geplant von einer Einheimischen, gedacht für Menschen, die mehr sehen wollen als Sehenswürdigkeiten.")}
          </p>
        </div>

        <div className="lg:col-span-2">
          <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary-foreground/40">{t("Reisen")}</h3>
          <ul className="space-y-3 text-sm">
            {tourLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-primary-foreground/80 transition-colors hover:text-secondary">
                  {t(l.label)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary-foreground/40">{t("Service")}</h3>
          <ul className="space-y-3 text-sm">
            {serviceLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-primary-foreground/80 transition-colors hover:text-secondary">
                  {t(l.label)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary-foreground/40">{t("Rechtliches")}</h3>
          <ul className="space-y-3 text-sm">
            {legalLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-primary-foreground/80 transition-colors hover:text-secondary">
                  {legalLabel(l.label)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary-foreground/40">{t("Kontakt")}</h3>
          <ul className="space-y-3.5 text-sm">
            <li>
              <a href="mailto:sarinasadirovna@gmail.com" className="flex items-center gap-3 text-primary-foreground/80 transition-colors hover:text-secondary">
                <Mail className="h-4 w-4 shrink-0" /> sarinasadirovna@gmail.com
              </a>
            </li>
            <li>
              <a href="tel:+393474867408" className="flex items-center gap-3 text-primary-foreground/80 transition-colors hover:text-secondary">
                <Phone className="h-4 w-4 shrink-0" /> +39 347 486 7408
              </a>
            </li>
            <li>
              <a href={whatsappUrl(t("Hallo Kereztour, ich habe eine Frage zu euren Reisen."))} onClick={(e) => openWhatsApp(e, t("Hallo Kereztour, ich habe eine Frage zu euren Reisen."))} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-primary-foreground/80 transition-colors hover:text-secondary">
                <MessageCircle className="h-4 w-4 shrink-0" /> WhatsApp
                <ArrowUpRight className="h-3 w-3 opacity-50" />
              </a>
            </li>
          </ul>

          <div className="mt-6 flex items-center gap-3">
            <a href="https://www.facebook.com/profile.php?id=61580882909583" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex h-10 w-10 items-center justify-center rounded-sm border border-primary-foreground/20 text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10 hover:text-secondary">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="https://www.instagram.com/kereztour/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-sm border border-primary-foreground/20 text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10 hover:text-secondary">
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-primary-foreground/10 pt-8 text-xs text-primary-foreground/40 sm:flex-row">
        <p>© 2026 Kereztour. {t("Alle Rechte vorbehalten.")}</p>
        <p>{t("Kleine Gruppen · Lokale Partner · Faire Preise")}</p>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
