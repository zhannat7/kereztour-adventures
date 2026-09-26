import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLanguage } from "@/i18n/LanguageContext";

const NomadGames = () => {
  const ref = useScrollReveal();
  const { t } = useLanguage();

  return (
    <section className="bg-background py-14 md:py-20">
      <div ref={ref} className="section-reveal container mx-auto px-6 max-w-[1600px]">
        <div className="mx-auto max-w-[900px] text-center">
          <span className="eyebrow mb-5 justify-center before:hidden">{t("Welt der Nomaden 2026")}</span>
          <h2 className="mb-5 font-display text-4xl leading-tight text-foreground md:text-6xl">
            {t("Kirgisistan")} <span className="italic text-primary">{t("in Bewegung")}</span>
          </h2>
        </div>

        <div className="mx-auto mt-10 max-w-[900px] overflow-hidden border border-border shadow-lift">
          <div className="relative w-full aspect-video">
            <iframe
              className="absolute inset-0 h-full w-full"
              src="https://www.youtube-nocookie.com/embed/YBRknUnMIE0?rel=0"
              title="Welt der Nomaden 2026 – Kirgisistan in Bewegung"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>

        <p className="mx-auto mt-4 max-w-[900px] text-right text-xs text-muted-foreground">
          Video: AKIpress News · YouTube
        </p>
      </div>
    </section>
  );
};

export default NomadGames;
