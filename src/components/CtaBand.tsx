import { lazy, Suspense, useState } from "react";
import { ArrowRight, MessageCircle, Mail } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { openWhatsApp, whatsappUrl } from "@/lib/whatsapp";
import { useLanguage } from "@/i18n/LanguageContext";

const ContactDialog = lazy(() => import("@/components/ContactDialog"));
const OWNER_EMAIL = "kereztour@hotmail.com";

const CtaBand = () => {
  const ref = useScrollReveal();
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { t } = useLanguage();
  const openDialog = () => {
    setLoaded(true);
    setOpen(true);
  };

  return (
    <section className="bg-background py-14 md:py-20">
      <div ref={ref} className="section-reveal container mx-auto px-6 max-w-[1600px]">
        <div className="relative overflow-hidden border-y border-gold/35 bg-gradient-primary px-5 py-10 sm:px-8 sm:py-14 md:px-16 md:py-20 shadow-lift">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <h2 className="mb-5 font-display text-4xl leading-tight text-primary-foreground md:text-6xl">
                {t("Erzähl mir, wovon du träumst")}
                <span className="block italic">{t("ich plane den Rest.")}</span>
              </h2>
              <p className="text-primary-foreground/70 text-base md:text-lg leading-relaxed max-w-xl">
                {t("Die Anfrage ist kostenlos und unverbindlich. Ich antworte innerhalb von 24 Stunden – auch bei Fragen zu Reiseterminen, Flügen oder Gruppengrößen.")}
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-3">
              <button
                type="button"
                onClick={openDialog}
                className="btn-accent w-full"
              >
                {t("Anfrage per Formular")} <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href={whatsappUrl(t("Hallo Kereztour, ich habe eine Frage zu euren Reisen."))}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => openWhatsApp(e, t("Hallo Kereztour, ich habe eine Frage zu euren Reisen."))}
                className="inline-flex w-full items-center justify-center gap-2 rounded-sm border border-primary-foreground/25 px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
              >
                <MessageCircle className="h-4 w-4" /> {t("Direkt auf WhatsApp")}
              </a>

              <a
                href={`mailto:${OWNER_EMAIL}`}
                className="inline-flex items-center justify-center gap-2 text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              >
                <Mail className="h-4 w-4" /> {OWNER_EMAIL}
              </a>
            </div>
          </div>

        </div>
      </div>

      {loaded && (
        <Suspense fallback={null}>
          <ContactDialog open={open} setOpen={setOpen} />
        </Suspense>
      )}
    </section>
  );
};

export default CtaBand;
