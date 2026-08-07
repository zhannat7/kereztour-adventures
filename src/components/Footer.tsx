import { Mail, Phone, MessageCircle, Facebook, Instagram, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const tourLinks = [
  { label: "Kultur Tour", to: "/reisen/kultur" },
  { label: "Intensiv-Trekking", to: "/reisen/trekking" },
  { label: "Nomadenspiele 2026", to: "/reisen/nomaden" },
];

const siteLinks = [
  { label: "Über uns", to: "/#ueber-uns" },
  { label: "Preise", to: "/#preise" },
  { label: "Häufige Fragen", to: "/#faq" },
  { label: "Anfrage senden", to: "/buchen" },
];

const Footer = () => (
  <footer id="kontakt" className="bg-primary text-primary-foreground">
    <div className="container mx-auto px-6 py-16 md:py-20">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
        <div className="md:col-span-4">
          <h2 className="font-display text-3xl mb-4">Kereztour</h2>
          <p className="text-primary-foreground/60 text-sm leading-relaxed max-w-sm">
            Persönlich geführte Reisen durch Kirgisistan – geplant von einer Einheimischen,
            gedacht für Menschen, die mehr sehen wollen als Sehenswürdigkeiten.
          </p>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary-foreground/40 mb-5">Reisen</h3>
          <ul className="space-y-3 text-sm">
            {tourLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-primary-foreground/80 hover:text-secondary transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary-foreground/40 mb-5">Service</h3>
          <ul className="space-y-3 text-sm">
            {siteLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-primary-foreground/80 hover:text-secondary transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary-foreground/40 mb-5">Kontakt</h3>
          <ul className="space-y-3.5 text-sm">
            <li>
              <a href="mailto:sarinasadirovna@gmail.com" className="flex items-center gap-3 text-primary-foreground/80 hover:text-secondary transition-colors">
                <Mail className="h-4 w-4 shrink-0" /> sarinasadirovna@gmail.com
              </a>
            </li>
            <li>
              <a href="tel:+393474867408" className="flex items-center gap-3 text-primary-foreground/80 hover:text-secondary transition-colors">
                <Phone className="h-4 w-4 shrink-0" /> +39 347 486 7408
              </a>
            </li>
            <li>
              <a href={whatsappUrl("Hallo Kereztour, ich habe eine Frage zu euren Reisen.")} onClick={(e) => openWhatsApp(e, "Hallo Kereztour, ich habe eine Frage zu euren Reisen.")} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-primary-foreground/80 hover:text-secondary transition-colors">
                <MessageCircle className="h-4 w-4 shrink-0" /> WhatsApp
                <ArrowUpRight className="h-3 w-3 opacity-50" />
              </a>
            </li>
          </ul>

          <div className="mt-6 flex items-center gap-3">
            <a
              href="https://www.facebook.com/profile.php?id=61580882909583"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-foreground/20 text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-secondary transition-colors"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href="https://www.instagram.com/sarinamam88/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-foreground/20 text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-secondary transition-colors"
            >
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-14 pt-8 border-t border-primary-foreground/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-primary-foreground/40">
        <p>© 2025–2026 KérezTour Adventures</p>
        <p>Kleine Gruppen · Lokale Partner · Faire Preise</p>
      </div>
    </div>
  </footer>
);

export default Footer;
