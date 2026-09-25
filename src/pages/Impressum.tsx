import { ArrowLeft, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

const Impressum = () => {\n  const { t } = useLanguage();
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border bg-muted/30">
        <div className="container mx-auto max-w-[1200px] px-6 py-16 md:py-24">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("Zurück")} zur Startseite
          </Link>

          <p className="eyebrow mb-4">{t("Rechtliches")}</p>
          <h1 className="font-display text-5xl leading-tight md:text-7xl">
            {t("Impressum")}
          </h1>
        </div>
      </section>

      <section className="container mx-auto max-w-[900px] px-6 py-16 md:py-24">
        <div className="space-y-12">
          <section>
            <h2 className="mb-5 font-display text-3xl md:text-4xl">
              {t("Anbieterin")}
            </h2>
            <div className="space-y-2 text-muted-foreground leading-relaxed">
              <p className="font-medium text-foreground">
                Mambetalieva Ainagul Zaidovna
              </p>
              <p>{t("Einzelunternehmerin")}</p>
              <p>
                Ak-Ordo Wohngebiet, Ak Bolpon Straße
                <br />
                Leninsky District, Bishkek
                <br />
                Kyrgyz Republic
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-5 font-display text-3xl md:text-4xl">
              {t("Registrierung")}
            </h2>
            <dl className="grid gap-4 text-sm sm:grid-cols-[220px_1fr]">
              <dt className="font-medium text-foreground">
                {t("Registrierungsnummer")}
              </dt>
              <dd className="text-muted-foreground">002-2024-169-3446</dd>

              <dt className="font-medium text-foreground">{t("{t("Registrierung")}")}</dt>
              <dd className="text-muted-foreground">22.04.2024</dd>

              <dt className="font-medium text-foreground">TIN</dt>
              <dd className="text-muted-foreground">11704196500548</dd>

              <dt className="font-medium text-foreground">
                {t("Wirtschaftliche Tätigkeit")}
              </dt>
              <dd className="text-muted-foreground">
                79.12.0 – Tour operator activities
              </dd>
            </dl>
          </section>

          <section>
            <h2 className="mb-5 font-display text-3xl md:text-4xl">
              {t("Kontakt")}
            </h2>
            <div className="space-y-4 text-sm">
              <a
                href="mailto:sarinasadirovna@gmail.com"
                className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-primary"
              >
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                sarinasadirovna@gmail.com
              </a>
              <a
                href="tel:+393474867408"
                className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-primary"
              >
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                +39 347 486 7408
              </a>
            </div>
          </section>

          <section className="border-t border-border pt-8">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t("Kereztour ist die Bezeichnung des Reiseangebots und der Website. Betreiberin des registrierten Einzelunternehmens ist Mambetalieva Ainagul Zaidovna.")}
            </p>
          </section>

          <div className="border-t border-border pt-8">
            <Link
              to="/registrierung"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-secondary"
            >
              {t("Registrierungsnachweis ansehen →")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Impressum;
